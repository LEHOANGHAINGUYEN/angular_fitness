import { createConstants, createReducer } from 'redux-module-builder';
import * as _ from 'lodash';

import { SettingService } from 'services';
import { Constants } from 'common';

export const types = createConstants('setting')('ERROR_GET_DATA', 'GET_STUDIO_EQUIPMENTS');

export const actions = {
  getMeasurementUnit: (studioUUId) => (dispatch) => {
    SettingService.getMeasurementUnit(studioUUId).then(res => {
      if (res) {
        const { studioEquipments } = res.data.data;
        const treadmillItem = _.find(studioEquipments, ['type', 'Treadmill']);
        const striderItem = _.find(studioEquipments, ['type', 'Strider']);
        const bikeItem = _.find(studioEquipments, ['type', 'Bike']);
        const weightFloorItem = _.find(studioEquipments, ['type', 'Weight Floor']);
        dispatch({
          type: types.GET_STUDIO_EQUIPMENTS,
          payload: { treadmillItem, striderItem, bikeItem, weightFloorItem }
        });
      }
    }, err => {
      dispatch({
        type: types.ERROR_GET_DATA,
        payload: err
      });
    });
  }
};


export const reducer = createReducer({
  [types.GET_STUDIO_EQUIPMENTS]: (state, {
    payload
  }) => {
    return {
      ...state,
      treadmillUnitMeasurement: (payload.treadmillItem || {}).unitOfMeasure || Constants.UnitMeasurementType.Imperial,
      striderUnitMeasurement: (payload.striderItem || {}).unitOfMeasure || Constants.UnitMeasurementType.Imperial,
      bikeUnitMeasurement: (payload.bikeItem || {}).unitOfMeasure || Constants.UnitMeasurementType.Imperial,
      weightFloorUnitMeasurement: (payload.weightFloorItem || {}).unitOfMeasure
        || Constants.UnitMeasurementType.Imperial,
      errors: undefined
    };
  },
  [types.ERROR_GET_DATA]: (state, {
    payload
  }) => {
    return {
      ...state,
      treadmillUnitMeasurement: Constants.UnitMeasurementType.Imperial,
      striderUnitMeasurement: Constants.UnitMeasurementType.Imperial,
      bikeUnitMeasurement: Constants.UnitMeasurementType.Imperial,
      weightFloorUnitMeasurement: Constants.UnitMeasurementType.Imperial,
      errors: payload
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  treadmillUnitMeasurement: Constants.UnitMeasurementType.Imperial,
  striderUnitMeasurement: Constants.UnitMeasurementType.Imperial,
  bikeUnitMeasurement: Constants.UnitMeasurementType.Imperial,
  weightFloorUnitMeasurement: Constants.UnitMeasurementType.Imperial,
  errors: undefined
};
