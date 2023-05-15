import React, { useState, useEffect, useContext } from 'react';
import SearchContext from '../context/SearchContext';

const ProjectInfo = () => {
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const {isLoadingProjectInfo, setIsLoadingProjectInfo} = useContext(SearchContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProjectInfo(true);
      const response = await fetch('/api/projectInfo');
      const data = await response.json();
      setRepository(data.repo_name);
      setBranch(data.branch_name);
      setIsLoadingProjectInfo(false);
    };
    fetchData();
  }, [setIsLoadingProjectInfo]);

  if (!isLoadingProjectInfo) {
  return (
    <div >
        Project : <b> {repository}  </b>  Branch : <b> {branch} </b>
    </div>
  );
  } else {
  return
  }
}

export default ProjectInfo;