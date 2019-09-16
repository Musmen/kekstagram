'use strict';// Протестить отправку формы, особенно новая фотка отправляется или нет...

(function () {

  var imgFormFileField = window.utils.formElement.querySelector('#upload-file');
  var effectsFieldset = document.body.querySelector('.img-upload__effects');
  var spans = effectsFieldset.querySelectorAll('span');
  var newImage = null;

  var isFileTypeValid = function (inputFile) {
    return inputFile.type.split('/')[0] === 'image';
  };

  var renderNewImages = function (imageDataURL) {
    window.utils.previewElement.lastElementChild.src = imageDataURL;
    for (var i = spans.length; i--;) {
      spans[i].style.backgroundImage = 'url("' + imageDataURL + '")';
    }
  };

  var onFileChange = function (inputFile) {
    
    var reader = new FileReader();

    reader.addEventListener('error',
        function (evt) {
          window.form.hideImgFormOverlay();
          window.backend.showError('Ошибка загрузки файла: ' + evt.error.code);
        }
    );

    reader.addEventListener('load',
      function (evt) {
        newImage = evt.target.result;
        renderNewImages(newImage);
      }
    )

    reader.readAsDataURL(inputFile);

  };

  imgFormFileField.addEventListener('change',
      function (evt) {
        if (!isFileTypeValid(evt.target.files[0])) {
          var errorMessage = 'Неверный тип файла' + 
            (evt.target.files[0].type ? (': ' + evt.target.files[0].type) : '');
          window.form.hideImgFormOverlay();
          window.backend.showError(errorMessage);
          return;
        }
        onFileChange(evt.target.files[0]);
      }
  );

})();