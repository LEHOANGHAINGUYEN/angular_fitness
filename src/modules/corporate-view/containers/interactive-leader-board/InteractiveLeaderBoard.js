import React from 'react';
import PropTypes from 'prop-types';

import { LeaderboardContent } from 'modules/shared/containers';
import { Back } from '../../components';

import './styles';

export default class InteractiveLeaderBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      < div className='corporate-interactive'>
        <div className='corporate-interactive-leader-board'>
          <div className='row top'>
            <div className='col-md-12 title'>
              <h3><Back />{'Interactive Leaderboard'}</h3>
            </div>
          </div>
          <div className='interactive-leader-board-content row'>
            <LeaderboardContent actions={this.props.actions} />
          </div>
        </div>
      </div>
    );
  }
}
/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
InteractiveLeaderBoard.propTypes = {
  actions: PropTypes.any
};
