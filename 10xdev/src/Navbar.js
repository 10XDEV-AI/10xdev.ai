import React from 'react';
import './Navbar.css';
import Sync from './Sync/Sync';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropdownButton from './DropDownButton/DropDownButton';
import { Link } from 'react-router-dom';

function Navbar({LoadProjectInfo, LoadSync}) {
  return (
    <nav className="navbar-chat">
      <div className="logo">
        <Link to="/welcome">
          10XDEV.AI
        </Link>
      </div>
      <div className="navbar-projectInfo">
        {LoadProjectInfo?(
        <ProjectInfo />
        ):null}
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