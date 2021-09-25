import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.scss';
import Logo from './images/Splash-Logo.svg';

export class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isHiding = this.props.hidingSplash ? ' splash-out' : '';
    const logoTransition = this.props.hidingSplash ? ' slide-top' : '';

    return (
      <div className='splash-wrapper'>
        {this.props.showSplash && <div className={`splash-screen${isHiding}`}>
              <div className='flash-container'><img className={`splash-logo${logoTransition}`} src={Logo}/></div>
        </div>}
      </div>
    );
  }
}

Splash.propTypes = {
  hidingSplash: PropTypes.bool,
  showSplash: PropTypes.bool
};

export default connect(state => ({
  showSplash: state.core_splash.isShow,
  hidingSplash: state.core_splash.hiding
}))(Splash);
