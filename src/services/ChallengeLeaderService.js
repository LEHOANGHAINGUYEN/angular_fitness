import BaseService from './BaseService';

class ChallengeLeaderService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/v3/challenge-leader';
  }

  /**
   * Get today challenge leaderboard
   * @param {number}  studioId Specify the studioId
   * @param {number}  challengeId Specify the challengeId
   * @param {string}  date Specify the date of challenge
   * @param {object}  options Specify the options to send request
   */
  getTodayLeaderboard(studioId, challengeId, date, options, numberLeader = 10, isConvention) {
    this.requestUrl = isConvention ? `${this.baseUrl}/convention/challenge/${challengeId}`
      : `${this.baseUrl}/today/studio/${studioId}/challenge/${challengeId}${date ? `?date=${date}` : ''}&numberLeader=${numberLeader}&isOriginal=true`;
    return this.get(options);
  }

  sendEmail(date, studioId) {
    this.requestUrl = `${this.baseUrl}/summary-orange-voyage`;
    return this.post({studioId, date});
  }
}

export default new ChallengeLeaderService();
