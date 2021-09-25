import { createConstants, createReducer } from 'redux-module-builder';
import Immutable from 'immutable';
import * as _ from 'lodash';

import { errorHandlerConstants } from './error-handler';
import { ApiFake, TableService, ChallengeService } from 'services';
import * as Helpers from 'common/utils/helpers';
import { Constants } from 'common';
import moment from 'moment';

/**
 * Define table action constant
 */
export const types = createConstants('table')(
  'REQUEST_DATA_PENDING',
  'REQUEST_DATA_SUCCEEDED',
  'REQUEST_DATA_FAILED',
  'DESTROY_DATA',
  'INIT_DATA',
  'REQUEST_DATA_SHARE',
  'REQUEST_DATA_PENDING_GLOBAL',
  'CLEAR_DATA_STUDIO_CURRENT',
  'REQUEST_DATA_PENDING_CHALLENGE'
);

export const actions = {
  /**
   * This action to start request
   * @param {object} options Specify the options data to get data for this table
   * @param {number} options.params.pageIndex Specify the page index
   * @param {number} options.params.pageSize Specify the page size per page options
   * @param {string} options.params.sort Specify the sort options
   */
  search: (options) => (dispatch, getState) => {
    let { params, isInitial } = options;
    const metricEntry = getState().shared_challenges.todayChallenge.MetricEntry || {};
    const entryType = metricEntry.EntryType;
    const isConverted = params && metricEntry.EquipmentId !== Constants.EquipmentType.Row
      && metricEntry.EntryType !== Constants.MetricEntryType.Time;
    const {
      bikeUnitMeasurement,
      weightFloorUnitMeasurement,
      treadmillUnitMeasurement,
      striderUnitMeasurement
    } = getState().studio_setting;
    const uom = {
      2: treadmillUnitMeasurement,
      3: striderUnitMeasurement,
      4: Constants.UnitMeasurementType.Metric,
      5: bikeUnitMeasurement,
      7: treadmillUnitMeasurement
    };
    const unitDistanceMeasurement = treadmillUnitMeasurement
      && metricEntry.EquipmentId === Constants.EquipmentType.Treadmill
      ? treadmillUnitMeasurement : Constants.UnitMeasurementType.Metric;
    params = params || {};
    let { additionalQuery } = params;
    let division = (additionalQuery || {}).division || getState().shared_challenges.division;
    const { itemChallenge } = getState().shared_challenges;
    // eslint-disable-next-line sort-vars
    let challengeTemplateId, endDate, startDate, equipmentId, entryTypeId, metricKey, regionCode, studioId;
    if (itemChallenge) {
      challengeTemplateId = (itemChallenge || {}).ChallengeTemplateId;
      endDate = moment(itemChallenge.EndDate).format('MM/DD/YYYY');
      startDate = moment(itemChallenge.StartDate).format('MM/DD/YYYY');
      equipmentId = itemChallenge.MetricEntry.EquipmentId;
      entryTypeId = Helpers.getEntryTypeId(itemChallenge.MetricEntry.EntryType);
      metricKey = itemChallenge.MetricEntry.MetricKey;
      regionCode = itemChallenge.regionCode;
      studioId = itemChallenge.studioId;
    }

    // Delete additionalQuery attr and append it into params object
    delete params.additionalQuery;
    params.pageSize = params.pageSize || getState().core_table.pageSize;
    params.pageIndex = params.pageIndex || 1;
    params.sort = params.sort || getState().core_table.sort;
    if (params.keyword === undefined || params.keyword === null) {
      params.keyword = getState().core_table.keyword;
      params.searchFields = getState().core_table.searchFields;
      params.fullTextSearch = getState().core_table.fullTextSearch;
    } else if (params.keyword === '') {
      params.keyword = undefined;
      params.fullTextSearch = true;
    }
    if (options.url === 'studio/getStudioAverages') {
      if (params.keyword === undefined || params.keyword === null) {
        params.fullTextSearch = true;
      }
      params.key = params.keyword;
      delete params.keyword;
    }
    additionalQuery = additionalQuery || getState().core_table.additionalQuery || {};

    // Store payload
    let payload = {
      baseUrl: options.url,
      ...params,
      additionalQuery
    };

    params = {
      ...params,
      ...additionalQuery
    };


    params.pageIndex = options.isResetPage ? 1 : params.pageIndex;
    let requestUrl = options.url + Helpers.buildUrlQuery(params);


    const requestUrlChallenges = {
      ...params,
      challengeTemplateId,
      endDate,
      startDate,
      equipmentId,
      entryTypeId,
      metricKey,
      division,
      regionCode,
      studioId,
      fullTextSearch: undefined
    };
    // Dispatch a PENDING action so UI can show a spinner or loading
    dispatch({ type: types.REQUEST_DATA_PENDING, payload });

    // Call API to fetch data based on requestUrl
    if (options.url === 'corporate/members' ||
      options.url === 'corporate/interactive-leader-board' ||
      options.url === 'corporate/permission' ||
      options.url === 'corporate/reports') {
      // Hard code for testing
      // After all API created and applied we will remove it completely.
      ApiFake.get(requestUrl)
        .then(result => {
          let data = result.rows;
          let dataSize = result.count;
          dispatch({ type: types.REQUEST_DATA_SUCCEEDED, payload: { data, dataSize } });
        }).catch(error => {
          dispatch({ type: types.REQUEST_DATA_FAILED });
          dispatch({ type: errorHandlerConstants.HANDLE_ERROR, payload: { error } });
        });
    } else if (options.url === 'corporate/challenges') {
      dispatch({ type: types.REQUEST_DATA_PENDING_CHALLENGE });
      ChallengeService.getAllChallenge(requestUrlChallenges)
        .then((res) => {
          const dataSize = res.data.TotalNumberOfRecords;
          let data = Helpers.filterDataOptLeaderboard(res.data.Results);
          if (params.sort) {
            const columnName = params.sort.split('_')[0];
            const direction = params.sort.split('_')[1];
            if (!params.sort.includes('LogoUrl') && !params.sort.includes('editChallenge')) {
              data.forEach((el) => {
                el[columnName] = String(el[columnName]) ? el[columnName] : moment(el[columnName]).format('YYYYMMDD');
              });
            }
            data = _.orderBy(data, [columnName], [direction]);
          }
          dispatch({
            type: types.REQUEST_DATA_SUCCEEDED,
            payload: { data, dataSize, pageIndex: res.data.PageNumber }
          });
        });
    }
    else if (options.url === 'studio/getStudioAverages') {
      dispatch({ type: types.REQUEST_DATA_PENDING_GLOBAL });
      TableService.searchGlobal(requestUrl).then((res) => {
        let data = res.data.result.studioAverageResult;
        let dataSize = res.data.result.totalNumberOfRecord;
        let currentHomeSt = res.data.result.homeStudio;

        data = Helpers.filterDataOptLeaderboard(data);
        Helpers.reSortRank(data);

        if (currentHomeSt === null) {
          dispatch({ type: types.CLEAR_DATA_STUDIO_CURRENT });
        } else {
          if (metricEntry.EntryType === Constants.MetricEntryType.Distance) {
            if (isConverted) {
              let input = {
                data,
                currentHomeSt,
                challengeType: entryType,
                unitDistanceMeasurement
              };
              data = Helpers.convertDataUnitMeasurementInterStudio(_.cloneDeep(input)).data;
              currentHomeSt = Helpers.convertDataUnitMeasurementInterStudio(_.cloneDeep(input)).currentHomeSt;
            } else {
              data.forEach((el) => {
                el.studioAverage = Math.round(parseFloat(el.studioAverage));
              });
              currentHomeSt.studioAverage = Math.round(parseFloat(currentHomeSt.studioAverage));
            }
          }
          dispatch({
            type: types.REQUEST_DATA_SUCCEEDED,
            payload: {
              data: division === 'studio' ? [] : data,
              dataSize,
              pageIndex: res.data.result.PageNumber,
              currentSt: [currentHomeSt],
              division
            }
          });
        }
      }).catch(error => {
        dispatch({ type: types.REQUEST_DATA_FAILED });
        dispatch({ type: errorHandlerConstants.HANDLE_ERROR, payload: { error } });
      });
    }
    else {
      TableService.search(requestUrl)
        .then(result => {
          let data;
          if (isConverted) {
            if (options.url === 'personal/breakers') {
              data = Helpers.convertDataUnitMeasurementPersonalBreaker({
                data: result.data.Results,
                uom,
                weightFloorUnitMeasurement,
                treadmillUnitMeasurement,
                striderUnitMeasurement,
                bikeUnitMeasurement,
                challengeType: entryType
              });
            } else {
              data = Helpers.convertDataUnitMeasurement({
                data: result.data.Results,
                weightFloorUnitMeasurement,
                challengeType: entryType,
                unitDistanceMeasurement: uom[additionalQuery.equipmentId]
              });
            }
          }
          if (options.url === 'challenge-leader/interactive'
            || options.url === 'personal/breakers'
            || options.url === 'personal/interactive/convention') {
            if (isInitial) {
              data = Helpers.filterDataOptLeaderboard(result.data.Results);
              Helpers.reSortRank(data);
              dispatch({ type: types.INIT_DATA, payload: { data } });
            } else {
              data = Helpers.filterDataOptLeaderboard(result.data.Results) || getState().core_table.dataInit;
            }
          } else {
            data = result.data.Results;
          }
          if (params.sort) {
            if (metricEntry.EntryType === Constants.MetricEntryType.Distance && isConverted) {
              data.forEach((el) => {
                el.Result = Helpers.formatDistanceResult(parseFloat(el.Result).toFixed(3));
              });
            }
            const columnName = params.sort.split('_')[0];
            const direction = params.sort.split('_')[1];
            if (!params.sort.includes('MemberName') && !params.sort.includes('ClassTime')
              && !params.sort.includes('ChallengeName') && !params.sort.includes('EquipmentName')
              && !params.sort.includes('StudioName') && !params.sort.includes('UnitOfMeasure')) {
              data.forEach((el) => {
                el[columnName] = String(el[columnName]).includes(':') ? el[columnName] : parseFloat(el[columnName]);
              });
            }
            data = _.orderBy(data, [columnName], [direction]);
          }
          let dataSize = result.data.TotalNumberOfRecords;
          dispatch({
            type: types.REQUEST_DATA_SUCCEEDED,
            payload: {
              data,
              dataSize,
              pageIndex: result.data.PageNumber
            }
          });
        }).catch(error => {
          dispatch({ type: types.REQUEST_DATA_FAILED });
          dispatch({ type: errorHandlerConstants.HANDLE_ERROR, payload: { error } });
        });
    }
  },

  /**
   * This action to send data to table (work sync)
   * This function just called when remote options of this table is false
   */
  sendData: (data) => (dispatch) => {
    data = data || [];
    let dataSize = (data || []).length;

    dispatch({ type: types.REQUEST_DATA_SUCCEEDED, payload: { data, dataSize } });
  },

  /**
   * This action to destroy state of this table
   */
  destroyData: () => (dispatch) => {
    dispatch({ type: types.DESTROY_DATA });
  }
};

