import Menubar from './Menubar';
import ResponseContainer from './ResponseContainer/ResponseContainer';
import UserPrompt from './UserPrompt/UserPrompt';
import './Main.css';
import SearchBar from './SearchBar/SearchBar';
import Navbar from './Navbar';
import { useState } from 'react';

function Main() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (input) => {
    setSearchInput(input);
    console.log(searchInput);
    const url = `http://127.0.0.1:5000/api/data?city=${searchInput}`;
    fetch(url)
      .then(response => response.json())
      .then(data => setSearchResults(data))
      .catch(error => console.log(error));
  }

  return (
    <div className="container">
      <Navbar/>
      <div className="UserPromptContainer">
              <UserPrompt searchInput={searchInput}/>
      </div>
      <div className="ResponseContainer">
            <ResponseContainer searchResults={searchResults}/>
      </div>
      <div className="searchbarrow">
        <SearchBar onSearch = {handleSearch}/>
      </div>
    </div>
  );
}

export default Main;