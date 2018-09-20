'use strict';

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

var getFeatures = function (array) {
  array = array.slice(0, Math.floor(Math.random() * array.length));
  return array;
};

var getPhotos = function (array) {
  array.sort(function () {
    return Math.random() - 0.5;
  });
  return array;
};

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
    features: getFeatures(featuresValues),
    description: ' ',
    photos: getPhotos(photosValues)
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

var advertisements = getAdvertisements();

var map = document.querySelector('.map');
map.classList.remove('.map--faded');

var template = document.querySelector('#pin').content;

for (var i = 0; i < advertisements.length; i++) {
  var element = template.querySelector('.map__pin').cloneNode(true);
  var image = element.querySelector('img');
  element.style.left = advertisements[i].location.x + 'px';
  element.style.top = advertisements[i].location.y + 'px';
  image.src = advertisements[i].author.avatar;
  image.alt = advertisements[i].offer.title;
  element.children[0].textContent = i;
  map.appendChild(element);
}

var newPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

newPins.appendChild(fragment);

var templateListing = document.querySelector('#card').content;

var listing = templateListing.cloneNode(true);

var advertisement = advertisements[0];
var offerTypes = {
  flat: 'Квартира',
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунагло'
};

listing.querySelector('.popup__title').textContent = advertisement.offer.title;
listing.querySelector('.popup__text--address').textContent =
  advertisement.offer.address;
listing.querySelector('.popup__text--price').textContent =
  advertisement.offer.price + '₽/ночь';
listing.querySelector('.popup__type').textContent =
  offerTypes[advertisements[0].offer.type];
listing.querySelector('.popup__text--capacity').textContent =
  advertisement.offer.rooms +
  ' комнаты для ' +
  advertisement.offer.guests +
  ' гостей';
listing.querySelector('.popup__text--time').textContent =
  'Заезд после ' +
  advertisement.offer.checkin +
  ' , выезд до ' +
  advertisement.offer.checkout;
listing.querySelector('.popup__features').textContent =
  advertisement.offer.features;
listing.querySelector('.popup__description').textContent =
  advertisement.offer.description;

var listingPhoto = listing.querySelector('.popup__photos');
var popupPhoto = listingPhoto.querySelector('img');
popupPhoto.src = advertisement.offer.photos[0];

for (i = 1; i < photosValues.length; i++) {
  popupPhoto = listingPhoto.querySelector('img').cloneNode(true);
  popupPhoto.src = advertisement.offer.photos[i];
  listingPhoto.appendChild(popupPhoto);
}

var avatar = listing.querySelector('.popup__avatar');
avatar.src = advertisement.author.avatar;

map.insertBefore(listing, map.querySelector('.map__filters-container'));
