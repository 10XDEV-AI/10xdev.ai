import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Sync from './Sync/Sync';
function Navbar() {
  return (
    <nav>
      <div className="logo">
        10XDEV.AI
      </div>
      <div className="linkscontainer">
      <div className="linkColumn">
        <div className="sync">
            <Sync/>
        </div>
        <Link className='NavLinks' to="/welcome">Ask AI</Link>

      </div>
      </div>
    </nav>
  );
}

export default Navbar;
