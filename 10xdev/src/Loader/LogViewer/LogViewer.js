import React, { useState, useEffect } from 'react';
import './LogViewer.css';

function LogViewer() {
  const [logs, setLogs] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('/api/logs');
      const reader = response.body.getReader();
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder('utf-8').decode(value);
      }
      result = result.replace(/,/g, ',\n'); // add newline after each comma
      result = result.slice(1, -2); // remove first and last square brackets
      setLogs(result);
    };


    const interval = setInterval(() => {
      fetchLogs();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
      <div className="logs">
        <div className="log-col-2">
            <pre>{logs}</pre>
        </div>
      </div>
  );
}

export default LogViewer;
