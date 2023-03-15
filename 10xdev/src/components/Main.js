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

  const chatMessages = [
      {
        type: 'prompt',
        message: <UserPrompt searchInput={searchInput} onRetry={handleSearch} />
      },
      {
        type: 'response',
        message: <ResponseContainer searchResults={searchResults} />
      },
      {
        type: 'prompt',
        message: <UserPrompt searchInput={searchInput} onRetry={handleSearch} />
      },
      // Add more messages as needed
    ];

  return (
    <div className="container">
      <div className="container">
        <Navbar />
        <div className="chat-container">
          {chatMessages.map((chatMessage, index) => (
            <div key={index} className={chatMessage.type}>
              {chatMessage.message}
            </div>
          ))}
        </div>
        <div className="searchbarrow">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}

export default Main;