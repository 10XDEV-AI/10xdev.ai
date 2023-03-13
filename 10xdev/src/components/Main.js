import Menubar from './Menubar';
import CodeTab from './CodeTab';
import './Main.css';
import SearchBar from './SearchBar/SearchBar';
import Navbar from './Navbar';
import { useState } from 'react';

function Main() {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (searchInput) => {
    const url = `http://127.0.0.1:5000/api/data?city=${searchInput}`;
    fetch(url)
      .then(response => response.json())
      .then(data => setSearchResults(data))
      .catch(error => console.log(error));
  }

  return (
    <div className="container">
      <Navbar/>
      <div className="row1">
        <CodeTab/>
      </div>
      <div className="searchbarrow">
        <SearchBar onSearch={handleSearch}/>
      </div>
      <div className="searchResults">
        <h1>Search Results :</h1>
        {searchResults && (
          <div>
            <p>Name: {searchResults.name}</p>
            <p>Age: {searchResults.age}</p>
            <p>City: {searchResults.city}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;