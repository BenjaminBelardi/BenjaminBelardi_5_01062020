
import { recipes } from "./recipes.js";


// product list and filter initialisation at loading page
window.addEventListener ('load', () =>{
    init();
});

// litéral template for automatic cards creation
let displayedProduct = [];
let nbTagActive = 0;

// mise à jour du DOM pour l'affichage des proguits
function updateAllDisplayedProduct() {
    let idOfElement = "recipesList";
    document.getElementById(idOfElement).textContent = "";
    let resultTemplate;
    if (displayedProduct.length > 0) {
        resultTemplate = `
        ${displayedProduct.map(result => `
            <div class="col-12 col-md-6 col-lg-4 mb-5">
                <a class="card card__link--color" href="#" title="">
                    <div class="card__img">
                    </div>
                    <div class="card__txt">
                        <div class="card__header">
                            <h3>${result.name}</h3>
                            <span class="card__header__time bold">${result.time} min
                                <i class="far fa-clock"></i>
                            </span>
                        </div>
                        <div class="card__body">
                            <ul class="card__body__list">
                            ${result.ingredients.map(element => `
                                <li><span class="bold">${element.name} : </span>${element.quantity} ${element.unit}</li>`).join("")}
                            </ul>
                            <p class="card__body__description truncate-overflow"><span> ${result.description.trunc(165)}</span></p>
                        </div>
                    </div>
                </a>
            </div>
            `).join("")
            }`;
    } else {
        resultTemplate = `<article> Aucune recette ne correspond à vootre critère... vous pouvez chercher "tarte aux pommes", "poisson", ect</article>`;

    }
    document.getElementById(idOfElement).innerHTML = resultTemplate;
}


let SearchLengthBack = 0;
function isFirstResearch (searchLength){
    let firstResearch = true ;
    if (searchLength > SearchLengthBack && SearchLengthBack != 0){
        firstResearch = false;
    }
    SearchLengthBack = searchLength;
    return firstResearch;
}

//add methode trunc to string class
// cut the string after "n" character and add ... behind the text
String.prototype.trunc = 
    function (n){
        return this.substr(0,n-1)+(this.length > n ? '&hellip;':'')
    }

function defaultProductDisplay (){
    displayedProduct = allProducts;
    unCheckProductOnAllProduct();
    updateAllDisplayedProduct()
    updateAllFilter();
}

function updateDom (){
    logAllProductWithTag();
    updateAllDisplayedProduct();
    updateAllFilter();
}

function checkFilterElementOnAllProduct(elementName, filterType) {
    allProducts.forEach(oneProduct => {
    oneProduct._checkFilterElement(elementName , filterType)
     });
}

function UnCheckFilterElement(elementName, type) {
    allProducts.forEach(oneProduct => {
        oneProduct._UnCheckFilterElement(elementName, type);
    })
}

function checkProductOnAllProduct(regEx , listOfProduct) {
    listOfProduct.forEach(oneProduct => {
        oneProduct._checkProduct(regEx);
    })
}

function unCheckProductOnAllProduct() {
    allProducts.forEach(oneProduct => {
        oneProduct._unCheckProduct();
    })
}

function logAllProductWithTag() {
    displayedProduct = [];
    allProducts.forEach(oneProduct => {
        oneProduct._isConcernedByFilter();
    });
}

function RemoveTag(event) {
    let attr = this.getAttribute("filtertype");
    let tagName = this.innerText;
    this.remove();
    nbTagActive--;
    UnCheckFilterElement(tagName, attr);
    mainSearch(event.type,normalizeMainSearchInput, allProducts);
}

function addSelectedTag(selectedTag, filterName) {
    let tag = document.getElementById("tagList");
    // create new span element
    let filter = document.createElement('span');
    // create text node to add to span element
    filter.appendChild(document.createTextNode(selectedTag));
    // set inner text property of span and add filterActive class
    filter.classList.add("filterActive", "tag__" + filterName + "--color");
    filter.setAttribute("filterType", filterName);
    //creat new icon close element
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-times-circle');
    filter.appendChild(icon);
    tag.insertBefore(filter, tag.lastChild);
    //add event listenner at tag creation for tag removing
    filter.addEventListener('click', RemoveTag);
}

