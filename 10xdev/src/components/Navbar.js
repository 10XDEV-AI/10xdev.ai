import React from 'react';
import './Navbar.css';
import SearchBar from './SearchBar/SearchBar';

function Navbar() {
  return (
    <nav>
      <div className="logo">
        10xDEV.AI
      </div>
      <div className="searchbarcol">
          <SearchBar />
      </div>
    </nav>
  );
}

export default Navbar;
