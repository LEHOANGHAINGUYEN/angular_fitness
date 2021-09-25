import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './styles.scss';
export default class MarathonSubCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subTypeSelected: props.challengeTemplateTypes[0].value
    };
  }
  componentDidMount() {
    this.props.actions.shared_challenges.setMarathonType(this.state.subTypeSelected);
  }

  getSubMarathonValue(value) {
    this.setState({
      subTypeSelected: value
    }, () => {
      this.props.actions.shared_challenges.setMarathonType(value);
    });
  }

  // Render sub marathon category
  renderSubMarathon() {
    const { challengeTemplateTypes } = this.props;
    return challengeTemplateTypes.map((subType, index) => {
      return <div className='col-md-4 square-wrapper' key={index} onClick={() => this.getSubMarathonValue(subType.value)}>
        {this.state.subTypeSelected === subType.value ? <div className='triangle-sub-marathon' /> : ''}
        <div className={`name-sub ${this.state.subTypeSelected === subType.value ? 'selected' : ''}`}>{subType.label}</div>
        <p className='value-sub'>{`${subType.goalReached} MILES`}</p>
      </div>;
    });
  }
  render() {
    return (
      <div>
        <div className='modal-body-title'><FormattedMessage id='Challenge.Notification.MarathonMonth.SelectSubType'/>
          {this.renderSubMarathon()}
        </div>
      </div>
    );
  }
}
MarathonSubCategory.propTypes = {
  actions: PropTypes.any,
  challenge: PropTypes.object,
  challengeTemplate: PropTypes.array,
  challengeTemplateTypes: PropTypes.array
};

