import moment from 'moment';

import BaseService from './BaseService';
import * as Helpers from 'common/utils/helpers';

class ChallengeService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/v3/challenges';
  }

  /**
   * Get today challenge information
   * @param {number} studioId Specify the studioId
   */
  getTodayChallenge(studioId, date, options) {
    this.requestUrl = `${this.baseUrl}/studio/${studioId}${date ? `?date=${date}` : ''}`;

    return this.get(options);
  }
  getAllChallenge(params) {
    this.requestUrl = `/v3/admin/challenges${Helpers.buildUrlQuery(params)}`;
    return this.get();
  }
  getAllChallengeTemplates(params) {
    this.requestUrl = `/v3/admin/challenge-groups${Helpers.buildUrlQuery(params)}`;
    return this.get();
  }

  /**
   * Get challenge result for each class
   * @param {number} classId Specify the classId that to get result
   * @param {number} studioId Specify the studioId that to get result
   */
  getChallengeResults(mboClassId, studioId, options) {
    this.requestUrl = `${this.baseUrl}/results/class/${mboClassId}${studioId ? `?studioId=${studioId}` : ''}`;
    return this.get(options);
  }

  /**
   * Save challenge results
   * @param {object} payload Specify the payload include results to save
   */
  saveChallengeResult(mboStudioId, payload) {
    this.requestUrl = `${this.baseUrl}/results/studio/${mboStudioId}`;

    return this.post(payload);
  }

  /**
   * Retrieve metrics based on equipmentId
   * @param {number} equipmentId Specify the equipmentId
   */
  getMetricsByEquipment(equipmentId) {
    this.requestUrl = `${this.baseUrl}/metrics/equipment/${equipmentId}`;
    return this.get({ isUndergroundReq: true });
  }

  deleteChallengeResult(uuid) {
    this.requestUrl = `${this.baseUrl}/results/${uuid}`;
    return this.delete();
  }

  populateChallengeEntity(challenge) {
    let keyStudio = !challenge.isAllStudios && challenge.isAddChallenge ? 'StudioInclusion' : 'StudioId';
    const formatDate = 'MM/DD/YYYY';
    return {
      ChallengeTemplateId: challenge.challengeType,
      MeasureId: challenge.unitOfMeasurement,
      CountryCode: challenge.country,
      [keyStudio]: challenge.individualStudios,
      AllStudiosByCountry: challenge.isAllStudios,
      IsApproved: true,
      StartDate: moment(challenge.startDate).format(formatDate),
      EndDate: challenge.isMultiday ? moment(challenge.endDate).format(formatDate)
        : moment(challenge.startDate).format(formatDate),
      NumberOfRound: parseInt((challenge.numberOfRound), 10),
      StudioExclusion: challenge.excludeStudio
    };
  }

  insertChallenge(challenge) {
    this.requestUrl = this.baseUrl;
    return this.post(this.populateChallengeEntity(challenge));
  }

  editChallenge(challenge) {
    let newChallenge = this.populateChallengeEntity(challenge);
    this.requestUrl = this.baseUrl;

    // Assign challengeID to newChallenge object
    newChallenge.ChallengeId = challenge.id;

    return this.put(newChallenge);
  }
  deleteChallenge(challenge) {
    const { listChallenge, isDeleteExistingResults } = challenge;
    this.requestUrl = this.requestUrl = `${this.baseUrl}?isDeleteExistingResults=${isDeleteExistingResults}`;
    return this.delete(listChallenge);
  }
  deleteChallengeGroups(challenge) {
    const { isDeleteExistingResults, template } = challenge;
    this.requestUrl = `/v3.0/admin/challenge-groups?isDeleteExistingResults=${isDeleteExistingResults}`;
    return this.delete(template);
  }
  getChallenge(challengeId) {
    this.requestUrl = `${this.baseUrl}/${challengeId}`;
    return this.get();
  }
  getChallengeTypes() {
    this.requestUrl = `${this.baseUrl}/challenge-types`;
    return this.get({ isUndergroundReq: true });
  }
  getChallengeTemplates(params) {
    this.requestUrl = `/v3/admin/challenge-templates${Helpers.buildUrlQuery(params)}`;
    return this.get();
  }
  getChallengeTemplateById(challengeTemplateId) {
    this.requestUrl = `/v3.0/admin/challenge-templates/${challengeTemplateId}`;
    return this.get();
  }
  insertChallengeTemplate(challengeTemplate) {
    this.requestUrl = '/v3.0/admin/challenge-templates';
    return this.post(challengeTemplate);
  }
  updateChallengeTemplate(challengeTemplate) {
    this.requestUrl = '/v3.0/admin/challenge-templates';
    return this.put(challengeTemplate);
  }
  deleteChallengeTemplate(template) {
    this.requestUrl = `/v3.0/admin/challenge-templates/${template.template.ChallengeTemplateId}`;
    return this.delete();
  }
  // Get all fitness type. Ex: Event, Benchmark, Signature
  getFitnessType() {
    this.requestUrl = '/v3.0/admin/fitness-types';
    return this.get();
  }

  getChallengeMemberInfo(memberId, challengeId) {
    this.requestUrl = `${this.baseUrl}/results/member/${memberId}/challenge/${challengeId}`;
    return this.get({ isUndergroundReq: true });
  }
}

export default new ChallengeService();
