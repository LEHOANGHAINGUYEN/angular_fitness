import React from 'react';
import PropTypes from 'prop-types';

import HomeIcon from './images/home-header.svg';
import './styles.scss';

export function Home(props) {
  const goHome = () => {
    props.actions.routing.navigateTo('/');
  };
  return (
    <div className='home-button' onClick={() => goHome()}>
      <img src={HomeIcon} />
    </div>
  );
}

Home.propTypes = {
  actions: PropTypes.any
};

export default Home;
