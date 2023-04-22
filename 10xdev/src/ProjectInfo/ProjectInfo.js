import React, { useState, useEffect, useContext } from 'react';
import SearchContext from '../context/SearchContext';

const ProjectInfo = () => {
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const {isLoadingProjectInfo, setIsLoadingProjectInfo} = useContext(SearchContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProjectInfo(true);
      const response = await fetch('http://127.0.0.1:5000/api/projectInfo');
      const data = await response.json();
      setRepository(data.repo_name);
      setBranch(data.branch_name);
      setIsLoadingProjectInfo(false);
    };
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, [setIsLoadingProjectInfo]);

  if (!isLoadingProjectInfo) {
  return (
    <div >
      Branch : '{branch}'      Project : '{repository}'
    </div>
  );
  } else {
  return
  }
}

export default ProjectInfo;