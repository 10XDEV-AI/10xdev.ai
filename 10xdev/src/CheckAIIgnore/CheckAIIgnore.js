import React, { useState, useEffect } from 'react';
import { callAPI } from '../api';

function CheckAIIgnore({ path }) {
  const [ignoreExists, setIgnoreExists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await callAPI(`/api/CheckAIIgnore?path=${encodeURIComponent(path)}`);
        setIgnoreExists(data.AIIgnore);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [path]);

  if (ignoreExists === null) {
    return <div>⏳Checking if '.AIIgnore' file exists...</div>;
  } else if (ignoreExists) {
    return <div>AIIgnore file exists ✅</div>;
  } else {
    return <div>Info ⚠️: AIIgnore file does not exist</div>;
  }
}

export default CheckAIIgnore;
