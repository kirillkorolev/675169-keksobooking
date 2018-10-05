'use strict';

(function () {
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

  var formSubmit = document.querySelector('.ad-form__submit');
  var form = document.querySelector('.ad-form');

  formSubmit.addEventListener('submit', function (evt) {
    window.backend.send(
        new FormData(form),
        function () {
          form.classList.remove('ad-form--disabled');
          window.backend.createSuccess();
        },
        function () {
          form.classList.add('ad-form--disabled');
          window.backend.createError();
        }
    );

    evt.preventDefault();
  });
})();
