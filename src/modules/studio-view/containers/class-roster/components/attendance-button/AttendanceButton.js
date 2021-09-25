import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { find } from 'lodash';

import './styles.scss';
import { Logo } from 'modules/shared/images';
import { Constants, Helpers } from 'common';

/**
   * Get icon by challengeTypeId and substituteID
   * Get equipment name by substituteID
   * Get challenge sub-type by challengeTemplateTypeId
   */
export function AttendanceButton(props) {
  const getInfoAttendance = (substituteId, challengeTemplateTypeId, challengeType) => {
    const { intl, substituteType, substituteLogo, challengeTemplateId, challengeTemplate } = props;
    let { isRowTime, isWeightFloorEquipment, logoUrl, isDriTri, isMM } = challengeType;
    let challengeTemplateTypeName, icon, name;
    icon = logoUrl;
    if (isRowTime) {
      name = intl.formatMessage({ id: 'Equipment.Rower.Title' });
    } else if (isWeightFloorEquipment) {
      name = intl.formatMessage({ id: 'Equipment.WeightFloor.Title' });
    } else {
      const ct = Helpers.getChallengeTemplateById(challengeTemplateId, challengeTemplate);
      if (ct.ChallengeTemplateTypes && ct.ChallengeTemplateTypes.length > 0) {
        if (challengeTemplateTypeId) {
          challengeTemplateTypeName = find(ct.ChallengeTemplateTypes, ['ChallengeTemplateTypeId', challengeTemplateTypeId]).TemplateTypeName;
          if (isMM) {
            logoUrl = (find(ct.ChallengeTemplateTypes, ['ChallengeTemplateTypeId', challengeTemplateTypeId]) || {}).LogoUrl;
          }
        } else {
          challengeTemplateTypeName = `${ct.TemplateName} Original`;
        }
        challengeTemplateTypeName = challengeTemplateTypeName.includes('Original') ? ct.TemplateName : challengeTemplateTypeName;
      } else {
        name = ct.TemplateName;
      }
      switch (substituteId) {
        case substituteType.BI:
          icon = substituteLogo.Bike || null;
          name = intl.formatMessage({ id: 'Equipment.Bike.Title' });
          break;
        case substituteType.PW:
          icon = substituteLogo.PowerWalker || null;
          name = intl.formatMessage({ id: 'Equipment.PW.Title' });
          break;
        case substituteType.STR:
          icon = substituteLogo.Strider || null;
          name = intl.formatMessage({ id: 'Equipment.Strider.Title' });
          break;
        case substituteType.TM:
          icon = substituteLogo.Treadmill || null;
          name = intl.formatMessage({ id: 'Equipment.Treadmill.Title' });
          break;
        default:
          icon = logoUrl;
          name = intl.formatMessage({ id: 'Equipment.Rower.Title' });
          break;
      }
    }
    return { icon: isDriTri || isMM ? logoUrl : icon, name, challengeTemplateTypeName };
  };

  const renderMemberName = () => {
    const { member } = props;
    if (!member) { return undefined; }

    let name = Helpers.formatMemberName(member.firstName, member.lastName);
    name = name.replace('\\', '');
    return name;
  };

  const { result, substituteId, member, allowEdit, challengeType, challengeTemplateTypeId, unitOfMeasure } = props;
  const getUnitOfMeasure = () => {
    const { isRowDistance, isDistance } = challengeType;
    if (isRowDistance) {
      return 'meter';
    } else if (isDistance) {
      return unitOfMeasure[substituteId] === Constants.UnitMeasurementType.Metric ? 'kilometer' : 'mile';
    }
    return 'minute';
  };
  let isDisabled = !allowEdit;
  const displayEmail = Helpers.renderEmail(member.email);
  return (
    <div className={props.className} onClick={props.onClick}>
      <div
        className={`thumbnail attendance-button black-bg-hover${isDisabled ? ' disabled' : ''}
            ${result ? ' black-bg' : ''}`}>
        <div className='avatar-icon'>
          <img src={!member.profilePictureUrl ? Logo : member.profilePictureUrl}
            onError={() => Logo}
            className='avatar' />
        </div>
        <div className='attendance-content'>
          <span className={'attendance-name'}>
            {renderMemberName()}
          </span>
          <span className='email'>{displayEmail}</span>
          {result && (
            <span className='attendance-record'>
              {result}
              <span className='substitute-text'>
                {` ${getUnitOfMeasure()} ${(getInfoAttendance.bind(this, substituteId, challengeTemplateTypeId, challengeType)() || {}).name || ''}`}
              </span>
            </span>
          )}
        </div>
        {result && (
          <div className='equipment'>
            <img src={(getInfoAttendance(substituteId, challengeTemplateTypeId, challengeType) || {}).icon} />
            {(getInfoAttendance(substituteId, challengeTemplateTypeId, challengeType) || {}).challengeTemplateTypeName &&
              <h3 className='sub-type'>{getInfoAttendance(substituteId, challengeTemplateTypeId, challengeType).challengeTemplateTypeName}</h3>}
          </div>
        )}
      </div>
    </div>
  );
}
AttendanceButton.propTypes = {
  allowEdit: PropTypes.bool,
  challengeTemplate: PropTypes.object,
  challengeTemplateId: PropTypes.number,
  challengeTemplateTypeId: PropTypes.number,
  challengeType: PropTypes.object,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  member: PropTypes.object,
  onClick: PropTypes.func,
  result: PropTypes.string,
  substituteId: PropTypes.number,
  substituteLogo: PropTypes.object,
  substituteType: PropTypes.object,
  unitOfMeasure: PropTypes.object
};
const attendanceButton = connect(state => ({
  substituteLogo: state.shared_challenges.equipmentLogo
}))(AttendanceButton);

export default injectIntl(memo(attendanceButton));
