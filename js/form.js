'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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

  var arriavalTime = document.querySelector('#timein');
  var departureTime = document.querySelector('#timeout');

  var arriavalTimeChangeHandler = function () {
    if (arriavalTime.value === '12:00') {
      departureTime.value = '12:00';
    } else if (arriavalTime.value === '13:00') {
      departureTime.value = '13:00';
    } else if (arriavalTime.value === '14:00') {
      departureTime.value = '14:00';
    }
  };

  arriavalTime.addEventListener('change', arriavalTimeChangeHandler);
  // arriavalTime.removeEventListener('change', arriavalTimeChangeHandler);

  var departureTimeChangeHandler = function () {
    if (departureTime.value === '12:00') {
      arriavalTime.value = '12:00';
    } else if (departureTime.value === '13:00') {
      arriavalTime.value = '13:00';
    } else if (departureTime.value === '14:00') {
      arriavalTime.value = '14:00';
    }
  };

  departureTime.addEventListener('change', departureTimeChangeHandler);

  var formAddress = document.querySelector('#address');

  var markerHandle = document.querySelector('.map__pin--main');
  var setPositionX = function (x) {
    markerHandle.style.left = x + 'px';
  };
  var setPositionY = function (y) {
    markerHandle.style.top = y + 'px';
  };

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

      var x = markerHandle.offsetLeft - shift.x;

      if (x < 0) {
        setPositionX(0);
      } else if (x > 1200 - marketWidth) {
        setPositionX(1200 - marketWidth);
      } else {
        setPositionX(x);
      }

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

  var form = document.querySelector('.ad-form');

  var resetForm = function () {
    form.reset();
    form.classList.remove('ad-form--disabled');
  };

  form.addEventListener('submit', function (evt) {
    window.backend.send(
        new FormData(form),
        function () {
          resetForm();
          window.data.showSuccessMessage();
        },

        window.data.showErrorMessage
    );

    evt.preventDefault();
  });

  // ====//

  var clearForm = document.querySelector('.ad-form__reset');
  var resetFormClickHandler = function () {
    var adForm = document.querySelector('.ad-form');
    var mapFilters = document.querySelector('.map__filters');
    var map = document.querySelector('.map');
    var avatarPreview = document.querySelector('.ad-form-header img');
    var housingPhotoPreview = document.querySelector('.ad-form__photo img');
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main');
    for (var i = 0; i < pins.length; i++) {
      pins[i].classList.add('hidden');
    }
    adForm.classList.add('ad-form--disabled');
    map.classList.add('map--faded');
    mapFilters.classList.add('ad-form--disabled');
    avatarPreview.classList.add('visually-hidden');
    housingPhotoPreview.classList.add('visually-hidden');

    form.reset();

    setPositionX(570);
    setPositionY(375);
  };

  clearForm.addEventListener('click', resetFormClickHandler);

  // === //

  var avatarChooser = document.querySelector(
      '.ad-form__field input[type=file]'
  );
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var housingPhotoChooser = document.querySelector(
      '.ad-form__upload input[type=file]'
  );

  var formPhoto = document.querySelector('.ad-form__photo');

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  housingPhotoChooser.addEventListener('change', function () {
    var file = housingPhotoChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var img = document.createElement('img').cloneNode(true);
        img.src = reader.result;
        formPhoto.appendChild(img);
      });

      reader.readAsDataURL(file);
    }
  });
})();
