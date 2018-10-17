'use strict';

(function () {
  var map = document.querySelector('.map');

  var clearPinsSelect = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    Array.from(pins).forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function (index) {
    var popup = document.querySelector('.popup');
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    popup.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);

    clearPinsSelect();
    pins[index].classList.add('map__pin--active');
  };

  var closePopup = function () {
    var popup = document.querySelector('.popup');
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
    clearPinsSelect();
  };

  var setHideHandlers = function (selector) {
    var hideMessage = function () {
      var block = document.querySelector(selector);
      block.remove();
      document.removeEventListener('click', hideMessageByClick);
      document.removeEventListener('keydown', hideMessageByEsc);
    };

    var hideMessageByClick = function () {
      hideMessage();
    };

    var hideMessageByEsc = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        hideMessage();
      }
    };

    document.addEventListener('click', hideMessageByClick);
    document.addEventListener('keydown', hideMessageByEsc);
  };

  var showMessage = function (copiedSelector, selector) {
    var main = document.querySelector('main');
    var templateError = document.querySelector(copiedSelector).content;
    var block = templateError.cloneNode(true);
    main.appendChild(block);
    setHideHandlers(selector);
  };

  var showErrorMessage = function () {
    showMessage('#error', '.error');
  };

  var showSuccessMessage = function () {
    showMessage('#success', '.success');
  };

  window.data = {
    openPopup: openPopup,
    closePopup: closePopup,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };
})();
