import React from 'react';

import './styles.scss';
import { AppConstants } from 'common';

export class ListTop extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='list-top'>
        <p className='title'>{'Top Participating Studios'}</p>
        {AppConstants.address.map((e, i) => (
          <div className='row' key={i}>
            <div className={`rank-${i + 1}`}>
              {i + 1}
            </div>
            <p className='address'>{e}</p>
          </div>
        ))}
      </div>
    );
  }
}
