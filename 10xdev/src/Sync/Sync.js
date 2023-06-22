import React, { useState, useEffect, useContext, useCallback } from "react";
import "./Sync.css";
import LogViewer from "../Loader/LogViewer/LogViewer.js";
import { callAPI } from "../api";
import SearchContext from "../context/SearchContext";
import { FaFile } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';

function Sync(handleSyncClick) {
  const { showSync, setShowSync } = useContext(SearchContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const navigate = useNavigate();

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
        }, 2000);
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

  const handleSelectClick = async () => {
    navigate("/train")
  }

  return (
    <div className="h-full">
      <div className="text-2xl font-bold">
        {isSyncing ? (
          <div>
            Syncing...{" "}
            <span role="img" aria-label="Description of the emoji">
              ⌛️
            </span>
          </div>
        ) : showTick ? (
          <div className="">
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
      </div>
      {newFiles.length > 0 && (
        <div className="h-full">
          <div className="text-xl flex items-center justify-between">
                <h2 className="py-4">New files found:</h2>
                {newFiles.length > 0 && (
                <div className="flex">
                  <button
                    onClick={handleSyncNewClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-2 mx-2 rounded"
                  >
                    Sync New Files
                  </button>

                  <button
                    onClick={handleSelectClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-2 rounded"
                    >
                    Select Files to Ignore
                    </button>
                    </div>
                )}
              </div>
          <ul className="list-disc pl-8 ">
            {newFiles.map((file, index) => (
              <li key={index} className="flex">
                <FaFile className="m-1" size={20} color="black" /> {file}
              </li>
            ))}
          </ul>
        <div className="text-center text-sm">
          <LogViewer />
        </div>
        </div>
      )}
    </div>
  );
}

export default Sync;
