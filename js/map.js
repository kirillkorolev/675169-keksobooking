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

var getfeatures = function (array) {
  var arr = arr.slice(Math.floor(Math.random() * array.length));
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
  var author = {
    avatar: 'img/avatars/user0' + index + '.png'
  };

  var location = {
    x: 100,
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
    features: getfeatures(featuresValues),
    description: ' ',
    photos: photosValues.sort(function () {
      return Math.random() - 0.5;
    })
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

var price = document.querySelector('.map');
price.classList.remove('.map--faded');

var mapElements = document.querySelector('.pin');

var template = document
  .querySelector('.map__pin')
  .content.querySelector('button');

for (var i = 0; i < advertisements.length; i++) {
  var element = template.cloneNode(true);

  element.style.left = advertisements[i].location.x + 'px';
  element.style.top = advertisements[i].location.y + 'px';
  element.src = advertisements[i].author.avatar;
  element.alt = advertisements[i].offer.title;
  element.children[0].textContent = i;
  mapElements[i].appendChild(element);
}

var newPins = document.querySelector('.map__pins');
var fragment = document.createDocumentFragment();

fragment.appendChild(mapElements);
newPins.appendChild(fragment);
