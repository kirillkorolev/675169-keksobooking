'use strict';

var createError = function () {
  var main = document.querySelector('.main');
  var templateError = document.querySelector('#error').content;
  var error = templateError.cloneNode(true);
  main.appendChild(error);
};

var createSuccess = function () {
  var main = document.querySelector('.main');
  var templateSuccess = document.querySelector('#success').content;
  var success = templateSuccess.cloneNode(true);
  main.appendChild(success);
};

var load = function (onLoad, onError) {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      onLoad(xhr.response);
    } else {
      onError(xhr.response);
      createError();
    }
  });

  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });
  xhr.timeout = 10000;

  xhr.open('GET', URL);
  xhr.send();
};

var send = function (data, onLoad, onError) {
  var URL = 'https://js.dump.academy/keksobooking';
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      onLoad(xhr.response);
      createSuccess();
    } else {
      onError(xhr.response);
      createError();
    }
  });

  xhr.open('POST', URL);
  xhr.send(data);
};

window.backend = {
  load: load,
  send: send
};
