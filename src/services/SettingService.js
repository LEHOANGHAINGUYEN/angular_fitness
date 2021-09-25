import BaseService from './BaseService';

class SettingService extends BaseService {
  constructor() {
    super();
    this.baseUrl = '/studios/';
  }

  getMeasurementUnit(studioId) {
    this.requestUrl = `${this.baseUrl}${studioId}/settings`;
    return this.get({
      apiType: 'otumFranchise', isUndergroundReq: true
    });
  }

  saveStudioEquipments(studioId, unit, equipment) {
    this.requestUrl = `${this.baseUrl}${studioId}/settings/measurement?equipment=${equipment}&unit=${unit}`;
    return this.post(null, {
      apiType: 'otumFranchise'
    });
  }
}

export default new SettingService();
