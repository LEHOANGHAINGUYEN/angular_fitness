import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';


export default class MultiInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { selectedRound, onSelectRound, numberOfRound } = this.props;
    let arrRound = [];
    for (let i = 1; i <= numberOfRound; i++) {
      arrRound.push(
        <div className='col-md-4 round-wrapper orange' key = {`input_${i}`}>
          {selectedRound === i ? <div className='triangle' /> : ''}
          <p className={`round-txt${selectedRound === i ? ' selected' : ''}`} onClick={() => onSelectRound(i)}>{`ROUND ${i}`}</p>
        </div>);
    }
    return (
      <div className='multi-input custom-scrollbar'>
        {arrRound}
      </div>
    );
  }
}

MultiInput.propTypes = {
  numberOfRound: PropTypes.number,
  onSelectRound: PropTypes.func,
  selectedRound: PropTypes.number
};
