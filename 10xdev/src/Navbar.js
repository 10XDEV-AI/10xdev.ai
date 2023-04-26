import React from 'react';
import './Navbar.css';
import Sync from './Sync/Sync';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropdownButton from './DropDownButton/DropDownButton';

function Navbar({LoadProjectInfo, LoadSync}) {
  return (
    <nav>
      <div className="logo">
        10XDEV.AI
      </div>
      <div className="navbar-projectInfo">
        <ProjectInfo />
      </div>
      <div className="linkscontainer">
      <div className="linkColumn">
        <DropdownButton />
        {LoadSync ? (
          <div className="sync">
            <Sync />
          </div>
        ) : null}
      </div>
      </div>
    </nav>
  );
}

export default Navbar;