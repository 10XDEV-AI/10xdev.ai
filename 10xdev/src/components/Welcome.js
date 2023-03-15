import './Welcome.css';
import SearchBar from './SearchBar/SearchBar';
import { useState } from 'react';


function Welcome() {
  const [search, setSearch] = useState('');

  const handleSearch = (search) => {
    setSearch(search);
  }
 return (
    <div className="container">
      <div className="container">
        <div className="logoContainer">
            10XDEV.AI
        </div>
        <div className="subText">
            Ask an AI to implement new features in your app!
        </div>
        <div className="welcomesearchrow">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}

export default Welcome;