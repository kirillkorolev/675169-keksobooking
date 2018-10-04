'use strict';

(function () {
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
        window.data.offerTypes[advertisement.offer.type]
    );
    setListingTextContent('.popup__text--capacity', textCapacity);
    setListingTextContent('.popup__text--time', textTime);
    setListingTextContent('.popup__features', advertisement.offer.features);
    setListingTextContent(
        '.popup__description',
        advertisement.offer.description
    );

    var popupPhotos = popup.querySelectorAll('.popup__photos img');

    for (var i = 0; i < advertisement.offer.photos.length; i++) {
      popupPhotos[i].src = advertisement.offer.photos[i];
    }
    var avatar = popup.querySelector('.popup__avatar');
    avatar.src = advertisement.author.avatar;
  };

  var createPins = function () {
    var advertisements = window.data.getAdvertisements();
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
          window.data.openPopup();
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
})();
