import React from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from "../context/SearchContext";
import { useContext } from "react";

const LoadingRing = () => {
  const {setIsLoading } = useContext(SearchContext);

  const handleCancel = () => {
    setIsLoading(false);
  };

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
    <button className ='loading-cancel' onCLick={handleCancel}>Run in Background</button>
    </div>
  );
};

export default LoadingRing;
