import React from 'react';
import { hashHistory } from 'react-router';

import './styles.scss';
import BackImage from './images/Back.svg';

export class Back extends React.Component {
  constructor(props) {
    super(props);
  }

  goBack() {
    hashHistory.goBack();
  }

  render() {
    return (
      <img src={BackImage} className='back-button-corporate' onClick={this.goBack} />
    );
  }
}

export default Back;
