import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './LogViewer.css';
import { callAPI } from '../../api';
import { useContext } from 'react';
import SearchContext from '../../context/SearchContext';
import { navigate } from 'react-router-dom';

function LogViewer(props) {
  const [logs, setLogs] = useState('');
  const { isLoading, setIsLoading } = useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await callAPI('/api/logs');
        console.log(response);

        if (Array.isArray(response)&& response.length > 0) {
          let result = response.join(',\n');
          if (result === '' && props.RedirectTo) {
            setIsLoading(false);
          const currentUrl = window.location.href;
          const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'))+'/repos';
          window.location.href = newUrl;
          }
          result = result.replace(/,/g, ''); // remove commas
          result = result.replace(/"/g, ''); // remove double quotes
          result = splitRows(result); // split rows longer than 200 characters
          setLogs(result);
        } else {
          console.error('Invalid response format or missing body property');
          setIsLoading(false)
          console.log(props.RedirectTo)
          const currentUrl = window.location.href;
          const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'))+'/repos';
          window.location.href = newUrl;
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
      if (line.length > 100) {
        const chunks = line.match(/.{1,100}/g); // split line into chunks of 200 characters
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
