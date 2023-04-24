import React from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';

const LoadingRing = () => {
  return (
  <div>
    <div className="loading-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div className ='logbox'>      <LogViewer /> </div>
    </div>
  );
};

export default LoadingRing;
