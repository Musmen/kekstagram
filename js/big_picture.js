'use strict';
// 4.  Покажите элемент .big-picture, удалив у него класс .hidden и заполните
// его данными из первого элемента сгенерированного вами массива:
// o  Адрес изображения url подставьте как src изображения внутри
// блока.big-picture__img.
// o  Количество лайков likes подставьте как текстовое содержание
// элемента .likes-count.
// o  Количество комментариев comments подставьте как текстовое
// содержание элемента .comments-count.
// o  Список комментариев под фотографией: коментарии должны
// вставляться в блок .social__comments. Разметка каждого
// комментария должна выглядеть так:
// <li class="social__comment social__comment--text">
// <img class="social__picture" src="img/avatar-{{случайное число от 1 до 6}}.svg"
// alt="Аватар комментатора фотографии"
// width="35" height="35">
// <p class="social__text">{{текст комментария}}</p>
// </li>
// o  Описание фотографии description вставьте строкой
// в блок .social__caption.
(function () {

  var bigPicture = {
    container: document.body.querySelector('.big-picture')
  };
  bigPicture.img = bigPicture.container.querySelector('.big-picture__img > img');
  bigPicture.cancelButton = bigPicture.container.querySelector('.big-picture__cancel');
  bigPicture.likes = bigPicture.container.querySelector('.likes-count');
  bigPicture.commentsContainer = bigPicture.container.querySelector('.social__comments');
  bigPicture.comments = bigPicture.container.querySelector('.comments-count');
  bigPicture.caption = bigPicture.container.querySelector('.social__caption');

  bigPicture.loadmoreButton = bigPicture.container.querySelector('.social__loadmore');

  var commentsCount = null;
  var renderComments = function (comments, commentsContainerBigPicture) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < Math.min(comments.length, 5); i++) {
      var commentsTemplate = document.body.querySelector('#comments-template')
        .content.querySelector('.social__comment.social__comment--text').cloneNode(true);
      commentsTemplate.querySelector('.social__picture').src = comments[i].avatar;
      commentsTemplate.querySelector('.social__text').textContent = comments[i].message;
      fragment.appendChild(commentsTemplate);
    }

    commentsContainerBigPicture.appendChild(fragment);
    return i;
  };

  var onLoadmoreButtonClick = function (evt) {
    if (evt) {
      evt.preventDefault();
    }
    commentsCount += renderComments(window.photoSet.items[activePhotoIndex].comments.slice(commentsCount), bigPicture.commentsContainer);
    bigPicture.container.querySelector('.social__comment-count').firstChild.data = commentsCount + ' из ';
    if (commentsCount >= window.photoSet.items[activePhotoIndex].comments.length) {
      bigPicture.loadmoreButton.removeEventListener('click', onLoadmoreButtonClick);
      bigPicture.loadmoreButton.classList.add('visually-hidden');
    }
  };

  var renderBigPicture = function (bigPicContainer, photo) {
    commentsCount = 0;
    bigPicture.img.src = photo.url;
    bigPicture.likes.textContent = photo.likes;
    bigPicture.comments.textContent = photo.comments.length;
    bigPicture.caption.textContent = photo.description;

    bigPicture.loadmoreButton.addEventListener('click', onLoadmoreButtonClick);
    bigPicture.loadmoreButton.classList.remove('visually-hidden');
    onLoadmoreButtonClick();
    bigPicture.container.classList.remove('hidden');
  };

  // 4.3. При нажатии на любую из миниатюр, показывается блок  .big-picture , содержащий
  // полноэкранное изображение с количеством лайков и комментариев.
  // Злементу  body задаётся класс  modal-open . Данные, описывающие изображение должны
  // подставляться в соответствующие элементы в разметке.
  var getPhotoIndex = function (target) {
    var photoSrc = target.getAttribute('src');
    for (var i = 0; i < window.photoSet.items.length; i++) {
      if (photoSrc === window.photoSet.items[i].url) {
        return i;
      }
    }
    return -1;
  };

  var closeBigPicture = function () {
    document.body.classList.remove('modal-open');
    bigPicture.loadmoreButton.removeEventListener('click', onLoadmoreButtonClick);
    bigPicture.loadmoreButton.classList.add('visually-hidden');
    bigPicture.container.classList.add('hidden');
    bigPicture.commentsContainer.textContent = '';
    document.removeEventListener('keydown', onBigPictureEscPressed);
    activePhoto.blur();
  };

  var onBigPictureEscPressed = function (evt) {
    window.utils.isEscPressed(evt, closeBigPicture);
  };

  var activePhoto = null;
  var activePhotoIndex = null;
  var onPhotoSetClick = function (evt) {
    var target = evt.target;
    while (!target.classList.contains('picture__link')) {
      if ((!target.parentElement) || (target.parentElement === evt.currentTarget)) {
        return;
      }
      target = target.parentElement;
    }
    activePhotoIndex = getPhotoIndex(target.querySelector('img'));
    if (!~activePhotoIndex) {
      return;
    }
    activePhoto = window.photoSet.elements[activePhotoIndex];
    renderBigPicture(bigPicture.container, window.photoSet.items[activePhotoIndex]);
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onBigPictureEscPressed);
  };

  window.photoSet.container.addEventListener('click', onPhotoSetClick);

  window.photoSet.container.addEventListener('keydown', function (evt) {
    window.utils.isEnterPressed(evt, onPhotoSetClick.bind(null, evt));
  });

  bigPicture.cancelButton.addEventListener('click', function () {
    closeBigPicture();
  });

})();
