import React, { useState, useEffect, useCallback } from "react";
import "./Sync.css";
import LogViewer from "../Loader/LogViewer/LogViewer.js";
import { callAPI } from "../api";

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

  const syncData = useCallback(async () => {
    if (isRequestInProgress) {
      return; // Do not make API call if isRequestInProgress is true
    }

    setIsSyncing(true);
    setShowWarning(false);

    try {
        const data = await callAPI("/api/sync?sync_new=false", {
        method: "GET",
        });
        console.log(data);
        if (data.message === "NEW") {
          setShowTick(false);
          setIsSyncing(false);
          setShowWarning(true);
          setNewFiles(data.files);
        } else if (data.message === "DONE") {
          setIsSyncing(false);
          setShowTick(true);
          setNewFiles([]);
        }
    } catch (error) {
      setShowWarning(true);
    }
  }, [isRequestInProgress]);

  useEffect(() => {
    // call syncData initially
    syncData();

    // call syncData every 60 seconds
    const intervalId = setInterval(syncData, 600000);

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isRequestInProgress, syncData]); // Include isRequestInProgress as a dependency in the dependency array

  const handleSyncNewClick = async () => {
    if (!isRequestInProgress) {
      setIsRequestInProgress(true);
      setIsSyncing(true);
      setShowWarning(false);

      try {
        const data = await callAPI("/api/sync?sync_new=true", {
          method: "GET",
        });

        console.log(data);

          if (data.message === "DONE") {
            setShowWarning(false);
            setShowTick(true);
            setNewFiles([]);
          } else if (data.message === "NEW") {
            setShowTick(false);
            setIsSyncing(false);
            setShowWarning(true);
            setNewFiles(data.files);
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
                Sync ⌛️
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
            <div >
                <h1>📁</h1>
                <h2>
                New files found
                </h2>
                <p>
                Add new files to the .AIIgnore file to ignore them.
                </p>
                <p>Click on "Sync New Files" if you want the AI to analyze these files.
                </p>
                <div className="new-files-container">
                <ul className="popup-container-bullet">
                    {newFiles.map((file, index) => (
                    <li key={index}>{file}</li>
                ))}
                </ul>
                </div>
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
