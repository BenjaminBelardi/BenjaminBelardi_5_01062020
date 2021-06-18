
import {recipes} from "./recipes.js";
// litéral template for automatic cards creation

let displayedProduct = []
let nbTagActive = 0;


// mise à jour du DOM pour l'affichage des proguits
export function updateAllDisplayedProduct(){
    let idOfElement = "recipesList"
    //document.getElementById(idOfElement).classList.remove("displayed")
    //document.getElementById("loader").classList.add("displayed")
    // Ici on supprime tous les produits dans notre "idOfElement"
    document.getElementById(idOfElement).textContent = "";
    //displayedProduct.forEach(oneProductToDisplay => {
    //    document.getElementById(idOfElement).appendChild("<div>" + oneProductToDisplay.name +"</div>")
    //})
    //document.getElementById(idOfElement).classList.add("displayed")
    //document.getElementById("loader").classList.remove("displayed")
    let resultTemplate ;
    if (displayedProduct.length > 0){
        resultTemplate =`
        ${displayedProduct.map(result => `
            <div class="card">
                <a class="card__link--color" href="#" title="">
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
                            ${result.ingredients.map(element =>`
                                <li><span class="bold">${element.name} : </span>${element.quantity} ${element.unit}</li>`).join("")}
                            </ul>
                            <p class="card__body__description"><span> ${result.description}</span></p>
                        </div>
                    </div>
                </a>
            </div>
            `).join("")
        }`;
    }else{
        resultTemplate = `<article> Aucune recette ne correspond à vootre critère... vous pouvez chercher "tarte aux pommes", "poisson", ect</article>`

    }
    document.getElementById(idOfElement).innerHTML = resultTemplate;
}

function checkFilterElementOnAllProduct (elementName , filterType){
    console.log("Le", elementName, "est coché")
    // allProducts.forEach(oneProduct => {
    // oneProduct._checkFilterElement(elementName , filterType)
    // })
    displayedProduct.forEach(oneProduct => {
    oneProduct._checkFilterElement(elementName , filterType)
    })

}

function UnCheckFilterElement(elementName, type){
    console.log("Le", elementName, "est coché")
    displayedProduct.forEach(oneProduct => {
    oneProduct._UnCheckFilterElement(elementName, type)
    })
}

function logAllProductWithTag(tagType, nbFilterActive){
    // purge the displayedProduct table before update with the new selection content
    console.log(nbFilterActive);
    displayedProduct = [];
    allProducts.forEach(oneProduct => {
        oneProduct._isConcernedByFilter(tagType)
    })
}

function RemoveTag(event){ 
    let attr = this.getAttribute("filtertype");
    let tagName = this.innerText;
    this.remove();
    nbTagActive -- ;
    UnCheckFilterElement(tagName, attr);
    logAllProductWithTag(attr);
    updateAllDisplayedProduct();
    updateAllFilter ()   
}

function addSelectedTag(selectedTag,filterName) {
    let tag = document.getElementById("tagList");
    // create new span element
    let filter = document.createElement('span');
    // create text node to add to span element
    filter.appendChild(document.createTextNode(selectedTag));
    // set inner text property of span and add filterActive class
    filter.classList.add("filterActive", "tag__" + filterName + "--color");
    filter.setAttribute("filterType" , filterName);
    //creat new icon close element
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-times-circle');
    filter.appendChild(icon);
    tag.insertBefore(filter, tag.lastChild);
    //add event listenner at tag creation for tag removing
    filter.addEventListener('click',RemoveTag);
}

