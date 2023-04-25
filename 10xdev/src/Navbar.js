import React from 'react';
import './Navbar.css';
import Sync from './Sync/Sync';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropdownButton from './DropDownButton/DropDownButton';
function Navbar() {
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
        <div className="sync">
            <Sync />
        </div>
        <DropdownButton/>
      </div>
      </div>
    </nav>
  );
}

export default Navbar;