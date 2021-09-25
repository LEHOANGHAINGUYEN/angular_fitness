import React from 'react';
import Select from 'react-select';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import { Api } from 'services';
import { AppConstants } from 'common';
import PropTypes from 'prop-types';
import { FormSelect, Calendar } from 'modules/core/components';
import './styles.scss';

export default class PushNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'individual',
      select: {
        individual: '',
        studio: ''
      }
    };
    this.formatDate = 'MM/DD/YYYY';
  }
  isChekedRadio(name) {
    return function () {
      let selected = this.state.selected;
      selected = name;
      this.setState({ selected });
    }.bind(this);
  }
  handleSelectChange(name) {
    return function (ev) {
      let select = this.state.select;
      select[name] = ev.value;
      this.setState({
        selected: name,
        select
      });
    }.bind(this);
  }

  loadStudioOptions() {
    if (!this.studioSelectValue || this.studioSelectValue === '') {
      return Promise.resolve({ options: [] });
    }

    let complete = false;

    return Api.get(`/v3/studios/suggestion/${this.studioSelectValue}`, { isUndergroundReq: true })
      .then(res => {
        if (res) {
          let options = res.data.map((item) => {
            return {
              value: item.StudioId,
              label: item.StudioName,
              address: item.StudioAddress
            };
          });

          return { options, complete };
        }

        return { options: [], complete };
      }, () => {
        // Silent handle error
        return { options: [], complete };
      });
  }

  /**
   * Customize the studio option
   */
  studioOptionRenderer(option) {
    return (
      <div>
        <Highlighter
          highlightClassName='highlight-select'
          searchWords={[this.studioSelectValue]}
          textToHighlight={option.label} />
        <span>{` / ${option.address}`}</span>
      </div>
    );
  }
  handleChangeMultiCalendar(newDate) {
    let selectState = this.state.select;
    selectState.date = newDate;
    this.setState((prevState) => {
      return {
        ...prevState,
        select: {
          date: moment(newDate).format(this.formatDate)
        }
      };
    });
  }
  render() {
    const {studio, date} = this.state.select;
    return (
        <div>
          <div className='push-notification'>
            <div className='row top'>
              <div className='col-md-12 title'>
                <h3>{'Push Notifications'}</h3>
              </div>
            </div>
            <div className='panel-filter-push'>
              <table className='table-push'>
                <tbody>
                  <tr>
                    <td className='list-select'>
                      <div className='list-radio'>
                        <input
                          id='1'
                          type='radio'
                          name='radio-button'
                          value='country'
                          checked={this.state.selected === 'country' ? true : false}
                          onChange={this.isChekedRadio('country')} />
                        <label htmlFor='1' className='radio-inline'><span />{'All Studios by Country'}</label>
                      </div>
                      <Select
                        disabled={this.state.selected === 'individual' ? true : false}
                        clearable={false}
                        name='country'
                        className='select-country'
                        value={this.state.select.country}
                        options={AppConstants.challengeFormSelect.country}
                        onChange={this.handleSelectChange('country')}
                        inputProps={{ readOnly: true }} />
                    </td>
                    <td className='list-select'>
                      <div className='list-radio'>
                        <input
                          id='2'
                          type='radio'
                          name='radio-button'
                          value='individual'
                          checked={this.state.selected === 'individual' ? true : false}
                          onChange={this.isChekedRadio('individual')} />
                        <label htmlFor='2' className='radio-inline'><span />{'Individual Studio'}</label>
                      </div>
                      <FormSelect
                        disabled={this.state.selected !== 'individual' ? true : false}
                        name='individual'
                        value={this.state.select.individual}
                        placeholder={'Select Studio...'}
                        async={true}
                        optionRenderer={this.studioOptionRenderer.bind(this)}
                        className='select-country'
                        loadOptions={this.loadStudioOptions.bind(this)}
                        onInputChange={(value) => { this.studioSelectValue = value; }}
                        onChange={this.handleSelectChange('individual')} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className='title-message'>{'Message'}</p>
              <div className='mesage'>
                <textarea />
              </div>
            </div>
            <div className='btn-bottom'>
              <button className='cancel-btn'>
                {'CANCEL'}
              </button>
              <button className='send-btn'>
                {'SEND'}
              </button>
            </div>
          </div>
          <div className='push-notification'>
          <div className='row top'>
            <div className='col-md-12 title'>
              <h3>{'Orange Voyage Summary Email'}</h3>
            </div>
          </div>
          <div className='panel-send-email'>
            <table className='table-push'>
              <tbody>
                <tr>
                  <td className='list-select'>
                    <div className='list-radio'>
                      <label className='radio-inline'><span />{'Date'}</label>
                    </div>
                    <Calendar options={{ format: this.formatDate }}
                      onChange={this.handleChangeMultiCalendar.bind(this)} />
                  </td>
                  <td className='list-select'>
                    <div className='list-radio'>
                      <label className='radio-inline'><span />{'Studio'}</label>
                    </div>
                    <FormSelect
                      name='studio'
                      value={this.state.select.studio}
                      placeholder={'Select Studio...'}
                      async={true}
                      optionRenderer={this.studioOptionRenderer.bind(this)}
                      className='select-country'
                      loadOptions={this.loadStudioOptions.bind(this)}
                      onInputChange={(value) => { this.studioSelectValue = value; }}
                      onChange={this.handleSelectChange('studio')} />
                  </td>
                  <td className='list-select send-email-btn'>
                    <button className='send-btn' onClick={()=>this.props.actions.corporate_challenges.sendEmail(date, studio)}>{'SEND'}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
PushNotifications.propTypes = {
  actions: PropTypes.any
};

