import axios from 'axios';
import * as _ from 'lodash';

import { CognitoService } from 'services';

import { AppConfigs, Constants } from 'common';
import { LocaleSessionConstant } from 'common/constants/constants';

let actions = {};

export const setApiActions = function (a) {
  actions = a;
};

class ApiService {
  constructor() {
    let apiService = this;

    this.authKey = undefined;

    this.getRootLink = function (apiType, isAuthorized) {
      if (apiType && apiType === 'otumFranchise') {
        return AppConfigs.getOTumFranchiseEndpoint();
      }
      if (apiType && apiType === 'dotnetCoreRootUrl') {
        return AppConfigs.getAuthorizeGlobalEndpoint();
      }
      if (apiType && apiType === 'edenMbo') {
        return AppConfigs.getEdenMboEndpoint();
      }
      // Default value isAuthorized config will be true
      let _isAuthorized = _.isUndefined(isAuthorized) ? true : isAuthorized;
      if (_isAuthorized) {
        return AppConfigs.getAuthorizeEndpoint();
      }

      return AppConfigs.getUnauthorizeEndpoint();
    };

    this.getFullAPILink = function (link, options) {
      options = options || {};
      if (root) { return this.getRootLink(options.apiType, options.isAuthorized) + link; }
      return link;
    };

    this.clearStorage = function () {
      const locale = localStorage.getItem(LocaleSessionConstant);
      const leaderboardOpt = localStorage.getItem(Constants.LeaderboardOptionalKey);
      localStorage.clear();
      actions.core_language.changeLocale(locale);
      localStorage.setItem(Constants.LeaderboardOptionalKey, leaderboardOpt);
    };

    this.getRequestHeaders = async function (options) {
      let isUndergroundReq = options && options.isUndergroundReq ? options.isUndergroundReq : false;

      if (!isUndergroundReq) {
        actions.core_loading.show();
      }

      // Keep session with idle time
      const currentUser = await CognitoService.getCurrentUser();

      if (!currentUser) {
        await CognitoService.refreshToken().then(result => {
          localStorage.setItem('cognitoAuthKey', result);

          return null;
        }).catch(() => this.clearStorage());
      }
      apiService.cognitoAuthKey = localStorage.getItem('cognitoAuthKey');

      if (!apiService.cognitoAuthKey) {
        this.clearStorage();
        return undefined;
      }

      let timezoneoffset = new Date().getTimezoneOffset();

      // Otum API
      if (options && options.apiType === 'otumFranchise') {
        return {
          Authorization: apiService.cognitoAuthKey
        };
      }
      if (options && options.apiType === 'dotnetCoreRootUrl') {
        return {
          Authorization: apiService.cognitoAuthKey
        };
      }
      if (options && options.apiType === 'edenMbo') {
        return {
          Authorization: `Bearer ${apiService.cognitoAuthKey}`
        };
      }
      return {
        'Authorization-Cognito': apiService.cognitoAuthKey,
        TimezoneOffset: timezoneoffset
      };
    };

    ['handleSuccess', 'handleError']
      .forEach((method) => {
        if (this[method]) {
          this[method] = this[method].bind(this);
        }
      });

    let service = axios.create();
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    actions.core_loading.hide();
    return response;
  }

  handleError(error) {
    actions.core_loading.hide();
    let msg;
    if (error && error.response && error.response.status === 401) {
      msg = ApiService.processResponse(error.response);
      actions.auth_users.logout();
      return Promise.reject(new Error(msg));
    }
    if (error && error.response && error.response.status === 400) {
      msg = ApiService.processResponse(error.response);
      return Promise.reject(new Error(msg[0]));
    }

    return Promise.reject(error);
  }

  static processResponse(response) {
    let messages = [];
    switch (response.status) {
      case 400:
        if (typeof response.data === 'string') {
          messages.push(response.data);
        } else if (response.data['0']) {
          for (let key in response.data['0']) {
            messages.push(response.data['0'][key]);
          }
        } else if (response.data.ModelState) {
          for (let key in response.data.ModelState) {
            response.data.ModelState[key].forEach(function (message) {
              messages.push(message);
            });
          }
        }
        break;
      case 401:
        messages.push('Your session has expired, please login again.');
        break;
      case 500:
        messages.push('Server Error.');
        break;
      default:
        messages.push('An error has occured.');
    }

    return messages;
  }

  static setAuthKey(authKey) {
    authKey = `Basic ${authKey}`;
    localStorage.setItem('authKey', authKey);
  }

  handleResponseData(data) {
    if (!!data && data.status === 200 || data.status === 201) {
      if (data.headers['x-amzn-remapped-authorization']) {
        ApiService.setAuthKey(
          data.headers['x-amzn-remapped-authorization']);
      }
      return Promise.resolve(data);
    }

    return Promise.reject(data);
  }

  async get(path, options) {
    let requestHeaders = await this.getRequestHeaders(options);
    path = this.getFullAPILink(path, options);
    return this.service.get(path, {
      headers: requestHeaders
    }).then((data) => {
      return this.handleResponseData(data);
    }).catch(err => {
      if (err.message && err.message.includes('504')) {
        return Promise.reject(new Error('Session has timed out!.'));
      }
      return Promise.reject(err);
    });
  }

  async post(path, payload, options) {
    let requestHeaders = await this.getRequestHeaders(options);
    path = this.getFullAPILink(path, options);
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload,
      headers: requestHeaders
    }).then((data) => {
      return this.handleResponseData(data);
    }).catch(err => {
      if (err.message && err.message.includes('504')) {
        return Promise.reject(new Error('Session has timed out!.'));
      }
      return Promise.reject(err);
    });
  }

  async put(path, payload, options) {
    let requestHeaders = await this.getRequestHeaders(options);
    path = this.getFullAPILink(path, options);
    return this.service.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload,
      headers: requestHeaders
    }).then((data) => {
      return this.handleResponseData(data);
    }).catch(err => {
      if (err.message && err.message.includes('504')) {
        return Promise.reject(new Error('Session has timed out!.'));
      }
      return Promise.reject(err);
    });
  }

  async delete(path, payload, options) {
    let requestHeaders = await this.getRequestHeaders(options);
    path = this.getFullAPILink(path, options);
    return this.service.request({
      method: 'DELETE',
      url: path,
      responseType: 'json',
      data: payload,
      headers: requestHeaders
    }).then((data) => {
      return this.handleResponseData(data);
    }).catch(err => {
      if (err.message && err.message.includes('504')) {
        return Promise.reject(new Error('Session has timed out!.'));
      }
      return Promise.reject(err);
    });
  }
}

export default new ApiService();
