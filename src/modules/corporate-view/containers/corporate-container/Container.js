/**
 * React module dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.scss';
import { Header, LeftMenu } from '../../components';

/**
 * Container parent for corporate module
 */
export class Container extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.actions.shared_challenges.getChallengeTypes();
  }
  render() {
    const { currentUser } = this.props;

    return (
      <div className='corporate-app-background'>
        {
          currentUser && <Header actions={this.props.actions} />
        }
        <div className={`app-container ${currentUser ? 'auth' : ''}`}>
          <div className='corporate-wrapper row'>
            {currentUser && <LeftMenu actions={this.props.actions} />}
            <div className={currentUser ? 'right-content' : ''}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Container.propTypes = {
  actions: PropTypes.any,
  children: PropTypes.element,
  currentUser: PropTypes.object,
  routing: PropTypes.object
};

export default connect(state => ({
  currentUser: state.auth_users.currentUser,
  routing: state.routing.locationBeforeTransitions
}))(Container);
