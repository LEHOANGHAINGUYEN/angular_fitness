import {
  createConstants,
  createReducer
} from 'redux-module-builder';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

import {
  alertConstants
} from 'modules/core/config/redux/alert';
import {
  errorHandlerConstants
} from 'modules/core/config/redux/error-handler';
import { AppConstants, Constants, Helpers } from 'common';
import {
  ChallengeService,
  ChallengeLeaderService,
  StudioService,
  AgendaService
} from 'services';
import {
  locale as defaultLocale
} from 'localization';
export const types = createConstants('challenges')(
  'GET_TODAY_CHALLENGE',
  'GET_TODAY_LEADER_BOARD',
  'GET_CHALLENGE_RESULTS',
  'SAVE_CHALLENGE_RESULT_SUCCESS',
  'RELOAD_CHALLENGE_RESULTS_DONE',
  'GET_ALL_CHALLENGE',
  'GETTING_TODAY_CHALLENGE',
  'GET_ALL_RECORDS',
  'SEARCH_PERSONAL_RECORDS',
  'ERROR_GET_DATA',
  'DESTROY_CHALLENGE_DATA',
  'FILTER_CHALLENGE',
  'FILTER_CHALLENGE_TEMPLATE',
  'GET_CHALLENGE_SUCCESS',
  'UPDATE_CHALLENGE',
  'SELECT_CHALLENGE',
  'DESTROY_CHALLENGE_FORM',
  'DESTROY_CHALLENGE_TEMPLATE_FORM',
  'REQUEST_FAILED',
  'ERROR_FETCH_DATA',
  'REMOVE_CHALLENGE_RESULT_SUCCESS',
  'UPDATE_CHALLENGE_SUCCESS',
  'DELETE_CHALLENGE_SUCCESS',
  'UPDATE_CHALLENGE_TEMPLATE_SUCCESS',
  'RESET_DELETE',
  'CHALLENGE_TEMPLATE_HAS_DATA',
  'CHALLENGE_HAS_DATA',
  'CLEAR_TODAY_CHALLENGE',
  'REMOVE_TODAY_CHALLENGE',
  'GET_SUBSTITUTE_TYPE',
  'GET_EQUIPMENT_LOGO',
  'GET_CHALLENGE_LOGO',
  'GET_CHALLENGE_TEMPLATES',
  'GET_CHALLENGE_TEMPLATE_TYPES',
  'GET_HOME_STUDIO_AVERAGE',
  'DESTROY_HOME_STUDIO_AVERAGE',
  'GET_CLASS_OPTIONS',
  'GET_CHALLENGE_TEMPLATE_SUCCESS',
  'IS_UPDATE',
  'CLEAR_SELECTED_CHALLENGE',
  'SELECT_CHALLENGE_TEMPLATES_DETAIL',
  'DELETE_CHALLENGE_TEMPLATE',
  'DELETE_CHALLENGE',
  'CLEAR_DELETE',
  'DELETE_CHALLENGE_TEMPLATE_SUCCESS',
  'IS_CHECK_CHALLENGE',
  'CLEAR_TABLE',
  'IS_EDIT_CHALLENGE',
  'CLEAR_SELECTED_TEMPLATE',
  'SELECTED_CHALLENGE_DELETE',
  'GET_SELECTED_CHALLENGE',
  'GET_FITNESS_TYPE',
  'GET_FITNESS_TYPE_FORM',
  'CHECK_MIN_MAX_CHALLENGE',
  'UNDO_CHECK_MIN_MAX_CHALLENGE',
  'SET_MARATHON_TYPE',
  'GET_CHALLENGE_MEMBER_INFO',
  'CLOSE_POPUP',
  'OPEN_POPUP',
  'CLOSE_INIT_POPUP',
  'OPEN_INIT_POPUP',
  'FETCHING_CHALLENGE_MEMBER_INFO'
);

