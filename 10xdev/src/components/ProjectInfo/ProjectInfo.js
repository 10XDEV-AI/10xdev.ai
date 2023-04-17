import React, { useState, useEffect } from 'react';

const ProjectInfo = () => {
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/projectInfo');
      const data = await response.json();
      setRepository(data.repo_name);
      setBranch(data.branch_name);
      console.log(data);
      console.log('Updated branch:', data.branch_name);
    };

    fetchData(); // Call initially when the component mounts

    const interval = setInterval(() => {
      fetchData(); // Call every 60 seconds
    }, 60000);

    return () => clearInterval(interval); // Clean up interval when component unmounts
  }, []);

  return (
    <div >
      🌿 On Branch : '{branch}'      📦 In Project : '{repository}'
    </div>
  );
};

export default ProjectInfo;
