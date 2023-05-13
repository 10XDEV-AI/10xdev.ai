import React,{ useState,useEffect} from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import Welcome from "../Welcome"

const LoadingRing = () => {
  const [isclicked, setisclicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating loading completion after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
  <div>
  {isclicked ? <div>
  <Welcome /> 
  {isLoading && (
            <div className="loading-popup">
              <p>Loading in progress...</p>
            </div>
          )}
  </div> :
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
    <button className='loading-cancel' onClick={
      () => {
        setisclicked(true);
      }
    } >
        Click the back button to 'Run in Background'
    </button>
    </div> 
    }
    </div>
    
  );
};

export default LoadingRing;
