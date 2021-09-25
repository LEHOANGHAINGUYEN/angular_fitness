import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { FormStudioSelect } from 'modules/shared/components';

import './styles.scss';

export class Poster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        studioId: '',
        date: moment(new Date()).format('MM/DD/YYYY')
      }
    };
  }

  onStudioChange(studioId) {
    if (studioId) {
      let select = this.state.select;
      select.studioId = studioId;
      this.setState({ select });
      this.props.actions.shared_challenges.getTodayChallenge(studioId, this.state.select.date,
        { isUndergroundReq: true });
    }
  }

  render() {
    return (
      <div className='wrapper-poster'>
        <div className='header'>
          <p className='title'>{this.props.title}</p>
          <p className='date'>{moment(new Date()).format('MMMM DD,YYYY')}</p>
        </div>
        <p className='type'>{this.props.type}</p>
        <FormStudioSelect
          actions={this.props.actions}
          onChange={this.onStudioChange.bind(this)}
          className='select-studio' />
      </div>
    );
  }
}

Poster.propTypes = {
  actions: PropTypes.any,
  title: PropTypes.string,
  type: PropTypes.string
};
