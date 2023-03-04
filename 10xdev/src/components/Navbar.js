import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <div className="logo">
        10xDEV.AI
      </div>
      <div className="search">
          <input type="text" placeholder="  What feature would you like to implement?" />
      </div>
      <div className="button">
        <button>Go!</button>
      </div>
    </nav>
  );
}

export default Navbar;
