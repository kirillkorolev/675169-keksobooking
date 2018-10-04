'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var titleValues = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var typeValues = ['palace', 'flat', 'house', 'bungalo'];

  var checkinValues = ['12:00', '13:00', '14:00'];

  var checkoutValues = ['12:00', '13:00', '14:00'];

  var featuresValues = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var photosValues = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var offerTypes = {
    flat: 'Квартира',
    palace: 'Дворец',
    house: 'Дом',
    bungalo: 'Бунагло'
  };

  var getRandomInRange = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };

  var getRandomValue = function (arr) {
    var min = 0;
    var max = arr.length - 1;
    var value = getRandomInRange(min, max);
    return arr[value];
  };

  var getFeatures = function () {
    return featuresValues.slice(0, getRandomInRange(0, featuresValues.length));
  };

  var getPhotos = function () {
    return photosValues.slice().sort(function () {
      return Math.random() - 0.5;
    });
  };

  var getAdvertisement = function (index) {
    index = index + 1;
    var author = {
      avatar: 'img/avatars/user0' + index + '.png'
    };

    var location = {
      x: getRandomInRange(0, 1200),
      y: getRandomInRange(130, 630)
    };

    var offer = {
      title: getRandomValue(titleValues),
      address: location.x + ', ' + location.y,
      price: getRandomInRange(1000, 1000000),
      type: getRandomValue(typeValues),
      rooms: getRandomInRange(1, 5),
      guests: Math.floor(Math.random() * 10),
      checkin: getRandomValue(checkinValues),
      checkout: getRandomValue(checkoutValues),
      features: getFeatures(),
      description: ' ',
      photos: getPhotos()
    };

    return {
      author: author,
      offer: offer,
      location: location
    };
  };

  var getAdvertisements = function () {
    var array = [];
    for (var i = 0; i < 8; i++) {
      array[i] = getAdvertisement(i);
    }
    return array;
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

  window.data = {
    getAdvertisements: getAdvertisements,
    openPopup: openPopup,
    closePopup: closePopup,
    togglePins: togglePins
  };
})();
