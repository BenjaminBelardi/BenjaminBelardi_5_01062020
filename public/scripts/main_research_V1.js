// import * as common from "./common-filter-search.js";
// import {recipes} from "./recipes.js";

// //création des 3 filtres qui contiendrons les objets associés "indredient" "ustensil" "appliance".
// let ingredientFilter = new common.Filter("ingredients");
// let applianceFilter = new common.Filter("appliances");
// let ustensiltFilter = new common.Filter("ustensils");
// // creation du tableau de produit qui contiendra toutes les recettes sous forme d'objet.
// let allProducts = [];

// recipes.forEach(oneProduct => {
//     let allIngredients=[] ,allUstensils = [], allAppliances =[];
//     oneProduct.ingredients.forEach(oneIngredient => {
//         allIngredients.push(new common.Ingredient(oneIngredient.ingredient,oneIngredient.quantity,oneIngredient.unit));
//         ingredientFilter._addFilter(oneIngredient.ingredient);
//     });
//     oneProduct.ustensils.forEach(oneUstensil => {
//         allUstensils.push(new common.Ustensil(oneUstensil));
//         ustensiltFilter._addFilter(oneUstensil);
//     });
//     allAppliances.push(new common.Appliance(oneProduct.appliance));
//     applianceFilter._addFilter(oneProduct.appliance);
//     allProducts.push(new common.Product(oneProduct.name, allIngredients,allUstensils,allAppliances,oneProduct.description, oneProduct.time));
// });

// //on affiche les filtres à l'initialisation
// ingredientFilter._createFilterOnDom();
// ustensiltFilter._createFilterOnDom();
// applianceFilter._createFilterOnDom();

// // init display all products
// //displayedProduct = allProducts;
// common.updateAllDisplayedProduct();