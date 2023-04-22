import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Sync from './Sync/Sync';
import ProjectInfo from './ProjectInfo/ProjectInfo';
function Navbar() {
  return (
    <nav>
      <div className="logo">
        10XDEV.AI
      </div>
      <div className="navbar-projectInfo">

      </div>
      <div className="linkscontainer">
      <div className="linkColumn">
        <div className="sync">

        </div>
        <Link className='NavLinks' to="/">Ask AI</Link>

      </div>
      </div>
    </nav>
  );
}

export default Navbar;