import {recipes} from "./recipes.js";

class Filters {
    constructor(name) {
        this.name = name;
        this.elements = [];
    }
    _normalize(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    } 
  
    _addFilter(newElement) {
        if (this.elements.includes(this._normalize(newElement)) === false) {
            this.elements.push(this._normalize(newElement));
        }
    }
    _delFilter(nameFilter){
        this.elements.splice(this.elements.indexOf(nameFilter),1);
    }

    _displayFilterOnDom(identifier) {
        let sel = document.getElementById(identifier);
        this.elements.sort().forEach(function (element) {
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
    _modifieFilterOnDom(identifier){
        let list = document.getElementById(identifier);
        while(list.firstChild){
            list.removeChild(list.firstChild);
        }
        this._displayFilterOnDom(identifier);
    }
}
class Product {

    constructor(name) {
        this.name = name;
        this.ingredients = [];
        this.ustensils = [];
        this.description = "";
        this.time;
    }

    __addProduct(ingredients,ustensils,appliance,description,time){
        this.ingredients = ingredients;
        this.ustensils = ustensils;
        this.description = description;
        this.appliance = appliance;
        this.time = time;
    }
    // _addUstensils(ustencils) {
    //     this.ustensils = ustencils
    // }
    _hasIngredients(ingredientName) {
        return this.ingredients.includes(ingredientName)
    }
}

let ingredientFilter = new Filters("ingredient")
let ustensilsFilter = new Filters("ustensils")
let applianceFilter = new Filters("appliance")
let allProducts = []
recipes.forEach(element => {
    // initialisation
    let oneProduct = new Product(element.name);
    let allProductIngredients = [];
    let allProductUstensils = [];
    let ProductAppliance = "";
    let ProductDescription ="";
    let ProductTime="";

    // On parcours et rempli les élements
    element.ingredients.forEach(element => {
        let str ="";
        ingredientFilter._addFilter(element.ingredient)
        allProductIngredients.push([element.ingredient + ": " , (typeof element.quantity === "number" && typeof element.unit === "string") ? str.concat(element.quantity ,element.unit.substring(0,2)):(typeof element.quantity === "number")? element.quantity: ""])
    })
    element.ustensils.forEach(element => {
        ustensilsFilter._addFilter(element)
        allProductUstensils.push(element)
    });
    applianceFilter._addFilter(element.appliance);
    ProductAppliance = element.appliance;
    ProductDescription = element.description;
    ProductTime = element.time + " min";

    // On stocke
    // oneProduct._addIngredients(allProductIngredients)
    // oneProduct._addUstensils(allProductUstensils)
    oneProduct.__addProduct(allProductIngredients,allProductUstensils, ProductAppliance,ProductDescription,ProductTime)
    allProducts.push(oneProduct)
});

//******************************DOM************************

//affichage de la liste complete de tag à l'initialisation de la page
ingredientFilter._displayFilterOnDom("myIngredientsList");
ustensilsFilter._displayFilterOnDom("myUstensilsList");
applianceFilter._displayFilterOnDom("myAppliancesList");

//supression des tag précédemment sélectionné par l'utilisateur et mise à jour de la liste de filtres
document.getElementById('filterTag').addEventListener('click',function(event){
    if(event.target.className == "filterActive"){
        ingredientFilter._addFilter(event.target.innerText)
        ingredientFilter._modifieFilterOnDom("myIngredientsList");
        event.target.remove();
    }
});

//ajoute du filtre selectionné par l'utilisateur sous forme de tag au dessus du champ de recherche
let tagFilter = document.getElementById("filterTag");
function addSelectedTag(elt, selectedTag) {
    // create new span element
    let filter = document.createElement('span');
    // create text node to add to span element
    filter.appendChild(document.createTextNode(selectedTag));
    // set inner text property of span and add filterActive class
    filter.classList.add('filterActive');
    tagFilter.insertBefore(filter, tagFilter.firstChild);
    //creat new icon close element
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-times-circle');
    filter.appendChild(icon);
}

//event to display tag list on input search event
let myIngredientsList = document.getElementById("myIngredientsList");
let myUstensilsList = document.getElementById("myUstensilsList");
let myApplianceList =  document.getElementById("myAppliancesList");
let myTagList = document.querySelectorAll('.tag__search');
myTagList.forEach(tagList => {tagList.addEventListener('click', OpenFilter)});
function OpenFilter(event) {
    switch (event.target.id) {
        case "mySearchIngredient":
            event.stopPropagation;
            myIngredientsList.classList.toggle("displayedList");
            break;
        case "mySearchAppliance":
            event.stopPropagation;
            myApplianceList.classList.toggle("displayedList");
            break;
        case "mySearchUstensil":
            event.stopPropagation;
            myUstensilsList.classList.toggle("displayedList");
            break;

        default:
             break;
     } 
}
//search and filtered tag from the tag list 
myTagList.forEach(tagList => {tagList.addEventListener('input', SearchTag)});
function SearchTag(event){
    let regEx = new RegExp("^("+event.target.value+")",'i');
    switch (event.target.id) {
        case "mySearchIngredient":
            event.stopPropagation;
            let filterIngredient = ingredientFilter.elements.filter(function(element){
                if(element.match(regEx)!= null){
                    return true;
                }else{
                    return false
                }
            });
            let ingredientFilterNew = new Filters("ingredient");
            ingredientFilterNew.elements = filterIngredient;
            ingredientFilterNew._modifieFilterOnDom("myIngredientsList");
            break;
        case "mySearchAppliance":
            event.stopPropagation;
            let filterAppliance = applianceFilter.elements.filter(function(element){
                if(element.match(regEx)!= null){
                    return true;
                }else{
                    return false
                }
            });
            let applianceFilterNew = new Filters("appliance");
            applianceFilterNew.elements = filterAppliance;
            applianceFilterNew._modifieFilterOnDom("myAppliancesList");
            break;
        case "mySearchUstensil":
            event.stopPropagation;
            let filterUstensil = ustensilsFilter.elements.filter(function(element){
                if(element.match(regEx)!= null){
                    return true;
                }else{
                    return false
                }
            });
            let ustensilsFilterNew = new Filters("ustensil");
            ustensilsFilterNew.elements = filterUstensil;
            ustensilsFilterNew._modifieFilterOnDom("myUstensilsList");
            break;
        default:
             break;
    }
}

//add the tag selected by the user
document.querySelector("ul").addEventListener('click', getDataTag);
function getDataTag(event) {
    event.target.classList.toggle("selected");
    ingredientFilter._delFilter(event.target.innerText);
    ingredientFilter._modifieFilterOnDom("myIngredientsList");
    addSelectedTag(event.target.parentNode, event.target.innerText);
    // en admettons ceci : let results contient les choix utilisateurs
    //let results = ["creme fraiche", "sel"]
    let productThatContainsAllResults = []
    allProducts.forEach(oneProduct => {
        let hasProductAllResult = true
        results.forEach(oneResult => {
            if (oneProduct._hasIngredients(oneResult) === false) {
                hasProductAllResult = false
            }
        })
        if (hasProductAllResult) {
            productThatContainsAllResults.push(oneProduct.name)
        }
    })
}
//********************* cards creation ****************************************
let results = allProducts;
// litéral template for automatic cards creation
const cardTemplate =`
    ${results.map(result =>`
    <div class="card">
        <a class="card__link--color" href="#" title="">
            <div class="card__img">
            </div>
            <div class="card__txt">
                <div class="card__header">
                    <h3>${result.name}</h3>
                    <span class="card__header__time bold">
                        <i class="far fa-clock"></i> ${result.time}
                    </span>
                </div>
                <div class="card__body">
                    <ul class="card__body__list">
                        ${result.ingredients.map(ingredient =>`<li><span class="bold">${ingredient[0]}</span>${ingredient[1]}</li>`).join("")}
                    </ul>
                    <p class="card__body__description"><span> ${result.description}</span></p>
                </div>
            </div>
        </a>
    </div>
    `)
}`;
let myRecipesList = document.getElementById("recipesList");
myRecipesList.innerHTML = cardTemplate;


