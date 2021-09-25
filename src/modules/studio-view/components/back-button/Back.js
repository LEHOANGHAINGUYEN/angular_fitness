import React from 'react';
import { hashHistory } from 'react-router';

import BackIcon from './images/arrow-back-header.svg';
import './styles.scss';

export function Back() {
  const goBack = () => {
    hashHistory.goBack();
  };
  return (
      <div className='back-button' onClick={() => goBack()}>
        <img src={BackIcon} />
      </div>
  );
}

export default Back;
