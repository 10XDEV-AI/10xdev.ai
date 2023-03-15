import Menubar from './Menubar';
import ResponseContainer from './ResponseContainer/ResponseContainer';
import UserPrompt from './UserPrompt/UserPrompt';
import './Train.css';
import SearchBar from './SearchBar/SearchBar';
import Navbar from './Navbar';
import { useState } from 'react';


function Main() {
  const [searchInputs, setSearchInputs] = useState({});
  const [searchResults, setSearchResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

const handleSearch = (input, index) => {
  setSearchInputs(prevState => ({...prevState, [index]: input}));
  const url = `http://127.0.0.1:5000/api/data?city=${input}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      setSearchResults(prevState => ({...prevState, [index]: data}))
      // add the search results to chatMessages
      setChatMessages(prevState => [...prevState, {
        prompt: <UserPrompt searchInput={input} onRetry={(input) => handleSearch(input, index)} />,
        response: <ResponseContainer searchResults={data} />
      }])
    })
    .catch(error => console.log(error));
}

  return (
    <div className="container">
      <div className="container">
        <Navbar />
        <div className="chat-container">
          {chatMessages.map((chatMessage, index) => (
            <div key={index}>
              {chatMessage.prompt}
              {chatMessage.response}
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