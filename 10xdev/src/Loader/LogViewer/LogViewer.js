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
          result = result.replace(/,/g, ''); // remove commas
          result = result.replace(/"/g, ''); // remove double quotes
          result = splitRows(result); // split rows longer than 200 characters
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

  const splitRows = (logs) => {
    const lines = logs.split('\n');
    const result = lines.map((line) => {
      if (line.length > 200) {
        const chunks = line.match(/.{1,200}/g); // split line into chunks of 200 characters
        return chunks.join('\n');
      }
      return line;
    });
    return result.join('\n');
  };

  return (
    <div className="logs">
      <div className="log-col-2">
        <pre>{logs}</pre>
      </div>
    </div>
  );
}

export default LogViewer;
