import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './loading.css';

export default function Loading(props) {
  return (
    <div className="loading-shading-mui" style={{...props}}>
      <CircularProgress className="loading-icon-mui" />
    </div>
  );
}
