import React from 'react';

import './styles.scss';
import { CountMember } from 'modules/corporate-view/components';
import { AppConstants } from 'common';
import MemberCountImage from './images/icon-member-count.png';

export default class TotalMemberCount extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='total-member-count'>
        <div className='member-count'>
          <CountMember img={MemberCountImage} title='Total Orangetheory Member Count' number='367,005'
className='reports-total' />
          <CountMember img={MemberCountImage} title='Amherst - The Boulevard Member Count' number='367,005'
className='reports-total' customFilter={AppConstants.addressReports} dropdownSelected='addressTotal'
name='addressTotal' />
        </div>
      </div>
    );
  }
}
