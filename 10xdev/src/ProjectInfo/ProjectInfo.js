import React, { useState, useEffect, useContext } from 'react';
import SearchContext from '../context/SearchContext';
import { callAPI } from '../api';
import Cookies from 'js-cookie';

const ProjectInfo = () => {
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const { isLoadingProjectInfo, setIsLoadingProjectInfo } = useContext(SearchContext);

  useEffect(() => {
    const fetchData = async () => {
    const cognitoCode = Cookies.get("cognitoCode");
    if(cognitoCode) {
           setIsLoadingProjectInfo(true);
           const data = await callAPI('/api/projectInfo');
           setRepository(data.repo_name);
           setBranch(data.branch_name);
           setIsLoadingProjectInfo(false);
           }
    };

    fetchData();
  }, [setIsLoadingProjectInfo]);

  if (!isLoadingProjectInfo) {
    return (
      <div>
        Project: <b className="mr-3"> {repository}</b> Branch: <b>{branch}</b>
      </div>
    );
  } else {
    return null; // Return null or loading spinner while loading
  }
};

export default ProjectInfo;
