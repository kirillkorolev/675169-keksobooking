'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var numberRooms = form.querySelector('#room_number');
  var numberGuests = form.querySelector('#capacity');

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

  var arriavalTime = form.querySelector('#timein');
  var departureTime = form.querySelector('#timeout');

  arriavalTime.addEventListener('change', function () {
    departureTime.value = arriavalTime.value;
  });

  departureTime.addEventListener('change', function () {
    arriavalTime.value = departureTime.value;
  });

  var formType = form.querySelector('#type');
  var priceInput = form.querySelector('#price');

  var validatePrice = function () {
    var str = '';
    if (
      (formType.value === 'flat' &&
        priceInput.value < window.constants.FLAT_MIN_PRICE) ||
      (formType.value === 'house' &&
        priceInput.value < window.constants.HOUSE_MIN_PRICE) ||
      (formType.value === 'palace' &&
        priceInput.value < window.constants.PALACE_MIN_PRICE)
    ) {
      str = 'Слишком маленькая цена!';
    }
    priceInput.setCustomValidity(str);
  };

  var typeChangeHandler = function () {
    validatePrice();
    var prices = {
      bungalo: 0,
      flat: 1000,
      house: 5000,
      palace: 10000
    };
    priceInput.placeholder = prices[formType.value];
  };

  formType.addEventListener('change', typeChangeHandler);
  priceInput.addEventListener('change', validatePrice);

  typeChangeHandler();

  var formAddress = form.querySelector('#address');

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
      } else if (x > window.constants.WIDTH_X - window.constants.MARKER_WIDTH) {
        setPositionX(window.constants.WIDTH_X - window.constants.MARKER_WIDTH);
      } else {
        setPositionX(x);
      }

      var y = markerHandle.offsetTop - shift.y;
      if (y < window.constants.TOP_Y) {
        setPositionY(window.constants.TOP_Y);
      } else if (y > window.constants.BOTTOM_Y) {
        setPositionY(window.constants.BOTTOM_Y);
      } else {
        setPositionY(y);
      }
      formAddress.value = (x + window.constants.MARKER_WIDTH / 2) + ', ' + y;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var resetAddress = function () {
    formAddress.value =
      window.constants.START_X +
      ', ' +
      window.constants.START_Y;
  };

  var disableForm = function () {
    var adForm = document.querySelector('.ad-form');
    var formFieldsets = adForm.querySelectorAll('fieldset');
    Array.from(formFieldsets).forEach(function (formFieldset) {
      formFieldset.setAttribute('disabled', 'true');
    });
  };

  var resetFilters = function () {
    var mapFilters = document.querySelector('.map__filters');
    var mapFeatures = document.querySelector('.map__features');
    var filters = [
      '#housing-type',
      '#housing-price',
      '#housing-rooms',
      '#housing-guests'
    ];

    var checkboxes = [
      '#filter-wifi',
      '#filter-dishwasher',
      '#filter-parking',
      '#filter-washer',
      '#filter-elevator',
      '#filter-conditioner'
    ];

    filters.forEach(function (filter) {
      mapFilters.querySelector(filter).value = 'any';
    });

    checkboxes.forEach(function (checkbox) {
      mapFeatures.querySelector(checkbox).checked = false;
    });
  };

  var resetForm = function () {
    var map = document.querySelector('.map');
    var avatarPreview = document.querySelector('.ad-form-header__preview img');
    var housingPhotoPreview = document.querySelectorAll('.ad-form__photo img');
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var popup = document.querySelector('.popup');
    var mapFilters = document.querySelector('.map__filters');

    Array.from(pins).forEach(function (pin) {
      pin.classList.add('hidden');
    });

    form.classList.add('ad-form--disabled');
    map.classList.add('map--faded');

    mapFilters.classList.add('ad-form--disabled');
    avatarPreview.src = 'img/muffin-grey.svg';

    popup.classList.add('hidden');

    if (housingPhotoPreview) {
      Array.from(housingPhotoPreview).forEach(function (photo) {
        photo.classList.add('visually-hidden');
      });
    }

    form.reset();

    setPositionX(window.constants.START_X);
    setPositionY(window.constants.START_Y);

    disableForm();
    resetFilters();
    resetAddress();
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

  var clearForm = form.querySelector('.ad-form__reset');

  resetAddress();
  clearForm.addEventListener('click', resetForm);

  var avatarChooser = form.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = form.querySelector('.ad-form-header__preview img');
  var housingPhotoChooser = form.querySelector(
      '.ad-form__upload input[type=file]'
  );

  var formPhoto = form.querySelector('.ad-form__photo');

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = window.constants.FILE_TYPES.some(function (it) {
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
    for (var i = 0; i < housingPhotoChooser.files.length; i++) {
      var file = housingPhotoChooser.files[i];
      var fileName = file.name.toLowerCase();

      var matches = window.constants.FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        (function () {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            var img = document.createElement('img').cloneNode(true);
            img.src = reader.result;
            formPhoto.appendChild(img);
          });

          reader.readAsDataURL(file);
        })();
      }
    }
  });
})();
