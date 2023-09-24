import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { callAPI } from '../../api';
import { useContext } from 'react';
import SearchContext from '../../context/SearchContext';
import { navigate } from 'react-router-dom';

function LogViewer(props) {
  const [logs, setLogs] = useState('');
  const [percentage, setPercentage] = useState("");
  const [time, setTime] = useState("");
  const { isLoading, setIsLoading } = useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await callAPI('/api/logs');
        console.log('Logs' + response.logs);
        setPercentage(response.percentage);
        console.log('Perc'+response.percentage);
        setTime(response.time);
        console.log('Time '+response.time);

        if (Array.isArray(response.logs)) {
          let result = response.logs.join(',\n');
          console.log(result)
          if (result === '' && props.RedirectTo) {
            setIsLoading(false);
            navigate(props.RedirectTo);
          }
          result = result.replace(/,/g, ''); // remove commas
          result = result.replace(/"/g, ''); // remove double quotes
          result = splitRows(result); // split rows longer than 200 characters
          setLogs(result);
        } else {
          setIsLoading(false)
          console.log(props.RedirectTo)
          if (props.RedirectTo) {
          const currentUrl = window.location.href;
          navigate('/erorr');
          }
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
    <div className="w-full">
      <div className="log-col-2 ">
        <pre className="font-sans font-semibold text-lg">
            {logs}
        </pre>
        {time&&percentage&&
        <div className="w-1/2 mx-auto pt-6">
            <div class="flex justify-between mb-1">
              <span class="text-base font-medium text-blue-700">Time Elapsed :  {time} minutes</span>
              <span class="text-sm font-medium text-blue-700">{percentage}%</span>
            </div>
            <div class="w-full bg-gray-300 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }} ></div>
            </div>
          </div>
          }
      </div>

    </div>
  );
}

export default LogViewer;
