import { createConstants, createReducer } from 'redux-module-builder';

/**
 * Define modal action constant
 */
export const types = createConstants('modal')(
  'SHOW_CUSTOM_MODAL',
  'SHOW',
  'HIDE'
);

export const actions = {
  /**
   * Show modal
   * Specify the modal type, title, message, etc throught following options parameter
   * @param {object} options The object that will specify the modal title, message
   * @param {string} options.modalType  Specify the type this modal (required)
   * @param {string} options.title      Specify the title of this modal (required)
   * @param {string} options.message    Specify the message of this modal
   * @param {string} options.size       Size of this modal, available values: 'lg', 'large', 'sm', 'small'
   * @param {string} options.className  Css class name to apply to this modal
   * @param {string} options.backdrop   Indlude a backdrop component. Specify 'static' (default) for a backdrop that doesn't trigger an "onHide" when clicked.
   * @param {ReactComponent} options.component  Specify the custom modal (just support when modalType is Custom)
   * @param {string} options.headerClass        Specify the header class (just support when modalType is Custom)
   * @param {Function} options.onClose          Callback function when modal is closed
   */
  show: (options) => (dispatch) => {
    dispatch({ type: types.SHOW, payload: options });
  },
  /**
   * This action to dispatch the state of modal to close
   */
  hide: () => (dispatch) => {
    dispatch({ type: types.HIDE });
  }
};

export const reducer = createReducer({
  [types.SHOW]: (state, { payload }) => {
    return {
      ...state,
      isOpen: true,
      options: payload
    };
  },
  [types.HIDE]: (state) => {
    return {
      ...state,
      isOpen: false
    };
  }
});

export const initialState = {
  isOpen: false,
  options: {}
};
