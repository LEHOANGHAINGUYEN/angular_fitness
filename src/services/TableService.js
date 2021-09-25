import BaseService from './BaseService';

class TableService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/v3';
  }

  /**
   * Search function get list of target entities
   * @param {string} url Specify the url
   */
  search(url) {
    this.requestUrl = `${this.baseUrl}/${url}`;

    return this.get({ isUndergroundReq: true });
  }
  searchGlobal(url) {
    this.requestUrl = `/${url}`;
    return this.get({
      apiType: 'dotnetCoreRootUrl'
    });
  }
}

export default new TableService();
