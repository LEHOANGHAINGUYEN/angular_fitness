/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.scss';

export class EditPermissionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: true
    };
  }
  cancel() {
    this.props.actions.core_modal.hide();
  }
  isChekedRadio() {
    return function () {
      this.setState({ isAdmin: !this.state.isAdmin });
    }.bind(this);
  }
  render() {
    return (
      <form className='permissions-form'>
        <div className='info-permissions row'>
          <div className='label-group'>{'PERSONAL INFORMATION'}</div>
          <div className='row'>
            <p className='col-md-2'>{'First Name:'}</p>
            <p className='col-md-6'>{'Alexander'}</p>
          </div>
          <div className='row'>
            <p className='col-md-2'>{'Last Name:'}</p>
            <p className='col-md-6'>{'Marolyn'}</p>
          </div>
          <div className='row'>
            <p className='col-md-2'>{'Email:'}</p>
            <p className='col-md-6'>{'alexander@orangetheotyfitness.ca '}</p>
          </div>
          <div className='row'>
            <p className='col-md-2'>{'Phone:'}</p>
            <p className='col-md-6'>{'547854154'}</p>
          </div>
          <div className='label-group'>{'USER PERMISSIONS'}</div>
          <label className='title'>{'Select Permissions'}</label>
          <div>
            <input
              type='radio'
              id='admin'
              name='selectPermissions'
              value='Corporate Admin'
              checked={this.state.isAdmin ? true : false}
              onChange={this.isChekedRadio('admin')}/>
            <label className='radio-inline' htmlFor='admin'><span />{'Corporate Admin'}</label>
            <input
              type='radio'
              id='user'
              name='selectPermissions'
              value='Corporate User'
              checked={!this.state.isAdmin ? true : false}
              onChange={this.isChekedRadio('user')}/>
            <label className='radio-inline' htmlFor='user'><span />{'Corporate User'}</label>
          </div>
        </div>
        <div className='action-permissions row'>
          <button type='button' className='btn btn-cancel' onClick={this.cancel.bind(this)}>{'CANCEL'}</button>
          <button type='submit' className='btn btn-primary'>{'SAVE'}</button>
        </div>
      </form>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
EditPermissionsForm.propTypes = {
  actions: PropTypes.any,
  challenge: PropTypes.object,
  id: PropTypes.number
};

export default connect(state => ({
  challenge: state.shared_challenges.challenge
}))(EditPermissionsForm);
