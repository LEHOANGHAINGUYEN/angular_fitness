import BaseService from './BaseService';

import * as Helpers from 'common/utils/helpers';
class StudioService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/v3/studios';
  }

  /**
   * Search studio information
   * @param {string} keyword Specify the search keyword
   */
  searchStudio(keyword, countryCode) {
    let params = {
      keyword,
      countryCode
    };
    keyword = keyword.trim();
    this.requestUrl = `${this.baseUrl}/suggestion/${encodeURIComponent(keyword)}${Helpers.buildUrlQuery(params)}`;
    return this.get({
      isUndergroundReq: true
    });
  }
  getHomeStudio(studioId, challengId) {
    this.requestUrl = `/studio/GetStudioAverages?division=studio&studioId=${studioId}&pageIndex=1&pageSize=15&challengeId=${challengId}&fullTextSearch=true`;
    return this.get({
      apiType: 'dotnetCoreRootUrl'
    });
  }
}

export default new StudioService();
