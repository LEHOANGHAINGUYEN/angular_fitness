import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import SubstituteItem from './SubstituteItem';
import helpers from 'common/utils/helpers';

import './styles.scss';
export class SubstituteArea extends React.Component {
  constructor(props) {
    super(props);
  }

  renderIconChallenge(challenge) {
    let name;
    const {
      isRowTime,
      isWeightFloorEquipment
    } = challenge;
    if (isRowTime) {
      name = 'Equipment.Rower.Title';
    } else if (isWeightFloorEquipment) {
      name = 'Equipment.WeightFloor.Title';
    }
    return name;
  }
  render() {
    const {
      isSubstitute,
      isRowTime,
      isWeightFloorEquipment,
      substituteId,
      isRowDistance,
      substituteType,
      logoUrl,
      substituteLogo,
      challengeTemplateId,
      challengeTemplate
    } = this.props;
    const challengeName = helpers.getChallengeTemplateById(challengeTemplateId, challengeTemplate).TemplateName;
    return (
      <div>
        {
          isSubstitute && (<div className='substitute-area'>
            <SubstituteItem
              isSelected={substituteId === substituteType.TM}
              icon={substituteLogo.Treadmill || null}
              onSelect={() => this.props.selectSubstitute('substituteId', substituteType.TM)}
              classNameIcon={'treadmill'}
              name={'Equipment.Treadmill.Title'} />
            <SubstituteItem
              isSelected={substituteId === substituteType.STR}
              icon={substituteLogo.Strider || null}
              onSelect={() => this.props.selectSubstitute('substituteId', substituteType.STR)}
              classNameIcon={'strider'}
              name={'Equipment.Strider.Title'} />
            <SubstituteItem
              isSelected={substituteId === substituteType.BI}
              icon={substituteLogo.Bike || null}
              onSelect={() => this.props.selectSubstitute('substituteId', substituteType.BI)}
              classNameIcon={'bike'}
              name={'Equipment.Bike.Title'} />
            <SubstituteItem
              isSelected={substituteId === substituteType.PW}
              icon={substituteLogo.PowerWalker || null}
              onSelect={() => this.props.selectSubstitute('substituteId', substituteType.PW)}
              classNameIcon={'pw'}
              name={'Equipment.PW.Title'} />
          </div>)
        }
        {
          (isRowTime || isWeightFloorEquipment || isRowDistance) &&
          (<div className='rower-equipment'>
            <img src={logoUrl} />
            <div className='rower-name'>
              {(isRowTime || isWeightFloorEquipment) ? <FormattedMessage
                id={this.renderIconChallenge({
                  isRowTime,
                  isWeightFloorEquipment
                })} /> : challengeName}
            </div>
          </div>
          )}
      </div>
    );
  }
}

SubstituteArea.propTypes = {
  challengeTemplate: PropTypes.object,
  challengeTemplateId: PropTypes.number,
  isDriTri: PropTypes.bool,
  isRowDistance: PropTypes.bool,
  isRowTime: PropTypes.bool,
  isSubstitute: PropTypes.bool,
  isWeightFloorEquipment: PropTypes.bool,
  logoUrl: PropTypes.string,
  selectSubstitute: PropTypes.func,
  substituteId: PropTypes.number,
  substituteLogo: PropTypes.string,
  substituteType: PropTypes.object
};
const substituteArea = connect(state => ({
  substituteLogo: state.shared_challenges.equipmentLogo

}))(SubstituteArea);

export default injectIntl(substituteArea);
