'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var START_X = 570;
  var START_Y = 375;
  var WIDTH_X = 1200;
  var TOP_Y = 130;
  var BOTTOM_Y = 630;
  var MARKER_WIDTH = 62;
  var TIMEOUT = 10000;
  var OK_CODE = 200;

  var ESC_KEYCODE = 27;

  var OFFER_TYPES = {
    flat: 'Квартира',
    palace: 'Дворец',
    house: 'Дом',
    bungalo: 'Бунагло'
  };

  window.constants = {
    FILE_TYPES: FILE_TYPES,
    START_X: START_X,
    START_Y: START_Y,
    WIDTH_X: WIDTH_X,
    TOP_Y: TOP_Y,
    BOTTOM_Y: BOTTOM_Y,
    MARKER_WIDTH: MARKER_WIDTH,
    TIMEOUT: TIMEOUT,
    OK_CODE: OK_CODE,
    ESC_KEYCODE: ESC_KEYCODE,
    OFFER_TYPES: OFFER_TYPES
  };
})();
