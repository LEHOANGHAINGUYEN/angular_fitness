import React from 'react';

import './styles.scss';
import { CountMember } from 'modules/corporate-view/components';
import { AppConstants } from 'common';
import ParticipatingCountImage from './images/icon-participants-count.png';

import { CircleChart } from 'modules/core/components/chart/CircleChart';

export default class ParticipatingMemberCount extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='participating-member-count'>
        <div className='member-count'>
          <div className='member-count-participating'>
            <CountMember
              img={ParticipatingCountImage}
              title='Orangetheory Fitness Members Participating'
              number='20,126'
              className='reports-participating'
              customFilter={AppConstants.typeParticipating}
              dropdownSelected='typeParticipating'
              name='typeParticipating' />
            <CountMember
              img={ParticipatingCountImage}
              title='Amherst - The Boulevard Member Participating'
              number='358'
              className='reports-participating'
              customFilter={AppConstants.addressReports}
              dropdownSelected='addressParticipating'
              name='addressParticipating' />
          </div>
          <div className='percentage-members-participating'>
            <p className='title-percentage'>{'Percentage Of Members Participating'}</p>
            <div className='chart-wrapper'>
              <div className='chart-percentage'>
                <CircleChart
                  height={200}
                  width={200}
                  innerRadius={80}
                  outerRadius={100}
                  angel={0.75} />
                <p className='chart-name'>{'Percentage Of Participating Members'}</p>
              </div>
              <div className='chart-info'>
                <p className='chart-category'>
                  <label className='ellipse'>{'●'}</label>{'Total Members: '}
                  <span className='chart-number'>{'367,005'}</span>
                </p>
                <p className='chart-category'>
                  <label className='ellipse'>{'●'}</label>{'Participating Members: '}
                  <span className='chart-number'>{'275,254'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
