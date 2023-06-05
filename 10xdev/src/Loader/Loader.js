import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import React from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from "../context/SearchContext";

const LoadingRing = () => {

  const {setIsLoading } = useContext(SearchContext);
  const navigate =useNavigate();
  const handleRunInBackGround = () => {
    setIsLoading(false);
    navigate("/welcome")
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
