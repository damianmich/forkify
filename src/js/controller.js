import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './view/addRecipeView.js';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //Loading spinner
    recipeView.renderSpinner();
    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1) Loading recipe
    await model.loadRecipe(id);
    //2) Rendering recipe
    recipeView.render(model.state.recipe);

    // await model.loadSearchResults('pizza');
  } catch (err) {
    recipeView.errorMessage();
    console.log(err);
  }
};

const controlSearchRecipes = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get search query
    const query = searchView.getQuery();
    //2) Loading recipe
    await model.loadSearchResults(query);
    //3) Rendering recipe
    // model.state.search.page = 1;
    resultsView.render(model.getSearchResultsPage());
    // //4) Render initial pagination buttons
    paginationView.render(model.state.search);
    // controlPagination();
  } catch (err) {
    resultsView.errorMessage();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipes servings(in state)
  model.updateServing(newServings);
  //Upadate the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  bookmarksView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Loading spinner
    addRecipeView.renderSpinner();
    //Uploading new recipe
    await model.uploadRecipe(newRecipe);
    //Change id in url
    // window.location.hash = model.state.recipe.id;
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Render recipe
    recipeView.render(model.state.recipe);
    resultsView.update(model.state.recipe);
    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);
    //Render success message
    addRecipeView.renderMessage();
    //Close form window
    setTimeout(() => {
      addRecipeView._toogleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.errorMessage(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchRecipes);
  paginationView.addHandlerRender(controlPagination);
  recipeView.addUpdateRecipes(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