// function to update the filter list with only dislpayed recipies
function updateAllFilter() {
    if (displayedProduct.length != 0) {
        ingredientFilter.data = [];
        ustensiltFilter.data = [];
        applianceFilter.data = [];
        let filterLists = document.querySelectorAll(".dropdown ul");
        filterLists.forEach(filter => {
            if (filter.hasChildNodes) {
                while (filter.firstChild) {
                    filter.removeChild(filter.firstChild);
                }
            }
        });
        displayedProduct.forEach(oneProduct => {
            oneProduct.ingredients.forEach(oneIngredient => {
                if (oneIngredient.isChecked === false) {
                    ingredientFilter._addFilter(oneIngredient.name);
                }
            });
            oneProduct.ustensils.forEach(oneUstensil => {
                if (oneUstensil.isChecked === false) {
                    ustensiltFilter._addFilter(oneUstensil.name);
                }
            });
            oneProduct.appliances.forEach(oneUstensil => {
                if (oneUstensil.isChecked === false) {
                    applianceFilter._addFilter(oneUstensil.name);
                }
            });
        });
        ingredientFilter._createFilterOnDom();
        ustensiltFilter._createFilterOnDom();
        applianceFilter._createFilterOnDom();
    }
}

function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }

/** Class representing a filter */
class Filter {
    constructor(name) {
        this.name = name;
        this.data = [];
        this._createTagChoiseEvent();
        this._createTagListDisplayEvent();
        this._searchTagEvent();
    }

    _addFilter(newElement) {
        if (this.data.includes(newElement) === false) {
            this.data.push(newElement);
        }
    }

    _createFilterOnDom() {
        let sel = document.getElementById(this.name + "-list");
        this.data.sort().forEach(function (element) {
            // create new li element
            let list = document.createElement('li');
            // create text node to add to li element (list)
            list.appendChild(document.createTextNode(element));
            // set inner text property of li and add filtTag class
            list.classList.add('tag__filter');
            // add list to end of list (sel)
            sel.appendChild(list);
        })
    }

    // get the element choise by the user and add tag
    //update the displaed recipies with the selected tag
    _createTagChoiseEvent() {
        let that = this;
        let idList = that.name + "-list";
        document.getElementById(idList).addEventListener("click", function (element) {
            if (element.target.nodeName === "LI") {
                let tagName = element.target.innerText;
                nbTagActive++;
                addSelectedTag(tagName, that.name);
                checkFilterElementOnAllProduct(tagName, that.name);
                updateDom ();
            }
        });
    }

    _createTagListDisplayEvent() {
        let listToDisplay = document.getElementById(this.name + "-list");
        let inputGroup = document.getElementById(this.name);
        let iconToggle = document.querySelectorAll("#" + this.name + " .tag__icon");
        document.getElementById(this.name).addEventListener("click", function (event) {
            inputGroup.classList.toggle("input-group-size");
            listToDisplay.classList.toggle("displayedList");
            iconToggle.forEach(icon => { icon.classList.toggle("hidden");
            });
        });
    }

