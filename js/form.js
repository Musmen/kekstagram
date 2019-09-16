'use strict';

(function () {

  var imgFormFileField = window.utils.formElement.querySelector('#upload-file');
  var imgFormOverlay = window.utils.formElement.querySelector('.img-upload__overlay');
  var imgFormCancelButton = window.utils.formElement.querySelector('#upload-cancel');

  var onImgFormOverlayEscPressed = function (evt) {
    window.utils.isEscPressed(evt, hideImgFormOverlay);
  };

  var showImgFormOverlay = function () {
    // window.utils.previewElement.lastElementChild.src = 'img/' + imgFormFileField.files[0].name; // ????????????????????????
    imgFormOverlay.classList.remove('hidden');
    window.resize.setValue(100);
    window.effects.hideScaleBar();
    window.effects.clear();
    document.addEventListener('keydown', onImgFormOverlayEscPressed);
  };

  var hideImgFormOverlay = function () {
    imgFormOverlay.classList.add('hidden');
    window.utils.formElement.reset();
    hashtagsField.setCustomValidity('');
    document.removeEventListener('keydown', onImgFormOverlayEscPressed);
  };

  imgFormFileField.addEventListener('change', function () {
    showImgFormOverlay();
  });

  imgFormCancelButton.addEventListener('click', function () {
    hideImgFormOverlay();
  });

  var commentsContainer = window.utils.formElement.querySelector('.img-upload__text');
  var hashtagsField = commentsContainer.querySelector('.text__hashtags');

  commentsContainer.addEventListener('focus', function () {
    document.removeEventListener('keydown', onImgFormOverlayEscPressed);
  }, true);

  commentsContainer.addEventListener('blur', function () {
    document.addEventListener('keydown', onImgFormOverlayEscPressed);
  }, true);

  // 2.3. Хэш-теги:
  // хэш-теги необязательны;
  // если фокус находится в поле ввода хэш-тега, нажатие на Esc не должно приводить
  // к закрытию формы редактирования изображения.

  // хэш-тег начинается с символа  #  (решётка);
  // хеш-тег не может состоять только из одной решётки;
  // хэш-теги разделяются пробелами;
  // один и тот же хэш-тег не может быть использован дважды;
  // нельзя указать больше пяти хэш-тегов;
  // максимальная длина одного хэш-тега 20 символов, включая решётку;
  // теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом.
  // Сообщения о неправильном формате хэштега задаются с помощью
  // метода  setCustomValidity  у соответствующего поля.
  var HASTAGS_MAX_COUNT = 5;

  var checkHastagValidity = function () {
    var errorMessage = '';
    var hastags = hashtagsField.value.trim().toUpperCase().split(/[' ']+/);
    if (!hastags.length) {
      return;
    }
    if (hastags.length > HASTAGS_MAX_COUNT) {
      errorMessage = 'Допускается не более 5 хэш-тегов';
    } else {
      for (var i = 0; i < hastags.length; i++) {
        if (hastags[i].length > 20) {
          errorMessage = 'Длина хэш-тега № ' + (i + 1) + ' не должна превышать 20 символов';
          break;
        }
        if (hastags[i][0] !== '#') {
          errorMessage = 'Хэш-тег № ' + (i + 1) + ' должен начинаться с #';
          break;
        } else if (hastags[i].length === 1) {
          errorMessage = 'Хэш-тег № ' + (i + 1) + ' не должен состоять только из #';
          break;
        }
        var item = hastags[i];
        delete hastags[i];
        if (~hastags.indexOf(item)) {
          errorMessage = 'Хэш-тег № ' + (hastags.indexOf(item) + 1) + ' уже введен под номером ' + (i + 1);
          break;
        }
        hastags[i] = item;
      }
    }
    hashtagsField.setCustomValidity(errorMessage);
  };

  hashtagsField.addEventListener('change', function () {
    checkHastagValidity();
  });

  var imgFormSubmitButton = window.utils.formElement.querySelector('.img-upload__submit');

  var onSubmit = function (evt) {
    if (window.utils.formElement.reportValidity()) {
      evt.preventDefault();
      var data = new FormData(window.utils.formElement);
      window.backend.save(data, hideImgFormOverlay, window.backend.showError);
    }
  };

  imgFormSubmitButton.addEventListener('click', onSubmit);

  window.form = {
    hideImgFormOverlay: hideImgFormOverlay
  };

})();
