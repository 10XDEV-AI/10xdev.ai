import React from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from "../context/SearchContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const LoadingRing = () => {
  const {setIsLoading } = useContext(SearchContext);

  const navigate = useNavigate();

  const handleCancel = () => {
    console.log("Cancel button clicked");
    setIsLoading(false);
    navigate("/"); // navigate to home page
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
