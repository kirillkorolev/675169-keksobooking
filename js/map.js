'use strict';

(function () {
  var MAX_PRICE = 10000;
  var MIN_PRICE = 50000;
/*
  var disableForm = function () {
    var adForm = document.querySelector('.ad-form');
    var formFieldsets = adForm.querySelectorAll('fieldset');
    for (var i = 0; i < formFieldsets.length; i++) {
      formFieldsets.setAttribute('disabled');
    }
  };

  disableForm();
*/
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

  var clearNode = function (node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  };

  var createPopup = function () {
    var map = document.querySelector('.map');
    var templateListing = document.querySelector('#card').content;
    var listing = templateListing.cloneNode(true);

    map.insertBefore(listing, map.querySelector('.map__filters-container'));
    var popup = document.querySelector('.popup');
    var closeButton = popup.querySelector('button');
    closeButton.addEventListener('click', window.data.closePopup);

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
    setListingTextContent(
        '.popup__type',
        window.constants.OFFER_TYPE[advertisement.offer.type]
    );
    setListingTextContent('.popup__text--capacity', textCapacity);
    setListingTextContent('.popup__text--time', textTime);
    setListingTextContent(
        '.popup__description',
        advertisement.offer.description
    );

    var template = document.querySelector('#card').content;
    var features = popup.querySelector('.popup__features');
    clearNode(features);
    for (i = 0; i < advertisement.offer.features.length; i++) {
      var feature = template
        .querySelector('.popup__feature--' + advertisement.offer.features[i])
        .cloneNode(true);
      features.appendChild(feature);
    }

    var popupPhotos = popup.querySelector('.popup__photos');
    clearNode(popupPhotos);

    for (var i = 0; i < advertisement.offer.photos.length; i++) {
      var photo = template.querySelector('.popup__photo').cloneNode(true);
      photo.src = advertisement.offer.photos[i];
      popupPhotos.appendChild(photo);
    }

    var avatar = popup.querySelector('.popup__avatar');
    avatar.src = advertisement.author.avatar;
  };

  var loadedAdvertisements = [];
  var filters = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false
  };

  var createPins = function (advertisements) {
    var map = document.querySelector('.map');
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
    var template = document.querySelector('#pin').content;

    var amount = advertisements.length > 5 ? 5 : advertisements.length;

    for (i = 0; i < amount; i++) {
      var element = template.querySelector('.map__pin').cloneNode(true);
      var image = element.querySelector('img');
      element.style.left = advertisements[i].location.x + 'px';
      element.style.top = advertisements[i].location.y + 'px';
      image.src = advertisements[i].author.avatar;
      image.alt = advertisements[i].offer.title;

      map.appendChild(element);
      var showPopup = function (index) {
        element.addEventListener('click', function () {
          comletePopup(advertisements[index]);
          window.data.openPopup();
          element.classList.add('.map__pin--active');
        });
      };

      showPopup(i);
    }
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

  window.backend.load(function (data) {
    loadedAdvertisements = data;
    createPins(data);
    togglePins(false);
  }, window.data.showErrorMessage);

  var applyFilters = function () {
    var compare = function (advertisement, name) {
      return (
        filters[name] === 'any' || advertisement.offer[name] === filters[name]
      );
    };

    var compareNumbers = function (advertisement, name) {
      return (
        filters[name] === 'any' || advertisement.offer[name] === +filters[name]
      );
    };

    var comparePrice = function (advertisement) {
      return (
        filters.price === 'any' ||
        (advertisement.offer.price < MAX_PRICE && filters.price === 'low') ||
        (advertisement.offer.price >= MAX_PRICE &&
          advertisement.offer.price < MIN_PRICE &&
          filters.price === 'middle') ||
        (advertisement.offer.price >= MIN_PRICE && filters.price === 'high')
      );
    };

    var compareCheck = function (advertisement, name) {
      return (
        !filters[name] || advertisement.offer.features.indexOf(name) !== -1
      );
    };

    var advertisements = loadedAdvertisements.filter(function (advertisement) {
      return (
        compare(advertisement, 'type') &&
        comparePrice(advertisement) &&
        compareNumbers(advertisement, 'rooms') &&
        compareNumbers(advertisement, 'guests') &&
        compareCheck(advertisement, 'wifi') &&
        compareCheck(advertisement, 'dishwasher') &&
        compareCheck(advertisement, 'parking') &&
        compareCheck(advertisement, 'washer') &&
        compareCheck(advertisement, 'elevator') &&
        compareCheck(advertisement, 'conditioner')
      );
    });
    createPins(advertisements);
  };

  var filterChangeHandler = function (evt) {
    var filterName = evt.target.name.replace('housing-', '');
    filters[filterName] = evt.target.value;
    applyFilters();
  };

  var checkBoxChangeHandler = function (evt) {
    var filterName = evt.target.id.replace('filter-', '');
    filters[filterName] = evt.target.checked;
    applyFilters();
  };

  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRoms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var wifi = mapFilters.querySelector('#filter-wifi');
  var dishwasher = mapFilters.querySelector('#filter-dishwasher');
  var parking = mapFilters.querySelector('#filter-parking');
  var washer = mapFilters.querySelector('#filter-washer');
  var elevator = mapFilters.querySelector('#filter-elevator');
  var conditioner = mapFilters.querySelector('#filter-conditioner');

  housingType.addEventListener('change', filterChangeHandler);
  housingPrice.addEventListener('change', filterChangeHandler);
  housingRoms.addEventListener('change', filterChangeHandler);
  housingGuests.addEventListener('change', filterChangeHandler);

  wifi.addEventListener('change', checkBoxChangeHandler);
  dishwasher.addEventListener('change', checkBoxChangeHandler);
  parking.addEventListener('change', checkBoxChangeHandler);
  washer.addEventListener('change', checkBoxChangeHandler);
  elevator.addEventListener('change', checkBoxChangeHandler);
  conditioner.addEventListener('change', checkBoxChangeHandler);

  var mapPinMain = document.querySelector('.map__pin--main');
  mapPinMain.addEventListener('mouseup', enableForm);
})();
