import React from 'react';

import './styles.scss';

export default function NotFound() {
  return (
    <div className='wrapper row2'>
      <div className='container-404 page-content-inner'>
        <div className='container'>
          <section className='fof row'>
            <div className='hgroup clear'>
              <h1>{'404'}</h1>
              <h2>{'Error ! '}<span>{'Page Not Found'}</span></h2>
            </div>
            <div className='row'>
              <div className='col-xs-12'>{'The page you requested could not be found on our server'}</div>
            </div>
            <p><a href='/#'>{'Go Home &raquo;'}</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
