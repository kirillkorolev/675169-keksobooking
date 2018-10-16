'use strict';

(function () {
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
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
    togglePins: togglePins,
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage
  };
})();
