'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var offerTypes = {
    flat: 'Квартира',
    palace: 'Дворец',
    house: 'Дом',
    bungalo: 'Бунагло'
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function () {
    var popup = document.querySelector('.popup');
    popup.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    var popup = document.querySelector('.popup');
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var togglePins = function (show) {
    var mapPins = document.querySelectorAll(
        '.map .map__pin:not(.map__pin--main)'
    );

    for (var i = 0; i < mapPins.length; i++) {
      if (show) {
        mapPins[i].classList.remove('hidden');
      } else {
        mapPins[i].classList.add('hidden');
      }
    }
  };

  var showMessage = function (selector) {
    var main = document.querySelector('main');
    var templateError = document.querySelector(selector).content;
    var block = templateError.cloneNode(true);
    main.appendChild(block);
  };

  var closeMessage = function (tag) {
    document.addEventListener('click', function () {
      var block = document.querySelector(tag);
      block.classList.add('hidden');
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        var block = document.querySelector(tag);
        block.classList.add('hidden');
      }
    });
  };

  var showErrorMessage = function () {
    showMessage('#error');
    closeMessage('.error');
  };

  var showSuccessMessage = function () {
    showMessage('#success');
    closeMessage('.success');
  };

  window.data = {
    offerTypes: offerTypes,
    openPopup: openPopup,
    closePopup: closePopup,
    togglePins: togglePins,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };
})();
