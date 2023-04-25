import React, { useState, useEffect } from "react";
import "./Sync.css";
import LogViewer from "../Loader/LogViewer/LogViewer.js"

function Sync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [intervalValue, setIntervalValue] = useState(6000);

  useEffect(() => {
    const syncData = async () => {
      setIsSyncing(true);
      setShowWarning(false);

      // make API call to http://127.0.0.1:5000/api/sync and wait for response
      console.log("syncing with false")
      const response = await fetch("http://127.0.0.1:5000/api/sync?sync_new=false");

      if (response.status === 200) {
        const result = await response.json();
        console.log("synced with false")
        console.log(result.message)
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

    // call syncData initially
    syncData();

    // call syncData every 60 seconds
    const intervalId = setInterval(syncData, 60000);

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  const handleSyncNewClick = async () => {
    setIsSyncing(true);
    setShowWarning(false);

    //make api call to http://127.0.0.1:5000/api/sync and wait for response
    console.log("syncing with true")
    const response = await fetch("http://127.0.0.1:5000/api/sync?sync_new=true");
    console.log("synced with true")
    console.log(response.message)
    console.log(response.files)
    if (response.status === 200) {
      setShowWarning(false);
      setShowTick(true);
      setNewFiles([]);
    } else {
      setShowWarning(true);
    }

    setIsSyncing(false);
  };

  return (
    <div className="sync-container">
    <p>
    isSyncing: {isSyncing.toString()}
    showTick: {showTick.toString()}
    showWarning: {showWarning.toString()}
    </p>
      {isSyncing ? (
      <div>
        <span className="refresh-icon" aria-label="refresh" role="img">
          ⏳
        </span>
        <LogViewer />
      </div>
      ) : showTick ? (
        <span className="tick-icon" aria-label="tick" role="img">
          ✅
        </span>
      ) : showWarning? (
          <div>
            <button className="sync-new-button" onClick={handleSyncNewClick}>
              Sync New Files
            </button>
            <span className="warning-icon" aria-label="warning" role="img">
                ⚠️
            </span>
          </div>
      ) :
      (
        <span className="cross-icon" aria-label="cross" role="img">
        ❌
        </span>
      )
      }



      {newFiles.length > 0 && (
        <div className="new-files-list">
          <ul>
            {newFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sync;
