import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <div className="logo">
        10XDEV.AI
      </div>
      <div className="linkscontainer">
      <div className="linkColumn">
        <Link className='NavLinks' to="/welcome">Train AI</Link>
        <Link className='NavLinks' to="/">Ask AI</Link>
      </div>
      </div>
    </nav>
  );
}

export default Navbar;
