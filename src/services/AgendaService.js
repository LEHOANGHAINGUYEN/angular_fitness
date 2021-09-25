import * as _ from 'lodash';
import moment from 'moment';

import BaseService from './BaseService';

class AgendaService extends BaseService {
  constructor() {
    super();

    this.baseUrl = '/studios/';
  }

  getAllMember(mboClassId, mboStudioId) {
    this.requestUrl = `/schedules/${mboClassId}/roster?MboStudioId=${mboStudioId}&MboClassId=${mboClassId}`;
    return this.get({
      apiType: 'edenMbo'
    });
  }

  refreshMember(mboClassId, mboStudioId, options) {
    this.requestUrl = `/schedules/${mboClassId}/roster?MboStudioId=${mboStudioId}&MboClassId=${mboClassId}`;
    return this.get(_.assign({
      apiType: 'edenMbo'
    }, options));
  }

  getClassesByStudio(studioId, date, options) {
    this.requestUrl = `/v3/studios/${studioId}/classes${date ? `?date=${date}` : ''}`;
    return this.get(options);
  }

  getClassesByMboStudio(mboStudioId, date, studioId) {
    let dateFormated = moment(date).format('YYYY/MM/DD');
    this.requestUrl = `/schedules?ClassStartDateTime=${dateFormated}&mboStudioId=${mboStudioId}&ClassEndDateTime=${dateFormated}&OrderBy=EndTime&HideCanceledClasses=false&studioId=${studioId}`;
    return this.get({
      apiType: 'edenMbo'
    });
  }
}

export default new AgendaService();
