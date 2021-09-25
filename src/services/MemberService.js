import * as Helpers from 'common/utils/helpers';

import BaseService from './BaseService';

class MemberService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/v3';
  }

  /**
   * Get member information
   * @param {string} memberId Specify the member id
   */
  getMember(memberId) {
    this.requestUrl = `${this.baseUrl}/studios/member/${memberId}`;

    return this.get();
  }

  /**
   * Search member information
   * @param {string} keyword Specify the search keyword
   */
  searchMember(keywword, mboStudioId) {
    this.requestUrl = `/members?MboStudioId=${mboStudioId}&SearchQuery=${keywword}&PageNumber=1&PageSize=10`;
    return this.get({
      apiType: 'edenMbo'
    });
  }
  /**
   * Get member benchmarks information
   */
  getMemberBenchmarks(payload) {
    this.requestUrl = `${this.baseUrl}/personal/benchmarks/member/${payload.memberId}${Helpers.buildUrlQuery(payload)}`;
    return this.get();
  }

  getTermsConditionRoster(emails) {
    this.requestUrl = `${this.baseUrl}/member/term-condition`;
    return this.post(emails);
  }
  saveTermsConditions(memberId, payload) {
    this.requestUrl = `/members/${memberId}/member-terms-conditions`;
    return this.post(payload, {
      apiType: 'otumFranchise'
    });
  }
  editTermsConditions(memberId, memberTermsConditionsUUId, payload) {
    this.requestUrl = `/members/${memberId}/member-terms-conditions/${memberTermsConditionsUUId}`;
    return this.put(payload, {
      apiType: 'otumFranchise'
    });
  }
}

export default new MemberService();
