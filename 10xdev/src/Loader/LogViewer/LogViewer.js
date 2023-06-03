import React, { useState, useEffect } from 'react';
import './LogViewer.css';
import { callAPI } from '../../api';

function LogViewer() {
  const [logs, setLogs] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await callAPI('/api/logs');
        console.log(response);

        if (Array.isArray(response)) {
          let result = response.join(',\n');
          result = result.replace(/,/g, ''); // add newline after each comma
          result = result.replace(/"/g, ''); // remove double quotes
          setLogs(result);
        } else {
          console.error('Invalid response format or missing body property');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    const interval = setInterval(fetchLogs, 3000);

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
