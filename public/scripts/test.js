
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
    displayedProduct = [];
    allProducts.forEach(oneProduct => {
        oneProduct._isConcernedByFilter()
    })
}
function addSelectedTag(selectedTag,filterName) {
    let tag = document.getElementById("tagList");
    // create new span element
    let filter = document.createElement('span');
    // create text node to add to span element
    filter.appendChild(document.createTextNode(selectedTag));
    // set inner text property of span and add filterActive class
    filter.classList.add("filterActive", "tag__" + filterName + "--color");
    tag.insertBefore(filter, tag.lastChild);
    //creat new icon close element
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-times-circle');
    filter.appendChild(icon);
}
// eventlistenner qui permet de supprimer les tag "filtre" quand l'utilisteur clique dessus
// document.getElementById('tagList').addEventListener('click',function(event){
//     if (event.target.parentElement.nodeName === "SPAN"){
//         event.target.parentElement.remove();
//     }else{
//         event.target.remove();
//     }
//     event.stopPropagation();
// });


class Filter {
    constructor(name) {
        this.name = name
        this.data = []
        this._createTagChoiseEvent()
        this._createTagListDisplayEvent()
        this._createTagRemoveChoiseEvent()
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

    _displayFilterOnDom() {
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
        let that = this;
        let listToDisplay = document.getElementById(that.name + "-list")
        document.getElementById(that.name + "-search").addEventListener("click", function(event){
            event.stopPropagation();
            listToDisplay.classList.toggle("displayedList");
        });
    }
    // eventlistenner qui permet de supprimer les tag "filtre" quand l'utilisteur clique dessus
    _createTagRemoveChoiseEvent(){
        document.getElementById('tagList').addEventListener('click',function(event){
        if (event.target.parentElement.nodeName === "SPAN"){
            let tagName = event.target.parentElement.innerText;
            event.target.parentElement.remove();
            UnCheckUstensilOnAllProduct(tagName);
            logAllProductWithTag();
            updateAllDisplayedProduct();
        }else{
            let tagName = event.target.innerText;
            event.target.remove();
            UnCheckUstensilOnAllProduct(tagName);
            logAllProductWithTag();
            updateAllDisplayedProduct();
        }
        event.stopPropagation();
    });
    }
    // _createTagListHiddenEvent(){
    //     let that = this;
    //     let listToHidden = document.getElementById(that.name + "-list")
    //     document.getElementById(that.name + "-search").addEventListener("focusout", function(event){
    //         event.stopPropagation();
    //         listToHidden.classList.remove("displayedList");
    //     });
    // }

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
            }
        })
        console.log("Voici les ingrédients mis à jours sur le produit", this.name)
        console.table(this.ingredients)
    }
    _checkAppliance(applianceName) {
        this.appliances.forEach(oneAppliance => {
            if (oneAppliance.name === applianceName) {
                oneAppliance.isChecked = true
            }
        })
        console.log("Voici les appareils mis à jours sur le produit", this.name)
        console.table(this.appliances)
    }
    _checkUstencils(ustencilsName) {
        this.ustencils.forEach(oneUstencils => {
            if (oneUstencils.name === ustencilsName) {
                oneUstencils.isChecked = true
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
        if (isDisplayableProduct && displayedProduct.includes(this) === false) {
            console.log("Le produit", this.name, "est un produit valable")
            displayedProduct.push(this)
        } else {
            //rajouter la supression du produit de la liste si le tag est decelectionné
            console.log("Le produit", this.name, "n'est pas un produit valable ou déjà affiché")
        }
    }
}

// let products = [
//     {
//      name : "purée mousseline",
//      ingredients : [
//          "ail",
//          "echalottes",
//          "lait"
//      ]
//     },
//     {
//      name : "foie gras de canard",
//      ingredients : [
//          "canard",
//          "beurre",
//          "ail",
//          "sel"
//      ]
//     },
//     {
//      name : "nouilles",
//      ingredients : [
//          "sel",
//          "poivre",
//          "crème"
//      ]
//     },
// ]

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
ingredientFilter._displayFilterOnDom();
ustensiltFilter._displayFilterOnDom();
applianceFilter._displayFilterOnDom();



// On part du principe que l'utilisateur a coché "ail"
//let ingredientChecked = "Ail";
//checkIngredientOnAllProduct(ingredientChecked);
logAllProductWithTag();
updateAllDisplayedProduct();