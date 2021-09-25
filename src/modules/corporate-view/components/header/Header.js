/**
 * Redux / React module dependency
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { default as InforMenu } from '../infor-menu/InforMenu';
import './styles.scss';
import logo from './images/orange-icon.png';
import { AppConstants } from 'common';

/**
 * Header component for corporate module
 */
export class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='corporate-header'>
        <div className='logo-section'>
          <span className='fitness-challenge-text'>
            <img className='fitness-challenge-logo' src={logo} />
            {AppConstants.appName}
          </span>
        </div>
        <InforMenu actions={this.props.actions} />
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Header.propTypes = {
  actions: PropTypes.any,
  currentUser: PropTypes.object,
  routing: PropTypes.object
};

export default connect(state => ({
  routing: state.routing.locationBeforeTransitions,
  currentUser: state.auth_users.currentUser
}))(Header);
