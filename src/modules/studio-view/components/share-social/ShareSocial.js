import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { injectIntl } from 'react-intl';
import { Logo } from 'modules/shared/images';

import { default as HeaderTodayChallenge } from './header-today-challenge/HeaderTodayChallenge';
import ChallengeRankToday from './challenge-rank-today/ChallengeRankToday';

import './styles.scss';
class ShareSocial extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  cancel() {
    this.props.close();
    this.props.actions.core_table.search({
      url: this.props.baseUrl,
      params: {
        sort: this.props.sort,
        pageIndex: 1,
        pageSize: 15
      }
    });
  }

  handleRenderImg() {
    const input = document.getElementById('poster-challenge');
    const time = moment(new Date()).format('YYYY-MM-DD');
    const scale = 2;
    htmlToImage.toPng(input, {
      height: input.offsetHeight * scale,
      width: input.offsetWidth * scale,
      style: {
        transform: 'scale(2) translateX(200px) translateY(150px)',
        background: '#ffffff'
      }
    })
      .then((dataUrl) => {
        download(dataUrl, `top_ten_member_${time}.png`);
      })
      .then(() => {
        this.cancel();
      }, 1000);
  }

  render() {
    const { todayChallenge, currentStudio, tableData, challengeTemplate } = this.props;
    return (
      <div>
        <div className='close-btn' onClick={this.cancel.bind(this)}>
          {'x'}
        </div>
        <div className='wrapper-content'>
          <div className='left-panel'>
            <div className='poster-challenge' id='poster-challenge'>
              <HeaderTodayChallenge
                challenge={todayChallenge}
                intl={this.props}
                currentStudio={currentStudio}
                challengeTemplate={challengeTemplate} />
              <ChallengeRankToday list={tableData} challenge={todayChallenge} challengeTemplate={challengeTemplate} />
            </div>
          </div>
          <div className='right-panel'>
            <div className='title-header'>
              <div className='avartar'>
                <img src={Logo} />
              </div>
              <div className='title'>
                <p>{currentStudio.StudioName}</p>
              </div>
            </div>
            <div className='inform-body'>
              <p className='studio-name'>
                {
                  `${currentStudio.StudioName} Check out today\'s benchmark leaderboard! #${currentStudio.StudioName}`
                }
              </p>
            </div>
            <div className='btn-image' onClick={this.handleRenderImg.bind(this)}>{'EXPORT IMAGE'}</div>
          </div>
        </div>
      </div>
    );
  }
}
ShareSocial.propTypes = {
  actions: PropTypes.any,
  baseUrl: PropTypes.string,
  challengeLeaderBoards: PropTypes.any,
  challengeTemplate: PropTypes.object,
  close: PropTypes.any,
  currentStudio: PropTypes.any,
  sort: PropTypes.any,
  tableData: PropTypes.any,
  todayChallenge: PropTypes.any
};
const todayShareSocial = connect(state => ({
  currentStudio: state.auth_users.currentStudio,
  todayChallenge: state.shared_challenges.todayChallenge,
  challengeLeaderBoards: state.shared_challenges.challengeLeaderBoards,
  tableData: state.core_table.data,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  baseUrl: state.core_table.baseUrl,
  sort: state.core_table.sort
}))(ShareSocial);
export default injectIntl(todayShareSocial);
