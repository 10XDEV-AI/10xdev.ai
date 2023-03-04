import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <div className="logo">
        10xDEV.AI
      </div>
      <div className="search">
          <input type="text" placeholder="Search" />
          <button>Go!</button>
      </div>
    </nav>
  );
}

export default Navbar;
