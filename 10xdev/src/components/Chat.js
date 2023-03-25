import ResponseContainer from './ResponseContainer/ResponseContainer';
import UserPrompt from './UserPrompt/UserPrompt';
import './Chat.css';
import SearchBar from './SearchBar/SearchBar';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function Chat() {
  const location = useLocation();
  const searchInput = location.state.searchInput;
  const [searchResults, setSearchResults] = useState({});
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/data?prompt=${searchInput}`);
      const data = await response.json();
      console.log(data);
      setChatMessages([{
        index: 0,
        prompt: <UserPrompt searchInput={searchInput} onRetry={(input) => handleRetry(input, 0)} />,
        response: <ResponseContainer searchResults={data} />
        }])
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
}, [searchInput]);

  const handleSearch = (input, index) => {
      const url = `http://127.0.0.1:5000/api/data?prompt=${input}`;
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


  const handleRetry= (input, index) => {
      const url = `http://127.0.0.1:5000/api/data?city=${input}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setChatMessages(prevState => {
                  const updatedMessages = [...prevState]; // create a copy of prevState
                  updatedMessages[index] = {
                    prompt: <UserPrompt searchInput={input} onRetry={(input) => handleSearch(input, index)} />,
                    response: <ResponseContainer searchResults={data} />
                  }
                  return updatedMessages; // return the updated copy as the new state
                })
          console.log("retry");
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
        <div className="spacer">
            {/* This is a spacer div that adds empty space at the bottom */}
        </div>
        <div className="footer">
        </div>
        <div className="searchbarrow">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}

export default Chat;