import API from './api/api';

class BaseService {
  constructor() {
    this.baseUrl = '';
    this.requestUrl = '';
  }

  get(options) {
    return API.get(this.requestUrl, options);
  }

  post(payload, options) {
    return API.post(this.requestUrl, payload, options);
  }

  put(payload, options) {
    return API.put(this.requestUrl, payload, options);
  }

  delete(payload, options) {
    return API.delete(this.requestUrl, payload, options);
  }
}

export default BaseService;
