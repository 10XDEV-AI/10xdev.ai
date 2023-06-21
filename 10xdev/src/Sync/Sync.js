import React, { useState, useEffect, useContext, useCallback } from "react";
import "./Sync.css";
import LogViewer from "../Loader/LogViewer/LogViewer.js";
import { callAPI } from "../api";
import SearchContext from "../context/SearchContext";

function Sync(handleSyncClick) {
  const { showSync, setShowSync } = useContext(SearchContext);
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
        setTimeout(() => {
          setShowSync(false);
        }, 1000); // Set showSync to false after 5 seconds
      }
    } catch (error) {
      setShowWarning(true);
    }
  }, [isRequestInProgress, setShowSync]);

  useEffect(() => {
    syncData();
  }, [isRequestInProgress, syncData]);

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
          setTimeout(() => {
            setShowSync(false);
          }, 5000); // Set showSync to false after 5 seconds
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
      <div className="text-2xl h-full">
        {isSyncing ? (
          <div>
            Syncing...{" "}
            <span role="img" aria-label="Description of the emoji">
              ⌛️
            </span>
          </div>
        ) : showTick ? (
          <div className="h-full">
            <div className="flex">
                  All files synced successfully {" "}
                  <span role="img" aria-label="Description of the emoji">
                    ✅
                  </span>

            </div>
          </div>
        ) : showWarning ? (
          <div>
            <span role="img" aria-label="Description of the emoji">
              ⚠️
            </span>{" "}
            Warning:
          </div>
        ) : (
          <div>
            Sync status unknown{" "}
            <span role="img" aria-label="Description of the emoji">
              ❌
            </span>
          </div>
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
            <button
              onClick={handleSyncNewClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded right-0 bottom-0 "
            >
              Sync New Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sync;