    // search element into the filter table and update the DOM 
    _searchTagEvent() {
        document.getElementById(this.name + "-search").addEventListener("input", (event) => {
            const list = document.querySelectorAll("#" + this.name + "-list" + "> .tag__filter");
            let normalizeInputSearch = normalize(event.target.value.trim());
            let regEx = new RegExp("(" + normalizeInputSearch + ")", 'gi');
            list.forEach((element) => {
                if (normalize(element.innerText).match(regEx) || event.target.value === "") {
                    element.style.display = 'list-item';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }
}

// class representing an ingredient
class Ingredient {
    constructor(name, quantity, unit) {
        this.name = name;
        this.quantity = this._validData(quantity);
        this.unit = this._shortenUnit(unit);
        this.isChecked = false;
        this._shortenUnit();
    }

    _validData(data) {
        if (typeof data === "undefined") {
            return data = "";
        } else {
            return data;
        }
    }

    _shortenUnit(data) {
        let string = this._validData(data);
        if (string.length > 2) {
            return string.substring(2, 0);
        } else {
            return string;
        }
    }
}

/** class representing an appliance */
class Appliance {
    constructor(name) {
        this.name = name;
        this.isChecked = false;
    }
}

/** class representing an ustensil */
class Ustensil {
    constructor(name) {
        this.name = name;
        this.isChecked = false;
    }
}
/** class representing a product recipie */
class Product {
    constructor(name, ingredients, ustensils, appliances, description, time) {
        this.name = name;
        this.ingredients = ingredients;
        this.ustensils = ustensils;
        this.appliances = appliances;
        this.description = description;
        this.time = time;
        this.nbFilterActive = 0;
        this.isChecked = false;
    }

    _checkFilterElement(elementName, type) {
        this[type].forEach(oneElement => {
            if (normalize(oneElement.name) == normalize(elementName)) {
                oneElement.isChecked = true;
                this.nbFilterActive++;
            }
        });
    }

    _UnCheckFilterElement(elementName, type) {
        this[type].forEach(oneElement => {
            if (oneElement.name == elementName &&  oneElement.isChecked) {
                oneElement.isChecked = false;
                this.nbFilterActive--;
            }
        });
    }
   
    _checkProduct(regEx) {
        let ingredientFound = false;
        this.ingredients.forEach(oneIngredient => {
            if (regEx.test(normalize(oneIngredient.name))) {
                ingredientFound = true;
            }
        });
        if (regEx.test(normalize(this.name)) || regEx.test(normalize(this.description)) || ingredientFound) {
            this.isChecked = true;
        } else {
            this.isChecked = false;
        }
    }

    _unCheckProduct() {
        this.isChecked = false;
    }
   
    //methode to check if the product have all filter criteria
    _isConcernedByFilter() {
        let mainSearchLength = document.getElementById("search-bar").value.length
        if (nbTagActive > 0) {
            if (mainSearchLength > 2) {
                if ((this.nbFilterActive === nbTagActive) && this.isChecked) {
                    displayedProduct.push(this)
                }
            } else if (this.nbFilterActive === nbTagActive) {
                displayedProduct.push(this);
            }
        } else if (this.isChecked) {
            displayedProduct.push(this);
        }

    }
}
//********************************INIT********************************************************/

    let ingredientFilter = new Filter("ingredients");
    let applianceFilter = new Filter("appliances");
    let ustensiltFilter = new Filter("ustensils");
    // array that contains all recipies
    let allProducts = [];

function init() {
    recipes.forEach(oneProduct => {
        let allIngredients = [], allUstensils = [], allAppliances = [];
        oneProduct.ingredients.forEach(oneIngredient => {
            allIngredients.push(new Ingredient(oneIngredient.ingredient, oneIngredient.quantity, oneIngredient.unit));
            ingredientFilter._addFilter(oneIngredient.ingredient);
        });
        oneProduct.ustensils.forEach(oneUstensil => {
            allUstensils.push(new Ustensil(oneUstensil));
            ustensiltFilter._addFilter(oneUstensil);
        });
        allAppliances.push(new Appliance(oneProduct.appliance));
        applianceFilter._addFilter(oneProduct.appliance);
        allProducts.push(new Product(oneProduct.name, allIngredients, allUstensils, allAppliances, oneProduct.description, oneProduct.time));
    });

    ingredientFilter._createFilterOnDom();
    ustensiltFilter._createFilterOnDom();
    applianceFilter._createFilterOnDom();

    // init display all products
    displayedProduct = allProducts;
    updateAllDisplayedProduct();
}

//*****************************************MAIN RESEARCH******************************** */
let normalizeMainSearchInput ="";
document.getElementById('search-bar')
    .addEventListener("input", (event) => {
        let type = event.target.id;
        let mainSearchString = event.target.value.trim();
        normalizeMainSearchInput = normalize(mainSearchString.trim());
        if (normalizeMainSearchInput.length > 2 ){
            if (isFirstResearch(normalizeMainSearchInput.length) && nbTagActive == 0){
                mainSearch(type, normalizeMainSearchInput , allProducts);
            }else{
                mainSearch(type, normalizeMainSearchInput , displayedProduct);
            }
        }else if (nbTagActive == 0) {
            defaultProductDisplay ();
        }else{
            updateDom ();
        }
    });

let mainSearchStart = 0;
let mainSearchEnd = 0;

function mainSearch (mainSearchInput, productList) {
    mainSearchStart = performance.now();
    let regEx = new RegExp("(" + mainSearchInput + ")", 'gi');
    checkProductOnAllProduct(regEx , productList);
    logAllProductWithTag();
    mainSearchEnd = performance.now();
    updateAllDisplayedProduct();
    updateAllFilter();
    console.log ("Main Search V1 Time: " + (mainSearchEnd - mainSearchStart) + 'ms' )
}

