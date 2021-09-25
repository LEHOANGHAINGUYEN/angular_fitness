import React, {memo} from 'react';
import PropTypes from 'prop-types';

import './styles.scss';
import { Helpers } from 'common';
import MaleImage from './images/icon_male.svg';
import FemaleImage from './images/icon_female.svg';

export function MemberResult({ member, actions }) {
  const displayEmail = Helpers.renderEmail(member.email);
  const renderMemberIcon = () => {
    if (member.ProfilePictureUrl) {
      return member.ProfilePictureUrl;
    }
    return member.GenderId === 1 ? MaleImage : FemaleImage;
  };
  const formatMemberName = (firstName, lastName) => {
    if (!firstName) {
      return undefined;
    }

    // Trim name before concatination
    if (lastName) {
      lastName = `${lastName}`.trim();
    }
    return `${firstName.trim()} ${`${lastName || ''}`.charAt(0).toUpperCase()}.`;
  };
  return (
    <div className='member-result-item' onClick={() => actions.routing.navigateTo(`/studio/member-details/${member.mboMemberId}`)}>
      <div className='container-member'>
        <div className='avatar-icon'>
          <img className='icon-member' src={renderMemberIcon()} />
        </div>
        <div className='wrap-name'>
          <p className='name-member'>{formatMemberName(member.firstName, member.lastName)}</p>
          <span className='email'>{displayEmail}</span>
        </div>
      </div>
    </div>
  );
}
MemberResult.propTypes = {
  actions: PropTypes.any,
  member: PropTypes.object
};
export default memo(MemberResult);
