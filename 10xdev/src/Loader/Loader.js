import React from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from "../context/SearchContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const LoadingRing = () => {
  return (
  <div>
    <div className="loading-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div className ='logbox'>
        <LogViewer />
    </div>
    <button className='loading-cancel'>
        Click the back button to 'Run in Background'
    </button>
    </div>
  );
};

export default LoadingRing;
