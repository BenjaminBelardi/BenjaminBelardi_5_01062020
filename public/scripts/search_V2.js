
import {recipes} from "./recipes.js";
// litéral template for automatic cards creation

let displayedProduct = []
// mise à jour du DOM pour l'affichage des proguits
function updateAllDisplayedProduct(){
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
    const cardTemplate =`
    ${displayedProduct.map(result => `
        <div class="card">
            <a class="card__link--color" href="#" title="">
                <div class="card__img">
                </div>
                <div class="card__txt">
                    <div class="card__header">
                        <h3>${result.name}</h3>
                        <span class="card__header__time bold">
                            <i class="far fa-clock"></i>
                        </span>
                    </div>
                    <div class="card__body">
                        <ul class="card__body__list">
                           
                        </ul>
                        <p class="card__body__description"><span> ${result.description}</span></p>
                    </div>
                </div>
            </a>
        </div>
        `).join("")
    }`;
 document.getElementById(idOfElement).innerHTML = cardTemplate;
}

function checkIngredientOnAllProduct(ingredientName) {
    console.log("Le", ingredientName, "est coché")
    allProducts.forEach(oneProduct => {
    oneProduct._checkIngredient(ingredientName)
    })
}
function checkUstensilOnAllProduct(ustensilName) {
    console.log("Le", ustensilName, "est coché")
    allProducts.forEach(oneProduct => {
    oneProduct._checkUstencils(ustensilName)
    })
}
function checkApplianceOnAllProduct(ApplianceName) {
    console.log("Le", ApplianceName, "est coché")
    allProducts.forEach(oneProduct => {
    oneProduct._checkAppliance(ApplianceName)
    })
}

function UnCheckIngredientOnAllProduct(ingredientName) {
    console.log("Le", ingredientName, "est coché")
    allProducts.forEach(oneProduct => {
    oneProduct._UnCheckIngredient(ingredientName)
    })
}
function UnCheckUstensilOnAllProduct(ustensilName) {
    console.log("Le", ustensilName, "est coché")
    allProducts.forEach(oneProduct => {
    oneProduct._UnCheckUstencils(ustensilName)
    })
}
function UnCheckApplianceOnAllProduct(ApplianceName) {
    console.log("Le", ApplianceName, "est coché")
    allProducts.forEach(oneProduct => {
    oneProduct._UnCheckAppliance(ApplianceName)
    })
}

function logAllProductWithTag(){
    // purge the displayedProduct table before update with the new selection content
    displayedProduct = [];
    allProducts.forEach(oneProduct => {
        oneProduct._isConcernedByFilter()
    })
}

function RemoveTag(event){ 
    let attr = event.target.getAttribute("filtertype");
    let tagName = event.target.innerText;
    if (event.target.parentNode.nodeName === "SPAN"){
        attr = event.target.parentNode.getAttribute("filtertype");
        tagName = event.target.parentNode.innerText;
        event.target.parentNode.remove();
    }else{
        attr = event.target.getAttribute("filtertype");
        event.target.remove();
    }

    if (attr === "ingredients"){
        UnCheckIngredientOnAllProduct(tagName);
        
    }else if(attr === "appliances"){
        UnCheckApplianceOnAllProduct(tagName);
    
    }else if(attr === "ustensils"){
        UnCheckUstensilOnAllProduct(tagName);
    }
        logAllProductWithTag();
        updateAllDisplayedProduct();
        
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
    ///////test///////
    filter.addEventListener('click',RemoveTag);
}


class Filter {
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

    _modifieFilterOnDom(data){
        let list = document.getElementById(this.name + "-list");
        while(list.firstChild){
            list.removeChild(list.firstChild);
        }
        this._createFilterOnDom();
    }
    
    // methode qui recupère l'élément qui à été cliqué par l'utilisateur dans la liste de filtre l'ajoute sous forme de Tag
    //mets à jour et affiche la liste des rectees qui contiennent ce tag.
    _createTagChoiseEvent(){
        let that = this;
        document.getElementById(that.name + "-list").addEventListener("click", function(element){
            //let ingredientName = this.value
            if (element.target.nodeName === "LI"){
                let tagName = element.target.innerText;
                if (that.name === "ingredients") {
                    addSelectedTag(tagName,that.name);
                    checkIngredientOnAllProduct(tagName);
                    logAllProductWithTag();
                    updateAllDisplayedProduct();
                }else if(that.name === "appliances") {
                    addSelectedTag(tagName,that.name);
                    checkApplianceOnAllProduct(tagName);
                    logAllProductWithTag();
                    updateAllDisplayedProduct();
                }else if(that.name === "ustensils") {
                    addSelectedTag(tagName,that.name);
                    checkUstensilOnAllProduct(tagName);
                    logAllProductWithTag();
                    updateAllDisplayedProduct();
                };
            }
        });
    }
    _createTagListDisplayEvent(){
        let listToDisplay = document.getElementById(this.name + "-list")
        document.getElementById(this.name + "-search").addEventListener("click", function(event){
            event.stopPropagation();
            listToDisplay.classList.toggle("displayedList");
        });
    }
    
