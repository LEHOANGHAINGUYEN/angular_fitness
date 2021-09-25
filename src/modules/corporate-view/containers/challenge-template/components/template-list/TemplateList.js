/**
 * React / Redux dependencies
 */
import React, { memo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import TemplateItem from '../template-item/TemplateItem';

import './styles.scss';

export class TemplateList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(newProps) {
    if (newProps && newProps.deleteChallengeSuccess !== this.props.deleteChallengeSuccess) {
      newProps.challengeFilterComp.handleFilterTemplate();
    }
  }
  renderChallenges() {
    const { actions, challengeFilterComp, challengeTemplates } = this.props;
    return (challengeTemplates || []).map((template, index) => {
      if (challengeTemplates.length !== 0) {
        return <TemplateItem key={index} actions={actions}
          template={template} challengeFilterComp={challengeFilterComp} />;
      }
      return null;
    });
  }
  /**
   * Return template of challenges list item component
   */
  render() {
    return (
      <div className='challenge-list row list-group'>
        {this.renderChallenges()}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
TemplateList.propTypes = {
  actions: PropTypes.any,
  challengeFilterComp: PropTypes.any,
  challengeTemplates: PropTypes.array,
  deleteChallengeSuccess: PropTypes.bool
};

const templateList = connect(state => ({
  challengeTemplates: state.shared_challenges.challengeTemplates,
  deleteChallengeSuccess: state.shared_challenges.deleteChallengeSuccess,
  deleteMessage: state.shared_challenges.deleteMessage
}))(memo(TemplateList));
export default injectIntl(templateList);
