import React from 'react';
import PropTypes from 'prop-types';

import './panel.scss';

export default function PanelContainer({ leftPanel, rightPanel }) {
  const dataToggle = () => {
    const isExpand = $('.left-container').hasClass('col-sm-5 col-md-4 col-lg-3');
    if (isExpand) {
      $('.left-container').addClass('hiden-left-container').removeClass('col-sm-5 col-md-4 col-lg-3');
      $('.right-container').addClass('hiden-right-container').removeClass('col-sm-7 col-md-8 col-lg-9');
      $('.icon').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
    }
    else {
      $('.left-container').addClass('col-sm-5 col-md-4 col-lg-3').removeClass('hiden-left-container');
      $('.right-container').addClass('col-sm-7 col-md-8 col-lg-9').removeClass('hiden-right-container');
      $('.icon').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right');
    }
  };
  return (
    <div className='separate-container'>
      <div className='left-container col-sm-5 col-md-4 col-lg-3 custom-scrollbar'>
        <div className='tag-div'>
          <div className='toggle'>
            <button
              type='button'
              className='btn-icon'
              onClick={dataToggle} >
              <span className='icon glyphicon glyphicon-chevron-left' />
            </button>
          </div>
        </div>
        {leftPanel}
      </div>
      <div className='right-container col-sm-7 col-md-8 col-lg-9'>
        {rightPanel}
      </div>
    </div>
  );
}
PanelContainer.propTypes = {
  leftPanel: PropTypes.any,
  rightPanel: PropTypes.any
};
