'use strict';

var createXhr = function (url, method, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (xhr.status === window.constants.OK_CODE) {
      onSuccess(xhr.response);
    } else {
      onError(xhr.response);
    }
  });

  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });
  xhr.timeout = window.constants.TIMEOUT;

  xhr.open(method, url);
  return xhr;
};

(function () {
  var load = function (onSuccess, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = createXhr(URL, 'GET', onSuccess, onError);
    xhr.send();
  };

  var send = function (data, onSuccess, onError) {
    var URL = 'https://js.dump.academy/keksobooking';
    var xhr = createXhr(URL, 'POST', onSuccess, onError);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    send: send
  };
})();
