import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Constants from 'common/constants/constants';
import './styles.scss';
import { BikeIcon, TreadmillIcon, StriderIcon, RowIcon, PowerWalkerIcon, WeightFloorIcon } from 'modules/shared/images';

export function ListSubChallenges({ list }) {
  const renderSubChallenges = () => {
    return list.map((metricEntry, key) => {
      let icon;
      switch (metricEntry.EquipmentId) {
        case Constants.EquipmentType.Bike: {
          icon = BikeIcon;
          break;
        }
        case Constants.EquipmentType.Strider: {
          icon = StriderIcon;
          break;
        }
        case Constants.EquipmentType.Row: {
          icon = RowIcon;
          break;
        }
        case Constants.EquipmentType.PowerWalker: {
          icon = PowerWalkerIcon;
          break;
        }
        case Constants.EquipmentType.WeightFloor: {
          icon = WeightFloorIcon;
          break;
        }
        case Constants.EquipmentType.Treadmill: {
          icon = TreadmillIcon;
          break;
        }
        default: {
          icon = BikeIcon;
          break;
        }
      }
      return (
        <div className='sub-challenge' key={`challenge_${key}`}>
          <img src={icon} className={'col-md-5'} />
          <p className={'col-md-7 challenge-des'}>{metricEntry.Title}</p>
        </div>);
    });
  };
  return (
    <div className={'list-sub-challenges'}>
      {renderSubChallenges()}
    </div>
  );
}
ListSubChallenges.propTypes = {
  list: PropTypes.array
};

export default injectIntl(React.memo(ListSubChallenges));