    _searchTagEvent() {
        document.getElementById(this.name + "-search").addEventListener("input", (event) => {
            const list = document.querySelectorAll('.tag__filter');
            let regEx = new RegExp("^(" + event.target.value + ")", 'i');
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
    
class Ingredient {
    constructor(name) {
        this.name = name
        this.isChecked = false
    }
}
class Appliance {
    constructor(name) {
        this.name = name
        this.isChecked = false
    }
}
class Ustensil {
    constructor(name) {
        this.name = name
        this.isChecked = false
    }
}

class Product {
    constructor(name, ingredients, ustencils, appliances, description) {
        this.name = name
        this.ingredients = ingredients
        this.ustencils = ustencils
        this.appliances = appliances
        this.description = description
        console.log("Initialisation du produit", name)
        console.log("Voici la liste des ingrédients :", ingredients)
    }

    _checkIngredient(ingredientName) {
        this.ingredients.forEach(oneIngredient => {
            if (oneIngredient.name === ingredientName) {
                oneIngredient.isChecked = true;
            }else{
                oneIngredient.isChecked = false;
            }
        })
        console.log("Voici les ingrédients mis à jours sur le produit", this.name)
        console.table(this.ingredients)
    }
    _checkAppliance(applianceName) {
        this.appliances.forEach(oneAppliance => {
            if (oneAppliance.name === applianceName) {
                oneAppliance.isChecked = true
            }else{
                oneAppliance.isChecked = false
            }
        })
        console.log("Voici les appareils mis à jours sur le produit", this.name)
        console.table(this.appliances)
    }
    _checkUstencils(ustencilsName) {
        this.ustencils.forEach(oneUstencils => {
            if (oneUstencils.name === ustencilsName) {
                oneUstencils.isChecked = true
            }else{
                oneUstencils.isChecked = false
            }
        })
        console.log("Voici les ingrédients mis à jours sur le produit", this.name)
        console.table(this.ingredients)
    }

    _UnCheckIngredient(ingredientName) {
        this.ingredients.forEach(oneIngredient => {
            if (oneIngredient.name === ingredientName) {
                oneIngredient.isChecked = false;
            }
        })
        console.log("Voici les ingrédients mis à jours sur le produit", this.name)
        console.table(this.ingredients)
    }
    _UnCheckAppliance(applianceName) {
        this.appliances.forEach(oneAppliance => {
            if (oneAppliance.name === applianceName) {
                oneAppliance.isChecked = false;
            }
        })
        console.log("Voici les appareils mis à jours sur le produit", this.name)
        console.table(this.appliances)
    }
    _UnCheckUstencils(ustencilsName) {
        this.ustencils.forEach(oneUstencils => {
            if (oneUstencils.name === ustencilsName) {
                oneUstencils.isChecked = false;
            }
        })
        console.log("Voici les ingrédients mis à jours sur le produit", this.name)
        console.table(this.ingredients)
    }

    _isConcernedByFilter() {
        let isDisplayableProduct = false
        this.ingredients.forEach(oneIngredient => {
             if (oneIngredient.isChecked) {
                 isDisplayableProduct = true
             }
         })
        this.ustencils.forEach(onUstencils => {
             if (onUstencils.isChecked) {
                 isDisplayableProduct = true
             }
         })
         this.appliances.forEach(onAppliance => {
            if (onAppliance.isChecked) {
                isDisplayableProduct = true
            }
         })
        if (isDisplayableProduct) {
            console.log("Le produit", this.name, "est un produit valable")
            displayedProduct.push(this)
        } else {
            //rajouter la supression du produit de la liste si le tag est decelectionné
            console.log("Le produit", this.name, "n'est pas un produit valable ou déjà affiché")
        }
    }
}

// creation du tableau de produit qui contiendra toutes les recettes.
//création des 3 filtres qui contiendrons les objets associés "indredient" "ustensil" "appliance".
let ingredientFilter = new Filter("ingredients");
let applianceFilter = new Filter("appliances");
let ustensiltFilter = new Filter("ustensils");
let allProducts = [];

recipes.forEach(oneProduct => {
    let allIngredients=[] ,allUstensils = [], allAppliances =[];
    oneProduct.ingredients.forEach(oneIngredient => {
        allIngredients.push(new Ingredient(oneIngredient.ingredient));
        ingredientFilter._addFilter(oneIngredient.ingredient);
    });
    oneProduct.ustensils.forEach(oneUstensil => {
        allUstensils.push(new Ustensil(oneUstensil));
        ustensiltFilter._addFilter(oneUstensil);
    });
    allAppliances.push(new Appliance(oneProduct.appliance));
    applianceFilter._addFilter(oneProduct.appliance);
    allProducts.push(new Product(oneProduct.name, allIngredients,allUstensils,allAppliances,oneProduct.description));
});

//on affiche les filtres à l'initialisation
ingredientFilter._createFilterOnDom();
ustensiltFilter._createFilterOnDom();
applianceFilter._createFilterOnDom();


//No display product at start up (to be corrected)
logAllProductWithTag();
updateAllDisplayedProduct();