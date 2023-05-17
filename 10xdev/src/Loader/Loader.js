import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';

const LoadingRing = () => {
  const navigate =useNavigate();
  const handleRunInBackGround = () => {
    navigate("/")
  }

  return (
  <div>
    <div className="loading-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div className ='logbox'>
        <LogViewer/>
    </div>
    <button className='loading-cancel' onClick={handleRunInBackGround} >
        Go Back / Run in Background
    </button>
  </div>
  );
};

export default LoadingRing;
