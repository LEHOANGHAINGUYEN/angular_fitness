import { createConstants, createReducer } from 'redux-module-builder';

import { errorHandlerConstants } from 'modules/core/config/redux/error-handler';
import { alertConstants } from 'modules/core/config/redux/alert';
import { MemberService } from 'services';

export const types = createConstants('members')(
  'CLEAR_PERSONAL_BENCHMARKS',
  'CLEAR_MEMBER_DETAIL',
  'GET_MEMBER_SUCCESS',
  'GET_PERSONAL_BENCHMARKS_SUCCESS',
  'GET_TERMS_CONDITIONS_ROSTER',
  'SAVE_TERMS_CONDITIONS',
  'UPSERT_SUCCESSFULLY',
  'RESET_UPSERT');

export const actions = {
  detroyMemberDetail: () => (dispatch) => {
    dispatch({ type: types.CLEAR_PERSONAL_BENCHMARKS });
    dispatch({ type: types.CLEAR_MEMBER_DETAIL });
  },
  getMember: (memberId) => (dispatch) => {
    MemberService.getMember(memberId).then((res) => {
      dispatch({ type: types.GET_MEMBER_SUCCESS, payload: res.data });
    }).catch((error) => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  getMemberBenchmarks: (payload) => (dispatch) => {
    const getMemberBenchmarks = MemberService.getMemberBenchmarks(payload);
    // Clear member data on redux store before call new request to get member benchmarks
    dispatch({ type: types.CLEAR_PERSONAL_BENCHMARKS });
    getMemberBenchmarks.then((res) => {
      dispatch({ type: types.GET_PERSONAL_BENCHMARKS_SUCCESS, payload: res.data.Dto });
    }).catch((error) => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  getTermConditionRoster: (emails) => (dispatch) => {
    MemberService.getTermsConditionRoster(emails).then((res) => {
      dispatch({ type: types.GET_TERMS_CONDITIONS_ROSTER, payload: res.data });
    }).catch((error) => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  saveTermsConditions: (memberId, payload) => (dispatch) => {
    dispatch({ type: types.RESET_UPSERT });
    MemberService.saveTermsConditions(memberId, payload).then(() => {
      dispatch({ type: alertConstants.SHOW_INFOR, payload: 'Save terms & conditions successfully!' });
      dispatch({ type: types.UPSERT_SUCCESSFULLY });
    }).catch((error) => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  },
  editTermsConditions: (memberId, memberTermsConditionsUUId, payload) => (dispatch) => {
    dispatch({ type: types.RESET_UPSERT });
    MemberService.editTermsConditions(memberId, memberTermsConditionsUUId, payload).then(() => {
      dispatch({ type: alertConstants.SHOW_INFOR, payload: 'Edit terms & conditions successfully!' });
      dispatch({ type: types.UPSERT_SUCCESSFULLY });
    }).catch((error) => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error
        }
      });
    });
  }
};

export const reducer = createReducer({
  [types.GET_MEMBER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      memberDetail: payload
    };
  },
  [types.GET_PERSONAL_BENCHMARKS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      personalBenchmarksData: payload
    };
  },
  [types.CLEAR_MEMBER_DETAIL]: (state) => {
    return {
      ...state,
      memberDetail: undefined
    };
  },
  [types.CLEAR_PERSONAL_BENCHMARKS]: (state) => {
    return {
      ...state,
      personalBenchmarksData: undefined
    };
  },
  [types.GET_TERMS_CONDITIONS_ROSTER]: (state, { payload }) => {
    return {
      ...state,
      rosterTermsConditions: payload
    };
  },
  [types.RESET_UPSERT]: (state) => {
    return {
      ...state,
      isUpsertSucessfully: false
    };
  },
  [types.UPSERT_SUCCESSFULLY]: (state) => {
    return {
      ...state,
      isUpsertSucessfully: true
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  memberDetail: undefined,
  personalBenchmarksData: undefined,
  rosterTermsConditions: {},
  isUpsertSucessfully: false,
  pageIndex: 1,
  pageSize: 5
};
