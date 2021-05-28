import  {recipes} from "./recipes.mjs";
// tag list creation from recipes table

let ingredients = [];
let ustensils =[];
let sortIngedients = [];
let sortUstensils= [];

recipes.forEach(element => {element.ingredients.forEach(element => {ingredients.push(element.ingredient)   
});
});

recipes.forEach(element => {element.ustensils.forEach(element => {ustensils.push(element)   
});
});

function filterTab (tab){
    return new Set(tab.sort());
}

sortIngedients = filterTab(ingredients);
sortUstensils = filterTab(ustensils);


// add tag list in html

let sel = document.getElementById('mySelectIngredients');
sortIngedients.forEach(function(element){
  // create new option element
  let opt = document.createElement('div');
  // create text node to add to option element (opt)
  opt.appendChild( document.createTextNode(element));
  // set value property of opt
  opt.classList.add('opt')
  opt.value = element; 
  // add opt to end of select box (sel)
  sel.appendChild(opt); 
})

//DOM
const optionChoise = document.querySelectorAll(".opt");

optionChoise.forEach((input)=>input.addEventListener("mouseover", getDataTag));

function getDataTag(event){
    console.log(event.target.value);
}