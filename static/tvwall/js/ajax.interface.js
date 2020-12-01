define(function (require, exports, module) {
  var fAjax = {};
  var timeout = (typeof (furnace) !== 'undefined') ? furnace.ajaxTimeout : 60000;
  var errorCallBack = (typeof (furnace) !== 'undefined') ? furnace.ajaxError : function (xhr, ajaxOptions, thrownError) {
    alert('Http status: ' + xhr.status + ' ' + xhr.statusText + '\najaxOptions: ' + ajaxOptions + '\nthrownError:' + thrownError + '\n' + xhr.responseText);
  };
  var isIE = ('ActiveXObject' in window);
  var baseURL = window.location.protocol + '//' + window.location.host + '/';
  // var baseURL = 'https://192.168.211.58/';

  function convertURL(url) {
    // 获取时间戳
    var timstamp = (new Date()).valueOf();
    // 将时间戳信息拼接到url上
    if (url.indexOf('?') >= 0) {
      url = url + '&t=' + timstamp;
    } else {
      url = url + '?t=' + timstamp;
    }
    if (url.indexOf('http:') !== -1 || url.indexOf('https:') !== -1) {
      return url
    }
    return baseURL + url;
  }

  var globalOptions = {
    timeout: timeout,
    error: errorCallBack,
    xhrFields: {
      withCredentials: true
    }
  };

  fAjax.post = function (url, data, config) {
    var options = $.extend({}, globalOptions, {type: 'POST', dataType: 'json'});
    if (arguments.length == 2) {
      if ($.isPlainObject(arguments[1])) {
        options = $.extend(options, arguments[1]);
      }
    } else {
      if (config) {
        options = $.extend(options, config);
      }
    }
    options = $.extend(options, {url: convertURL(url), data: data});
    return $.ajax(options);
  };

  fAjax.get = function (url, config) {
    var options = $.extend({}, globalOptions, {type: 'GET', dataType: 'json'});
    if (config) {
      options = $.extend(options, config);
    }
    options = $.extend(options, {url: convertURL(url)});
    return $.ajax(options);
  };

  fAjax.delete = function (url, config) {
    var options = $.extend({}, globalOptions, {type: 'DELETE'});
    if (config) {
      options = $.extend(options, config);
    }
    options = $.extend(options, {url: convertURL(url)});
    return $.ajax(options);
  };

  fAjax.put = function (url, data, config) {
    var options = $.extend({}, globalOptions, {type: 'PUT', dataType: 'json', contentType: 'application/json'});
    if (config) {
      options = $.extend(options, config);
    }
    options = $.extend(options, {url: convertURL(url), data: data});
    return $.ajax(options);
  };

  fAjax.ajax = function (config) {
    var options = {};
    if (config) {
      options = $.extend(options, globalOptions, config);
    }
    options.url = convertURL(url);
    return $.ajax(options);
  };

  fAjax.getParameter = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  };

  module.exports = fAjax;

  if (typeof (furnace) !== 'undefined') {
    furnace.clone(fAjax);
  }
});
