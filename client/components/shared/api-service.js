'use strict';
const config = require('../../../config');

class ApiService {
  constructor($q, $http) {
    'ngInject';
    this._$q = $q;
    this._$http = $http;
  }

  get(url, config) {
    return this._$http.get(this._getUrlPath(url), config);
  }

  post(url, data, config) {
    return this._$http.post(this._getUrlPath(url), data, config);
  }

  put(url, data, config) {
    return this._$http.post(this._getUrlPath(url), data, config);
  }

  delete(url, config) {
    return this._$http.delete(this._getUrlPath(url), config);
  }

  _getUrlPath(url) {
    if (url[0] === '/') {
      url = url.substr(1);
    }
    return config.get('api.domain') + '/' + url;
  }
}

module.exports = ApiService;