// function qui mets à jour la liste de filtre en fonction des produits qui sont afficées
function updateAllFilter (){
    if (displayedProduct.length != 0){
        // on vide la contenu de tout les filtres
        ingredientFilter.data = [];
        ustensiltFilter.data = [];
        applianceFilter.data = [];
        //on recupère les 3 filtres
        let filterLists = document.querySelectorAll(".dropdown ul");
        //pour chaue filtre on suprime tous les elements du DOM
        filterLists.forEach(filter => {
            if (filter.hasChildNodes){
                while(filter.firstChild){
                    filter.removeChild(filter.firstChild);
                }
            } 
        });
        //reconstruit les listes de filtre à partir des produits qui sont affichées sur le DOM.
        displayedProduct.forEach(oneProduct => {
                    oneProduct.ingredients.forEach(oneIngredient => {
                            if (oneIngredient.isChecked === false){
                                ingredientFilter._addFilter(oneIngredient.name);  
                            }
                        });
                        oneProduct.ustensils.forEach(oneUstensil => {
                            if (oneUstensil.isChecked === false){
                                ustensiltFilter._addFilter(oneUstensil.name);    
                            }
                        });
                        oneProduct.appliances.forEach(oneUstensil => {
                        if (oneUstensil.isChecked === false){
                            applianceFilter._addFilter(oneUstensil.name);
                        }
                        });
                    });
        // mise à jour du DOM
        ingredientFilter._createFilterOnDom()
        ustensiltFilter._createFilterOnDom();
        applianceFilter._createFilterOnDom()
    }
}

export class Filter {
    constructor(name) {
        this.name = name
        this.data = []
        this._createTagChoiseEvent()
        this._createTagListDisplayEvent()
        this._searchTagEvent()
        //this._RemoveTagEvent()
        //this._createTagListHiddenEvent()
    }

    //_normalize(str) {
    //    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    //  }
    
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
            list.classList.add('tag__filter')
            // add list to end of list (sel)
            sel.appendChild(list);
        })
    }

