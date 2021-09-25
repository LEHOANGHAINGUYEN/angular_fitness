import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Header } from '../../components';

import './styles.scss';

export class Container extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.actions.shared_challenges.getChallengeTypes();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.currentStudio && newProps.currentStudio !== this.props.currentStudio) {
      const { actions } = this.props;
      actions.routing.navigateTo('/studio');
    }
  }

  render() {
    $(document).ready(function () {
      /* Temporary remove custom keyboard
      if (Helpers.mobileAndTabletCheck()) {
        $('input.i-alKeyboard').prop('readonly', true);
        $('input.i-alKeyboard').bind('focus', function (e) {
          that.props.actions.core_keyboard.show(e);
          $(document).on('click', function (e) {
            if (that.props.keyboardShow) {
              that.props.actions.core_keyboard.hide(e);
            }
          });
        });
      }
      */
    });
    return (
      <div id='studioView' className='app-background'>
        {
          (this.props.currentStudio || this.props.currentUser) &&
          (
            <div>
              <Header actions={this.props.actions} />
            </div>
          )
        }
        <div className='app-container'>
          {this.props.children}
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
  children: PropTypes.any,
  currentStudio: PropTypes.any,
  currentUser: PropTypes.any
};


export default connect(state => ({
  currentUser: state.auth_users.currentUser,
  currentStudio: state.auth_users.currentStudio,
  routing: state.routing.locationBeforeTransitions,
  keyboardShow: state.core_keyboard.isShow
}))(Container);