export const reducer = createReducer({
  [types.REQUEST_DATA_PENDING]: (state, { payload }) => {
    return Immutable.fromJS(state)
      .set('isLoading', true)
      .set('baseUrl', payload.baseUrl)
      .set('pageSize', payload.pageSize)
      .set('pageIndex', payload.pageIndex)
      .set('sort', payload.sort)
      .set('keyword', payload.keyword)
      .set('searchFields', payload.searchFields)
      .set('fullTextSearch', payload.fullTextSearch)
      .set('additionalQuery', payload.additionalQuery)
      .toJS();
  },
  [types.REQUEST_DATA_SUCCEEDED]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      data: payload.data,
      dataSize: payload.dataSize,
      pageIndex: payload.pageIndex,
      currentSt: payload.currentSt,
      division: payload.division
    };
  },
  [types.DESTROY_DATA]: (state) => {
    return {
      ...state,
      isLoading: false,
      baseUrl: undefined,
      dataSize: 0,
      data: [],
      fullTextSearch: true,
      sort: undefined,
      searchFields: undefined,
      pageIndex: 1,
      keyword: undefined,
      additionalQuery: undefined
    };
  },
  [types.REQUEST_DATA_FAILED]: (state) => {
    return {
      ...state,
      isLoading: false
    };
  },
  [types.INIT_DATA]: (state, { payload }) => {
    return {
      ...state,
      dataInit: payload.data
    };
  },
  [types.REQUEST_DATA_PENDING_GLOBAL]: (state) => {
    return {
      ...state,
      isLoading: false
    };
  },
  [types.CLEAR_DATA_STUDIO_CURRENT]: (state) => {
    return {
      ...state,
      currentSt: [],
      data: [],
      dataSize: 0
    };
  },
  [types.REQUEST_DATA_PENDING_CHALLENGE]: (state) => {
    return {
      ...state,
      isLoading: false
    };
  }
});

export const initialState = {
  additionalQuery: undefined,
  baseUrl: '',
  pageIndex: 1,
  data: [],
  dataInit: [],
  dataSize: 0,
  fullTextSearch: true,
  isLoading: false,
  keyword: undefined,
  pageSize: 15,
  searchFields: undefined,
  sort: undefined,
  currentSt: []
};
