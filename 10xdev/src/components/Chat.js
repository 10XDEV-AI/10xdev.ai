import ResponseContainer from "./ResponseContainer/ResponseContainer";
import UserPrompt from "./UserPrompt/UserPrompt";
import "./Chat.css";
import SearchBar from "./SearchBar/SearchBar";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Chat() {
  const location = useLocation();
  const searchInput = location.state.searchInput;
  // eslint-disable-next-line no-unused-vars
  const [searchResults, setSearchResults] = useState({});
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    //find errors in this useEffect which causing api call to be made twice
    const fetchData = async () => {
      try {
        //check for searchinput to uniquely identify the first search
        const response = await fetch(
          `http://127.0.0.1:5000/api/data?prompt=${searchInput}`
        );
        const data = await response.json();
        console.log(data);
        setChatMessages([
          {
            index: 0,
            prompt: (
              <UserPrompt
                indexval={0}
                searchInput={searchInput}
                onChildData={handleChildData}
                onRetry={(input) => {
                  setChatMessages((prevState) => prevState.slice(0, -1));
                  handleSearch(input, 0);
                }}
              />
            ),
            response: <ResponseContainer searchResults={data} />,
          },
        ]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleSearch = (input, index) => {
    const url = `http://127.0.0.1:5000/api/data?prompt=${input}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults((prevState) => ({ ...prevState, [index]: data }));
        // add the search results to chatMessages
        setChatMessages((prevState) => [
          ...prevState,
          {
            prompt: (
              <UserPrompt
                indexval={prevState.length -1 }
                searchInput={input}
                onChildData={handleChildData}
                onRetry={(input) => {
                  setChatMessages((prevState) => prevState.slice(0, -1));
                  handleSearch(input, index);
                }}
              />
            ),
            response: <ResponseContainer searchResults={data} />,
          },
        ]);
      })
      .catch((error) => console.log(error));
  };
  const handleChildData = (data, index, input) => {
    setSearchResults((prevState) => ({ ...prevState, [index]: data }));
    
    setChatMessages((prevState) => {
      console.log(prevState);
      const updatedMessages = [...prevState]; // create a copy of prevState

      updatedMessages[index] = {
        prompt: (
          <UserPrompt
            indexval={updatedMessages.length -1 }
            searchInput={input}
            onChildData={handleChildData}
            onRetry={(input) => {
              setChatMessages((prevState) => prevState.slice(0, -1));
              handleSearch(input, index);
            }}
          />
        ),
        response: <ResponseContainer searchResults={data} />,
      };
      return updatedMessages; // return the updated copy as the new state
    });
  };

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
        <div className="footer"></div>
        <div className="searchbarrow">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
