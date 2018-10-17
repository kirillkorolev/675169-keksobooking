'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var formFieldsets = adForm.querySelectorAll('fieldset');

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');

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

  var disableForm = function () {
    Array.from(formFieldsets).forEach(function (formFieldset) {
      formFieldset.setAttribute('disabled', 'true');
    });
  };

  disableForm();

  var togglePins = function (show) {
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    Array.from(mapPins).forEach(function (pin) {
      if (show) {
        pin.classList.remove('hidden');
      } else {
        pin.classList.add('hidden');
      }
    });
  };

  var clearNode = function (node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  };

  var createPopup = function () {
    var templateListing = document.querySelector('#card').content;
    var listing = templateListing.cloneNode(true);

    map.insertBefore(listing, map.querySelector('.map__filters-container'));
    var popup = document.querySelector('.popup');
    var closeButton = popup.querySelector('button');
    closeButton.addEventListener('click', window.data.closePopup);

    popup.classList.add('hidden');
  };

  var comletePopup = function (advertisement) {
    var popup = document.querySelector('.popup');
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
        window.constants.OFFER_TYPES[advertisement.offer.type]
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

    advertisement.offer.features.forEach(function (it) {
      var feature = template
        .querySelector('.popup__feature--' + it)
        .cloneNode(true);
      features.appendChild(feature);
    });

    var popupPhotos = popup.querySelector('.popup__photos');
    clearNode(popupPhotos);

    advertisement.offer.photos.forEach(function (src) {
      var photo = template.querySelector('.popup__photo').cloneNode(true);
      photo.src = src;
      popupPhotos.appendChild(photo);
    });

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
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
    var template = document.querySelector('#pin').content;

    var amount =
      advertisements.length > window.constants.SHOWN_PINS_AMMOUNT
        ? window.constants.SHOWN_PINS_AMMOUNT
        : advertisements.length;

    for (i = 0; i < amount; i++) {
      var element = template.querySelector('.map__pin').cloneNode(true);
      var image = element.querySelector('img');
      var advertisement = advertisements[i];
      element.style.left = advertisement.location.x + 'px';
      element.style.top = advertisement.location.y + 'px';
      image.src = advertisement.author.avatar;
      image.alt = advertisement.offer.title;

      map.appendChild(element);
      var showPopup = function (index) {
        element.addEventListener('click', function () {
          comletePopup(advertisements[index]);
          window.data.openPopup(index);
        });
      };

      showPopup(i);
    }
  };

  var enableForm = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    mapFilters.classList.remove('ad-form--disabled');

    Array.from(formFieldsets).forEach(function (formFieldset) {
      formFieldset.removeAttribute('disabled');
    });

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
        (advertisement.offer.price < window.constants.MAX_PRICE &&
          filters.price === 'low') ||
        (advertisement.offer.price >= window.constants.MAX_PRICE &&
          advertisement.offer.price < window.constants.MIN_PRICE &&
          filters.price === 'middle') ||
        (advertisement.offer.price >= window.constants.MIN_PRICE &&
          filters.price === 'high')
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
    window.data.closePopup();
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

  mapPinMain.addEventListener('mouseup', enableForm);
})();