export const actions = {
  insertChallenge: (challenge) => (dispatch) => {
    dispatch({
      type: types.IS_CHECK_CHALLENGE
    });
    ChallengeService.insertChallenge(challenge).then(() => {
      dispatch({
        type: alertConstants.SHOW_INFOR,
        payload: 'Challenge has been created successfully!'
      });
      dispatch({
        type: types.UPDATE_CHALLENGE_SUCCESS
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },

  editChallenge: (challenge) => (dispatch) => {
    ChallengeService.editChallenge(challenge).then(() => {
      dispatch({
        type: alertConstants.SHOW_INFOR,
        payload: 'Challenge has been edited successfully!'
      });
      dispatch({
        type: types.UPDATE_CHALLENGE_SUCCESS
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  deleteChallenge: (challenge) => (dispatch) => {
    const paramChallenge = {
      isDeleteExistingResults: challenge.isDeleteExistingResults,
      listChallenge: challenge.listChallenge
    };
    dispatch({
      type: types.RESET_DELETE
    });
    ChallengeService.deleteChallenge(paramChallenge).then((res) => {
      if (res.data.body && res.data.body.code === 'EXISTING_CHALLENGE_RESULT') {
        dispatch({
          type: types.CHALLENGE_HAS_DATA,
          payload: res.data.body.message
        });
      } else {
        dispatch({
          type: alertConstants.SHOW_INFOR,
          payload: 'Challenge has been deleted successfully!'
        });
        if (challenge.clearChallengeStudio) {
          dispatch({
            type: types.CLEAR_DELETE
          });
        }
        else {
          dispatch({
            type: types.DELETE_CHALLENGE
          });
        }
      }
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  getFitnessType: () => (dispatch) => {
    ChallengeService.getFitnessType().then((res) => {
      if (res) {
        let fitnessTypes = [];
        let fitnessTypesAll = [];
        fitnessTypes = res.data.map(item => {
          return {
            value: item.FitnessTypeId,
            label: item.TypeDescription
          };
        });
        fitnessTypesAll = [{
          value: 'All',
          label: 'All'
        },
          ...fitnessTypes
        ];
        dispatch({
          type: types.GET_FITNESS_TYPE,
          payload: fitnessTypesAll
        });
        dispatch({
          type: types.GET_FITNESS_TYPE_FORM,
          payload: fitnessTypes
        });
      }
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },

  insertChallengeTemplate: (challengeTemplate) => (dispatch) => {
    ChallengeService.insertChallengeTemplate(challengeTemplate).then(() => {
      dispatch({
        type: alertConstants.SHOW_INFOR,
        payload: 'Challenge template has been created successfully!'
      });
      dispatch({
        type: types.UPDATE_CHALLENGE_TEMPLATE_SUCCESS
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },

  getChallengeTemplateById: (challengeTemplateId) => (dispatch) => {
    ChallengeService.getChallengeTemplateById(challengeTemplateId).then((res) => {
      let challengeTemplate = res.data;
      let title = parseFloat((challengeTemplate.MetricEntry || {}).MetricKey);
      challengeTemplate.Title = title ? title : null;
      dispatch({
        type: types.GET_CHALLENGE_TEMPLATE_SUCCESS,
        payload: challengeTemplate
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  clearSelectedTemplate: () => (dispatch) => {
    dispatch({
      type: types.CLEAR_SELECTED_TEMPLATE
    });
  },
  updateChallengeTemplate: (challengeTemplate) => (dispatch => {
    ChallengeService.updateChallengeTemplate(challengeTemplate).then(() => {
      dispatch({
        type: alertConstants.SHOW_INFOR,
        payload: 'Challenge template has been edited successfully!'
      });
      dispatch({
        type: types.UPDATE_CHALLENGE_TEMPLATE_SUCCESS
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  }),

  deleteChallengeTemplate: (template) => (dispatch) => {
    dispatch({
      type: types.RESET_DELETE
    });
    ChallengeService.deleteChallengeTemplate(template).then(() => {
      dispatch({
        type: alertConstants.SHOW_INFOR,
        payload: 'Challenge template has been deleted successfully!'
      });

      dispatch({
        type: types.DELETE_CHALLENGE_SUCCESS
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },

  getTodayChallenge: (studioId, date, options = {}) => (dispatch, getState) => {
    dispatch({
      type: types.GETTING_TODAY_CHALLENGE
    });
    ChallengeService.getTodayChallenge(studioId, date, {
      isUndergroundReq: options ? options.isUndergroundReq : false
    })
      .then(challenge => {
        dispatch({
          type: types.GET_TODAY_CHALLENGE,
          payload: challenge
        });
        if (options.isInteractiveLeaderboard && !_.isUndefined(challenge.data.ChallengeId)) {
          return StudioService.getHomeStudio(studioId, challenge.data.ChallengeId).then(res => {
            const metricEntry = challenge.data.MetricEntry || {};
            const entryType = metricEntry.EntryType;
            const isConverted = metricEntry.EquipmentId !== Constants.EquipmentType.Row &&
              metricEntry.EntryType !== Constants.MetricEntryType.Time;
            const {
              treadmillUnitMeasurement
            } = getState().studio_setting;
            const unitDistanceMeasurement = treadmillUnitMeasurement &&
              metricEntry.EquipmentId === Constants.EquipmentType.Treadmill ?
              treadmillUnitMeasurement : Constants.UnitMeasurementType.Metric;
            if (res.data.result.homeStudio) {
              let currentHomeSt = res.data.result.homeStudio;
              if (metricEntry.EntryType === Constants.MetricEntryType.Distance) {
                if (isConverted) {
                  let input = {
                    currentHomeSt,
                    challengeType: entryType,
                    unitDistanceMeasurement
                  };
                  currentHomeSt = Helpers.convertDataUnitMeasurementInterStudio(input).currentHomeSt;
                } else {
                  const averageHomeSt = currentHomeSt.studioAverage;
                  currentHomeSt.studioAverage = Helpers.formatDistanceResult(Math.round(parseFloat(averageHomeSt)));
                }
              }
              dispatch({
                type: types.GET_HOME_STUDIO_AVERAGE,
                payload: currentHomeSt
              });
            }
          }, error => {
            dispatch({
              type: types.DESTROY_HOME_STUDIO_AVERAGE
            });
            dispatch({
              type: errorHandlerConstants.HANDLE_ERROR,
              payload: {
                error,
                isSilence: true
              }
            });
          });
        }
        return true;
      }, error => {
        dispatch({
          type: types.GET_TODAY_CHALLENGE,
          payload: {
            data: {},
            noChallenge: true,
            homeStudio: undefined
          }
        });
        dispatch({
          type: errorHandlerConstants.HANDLE_ERROR,
          payload: {
            error,
            isSilence: true
          }
        });
      });
  },
  /**
   * Get today challenge and leaderboard on Today leaderboard page
   */
  getTodayChallengeAndLeaderboards: (studioId, date, options, isConvention) => (dispatch) => {
    dispatch({
      type: types.GETTING_TODAY_CHALLENGE
    });
    ChallengeService.getTodayChallenge(studioId, date, {
      isUndergroundReq: options ? options.isUndergroundReq : false
    }).then((res) => {
      const challenge = res;
      dispatch({
        type: types.GET_TODAY_CHALLENGE,
        payload: challenge
      });
      if (challenge.data.ChallengeId) {
        return ChallengeLeaderService.getTodayLeaderboard(studioId,
          challenge.data.ChallengeId, date, {
            isUndergroundReq: true
          }, 10, isConvention);
      }
      return true;
    }).then((res) => {
      dispatch({
        type: types.GET_TODAY_LEADER_BOARD,
        payload: res.data
      });
    }).catch((error) => {
      dispatch({
        type: types.CLEAR_TODAY_CHALLENGE
      });
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error,
          isSilence: true
        }
      });
    });
  },
  /**
   * Get today leaderboard
   * This function is used for refresh the result on Today Leaderboard page
   */
  refreshTodayLeaderboards: (studioId, challengeId, date, challengeTemplateId, isConvention) =>
    (dispatch, getState) => {
      const {
        challengeTemplate
      } = getState().shared_challenges;
      let challengeTemplateTypeId = challengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId ?
        challengeTemplate.DriTri.ChallengeTemplateTypes[0].ChallengeTemplateTypeId : undefined;
      ChallengeLeaderService.getTodayLeaderboard(studioId, challengeId, date, {
        isUndergroundReq: true
      }, challengeTemplateTypeId, 10, isConvention).then((res) => {
        dispatch({
          type: types.GET_TODAY_LEADER_BOARD,
          payload: res.data
        });
      }).catch((err) => {
        dispatch({
          type: errorHandlerConstants.HANDLE_ERROR,
          payload: {
            error: err
          }
        });
      });
    },
  getChallengeResults: (mboClassId, studioId, options) => (dispatch) => {
    dispatch({
      type: types.CLOSE_POPUP
    });
    ChallengeService.getChallengeResults(mboClassId, studioId, options)
      .then((res) => {
        dispatch({
          type: types.GET_CHALLENGE_RESULTS,
          payload: res.data
        });
      });
  },
  saveChallengeResult: (mboStudioId, data) => (dispatch) => {
    ChallengeService.saveChallengeResult(mboStudioId, data)
      .then(() => {
        dispatch({
          type: types.SAVE_CHALLENGE_RESULT_SUCCESS
        });
      })
      .catch((err) => {
        dispatch({
          type: errorHandlerConstants.HANDLE_ERROR,
          payload: {
            error: err
          }
        });
      });
  },
  reloadChallengeResultsDone: () => (dispatch) => {
    dispatch({
      type: types.RELOAD_CHALLENGE_RESULTS_DONE
    });
  },
  destroyChallengeData: () => (dispatch) => {
    dispatch({
      type: types.DESTROY_CHALLENGE_DATA
    });
  },
  checkRangeChanged: () => (dispatch) => {
    dispatch({
      type: types.CHECK_MIN_MAX_CHALLENGE
    });
  },
  undoCheckRangeChanged: () => (dispatch) => {
    dispatch({
      type: types.UNDO_CHECK_MIN_MAX_CHALLENGE
    });
  },
  /**
   * Search funtion when making filter action on challenge filter
   * @param {object} options The options object include meta data to query
   */
  filterChallenge: (params) => (dispatch) => {
    ChallengeService.getAllChallengeTemplates(params)
      .then((res) => {
        dispatch({
          type: types.FILTER_CHALLENGE,
          payload: {
            res: res.data,
            division: params.division,
            paramFilter: params
          }
        });
      });
  },
  filterChallengeTemplate: (params) => (dispatch) => {
    dispatch({
      type: types.IS_UPDATE
    });
    ChallengeService.getChallengeTemplates(params)
      .then((res) => {
        dispatch({
          type: types.FILTER_CHALLENGE_TEMPLATE,
          payload: res.data
        });
      });
  },

  deleteChallengeGroups: (challenge) => (dispatch) => {
    dispatch({
      type: types.RESET_DELETE
    });
    ChallengeService.deleteChallengeGroups(challenge).then((res) => {
      if (res.data.body && res.data.body.code === 'EXISTING_CHALLENGE_RESULT') {
        dispatch({
          type: types.CHALLENGE_TEMPLATE_HAS_DATA,
          payload: res.data.body.message
        });
      } else {
        dispatch({
          type: alertConstants.SHOW_INFOR,
          payload: ' Delete challenge successfully!'
        });
        dispatch({
          type: types.DELETE_CHALLENGE_TEMPLATE_SUCCESS
        });
      }
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  selectChallengeTemplateDetail: (params) => (dispatch) => {
    dispatch({
      type: types.SELECT_CHALLENGE_TEMPLATES_DETAIL,
      payload: params
    });
  },
  /**
   * Calling API to making a request to get challenge entity
   * Render challenge that is returned on challenge edit form
   * @param {number} challengeId The challengeId of challenge
   */
  getChallenge: (challengeId) => (dispatch) => {
    const format = 'MM/DD/YYYY';
    ChallengeService.getChallenge(challengeId).then((res) => {
      let challenge = {
        id: res.data.ChallengeId,
        language: 'En',
        country: res.data.CountryCode,
        individualStudios: res.data.StudioId,
        individualStudioName: res.data.StudioName,
        startDate: moment(res.data.StartDate).format(format),
        endDate: moment(res.data.EndDate).format(format),
        challengeType: res.data.ChallengeTemplateId,
        numberOfRound: res.data.NumberOfRound,
        unitOfMeasurement: res.data.MeasureId
      };

      dispatch({
        type: types.GET_CHALLENGE_SUCCESS,
        payload: challenge
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },

  /**
   * Select challenge item and marked it as selected state
   * @param {number} id The id of selected challenge
   */

  getSelectedChallenge: (selectedChallenge) => (dispatch) => {
    dispatch({
      type: types.GET_SELECTED_CHALLENGE,
      payload: {
        selectedChallenge
      }
    });
  },
  selectChallenge: (challengeItemTemplate) => (dispatch) => {
    dispatch({
      type: types.SELECT_CHALLENGE,
      payload: {
        challengeItemTemplate,
        selectedChallenge: challengeItemTemplate.ChallengeTemplateId
      }
    });
  },
  selectedChallengeDelete: (challengeItemTemplate) => (dispatch) => {
    dispatch({
      type: types.SELECTED_CHALLENGE_DELETE,
      payload: {
        challengeItemTemplate,
        selectedChallenge: challengeItemTemplate.ChallengeTemplateId
      }
    });
  },
  clearSelectedChallenge: () => (dispatch) => {
    dispatch({
      type: types.CLEAR_SELECTED_CHALLENGE
    });
  },
  /**
   * Destroy challenge form state
   */
  destroyChallengeForm: () => (dispatch) => {
    dispatch({
      type: types.DESTROY_CHALLENGE_FORM
    });
  },

  destroyChallengeTemplateForm: () => (dispatch) => {
    dispatch({
      type: types.DESTROY_CHALLENGE_TEMPLATE_FORM
    });
  },

  removeChallengeResult: (uuid) => (dispatch) => {
    ChallengeService.deleteChallengeResult(uuid)
      .then(() => {
        dispatch({
          type: types.REMOVE_CHALLENGE_RESULT_SUCCESS
        });
      })
      .catch(error => {
        dispatch({
          type: errorHandlerConstants.HANDLE_ERROR,
          payload: {
            error
          }
        });
      });
  },

  clearTodayChallenge: () => (dispatch) => {
    dispatch({
      type: types.REMOVE_TODAY_CHALLENGE
    });
  },

  getChallengeTypes: () => (dispatch) => {
    ChallengeService.getChallengeTypes()
      .then((res) => {
        let substituteType = {};
        let equipmentLogo = {};
        let challengeTemplate = {};
        Object.keys(res.data).forEach(el => {
          switch (el) {
            case 'ChallengeTemplates':
              res.data[el].forEach(element => {
                challengeTemplate = {
                  ...challengeTemplate,
                  [element.TemplateCode]: element
                };
              });
              dispatch({
                type: types.GET_CHALLENGE_TEMPLATES,
                payload: challengeTemplate
              });
              break;
            case 'SubstituteEquipments':
              res.data[el].forEach(element => {
                substituteType = {
                  ...substituteType,
                  [element.SubstituteEquipmentCode]: element.SubstituteEquipmentId
                };
              });
              dispatch({
                type: types.GET_SUBSTITUTE_TYPE,
                payload: substituteType
              });
              break;
            case 'Equipments':
              res.data[el].forEach(element => {
                let trimEquipName = element.EquipmentName.replace(/\s/g, '');
                equipmentLogo = {
                  ...equipmentLogo,
                  [trimEquipName]: element.ContentUrl || null
                };
              });
              dispatch({
                type: types.GET_EQUIPMENT_LOGO,
                payload: equipmentLogo
              });
              break;
            default:
              break;
          }
        });
      });
  },
  destroyHomeStudioAverage: () => (dispatch) => {
    dispatch({
      type: types.DESTROY_HOME_STUDIO_AVERAGE
    });
  },
  getClassTimeOptions: (studioId, date) => (dispatch) => {
    AgendaService.getClassesByStudio(studioId, date, {
      isUndergroundReq: true
    }).then(
      res => {
        if (res) {
          let classOptions = [];
          classOptions = res.data.map(item => {
            return {
              value: item.ClassId,
              label: moment(item.StartTime)
                .locale(defaultLocale)
                .format('LT')
            };
          });
          classOptions = [{
            value: 'All',
            label: 'All'
          },
            ...classOptions
          ];
          dispatch({
            type: types.GET_CLASS_OPTIONS,
            payload: classOptions
          });
        }
      }
    ).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  setMarathonType: (id) => (dispatch) => {
    dispatch({
      type: types.SET_MARATHON_TYPE,
      payload: id
    });
  },
  getChallengeMemberInfo: (memberId, challengeId) => (dispatch) => {
    dispatch({
      type: types.CLOSE_POPUP
    });
    ChallengeService.getChallengeMemberInfo(memberId, challengeId).then((res) => {
      dispatch({
        type: types.FETCHING_CHALLENGE_MEMBER_INFO
      });
      if (!_.isNull(res.data.Dto.ChallengeResults)) {
        dispatch({
          type: types.OPEN_POPUP
        });
        dispatch({
          type: types.SET_MARATHON_TYPE,
          payload: _.last(res.data.Dto.ChallengeResults).ChallengeTemplateTypeId
        });
      } else {
        dispatch({
          type: types.OPEN_INIT_POPUP
        });
      }
      dispatch({
        type: types.GET_CHALLENGE_MEMBER_INFO,
        payload: res.data.Dto
      });
    }).catch(error => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  closeInitPopup: () => (dispatch) => {
    dispatch({
      type: types.CLOSE_INIT_POPUP
    });
  }
};

export const reducer = createReducer({
  [types.GET_TODAY_CHALLENGE]: (state, {
    payload
  }) => {
    return {
      ...state,
      loading: false,
      todayChallenge: payload.data,
      errors: undefined,
      noChallenge: payload.noChallenge || false
    };
  },
  [types.CLEAR_TODAY_CHALLENGE]: (state) => {
    return {
      ...state,
      challengeLeaderBoards: [],
      errors: undefined
    };
  },
  [types.REMOVE_TODAY_CHALLENGE]: (state) => {
    return {
      ...state,
      todayChallenge: {},
      errors: undefined
    };
  },
  [types.GET_TODAY_LEADER_BOARD]: (state, {
    payload
  }) => {
    return {
      ...state,
      challengeLeaderBoards: payload,
      errors: undefined
    };
  },
  [types.GETTING_TODAY_CHALLENGE]: (state) => {
    return {
      ...state,
      loading: true,
      errors: undefined,
      todayChallenge: {},
      noChallenge: false
    };
  },
  [types.GET_CHALLENGE_RESULTS]: (state, {
    payload
  }) => {
    return {
      ...state,
      challengeResults: payload,
      errors: undefined
    };
  },
  [types.SAVE_CHALLENGE_RESULT_SUCCESS]: (state) => {
    return {
      ...state,
      saveChallengeResultSuccess: true,
      isOpenPopup: false,
      errors: undefined
    };
  },
  [types.REMOVE_CHALLENGE_RESULT_SUCCESS]: (state) => {
    return {
      ...state,
      removeChallengeResultSuccess: true,
      isOpenPopup: false,
      errors: undefined
    };
  },
  [types.RELOAD_CHALLENGE_RESULTS_DONE]: (state) => {
    return {
      ...state,
      saveChallengeResultSuccess: false,
      removeChallengeResultSuccess: false,
      errors: undefined
    };
  },
  [types.GET_ALL_CHALLENGE]: (state, {
    payload
  }) => {
    return {
      ...state,
      challenges: payload,
      errors: undefined
    };
  },
  [types.GET_FITNESS_TYPE]: (state, {
    payload
  }) => {
    return {
      ...state,
      fitnessTypeOptions: payload,
      errors: undefined
    };
  },
  [types.GET_FITNESS_TYPE_FORM]: (state, {
    payload
  }) => {
    return {
      ...state,
      fitnessTypeOptionsForm: payload,
      errors: undefined
    };
  },
  [types.GET_ALL_RECORDS]: (state, {
    payload
  }) => {
    return {
      ...state,
      records: payload,
      errors: undefined
    };
  },
  [types.SEARCH_PERSONAL_RECORDS]: (state, {
    payload
  }) => {
    return {
      ...state,
      records: payload,
      errors: undefined
    };
  },
  [types.DESTROY_CHALLENGE_DATA]: (state) => {
    return {
      ...state,
      saveChallengeResultSuccess: false,
      challengeResults: [],
      challenge: {},
      todayChallenge: {},
      errors: undefined,
      homeStudio: undefined,
      classesOpt: []
    };
  },
  [types.FILTER_CHALLENGE]: (state, {
    payload
  }) => {
    return {
      ...state,
      allChallengeTemplate: payload.res,
      division: payload.division,
      paramFilter: payload.paramFilter,
      removeChallenge: false
    };
  },
  [types.FILTER_CHALLENGE_TEMPLATE]: (state, {
    payload
  }) => {
    return {
      ...state,
      challengeTemplates: payload,
      errors: undefined,
      isUpdate: true
    };
  },
  [types.GET_CHALLENGE_SUCCESS]: (state, {
    payload
  }) => {
    return {
      ...state,
      challenge: payload,
      errors: undefined
    };
  },
  [types.DESTROY_CHALLENGE_FORM]: (state) => {
    return Immutable.fromJS(state)
      .set('challenge', AppConstants.initChallengeValue)
      .set('updateChallengeSuccess', false)
      .set('errors', undefined)
      .toJS();
  },
  [types.DESTROY_CHALLENGE_TEMPLATE_FORM]: (state) => {
    return {
      ...state,
      selectedTemplate: {},
      editChallengeTemplateSuccess: false

    };
  },
  [types.REQUEST_FAILED]: (state, {
    payload
  }) => {
    return {
      ...state,
      errors: payload
    };
  },
  [types.FETCHED_SUGGESTION_OPTION]: (state, {
    payload
  }) => {
    return {
      ...state,
      studiosOption: payload,
      errors: undefined
    };
  },
  [types.UPDATE_CHALLENGE_SUCCESS]: (state) => {
    return {
      ...state,
      updateChallengeSuccess: true
    };
  },
  [types.UPDATE_CHALLENGE_TEMPLATE_SUCCESS]: (state) => {
    return {
      ...state,
      editChallengeTemplateSuccess: true
    };
  },
  [types.RESET_DELETE]: (state) => {
    return {
      ...state,
      deleteChallengeSuccess: false,
      deleteMessage: '',
      deleteMessageTemplate: ''
    };
  },
  [types.CLEAR_DELETE]: (state) => {
    return {
      ...state,
      removeChallenge: false,
      isSelectedChallenge: true,
      clearChallengeStudio: true
    };
  },
  [types.DELETE_CHALLENGE_SUCCESS]: (state) => {
    return {
      ...state,
      deleteChallengeSuccess: true

    };
  },
  [types.DELETE_CHALLENGE_TEMPLATE_SUCCESS]: (state) => {
    return {
      ...state,
      deleteChallengeSuccess: true,
      isSelectChallenge: false
    };
  },
  [types.DELETE_CHALLENGE]: (state) => {
    return {
      ...state,
      removeChallenge: true,
      isSelectChallenge: false
    };
  },
  [types.CHALLENGE_TEMPLATE_HAS_DATA]: (state, {
    payload
  }) => {
    return {
      ...state,
      deleteMessageTemplate: payload
    };
  },
  [types.GET_SUBSTITUTE_TYPE]: (state, {
    payload
  }) => {
    return {
      ...state,
      substituteType: payload
    };
  },
  [types.GET_EQUIPMENT_LOGO]: (state, {
    payload
  }) => {
    return {
      ...state,
      equipmentLogo: payload
    };
  },
  [types.GET_CHALLENGE_LOGO]: (state, {
    payload
  }) => {
    return {
      ...state,
      challengeLogo: payload
    };
  },
  [types.GET_CHALLENGE_TEMPLATES]: (state, {
    payload
  }) => {
    return {
      ...state,
      challengeTemplate: payload
    };
  },

  [types.GET_HOME_STUDIO_AVERAGE]: (state, {
    payload
  }) => {
    return {
      ...state,
      homeStudio: payload
    };
  },
  [types.DESTROY_HOME_STUDIO_AVERAGE]: (state) => {
    return {
      ...state,
      homeStudio: undefined
    };
  },
  [types.GET_CLASS_OPTIONS]: (state, {
    payload
  }) => {
    return {
      ...state,
      classesOpt: payload
    };
  },
  [types.GET_CHALLENGE_TEMPLATE_SUCCESS]: (state, {
    payload
  }) => {
    return {
      ...state,
      selectedTemplate: payload,
      isRangeChanged: true
    };
  },
  [types.IS_UPDATE]: (state) => {
    return {
      ...state,
      isUpdate: false
    };
  },
  [types.SELECT_CHALLENGE]: (state, { payload }) => {
    return {
      ...state,
      isSelectChallenge: true,
      itemChallenge: payload.challengeItemTemplate,
      selectedChallenge: payload.selectedChallenge
      // errors: undefined
    };
  },
  [types.SELECTED_CHALLENGE_DELETE]: (state, { payload }) => {
    return {
      ...state,
      isSelectChallenge: false,
      itemChallenge: payload.challengeItemTemplate,
      selectedChallenge: payload.selectedChallenge
    };
  },
  [types.CLEAR_SELECTED_CHALLENGE]: (state) => {
    return {
      ...state,
      isSelectChallenge: false,
      removeChallenge: false,
      clearChallengeStudio: false,
      clearChallenge: true,
      allChallengeTemplate: []
    };
  },
  [types.SELECT_CHALLENGE_TEMPLATES_DETAIL]: (state) => {
    return {
      ...state,
      isSelectChallenge: false
    };
  },
  [types.CHALLENGE_HAS_DATA]: (state, { payload }) => {
    return {
      ...state,
      deleteMessage: payload
    };
  },
  [types.CLEAR_TABLE]: (state) => {
    return {
      ...state,
      isSelectChallenge: false
    };
  },
  [types.CLEAR_SELECTED_TEMPLATE]: (state) => {
    return {
      ...state,
      selectedTemplate: {}
    };
  },
  [types.GET_SELECTED_CHALLENGE]: (state, { payload }) => {
    return {
      ...state,
      selectedChallenge: payload.selectedChallenge,
      clearChallengeStudio: false
    };
  },
  [types.CHECK_MIN_MAX_CHALLENGE]: (state) => {
    return {
      ...state,
      isRangeChanged: false
    };
  },
  [types.UNDO_CHECK_MIN_MAX_CHALLENGE]: (state) => {
    return {
      ...state,
      isRangeChanged: true
    };
  },
  [types.SET_MARATHON_TYPE]: (state, { payload }) => {
    return {
      ...state,
      marathonTypeId: payload
    };
  },
  [types.GET_CHALLENGE_MEMBER_INFO]: (state, { payload }) => {
    return {
      ...state,
      challengeMemberInfo: payload,
      isFetchedChallengeMemberInfo: true
    };
  },
  [types.CLOSE_POPUP]: (state) => {
    return {
      ...state,
      isOpenPopup: false
    };
  },
  [types.OPEN_POPUP]: (state) => {
    return {
      ...state,
      isOpenPopup: true
    };
  },
  [types.OPEN_INIT_POPUP]: (state) => {
    return {
      ...state,
      initPopup: true
    };
  },
  [types.CLOSE_INIT_POPUP]: (state) => {
    return {
      ...state,
      initPopup: false
    };
  },
  [types.FETCHING_CHALLENGE_MEMBER_INFO]: (state) => {
    return {
      ...state,
      isFetchedChallengeMemberInfo: false
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  loading: false,
  errors: undefined,
  challengeResults: [],
  deleteMessage: '',
  saveChallengeResultSuccess: false,
  removeChallengeResultSuccess: false,
  todayChallenge: {},
  // The challenge entity used for add / edit page
  challenge: AppConstants.initChallengeValue,
  updateChallengeSuccess: false,
  deleteChallengeSuccess: false,
  editChallengeTemplateSuccess: false,
  records: [],
  challengeLeaderBoards: [],
  selectedChallenge: undefined,
  challenges: [],
  challengeTemplates: [],
  noChallenge: false,
  substituteType: {},
  equipmentLogo: {},
  challengeTemplate: {},
  challengeTemplateTypes: {},
  challengeLogo: {},
  homeStudio: undefined,
  classesOpt: [],
  selectedTemplate: {},
  isSelectChallenge: false,
  allChallengeTemplate: [],
  removeChallenge: false,
  clearChallengeStudio: false,
  fitnessTypeOptions: [],
  fitnessTypeOptionsForm: [],
  isRangeChanged: true,
  marathonTypeId: undefined,
  totalResult: 0,
  challengeMemberInfo: {},
  isOpenPopup: false,
  initPopup: false,
  isFetchedChallengeMemberInfo: false
};
