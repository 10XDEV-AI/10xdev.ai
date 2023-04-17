import React, { useState, useEffect } from "react";
import "./Sync.css";

function Sync() {
  const [isSyncing, setIsSyncing] = useState(true);
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const syncData = async () => {

      setIsSyncing(true);
      // simulate an async data sync
      await new Promise((resolve) => setTimeout(resolve, 300));
      //make api call to http://127.0.0.1:5000/api/sync and wait for response
      await fetch("http://127.0.0.1:5000/api/sync");

      setIsSyncing(false);
      setShowTick(true);
    };

    // call syncData initially
    syncData();

    // call syncData every 60 seconds
    const intervalId = setInterval(syncData, 600000);

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sync-container">
      {isSyncing ? (
        <span className="refresh-icon" aria-label="refresh" role="img">
          ⏳
        </span>
      ) : showTick ? (
        <span className="tick-icon" aria-label="tick" role="img">
          ✅
        </span>
      ) : null}
    </div>
  );
}

export default Sync;
