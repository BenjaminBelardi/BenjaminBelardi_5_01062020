import  {recipes} from "./recipes.js";
// tag list creation from recipes table
let ingredients = [];
let ustensils =[];
let sortIngedients = [];
let sortUstensils= [];

recipes.forEach(element => {element.ingredients.forEach(element => {ingredients.push(normalize(element.ingredient))   
});
});

recipes.forEach(element => {element.ustensils.forEach(element => {ustensils.push(element)   
});
});

function normalize (str){
  let normalizeStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  //let singularStr = normalizeStr.replace(/\u0073$/gm,"");
  return normalizeStr;
}

function filterTab (tab){
    return new Set(tab.sort());
}

sortIngedients = filterTab(ingredients);
sortUstensils = filterTab(ustensils);

//******************************DOM************************

// add tag list in html
let sel = document.getElementById('myIngredientsList');
sortIngedients.forEach(function(element){
  // create new li element
  let list = document.createElement('li');
  // create text node to add to li element (list)
  list.appendChild( document.createTextNode(element));
  // set inner text property of li and add filtTag class
  list.classList.add('tag__filter')
  list.innerText = element; 
  // add list to end of list (sel)
  sel.appendChild(list); 
})



// add selected tag on top of tag search
let tagFilter = document.getElementById("filterTag");
 function addSelectedTag(elt, selectedTag) {
   // create new span element
  let filter = document.createElement('span');
  // create text node to add to span element
  filter.appendChild( document.createTextNode(selectedTag));
  // set inner text property of span and add filterActive class
  filter.classList.add('filterActive')
  filter.innerText = selectedTag ;
  tagFilter.insertBefore(filter,tagFilter.firstChild)

  //creat new icon close element
  let icon = document.createElement('i');
  icon.classList.add('far','fa-times-circle');
  filter.appendChild(icon);
}


//event to display tag list on input search event
let myIngredientsList = document.getElementById("myIngredientsList");
document.getElementById("mySearchIngredient").onfocus = function() {
      myIngredientsList.classList.add("displayed");
      myIngredientsList.classList.remove("tag__list");
};

//event to hidden tag list
document.getElementById("mySearchIngredient").onblur = function() {
  myIngredientsList.classList.remove("displayed");
  myIngredientsList.classList.add("tag__list");
  for (let child of myIngredientsList.children){
    child.classList.remove("selected");
  }
};



// function to get the user choise
function getDataTag(event){
  //event.target.preventDefault;
  //event.target.stopPropagation;
  event.target.classList.add("selected");
  console.log(event.target.innerText);
  addSelectedTag(event.target.parentNode,event.target.innerText);
}

let optionChoise = document.querySelectorAll(".tag__filter");
optionChoise.forEach((input)=>input.addEventListener('mousedown', getDataTag));

