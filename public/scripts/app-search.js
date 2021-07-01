
import { recipes } from "./recipes.js";
// litéral template for automatic cards creation

let displayedProduct = [];
let nbTagActive = 0;

// update DOM to displayed product list
function updateAllDisplayedProductV2() {
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
                                <li><span class="bold">${element.ingredient} : </span>${element.quantity} ${element.unit}</li>`).join("")}
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

// function to truncate text and to add "..." as a suffix
String.prototype.trunc = 
    function (n){
        return this.substr(0,n-1)+(this.length > n ? '&hellip;':'')
    }

// function to update DOM with the filtered recipes. Also update the filters
function updateDom (products){
    displayedProduct = products; 
    updateAllDisplayedProductV2();
    updateAllFilterV2();
}


function checkFilterElementOnDisplayedProduct(elementName, filterType) {
    let tempDisplayProduct =[];
    displayedProduct.forEach(oneProduct => {
    if (filterType == "ingredients"){
        oneProduct[filterType].forEach(ingredient => {
            if (normalize(ingredient.ingredient) == normalize(elementName) ){
                tempDisplayProduct.push(oneProduct);
            }
        });
    }else if (filterType == "appliances"){
        if ( oneProduct.appliance == elementName){
            tempDisplayProduct.push(oneProduct);
        }
    }else if(filterType == "ustensils"){
        oneProduct[filterType].forEach(ustensil =>{
            if(ustensil == elementName){
                tempDisplayProduct.push(oneProduct);
            }
        }) ;
    }
     });
    return tempDisplayProduct;
}


function checkFilterElementOnAllProduct(elementName, filterType) {
    let tempDisplayProduct =[];
    recipes.forEach(oneProduct => {
    if (filterType == "ingredients"){
        oneProduct[filterType].forEach(ingredient => {
            if (normalize(ingredient.ingredient) == normalize(elementName) ){
                tempDisplayProduct.push(oneProduct);
            }
        });
    }else if (filterType == "appliances"){
        if ( oneProduct.appliance == elementName){
            tempDisplayProduct.push(oneProduct);
        }
    }else if(filterType == "ustensils"){
        oneProduct[filterType].forEach(ustensil =>{
            if(ustensil == elementName){
                tempDisplayProduct.push(oneProduct);
            }
        }) ;
    }
     });
    return tempDisplayProduct;
}

function RemoveTag(event) {
    this.remove();
    nbTagActive--;
    let productfound = [];
    if (nbTagActive > 0){
        let tagList = document.querySelectorAll(".filterActive");
        tagList.forEach(tag => {
            productfound.push(checkFilterElementOnAllProduct(tag.textContent, tag.getAttribute("filtertype")));
        });
        updateDom(arrayIntersection(productfound));
    }else{
    mainSearch(event.type,normalizeMainSearchInput);
    }
}

// function for table intersection
// for each element (element) of the table array1:
//   check if element is in "rest" table results 
//   returns common values in both table a and rest
function arrayIntersection (array){
    let [array1,...rest] = array; //see def: rest parameter
    return array1.filter(element => rest.every(val => val.includes(element)));
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


function updateAllFilterV2() {
    if (displayedProduct.length != 0) {
        // clear the filter data
        ingredientFilter.data = [];
        ustensiltFilter.data = [];
        applianceFilter.data = [];
        let filterLists = document.querySelectorAll(".dropdown ul");
        // for every filter all DOM element are cleared
        filterLists.forEach(filter => {
            if (filter.hasChildNodes) {
                while (filter.firstChild) {
                    filter.removeChild(filter.firstChild);
                }
            }
        });
        // rebuild the filter list from the products displayed in the DOM
        displayedProduct.forEach(oneProduct => {
            oneProduct.ingredients.forEach(oneIngredient => {
                ingredientFilter._addFilter(oneIngredient.ingredient);
            });
            oneProduct.ustensils.forEach(oneUstensil => {
                ustensiltFilter._addFilter(oneUstensil);
            });
            applianceFilter._addFilter(oneProduct.appliance);
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


    // method to get the element clicked by user in the filter list
    // add the element as a tag
    // update and display of the list of recipes that contain the tag in the DOM
    _createTagChoiseEvent() {
        let that = this;
        let idList = that.name + "-list";
        document.getElementById(idList).addEventListener("click", function (element) {
            if (element.target.nodeName === "LI") {
                let tagName = element.target.innerText;
                nbTagActive++;
                addSelectedTag(tagName, that.name);
                let productfound = checkFilterElementOnDisplayedProduct(tagName, that.name);
                updateDom(productfound);
            }
        });
    }

    _createTagListDisplayEvent() {
        let listToDisplay = document.getElementById(this.name + "-list");
        let iconToggle = document.querySelectorAll("#" + this.name + " .tag__icon");
        document.getElementById(this.name).addEventListener("click", function (event) {
            listToDisplay.classList.toggle("displayedList");
            iconToggle.forEach(icon => { icon.classList.toggle("hidden");
            });
        });
    }

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

//********************************INIT********************************************************/
// create 3 filters that contain associated: "ingredients", "tools" and "appliance"
let ingredientFilter = new Filter("ingredients");
let applianceFilter = new Filter("appliances");
let ustensiltFilter = new Filter("ustensils");
// creation du tableau de produit qui contiendra toutes les recettes sous forme d'objet.

recipes.forEach(oneProduct => {
    //let allIngredients = [], allUstensils = [], allAppliances = [];
    oneProduct.ingredients.forEach(oneIngredient => {
        //allIngredients.push(new Ingredient(oneIngredient.ingredient, oneIngredient.quantity, oneIngredient.unit));
        ingredientFilter._addFilter(oneIngredient.ingredient);
    });
    oneProduct.ustensils.forEach(oneUstensil => {
        //allUstensils.push(new Ustensil(oneUstensil));
        ustensiltFilter._addFilter(oneUstensil);
    });
    //allAppliances.push(new Appliance(oneProduct.appliance));
    applianceFilter._addFilter(oneProduct.appliance);
    //allProducts.push(new Product(oneProduct.name, allIngredients, allUstensils, allAppliances, oneProduct.description, oneProduct.time));
});
// display of the filter at the init
ingredientFilter._createFilterOnDom();
ustensiltFilter._createFilterOnDom();
applianceFilter._createFilterOnDom();

// init display all products
displayedProduct = recipes;
updateAllDisplayedProductV2();

//*****************************************MAIN RESEARCH******************************** */
let normalizeMainSearchInput ="";
document.getElementById('search-bar')
    .addEventListener("input", (event) => {
        let type = event.target.id;
        let mainSearchString = event.target.value.trim();
        normalizeMainSearchInput = normalize(mainSearchString.trim());
        if (normalizeMainSearchInput.length > 2){
            mainSearch(type, normalizeMainSearchInput);
        }else if (nbTagActive == 0) {
            updateDom(recipes);
        }else{
            let tagList = document.querySelectorAll(".filterActive");
            tagList.forEach(tag => {
            let productfound = checkFilterElementOnAllProduct(tag.textContent, tag.getAttribute("filtertype"));
            updateDom(productfound);
            });
        }
    });

let mainSearchStart = 0;
let mainSearchEnd = 0;

function mainSearch(type, mainSearchInput) {
    mainSearchStart = performance.now();
    let regEx = new RegExp("(" + mainSearchInput + ")", 'gi');
    if (nbTagActive == 0){
        displayedProduct = [];
        recipes.forEach(oneProduct => {
            if (regEx.test(normalize(oneProduct.name)))   {
                displayedProduct.push(oneProduct);
            }else if (regEx.test(normalize(oneProduct.description))){
                displayedProduct.push(oneProduct);
            }else{
                oneProduct.ingredients.forEach(oneIngredient => {
                    if (regEx.test(normalize(oneIngredient.ingredient))){
                        displayedProduct.push(oneProduct);
                    } 
                });
            }
        });
    }else{
        let tempDisplayProduct = [];
        displayedProduct.forEach(oneProduct => {
            if (regEx.test(normalize(oneProduct.name)))   {
                tempDisplayProduct.push(oneProduct);
            }else if (regEx.test(normalize(oneProduct.description))){
                tempDisplayProduct.push(oneProduct);
            }else{
                oneProduct.ingredients.forEach(oneIngredient => {
                    if (regEx.test(normalize(oneIngredient.ingredient))){
                        tempDisplayProduct.push(oneProduct);
                    } 
                });
            }
        });
        displayedProduct = tempDisplayProduct;
    }
    mainSearchEnd = performance.now();
    updateDom(displayedProduct);
    console.log ("Main Search V2 Time: " + (mainSearchEnd - mainSearchStart) + 'ms' );
}
