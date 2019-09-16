'use strict';

(function () {

  /****************************************************************************************/
  // var PHOTOS_COUNT = 25;

  // var LIKES = {
  //   NUMBER: {
  //     MIN: 15,
  //     MAX: 200
  //   }
  // };

  // var createPhotoSet = function (numberOfPhotos) {

  //   var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  //     'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  //     'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  //     'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  //     'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  //   var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...',
  //     'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  //     'Вот это тачка!'];


  //   var Photo = function (index) {
  //     this.url = 'photos/' + index + '.jpg';
  //     this.likes = window.utils.getRandomInt(LIKES.NUMBER.MIN, LIKES.NUMBER.MAX);
  //     this.comments = (function () {
  //       var result = [];
  //       for (var i = 0; i < window.utils.getRandomInt(1, 2); i++) {
  //         result.push(COMMENTS[window.utils.getRandomInt(0, COMMENTS.length - 1)]);
  //       }
  //       return result;
  //     })();
  //     this.description = DESCRIPTIONS[window.utils.getRandomInt(0, DESCRIPTIONS.length - 1)];
  //   };

  //   var photoSet = [];
  //   for (var i = 0; i < numberOfPhotos; i++) {
  //     photoSet.push(new Photo(i + 1));
  //   }

  //   return photoSet;
  // };
  /***********************************************************************************************/
  // var photos = createPhotoSet(PHOTOS_COUNT);

  // 2.  На основе данных, созданных в предыдущем пункте
  // и шаблона #picture создайте DOM-элементы, соответствующие
  // фотографиям и заполните их данными из массива:
  // o  Адрес изображения url подставьте как src изображения.
  // o  Количество лайков likes подставьте как текстовое содержание
  // элемента .picture__stat--likes.
  // o  Количество комментариев comments подставьте как текстовое
  // содержание элемента .picture__stat--comments.
  var pictureTemplate = document.body.querySelector('#picture');

  var createPhotoSetElements = function (photoSet) {
    var photoSetElements = [];
    for (var i = 0; i < photoSet.length; i++) {
      var pictureElement = pictureTemplate.content.querySelector('.picture__link').cloneNode(true);
      pictureElement.querySelector('.picture__img').src = photoSet[i].url;
      pictureElement.querySelector('.picture__stat--likes').textContent = photoSet[i].likes;
      pictureElement.querySelector('.picture__stat--comments').textContent = photoSet[i].comments.length;
      photoSetElements.push(pictureElement);
    }

    return photoSetElements;
  };

  // 3.  Отрисуйте сгенерированные DOM-элементы в блок .pictures. Для вставки
  // элементов используйте DocumentFragment.
  var picturesContainer = document.body.querySelector('.pictures');

  var renderPhotos = function (photoSetElements, container) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photoSetElements.length; i++) {
      fragment.appendChild(photoSetElements[i]);
    }
    container.appendChild(fragment);
  };

  var clearPhotos = function (photoSetElements, container) {
    photoSetElements.forEach(function (item) {
      container.removeChild(item);
    });
  };

  var POPULAR_PHOTOS_COUNT = 10;
  var FilterIdToNewPhotos = {
    'filter-popular': function () {
      return photos;
    },

    'filter-new': function () {
      var randomIndex = window.utils.getRandomInt(0, photos.length - POPULAR_PHOTOS_COUNT);
      return photos.slice(randomIndex, randomIndex + POPULAR_PHOTOS_COUNT);
    },

    'filter-discussed': function () {
      return photos.slice().sort(
          function (left, right) {
            return right.comments.length - left.comments.length;
          }
      );
    }
  };

  var activeFilter = document.body.querySelector('#filter-popular');
  var onFilterClick = function (evt) {
    if (evt.target.tagName.toLowerCase() !== 'button') {
      return;
    }
    clearPhotos(photosElements, picturesContainer);
    var newPhotos = FilterIdToNewPhotos[evt.target.id]();
    photosElements = createPhotoSetElements(newPhotos);
    renderPhotos(photosElements, picturesContainer);
    activeFilter.classList.remove('img-filters__button--active');
    activeFilter = evt.target;
    activeFilter.classList.add('img-filters__button--active');
  };


  var photos = [];
  var photosElements = [];
  var imgFiltersContainer = document.body.querySelector('.img-filters');
  var uploadPhotoSet = function (data) {
    photos = data;
    photosElements = createPhotoSetElements(photos);
    renderPhotos(photosElements, picturesContainer);

    window.photoSet.elements = photosElements;
    window.photoSet.items = photos;
    imgFiltersContainer.addEventListener('click', onFilterClick);
    imgFiltersContainer.classList.remove('img-filters--inactive');
  };

  window.backend.load(uploadPhotoSet, window.backend.showError);

  window.photoSet = {
    container: picturesContainer,
    items: photos,
    elements: photosElements
  };

  // uploadPhotoSet(createPhotoSet(PHOTOS_COUNT)); // Это убрать, если данные берем с сервера
})();
