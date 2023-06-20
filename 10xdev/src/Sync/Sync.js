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
    const intervalId = setInterval(syncData, 6000000);

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isRequestInProgress, syncData]);

  // Include isRequestInProgress as a dependency in the dependency array
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
      <div className="sync-container ">
        <div className="sync-status-container" >
          {isSyncing ? (
            <div>
              Syncing... <span role="img" aria-label="Description of the emoji">⌛️</span>
            </div>
          ) : showTick ? (
            <div>
              All files synced successfully <span role="img" aria-label="Description of the emoji">✅</span>
            </div>
          ) : showWarning ? (
            <div>
              <span role="img" aria-label="Description of the emoji">⚠️</span> Warning: Error syncing files
            </div>
          ) : (
            <div>Sync status unknown <span role="img" aria-label="Description of the emoji">❌</span></div>
          )}
          <LogViewer />
        </div>
        {newFiles.length > 0 && (
          <div className="new-files-container">
            <h2>New files found:</h2>
            <ul>
              {newFiles.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
            <button onClick={handleSyncNewClick}>Sync New Files</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sync;