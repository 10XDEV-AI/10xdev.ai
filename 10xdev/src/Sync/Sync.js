import React, { useState, useEffect, useCallback } from "react";
import "./Sync.css";
import LogViewer from "../Loader/LogViewer/LogViewer.js";
import { callAPI } from "../api";

function Sync(setShowSync){
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
      <div className="h-full">
        <div className="text-2xl" >
          {isSyncing ? (
            <div>
              Syncing... <span role="img" aria-label="Description of the emoji">⌛️</span>
            </div>
          ) : showTick ? (
            <div className="right-0 bottom-0">
              All files synced successfully <span role="img" aria-label="Description of the emoji">✅</span>
              <button className="px-4 bg-blue-900 text-white rounded ml-auto hover:bg-blue-600" onClick={() => setShowSync(false)}>
                  Ok
              </button>
            </div>
          ) : showWarning ? (
            <div>
              <span role="img" aria-label="Description of the emoji">⚠️</span> Warning:
            </div>
          ) : (
            <div>Sync status unknown <span role="img" aria-label="Description of the emoji">❌</span></div>
          )}
          <div className="text-center">
          <LogViewer />
          </div>
        </div>
        {newFiles.length > 0 && (
          <div className="h-full">
                      <h2 className="text-xl py-4">New files found:</h2>
                                           <ul className="list-disc pl-8">
                                                                                        {newFiles.map((file, index) => (
                                                                                          <li key={index}>{file}</li>
                                                                                        ))}
                                                                                      </ul>
                                                                                      <div className="flex">
                                                                                          <button onClick={handleSyncNewClick}
                                                                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded right-0 bottom-0" >
                                                                                            Sync New Files
                                                                                          </button>
                                                                                      </div>
                    </div>
        )}
      </div>
  );
}

export default Sync;