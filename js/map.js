'use strict';

var getRandomValue = function(arr) {
  var value = Math.floor(Math.random() * arr.length);
  return arr[value];
};

var getRandomInRange = function(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

var getPhotos = function(array) {
  for (var i = 0; i < arr.length; i++) {
    var j = Math.Floor(Math.Random() * (i + 1));
    var newArray = array[j];
    array[i] = array[j];
  }
  return newArray;
};

var getfeatures = function(array) {
  var arr2 = arr.slice(Math.Floor(Math.Random() * array.length));
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

var typeValues = [palace, flat, house, bungalo];

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

var getOffer = function(offer) {
  var advertisements = [];
  for (var i = 0; i < 8; i++) {
    author = {
      avatar: 'img/avatars/user0' + i + '.png'
    };
    offer = {
      title: getRandomValue(title),
      address: 'location.x, location.y',
      price: getRandomInRange(1000, 1000000),
      type: getRandomValue(type),
      rooms: getRandomInRange(1, 5),
      guests: Math.Floor(Math.Random() * 10),
      checkin: getRandomValue(checkinValues),
      checkout: getRandomValue(checkoutValues),
      features: getfeatures(features),
      description: ' ',
      photos: getPhotos(photos)
    };
    location = {
      x: 100,
      y: getRandomInRange(130, 630)
    };
  }
};

var advertisements = getOffer();

var price = document.querySelector('.map');
price.classList.remove('.map--faded');

var mapElements = document.querySelector('.pin');

var template = document
  .querySelector('.map__pin')
  .content.querySelector('button');

for (var i = 0; i < 8; i++) {
  var element = template.cloneNode(true);
  element.advertisements[i];
  element.style =
    'left: ' +
    advertisements.offer.location.x +
    ' px; top: ' +
    advertisements.offer.location.y +
    ' px;';
  element.src = advertisements.author.avatar;
  element.alt = advertisements.offer.title;
  element.children[0].textContent = i;
  mapElements[i].appendChild(element);
}

var newPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

fragment.appendChild(mapElements);
newPins.appendChild(fragment);
