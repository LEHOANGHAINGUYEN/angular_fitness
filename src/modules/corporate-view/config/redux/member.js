import { createConstants, createReducer } from 'redux-module-builder';

import { AppConstants } from 'common';

export const types = createConstants('corp_members')(
  'SEARCH_MEMBERS', 'SEARCH_MEMBERS_PERMISSION'
);

/**
 * Actions for corporate member
 */
export const actions = {
  /**
   * Search funtion when making filter action on member filter
   * @param {object} options The options object include meta data to query
   */
  searchMembers: (options) => (dispatch) => {
    dispatch({ type: types.SEARCH_MEMBERS, payload: options });
  },
  searchMemberPermission: (text, arr) => (dispatch) => {
    let textSearch = text.trim();
    let arrSearch = [];
    let data = arr;
    if (text !== '') {
      for (let i = 0; i < data.length; i++) {
        let arrName = data[i].name.split(' ');
        if (arrName[0].toLowerCase().startsWith(textSearch.toLowerCase())
          || arrName[1].toLowerCase().startsWith(textSearch.toLowerCase())
          || data[i].name.toLowerCase().startsWith(textSearch.toLowerCase())) {
          arrSearch.push(data[i]);
        }
      }
      dispatch({ type: types.SEARCH_MEMBERS_PERMISSION, payload: arrSearch });
    }
  }
};

/**
 * Reducer for above actions
 */
export const reducer = createReducer({
  [types.SEARCH_MEMBERS]: (state, { payload }) => {
    // The following filter is temporary, just use for testing
    let members = AppConstants.members;

    if (payload && payload.keyword && payload.keyword !== '') {
      members = members.filter((member) => {
        return member.username.indexOf(payload.keyword) !== -1 ||
          member.homeStudio.indexOf(payload.keyword) !== -1 ||
          member.visitedStudios.indexOf(payload.keyword) !== -1;
      });
    }

    return {
      ...state,
      members,
      errors: undefined
    };
  },
  [types.REQUEST_FAILED]: (state, { payload }) => {
    return {
      ...state,
      errors: payload
    };
  },
  [types.SEARCH_MEMBERS_PERMISSION]: (state, { payload }) => {
    return {
      ...state,
      memberSearch: payload
    };
  }

});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  errors: undefined,
  // List of members
  members: [],
  loading: false,
  memberSearch: []
};
