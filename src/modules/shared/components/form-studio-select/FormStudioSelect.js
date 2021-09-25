import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';

import './styles';
import Highlighter from 'react-highlight-words';
import { FormSelect } from 'modules/core/components';

export class FormStudioSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        studioId: ''
      }
    };
  }

  loadStudioOptions() {
    if (!this.studioSelectValue || this.studioSelectValue === '') {
      return Promise.resolve({ options: [] });
    }
    let complete = false;
    let that = this;

    return this.props.actions.shared_studios.fetchsOptionSuggestion(this.studioSelectValue).then(() => {
      if (that.props.studiosOption) {
        let options = that.props.studiosOption.map((item) => {
          return {
            value: item.StudioId,
            label: item.StudioName,
            state: item.StudioState,
            number: item.StudioNumber
          };
        });
        return { options, complete };
      }
      return { options: [], complete };
    }, () => {
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
        <span>{` #${option.number}`}</span>
      </div>
    );
  }

  handleSelectChange(name) {
    return function (ev) {
      let select = this.state.select;
      select[name] = ev.value;
      this.setState({
        select
      });
      if (this.props.onChange) {
        this.props.onChange(select.studioId);
      }
    }.bind(this);
  }

  render() {
    const { intl } = this.props;
    return (
      <FormSelect
        name='studioId'
        value={this.state.select.studioId}
        placeholder={intl.formatMessage({id: 'Interactive.Filter.SelectStudio.Placeholder'})}
        async={true}
        optionRenderer={this.studioOptionRenderer.bind(this)}
        loadOptions={this.loadStudioOptions.bind(this)}
        onInputChange={(value) => { this.studioSelectValue = value; }}
        onChange={this.handleSelectChange('studioId')}
        className={this.props.className}/>
    );
  }
}
FormStudioSelect.propTypes = {
  actions: PropTypes.any,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  onChange: PropTypes.func
};
const formStudioSelect = connect(state => ({
  studiosOption: state.shared_studios.studiosOption
}))(FormStudioSelect);

export default injectIntl(formStudioSelect);
