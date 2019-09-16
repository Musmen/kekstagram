'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.utils = {
    isEscPressed: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    isEnterPressed: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    getRandomInt: function (minRange, maxRange) {
      return Math.floor(Math.random() * (++maxRange - minRange) + minRange);
    },

    formElement: document.body.querySelector('.img-upload__form')

  };

  window.utils.previewElement = window.utils.formElement.querySelector('.img-upload__preview');

})();
