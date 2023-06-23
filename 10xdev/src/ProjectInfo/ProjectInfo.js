import React from 'react';

const ProjectInfo = ({isLoadingProjectInfo,repository,branch}) => {
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
