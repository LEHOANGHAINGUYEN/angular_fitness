import React from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppConstants } from 'common';
import Back from '../back-button/Back';
import Home from '../home-button/Home';
import Menu from '../menu/Menu';

import Logo from './images/logo-challenge-header.png';
import ArrowIcon from './images/studio-profile-arrow.svg';
import { ExpandIcon, CollapseIcon } from 'modules/shared/images';
import './styles.scss';

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }
   /**
   * Switch screen state
   * @param {bool} isFullscreen
   */
  onChangeScreen(isFullscreen) {
    if (isFullscreen) {
      this.props.actions.core_screen.collapse();
    } else {
      this.props.actions.core_screen.expand();
    }
  }

  render() {
    let studioName = '';
    let address = '';
    let isBackEnable;

    const { intl, loginType, studio, isFullscreen } = this.props;
    if (loginType === 'studio') {
      if (studio) {
        studioName = <span className='studio-name'>{studio.StudioName}</span>;
        address = <span className='studio-address'>&nbsp;&nbsp;&nbsp;{`#${studio.StudioNumber}`}</span>;
      }
      else {
        studioName = '';
        address = '';
      }
      isBackEnable = this.props.routing.pathname !== AppConstants.defaultPagePath.studio ?
        (<div><Back /><Home actions={this.props.actions} /></div>) :
        '';
    }

    return (
      <div className='header'>
        <div className='left'>
          {isBackEnable}
          <div className='logo-challenge'>
            <img src={Logo} />
            <div className='title'>{<FormattedMessage id={'General.AppName'} />}</div>
          </div>
        </div>
        <div className='right'>
          {/* The functionality is not built out yet we do not want the UI in the first release.
          <Notification />
          <div className='seperator-line' /> */}
          <div className='dropdown studio-menu'>
            <a className='current-studio'>
              {studioName}{address}
            </a>

            <img className='icon-screen' src={isFullscreen ? CollapseIcon : ExpandIcon}
              onClick={() => this.onChangeScreen.bind(this)(isFullscreen)}/>

            <a data-toggle='dropdown'>
              <img src={ArrowIcon} />
            </a>
            <Menu actions={this.props.actions} intl={intl} currentStudio={studio}/>
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
Header.propTypes = {
  actions: PropTypes.any,
  intl: intlShape.isRequired,
  isFullscreen: PropTypes.bool,
  loginType: PropTypes.string,
  routing: PropTypes.object,
  studio: PropTypes.object,
  user: PropTypes.object
};

let header = injectIntl(Header);

export default connect(state => ({
  routing: state.routing.locationBeforeTransitions,
  studio: state.auth_users.currentStudio,
  user: state.auth_users.currentUser,
  loginType: state.auth_users.loginType,
  isFullscreen: state.core_screen.isExpand
}))(header);
