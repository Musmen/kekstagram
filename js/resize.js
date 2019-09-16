'use strict';
// 2.1. Масштаб:
// При нажатии на кнопки  .resize__control--minus  и  .resize__control--plus  должно
// изменяться значение поля  .resize__control--value.
// Значение должно изменяться с шагом в 25. Например, если значение поля установлено
// в 50%, после нажатия на «+», значение должно стать равным 75%. Максимальное
// значение — 100%, минимальное — 25%. Значение по умолчанию — 100%.
// При изменении значения поля  .resize__control--value изображению  .img-upload__preview  должен добавляться соответствующий стиль CSS, который с помощью
// трансформации  scale  задаёт масштаб. Например, если в поле стоит значение 75%,
// то в стиле изображения должно быть написано  transform: scale(0.75).
(function () {

  var resize = {
    minusButton: window.utils.formElement.querySelector('.resize__control--minus'),
    plusButton: window.utils.formElement.querySelector('.resize__control--plus'),
    controlField: window.utils.formElement.querySelector('.resize__control--value'),
    value: null,

    STEP: 25,

    VALUE: {
      MIN: 25,
      MAX: 100
    }
  };

  var getResizeValue = function () {
    return parseInt(resize.controlField.value, 10);
  };

  window.resize = {
    setValue: function (newValue) {
      resize.controlField.value = newValue + '%';
      window.utils.previewElement.style.transform = 'scale(' + newValue / 100 + ')';
    }
  };

  var resizeImg = function (STEP, LIMIT) {
    resize.value = getResizeValue();
    if (resize.value === LIMIT) {
      return;
    }
    resize.value += STEP;
    window.resize.setValue(resize.value);
  };

  resize.plusButton.addEventListener('click', function () {
    resizeImg(resize.STEP, resize.VALUE.MAX);
  });

  resize.minusButton.addEventListener('click', function () {
    resizeImg(-resize.STEP, resize.VALUE.MIN);
  });

})();
