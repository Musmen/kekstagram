'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram'; // + '/data';

  var backend = {};

  var onRequestLoad = function (xhr, onLoad, onError) {
    var errorMessage = '';

    switch (xhr.status) {
      case 200:
        onLoad(xhr.response);
        break;
      case 300:
        errorMessage = 'Искомый ресурс не доступен. Ошибка: ';
        break;
      case 400:
        errorMessage = 'Ошибка запроса: ';
        break;
      case 404:
        errorMessage = 'Искомый ресурс не найден. Ошибка: ';
        break;
      default:
        errorMessage = 'Ошибка доступа к искомому ресурсу: ';
        break;
    }

    if (errorMessage) {
      onError(errorMessage + xhr.status);
    }
  };

  var onRequestError = function (xhr, onError, errorMessage) {
    onError(errorMessage + ' \n Статус ответа сервера: ' + xhr.status);
  };

  var addRequestListeners = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function (evt) {
      onRequestLoad(evt.target, onLoad, onError);
    });
    xhr.addEventListener('error', function (evt) {
      onRequestError(evt.target, onError, 'Ошибка доступа к серверу. ');
    });
    xhr.timeout = 2000;
    xhr.addEventListener('timeout', function (evt) {
      onRequestError(evt.target, onError, 'Превышено время ожидания ' + evt.target.timeout + ' мс. ');
    });
  };

  backend.load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    addRequestListeners(xhr, onLoad, onError);

    xhr.open('GET', URL + '/data', true);
    xhr.send();
  };

  backend.save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    addRequestListeners(xhr, onLoad, onError);

    xhr.open('POST', URL, true);
    xhr.send(data);
  };

  window.backend = {
    load: backend.load,
    save: backend.save,
    showError: function (errorMessage) {
      var onErrorPoppup = function () {
        document.removeEventListener('mousedown', onErrorPoppup);
        document.removeEventListener('keydown', onErrorPoppup);
        document.body.removeChild(errorPopup);
      };

      var template = document.body.querySelector('#picture');
      var errorPopup = template.content.querySelector('.img-upload__message--error').cloneNode(false);
      errorPopup.innerHTML = errorMessage;
      errorPopup.style.zIndex = 1000;
      errorPopup.classList.remove('hidden');
      document.addEventListener('mousedown', onErrorPoppup);
      document.addEventListener('keydown', onErrorPoppup);
      document.body.appendChild(errorPopup);
      // 3.4. Если при отправке данных произошла ошибка запроса, нужно показать
      // соответствующее сообщение с помощью блока  img-upload__message--error , у которого
      // нужно убрать класс  hidden .
    }
  };

})();
