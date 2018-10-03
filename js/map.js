'use strict';

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

var createPopup = function () {
  var map = document.querySelector('.map');
  var templateListing = document.querySelector('#card').content;
  var listing = templateListing.cloneNode(true);

  map.insertBefore(listing, map.querySelector('.map__filters-container'));
  var popup = document.querySelector('.popup');
  var popupPhotos = popup.querySelector('.popup__photos');

  for (var i = 0; i < 2; i++) {
    var popupPhoto = popupPhotos.querySelector('img').cloneNode(true);
    popupPhotos.appendChild(popupPhoto);
  }

  var closeButton = popup.querySelector('button');
  closeButton.addEventListener('click', closePopup);

  popup.classList.add('hidden');
};

var comletePopup = function (advertisement) {
  var textCapacity =
    advertisement.offer.rooms +
    ' комнаты для ' +
    advertisement.offer.guests +
    ' гостей';
  var textTime =
    'Заезд после ' +
    advertisement.offer.checkin +
    ' , выезд до ' +
    advertisement.offer.checkout;
  var popup = document.querySelector('.popup');
  var setListingTextContent = function (popupName, offerName) {
    popup.querySelector(popupName).textContent = offerName;
  };

  setListingTextContent('.popup__title', advertisement.offer.title);
  setListingTextContent('.popup__text--address', advertisement.offer.adress);
  setListingTextContent(
      '.popup__text--price',
      advertisement.offer.price + '₽/ночь'
  );
  setListingTextContent('.popup__type', offerTypes[advertisement.offer.type]);
  setListingTextContent('.popup__text--capacity', textCapacity);
  setListingTextContent('.popup__text--time', textTime);
  setListingTextContent('.popup__features', advertisement.offer.features);
  setListingTextContent('.popup__description', advertisement.offer.description);

  var popupPhotos = popup.querySelectorAll('.popup__photos img');

  for (var i = 0; i < advertisement.offer.photos.length; i++) {
    popupPhotos[i].src = advertisement.offer.photos[i];
  }
  var avatar = popup.querySelector('.popup__avatar');
  avatar.src = advertisement.author.avatar;
};

var createPins = function () {
  var advertisements = getAdvertisements();
  var map = document.querySelector('.map');

  var template = document.querySelector('#pin').content;

  for (var i = 0; i < advertisements.length; i++) {
    var element = template.querySelector('.map__pin').cloneNode(true);
    var image = element.querySelector('img');
    element.style.left = advertisements[i].location.x + 'px';
    element.style.top = advertisements[i].location.y + 'px';
    image.src = advertisements[i].author.avatar;
    image.alt = advertisements[i].offer.title;

    map.appendChild(element);
    (function (index) {
      element.addEventListener('click', function () {
        comletePopup(advertisements[index]);
        openPopup();
      });
    })(i);
  }
  togglePins(false);
};

var enableForm = function () {
  var adForm = document.querySelector('.ad-form');
  var formFieldsets = adForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var map = document.querySelector('.map');

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('ad-form--disabled');

  for (var i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].removeAttribute('disabled');
  }

  togglePins(true);
};

createPopup();
createPins();

var mapPinMain = document.querySelector('.map__pin--main');
mapPinMain.addEventListener('mouseup', enableForm);

var numberRooms = document.querySelector('#room_number');
var numberGuests = document.querySelector('#capacity');

var validate = function () {
  var str = '';
  if (
    +numberRooms.value < +numberGuests.value ||
    (+numberRooms.value === 100 && +numberGuests.value !== 0) ||
    (+numberRooms.value !== 100 && +numberGuests.value === 0)
  ) {
    str = 'Несоответствие количества комнат количеству возможных гостей';
  }
  numberRooms.setCustomValidity(str);
};

validate();

numberGuests.addEventListener('change', validate);
numberRooms.addEventListener('change', validate);

var formAddress = document.querySelector('#address');

var markerHandle = document.querySelector('.map__pin--main');
markerHandle.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  var onMouseMove = function (moveEvt) {
    var markerHeight = 84;
    var marketWidth = 62;
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var setPositionX = function (x) {
      markerHandle.style.left = x + 'px';
    };

    var x = markerHandle.offsetLeft - shift.x;

    if (x < 0) {
      setPositionX(0);
    } else if (x > 1200 - marketWidth) {
      setPositionX(1200 - marketWidth);
    } else {
      setPositionX(x);
    }

    var setPositionY = function (y) {
      markerHandle.style.top = y + 'px';
    };

    var y = markerHandle.offsetTop - shift.y;
    if (y < 130) {
      setPositionY(130);
    } else if (y > 630) {
      setPositionY(630);
    } else {
      setPositionY(y);
    }
    formAddress.value = x + marketWidth / 2 + ', ' + (y + markerHeight);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
