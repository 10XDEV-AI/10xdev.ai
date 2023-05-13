import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import SearchContext from "../context/SearchContext";


const LoadingRing = () => {
  const {setIsLoading}  = useContext(SearchContext);
  const navigate = useNavigate();

  const handleBackground = async() => {
  setIsLoading(false);
  navigate('/')
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
    <button className='loading-cancel' onClick ={handleBackground}>
        Click the back button to 'Run in Background'
    </button>
    </div>
  );
};

export default LoadingRing;
