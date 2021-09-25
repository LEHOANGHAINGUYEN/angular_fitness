import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import './styles.scss';

export default class CountMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        addressTotal: 'Amherst - The Boulevard / 1551 Niagra',
        typeParticipating: 'Treadmill 12 Min For Distance',
        addressParticipating: 'Amherst - The Boulevard / 1551 Niagra'
      },
      selectedValue: ''
    };
  }

  componentDidMount() {
    const { dropdownSelected } = this.props;
    const { select, selectedValue } = this.state;

    if (dropdownSelected && selectedValue === '') {
      this.setState({
        selectedValue: select[dropdownSelected]
      });
    }
  }

  handleSelectChange(name) {
    return function (newValue) {
      let selectState = this.state.select;
      selectState[name] = newValue.value;
      this.setState({
        select: selectState,
        selectedValue: newValue.value
      });
    }.bind(this);
  }
  render() {
    let customFilter;
    customFilter = this.props.customFilter ? (
      <Select
        name={this.props.name}
        className='dropdown'
        value={this.state.selectedValue}
        options={this.props.customFilter}
        inputProps={{ readOnly: true }}
        onChange={this.handleSelectChange(this.props.dropdownSelected)} />
    ) : '';
    return (
      <div className={`wrapper-count-member ${this.props.className ? this.props.className : ''}`}>
        {customFilter}
        <div className='body'>
          <img src={this.props.img} className='image' />
          <div className='text'>
            <p className='number'>{this.props.number}</p>
            <p className='title'>{this.props.title}</p>
          </div>
        </div>
      </div>
    );
  }
}

CountMember.propTypes = {
  className: PropTypes.string,
  customFilter: PropTypes.any,
  dropdownSelected: PropTypes.any,
  img: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.string,
  title: PropTypes.string
};

