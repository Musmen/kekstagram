'use strict';
// При изменении уровня интенсивности эффекта, CSS-стили элемента  .img-upload__preview
// обновляются следующим образом:
// Для эффекта «Хром» —  filter: grayscale(0..1);
// Для эффекта «Сепия» —  filter: sepia(0..1);
// Для эффекта «Марвин» —  filter: invert(0..100%);
// Для эффекта «Фобос» —  filter: blur(0..3px);
// Для эффекта «Зной» —  filter: brightness(1..3).
(function () {
  var imgEffectsContainer = window.utils.formElement.querySelector('.img-upload__effects');
  var scaleBarContainer = window.utils.formElement.querySelector('.img-upload__scale');
  var scaleLevelBar = scaleBarContainer.querySelector('.scale__level');
  var scaleValueField = scaleBarContainer.querySelector('.scale__value');
  var scalePin = scaleBarContainer.querySelector('.scale__pin');

  var setImgPreviewFilterStyle = function (filterStyle) {
    window.utils.previewElement.style.webkitFilter = filterStyle;
    window.utils.previewElement.style.filter = filterStyle;
  };

  var setScaleValue = function (scaleValue) {
    scaleValueField.value = scaleValue;
  };

  var changeEffectsScale = function () {
    var scale = Math.round((scalePin.offsetLeft - scaleLevelBar.offsetLeft) * 100 / scaleLevelBar.clientWidth);
    setScaleValue(scale);
    scale = scale / 100;

    switch (window.utils.previewElement.classList[1]) {
      case 'effects__preview--chrome':
        setImgPreviewFilterStyle('grayscale(' + scale + ')');
        break;
      case 'effects__preview--sepia':
        setImgPreviewFilterStyle('sepia(' + scale + ')');
        break;
      case 'effects__preview--marvin':
        setImgPreviewFilterStyle('invert(' + scale * 100 + '%)');
        break;
      case 'effects__preview--phobos':
        setImgPreviewFilterStyle('blur(' + scale * 3 + 'px)');
        break;
      case 'effects__preview--heat':
        setImgPreviewFilterStyle('brightness(' + (1 + scale * 2) + ')');
        break;
    }
  };

  var pin = {
    MIN_X: null,
    MAX_X: null,

    shiftX: null,

    setPosition: function (xCoord) {
      xCoord = Math.max(xCoord, pin.MIN_X);
      xCoord = Math.min(xCoord, pin.MAX_X);
      scalePin.style.left = xCoord + 'px';
    }
  };

  var onScalePinMouseDown = function (evtMouseDown) {
    evtMouseDown.preventDefault();
    pin.shiftX = evtMouseDown.clientX - scalePin.offsetLeft;

    var onScalePinMouseMove = function (evtMouseMove) {
      evtMouseMove.preventDefault();
      changeEffectsScale();
      pin.setPosition(evtMouseMove.clientX - pin.shiftX);
    };

    var onScalePinMouseUp = function (evtMouseUp) {
      evtMouseUp.preventDefault();
      // changeEffectsScale(); Требуются по заданию, но зачем они???
      // pin.setPosition(evtMouseUp.clientX - pin.shiftX);
      document.removeEventListener('mousemove', onScalePinMouseMove);
      document.removeEventListener('mouseup', onScalePinMouseUp);
    };

    document.addEventListener('mousemove', onScalePinMouseMove);
    document.addEventListener('mouseup', onScalePinMouseUp);
  };

  scalePin.addEventListener('mousedown', onScalePinMouseDown);

  // 2.2. Наложение эффекта на изображение:
  // На изображение может накладываться только один эффект .
  // При смене эффекта, выбором одного из значений среди
  // радиокнопок  .effects__radio , добавить картинке внутри  .img-upload__preview  CSS-класс, соответствующий эффекту.
  // Например, если выбран эффект  .effect-chrome ,
  // изображению нужно добавить класс  effects__preview--chrome .
  // Интенсивность эффекта регулируется перемещением ползунка
  // в слайдере  .scale__pin . Уровень эффекта записывается в поле  .scale__value . При
  // изменении уровня интенсивности эффекта, CSS-стили элемента  .img-upload__preview  обновляются следующим образом:
  // Для эффекта «Хром» —  filter: grayscale(0..1);
  // Для эффекта «Сепия» —  filter: sepia(0..1);
  // Для эффекта «Марвин» —  filter: invert(0..100%);
  // Для эффекта «Фобос» —  filter: blur(0..3px);
  // Для эффекта «Зной» —  filter: brightness(1..3).
  // При выборе эффекта «Оригинал» слайдер скрывается.
  // При переключении эффектов, уровень насыщенности сбрасывается до начального
  // значения (100%): слайдер, CSS-стиль изображения и значение поля должны
  // обновляться.
  var showScaleBar = function () {
    scaleBarContainer.classList.remove('hidden');

    pin.MIN_X = pin.MIN_X || scaleLevelBar.offsetLeft;
    pin.MAX_X = pin.MAX_X || (scaleLevelBar.offsetLeft + scaleLevelBar.clientWidth);
    pin.setPosition(pin.MAX_X);
    setScaleValue(100);
  };

  window.effects = {
    hideScaleBar: function () {
      scaleBarContainer.classList.add('hidden');
    },

    clear: function () {
      window.utils.previewElement.classList.remove(window.utils.previewElement.classList[1]);
      setImgPreviewFilterStyle('');
    }
  };

  var onImgEffectsChange = function (evt) {
    window.effects.clear();
    if (evt.target.value === 'none') {
      window.effects.hideScaleBar();
      return;
    }
    showScaleBar();
    window.utils.previewElement.classList.add('effects__preview--' + evt.target.value);
  };

  imgEffectsContainer.addEventListener('change', onImgEffectsChange);

})();
