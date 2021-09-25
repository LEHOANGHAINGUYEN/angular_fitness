import React from 'react';

import './styles.scss';

export default function NotFound() {
  return (
    <div className='wrapper row2'>
      <div className='unauthorized-container page-content-inner'>
        <div className='container'>
          <section className='fof row'>
            <div className='hgroup clear'>
              <h1>{'401'}</h1>
              <h2>{'Error! '}<span>{'Unauthorized'}</span></h2>
            </div>
            <div className='row'>
              <div className='col-xs-12'>{'You dont have permission to access this page. Please contact the admin to get more infomations.'}</div>
            </div>
            <p><a href='/#'>{'Go Home &raquo;'}</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
