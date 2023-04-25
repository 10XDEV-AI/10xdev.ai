import React, { useState, useEffect } from "react";
import "./Sync.css";
import LogViewer from "../Loader/LogViewer/LogViewer.js"
function Sync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State variable to track whether to show the popup


   // Event handler for when the user hovers over an item
    const handleMouseOver = () => {
      setShowPopup(true);
    };

    // Event handler for when the user stops hovering over an item
    const handleMouseLeave = () => {
      setShowPopup(false);
    };
  const syncData = async () => {
      if (isRequestInProgress) {
        return; // Do not make API call if isRequestInProgress is true
      }

      setIsSyncing(true);
      setShowWarning(false);

      // make API call to http://127.0.0.1:5000/api/sync and wait for response
      console.log("syncing with false");
      const response = await fetch("http://127.0.0.1:5000/api/sync?sync_new=false");

      if (response.status === 200) {
        const result = await response.json();
        console.log("synced with false");
        console.log(result.message);
        if (result.message === "NEW") {
          setShowTick(false);
          setIsSyncing(false);
          setShowWarning(true);
          setNewFiles(result.files);
        } else if (result.message === "DONE") {
          setIsSyncing(false);
          setShowTick(true);
          setNewFiles([]);
        }
      } else {
        setShowWarning(true);
      }
    };

  useEffect(() => {

    // call syncData initially
    syncData();

    // call syncData every 60 seconds
    const intervalId = setInterval(syncData, 60000);

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isRequestInProgress]); // Include isRequestInProgress as a dependency in the dependency array




const handleSyncNewClick = async () => {
  if (!isRequestInProgress) {
    setIsRequestInProgress(true);
    setIsSyncing(true);
    setShowWarning(false);

    try {
      // Make API call to http://127.0.0.1:5000/api/sync and wait for response
      console.log("syncing with true");
      const response = await fetch("http://127.0.0.1:5000/api/sync?sync_new=true");
      const result = await response.json();
      console.log("synced with true");
      console.log(result.message);
      console.log(result.files);

      if (response.status === 200 && result.message === "DONE") {
        setShowWarning(false);
        setShowTick(true);
        setNewFiles([]);
      } else if (result.message === "NEW") {
        setShowTick(false);
        setIsSyncing(false);
        setShowWarning(true);
        setNewFiles(result.files);
      } else {
        setShowWarning(true);
      }
    } catch (error) {
      setShowWarning(true);
    }

    setIsRequestInProgress(false);
    setIsSyncing(false);
  }
};

  return (
  <div>
    <div onMouseLeave={handleMouseLeave}>

      {isSyncing ? (
        <div>
        <div className="sync-container">
            <button className="sync-button" onClick={syncData} disabled={isSyncing} onMouseOver={handleMouseOver} >
                Sync ⏳
              </button>
        </div>
          {showPopup &&(
            <div className="popup-container">
            <h1> ⚒️</h1>
            Syncing...
            <LogViewer />
            </div>
            )}
        </div>
      ) : showTick ? (
        <div>
          <div className="sync-container">
            <button className="sync-button" onClick={syncData} disabled={isSyncing} onMouseOver={handleMouseOver} >
                Sync ✅
            </button>
          </div>
          {showPopup &&
              <div className="popup-container">
              <h1>👍🏻</h1>
                 All files synced successfully
              </div>
          }
        </div>
      ) : showWarning ? (
        <div>
            <div className="sync-container">
             <button className="sync-button" onClick={syncData} disabled={isSyncing} onMouseOver={handleMouseOver} >
              Sync ⚠️
             </button>
            </div>
        {newFiles.length > 0 && showPopup && (
        <div className="popup-container">
            <div className="new-files-list">
                <ul className="popup-container-bullet">
                    {newFiles.map((file, index) => (
                    <li key={index}>{file}</li>
                ))}
                </ul>
            </div>
            <button className="PopUpbutton" onClick={syncData} disabled={isSyncing}>
                Refresh
            </button>
            <button
              className="PopUpbutton"
              onClick={handleSyncNewClick}
              disabled={isSyncing}
            >
              Sync New Files
            </button>
        </div>
        )}
      </div>
    ) : (
      <span className="cross-icon" aria-label="cross" role="img">
        ❌
      </span>
    )}

    </div>
  </div>
);
}

export default Sync;
