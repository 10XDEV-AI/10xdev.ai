import React,{ useState,useContext} from 'react';
import './Loader.css';
import LogViewer from './LogViewer/LogViewer';
import Welcome from "../Welcome"
import SearchContext from "../context/SearchContext";
import CoolAlert from "./CoolAlert/CoolAlert";
const LoadingRing = () => {
  const [isclicked, setisclicked] = useState(false);
  const setclicked=()=>{setisclicked(!isclicked);};
  const loading = useContext(SearchContext);
  return (
  <div>
  {isclicked ? <div>
  {loading.isLoading ? <>
    <CoolAlert message="Training in progress..." setclicked={setclicked} />
  </>:null}
  <Welcome /> 
  
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
