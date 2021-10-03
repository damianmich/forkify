import icons from 'url:../../img/icons.svg';
import View from './View.js';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');
  _errorMessage = 'Error. Please try again!';
  _message = 'Succesfull! :) You added you recipe!';

  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }
  _toogleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this._toogleWindow.bind(this));
  }
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this._toogleWindow.bind(this));
    this._overlay.addEventListener('click', this._toogleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}

export default new addRecipeView();
