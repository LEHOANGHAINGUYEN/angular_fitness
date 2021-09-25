import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

import './styles.scss';
import { AppConstants } from 'common';
import PropTypes from 'prop-types';

export class GeneralSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false
    };
  }

  componentWillMount() {
    if (this.props.id) {
      this.setState({
        isEdit: true
      });

      this.props.actions.shared_challenges.getChallenge(this.props.id);
    }
  }
  handleSelectChange(name) {
    return function (ev) {
      this.props.actions.shared_challenges.handleChallengeChange(name, ev.value);
    }.bind(this);
  }
  handleOptionChange(name) {
    return function (ev) {
      this.props.actions.shared_challenges.handleChallengeChange(name, ev.target.value);
    }.bind(this);
  }
  render() {
    let { challenge } = this.props;
    return (
      <div className='settings'>
        <div className='row top'>
            <div className='col-md-12 title'>
              <h3>{'Settings'}</h3>
            </div>
          </div>
        <div className='panel-filter-general'>
          <table className='table-panel'>
            <tr>
              <td className='menu-list'>
                <p className='title-panel-child'>{'LANGUAGE'}</p>
                <div className='title-child'>
                  <p className='text-child'>{'Language Settings'}</p>
                </div>
                <Select
                  name='language'
                  className='select-language'
                  value={challenge.language}
                  options={AppConstants.challengeFormSelect.language}
                  onChange={this.handleSelectChange('language')} />
              </td>
              <td >
                <p className='title-panel-child'>{'UNIT'}</p>
                <div className='title-child'>
                  <p className='text-child'>{'Unit of Measurement'}</p>
                  <div className='list-radio'>
                    <input
                      type='radio'
                      id='imperial'
                      name='unitOfMeasurement'
                      value='Imperial'
                      checked={challenge.unitOfMeasurement ? challenge.unitOfMeasurement === 'Imperial' : true}
                      onChange={this.handleOptionChange('unitOfMeasurement')} />
                    <label className='radio-inline' htmlFor='imperial'><span />{'Imperial'}</label>

                    <input
                      type='radio'
                      id='metric'
                      name='unitOfMeasurement'
                      value='Metric'
                      checked={challenge.unitOfMeasurement === 'Metric'}
                      onChange={this.handleOptionChange('unitOfMeasurement')} />
                    <label className='radio-inline' htmlFor='metric'><span />{'Metric'}</label>
                  </div>
                </div>
              </td>
              <td>
                <p className='title-panel-child'>{'DATE'}</p>
                <div className='title-child'>
                  <p className='text-child'>{'Date Format'}</p>
                  <div className='list-radio'>
                    <input
                      type='radio'
                      name='dateFormat'
                      value='MM/DD/YY'
                      id='mm/dd/yy'
                      checked={challenge.dateFormat ? challenge.dateFormat === 'MM/DD/YY' : true}
                      onChange={this.handleOptionChange('dateFormat')} />
                    <label className='radio-inline' htmlFor='mm/dd/yy'><span />{'MM/DD/YYYY'}</label>
                    <input
                      type='radio'
                      name='date'
                      value='DD/MM/YYYY'
                      id='dd/mm/yyyy'
                      checked={challenge.dateFormat === 'DD/MM/YYYY'}
                      onChange={this.handleOptionChange('dateFormat')} />
                    <label className='radio-inline' htmlFor='dd/mm/yyyy'><span />{'DD/MM/YYYY'}</label>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div className='btn-bottom'>
          <button className='cancel-btn'>
            {'CANCEL'}
          </button>
          <button className='send-btn'>
            {'SAVE'}
          </button>
        </div>
      </div>
    );
  }
}
GeneralSettings.propTypes = {
  actions: PropTypes.any,
  challenge: PropTypes.object,
  id: PropTypes.number
};
export default connect(state => ({
  challenge: state.shared_challenges.challenge
}))(GeneralSettings);
