import React from 'react';
import PropTypes from 'prop-types';

import { LeaderboardContent } from 'modules/shared/containers';

import './styles.scss';

export default function Overall(props) {
  const isConvention = props.location.query.convention;
  return (
    <div className='interactive-leader-board'>
      <div className='leader-board-content'>
        <LeaderboardContent actions={props.actions} defaultTitle={true} isConvention={isConvention} />
      </div>
    </div>
  );
}
Overall.propTypes = {
  actions: PropTypes.any,
  location: PropTypes.object
};
