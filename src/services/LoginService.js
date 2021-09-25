import BaseService from './BaseService';

class LoginService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/v3';
  }

  /**
   * Login function
   * @param {string} url Specify the url
   */
  login(user, type) {
    let url;
    if (type === 'Studio') {
      url = 'authenticate/studio/login';
    } else {
      url = 'authenticate/studio/corporate/login';
    }
    this.requestUrl = `${this.baseUrl}/${url}`;

    return this.post(user);
  }

  /**
   * Get Studio suggestions
   * @param {string} url Specify the url
   * @param {object} options req options
   */
  getStudioSuggestions(suggestionVal, options) {
    let defaultOptions = { isAuthorized: false };
    suggestionVal = suggestionVal.trim();
    let url = `studios/suggestion/${encodeURIComponent(suggestionVal)}`;
    this.requestUrl = `${this.baseUrl}/${url}`;

    return this.get(Object.assign(defaultOptions, options));
  }
}

export default new LoginService();
