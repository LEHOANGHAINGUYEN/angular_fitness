import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles';

export class Profiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilesDt: this.props.currentUser
    };
  }

  render() {
    let profilesDt = this.state.profilesDt;
    return (
      <div className='container profiles-container'>
        <div className='row header-title'><h1>{'My Account'}</h1></div>
        <div className='row content'>
          <div className='col-sm-3 basic-info'>
            <div className='row avatar'><img className='img-circle' src={profilesDt.profileUrl} /></div>
            <div className='row'>
              <h3>{profilesDt.displayName}</h3>
              <p>{profilesDt.roleName}</p>
            </div>
            <div className='row action'><button>{'CHANGE IMAGE'}</button></div>
          </div>
          <div className='col-sm-3 detail-info'>
            <div className='title'><h4>{'PERSONAL INFOMATION'}</h4></div>
            <div className='field'>
              <label>{'First Name*'}</label>
              <input value={profilesDt.firstName} />
            </div>
            <div className='field'>
              <label>{'Last Name*'}</label>
              <input value={profilesDt.lastName} />
            </div>
            <div className='field'>
              <label>{'Phone'}</label>
              <input value={profilesDt.phoneNumber} />
            </div>
            <div className='field'>
              <label>{'Email*'}</label>
              <input value={profilesDt.email} />
            </div>
          </div>
          <div className='col-sm-3 detail-info'>
            <div className='title'><h4>{'CHANGE PASSWORD'}</h4></div>
            <div className='field'>
              <label>{'Current Password*'}</label>
              <input type='password' />
            </div>
            <div className='field'>
              <label>{'Confirm Password*'}</label>
              <input type='password' />
            </div>
            <div className='field'>
              <label>{'New Password'}</label>
              <input type='password' />
            </div>
          </div>
        </div>
        <div className='row action'>
          <button className='cancel-btn'>{'CANCEL'}</button>
          <button className='update-btn'>{'UPDATE'}</button>
        </div>
      </div>
    );
  }
}
Profiles.propTypes = {
  currentUser: PropTypes.any
};

export default connect(state => ({
  currentUser: state.auth_users.currentUser
}))(Profiles);