// methode qui recupère l'élément qui à été cliqué par l'utilisateur dans la liste de filtre l'ajoute sous forme de Tag
//mets à jour et affiche la liste des rectees qui contiennent ce tag.
    _createTagChoiseEvent(){
        let that = this;
        let idList = that.name + "-list";
        document.getElementById(idList).addEventListener("click", function(element){
            if (element.target.nodeName === "LI"){
                let tagName = element.target.innerText;
                nbTagActive ++;
                addSelectedTag(tagName,that.name);
                checkFilterElementOnAllProduct(tagName,that.name)
                logAllProductWithTag(that.name, nbTagActive);
                updateAllDisplayedProduct();
                updateAllFilter();
            }
        });
    }

    _createTagListDisplayEvent(){
        let listToDisplay = document.getElementById(this.name + "-list")
        document.getElementById(this.name).addEventListener("click", function(event){
            listToDisplay.classList.toggle("displayedList");
            event.stopPropagation();
        });
    }
    
    _searchTagEvent() {
        document.getElementById(this.name + "-search").addEventListener("input", (event) => {
            const list = document.querySelectorAll('.tag__filter');
            let regEx = new RegExp("(" + event.target.value + ")", 'gi');
            list.forEach((element) => {
                if (element.innerText.match(regEx) || event.target.value === "") {
                    element.style.display = 'list-item';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }
}
    
export class Ingredient {
    constructor(name, quantity, unit) {
        this.name = name
        this.quantity = this._validData(quantity)
        this.unit = this._shortenUnit(unit)
        this.isChecked = false
        this._shortenUnit()
    }

    _validData(data){
        if (typeof data === "undefined"){
            return data ="";
        }else{
            return data
        }
    }

    _shortenUnit(data){
         let string = this._validData(data)
        if (string.length > 2){
            return string.substring(2,0)
        }else{
            return string
        }
    }
}
export class Appliance {
    constructor(name) {
        this.name = name
        this.isChecked = false
    }
}
export class Ustensil {
    constructor(name) {
        this.name = name
        this.isChecked = false
    }
}

export class Product {
    constructor(name, ingredients, ustensils, appliances, description, time) {
        this.name = name
        this.ingredients = ingredients
        this.ustensils = ustensils
        this.appliances = appliances
        this.description = description
        this.time = time
        this.nbFilterActive = 0
        console.log("Initialisation du produit", name)
        console.log("Voici la liste des ingrédients :", ingredients)
    }

    _checkFilterElement(elementName, type){

        this[type].forEach(oneElement =>{
            if(oneElement.name == elementName){
                oneElement.isChecked = true;
                this.nbFilterActive ++;
            }
        });
        console.log("Voici les ingrédients mis à jours sur le produit", this.name , "avec le nouvel algo")
        console.table(this[type])
        console.log("Voici le nombre de filtre Actif sur le produit", this.name , "avec le nouvel algo" , this.nbFilterActive)
       
    }
    
    _UnCheckFilterElement (elementName, type){
        this[type].forEach(oneElement =>{
            if (oneElement.name == elementName){
                oneElement.isChecked = false;
                this.nbFilterActive --;
            }
        });
        console.log("Voici les ingrédients mis à jours sur le produit", this.name ,"avec le nouvel algo");
        console.table(this[type]);
    }

    _isConcernedByFilter(type) {
        let isDisplayableProduct = false;
        console.log("nombre de filtre avtif dans le produit", this.name , ":", this.nbFilterActive)
        console.log("nombre de Tag actif sur le DOM :", nbTagActive)
        // this[type].forEach(oneElement => {
        //     if (oneElement.isChecked){
        //         isDisplayableProduct = true;
        //     }
        // });
        if (this.nbFilterActive ===  nbTagActive){
            isDisplayableProduct = true
        }
        if (isDisplayableProduct){
            displayedProduct.push(this)
            console.log("Tag Search : Le produit", this.name, "est un produit valable")
        }
    }

    _isConcernedByMainSearch(){
         displayedProduct.push(this)
         console.log("Main Search : Le produit", this.name, "est un produit valable")
    }

}

//********************************INIT********************************************************/
//création des 3 filtres qui contiendrons les objets associés "indredient" "ustensil" "appliance".
let ingredientFilter = new Filter("ingredients");
let applianceFilter = new Filter("appliances");
let ustensiltFilter = new Filter("ustensils");
// creation du tableau de produit qui contiendra toutes les recettes sous forme d'objet.
let allProducts = [];

recipes.forEach(oneProduct => {
    let allIngredients=[] ,allUstensils = [], allAppliances =[];
    oneProduct.ingredients.forEach(oneIngredient => {
        allIngredients.push(new Ingredient(oneIngredient.ingredient,oneIngredient.quantity,oneIngredient.unit));
        ingredientFilter._addFilter(oneIngredient.ingredient);
    });
    oneProduct.ustensils.forEach(oneUstensil => {
        allUstensils.push(new Ustensil(oneUstensil));
        ustensiltFilter._addFilter(oneUstensil);
    });
    allAppliances.push(new Appliance(oneProduct.appliance));
    applianceFilter._addFilter(oneProduct.appliance);
    allProducts.push(new Product(oneProduct.name, allIngredients,allUstensils,allAppliances,oneProduct.description, oneProduct.time));
});

//on affiche les filtres à l'initialisation
ingredientFilter._createFilterOnDom();
ustensiltFilter._createFilterOnDom();
applianceFilter._createFilterOnDom();

// init display all products
displayedProduct = allProducts;
updateAllDisplayedProduct();

//*****************************************MAIN RESEARCH******************************** */
document.getElementById('search-bar')
    .addEventListener("input", (event) => {
        if (event.target.value.length > 2){
            console.log ("main search start")
            let displayableProduct = [];
            let regEx = new RegExp("(" + event.target.value + ")", 'gi');
            console.log("RegEx :", regEx)
             displayedProduct.forEach(oneProduct => {
                 if(regEx.test(oneProduct.name) || regEx.test(oneProduct.description)){
                     //alert("l'expression: " + regEx +" a été trouvé dans le produit" + oneProduct.name )
                     //oneProduct._isConcernedByMainSearch();
                     displayableProduct.push(oneProduct);
                 }
             });
            displayedProduct = displayableProduct;
            updateAllDisplayedProduct();
            updateAllFilter();
         }else{
             displayedProduct = allProducts;
             updateAllDisplayedProduct();
             updateAllFilter();
        }
    });
