import React, { useContext } from "react";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import ResponseContainer from "./ResponseContainer/ResponseContainer";
import UserPrompt from "./UserPrompt/UserPrompt";
import "./Chat.css";
import SearchBar from "./SearchBar/SearchBar";
import Navbar from "./Navbar";
import { useState, useEffect,useLocation } from "react";

export const Chat = () => {
  const { searchTerm, isLoading,results } = useContext(SearchContext);
  console.log("results",results);

  const handleSearch = (input, index) => {
      const url = `http://127.0.0.1:5000/api/data?prompt=${input}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setChatMessages((prevState) => [
            ...prevState,
            {
              prompt: (
                <UserPrompt
                  indexval={prevState.length}
                  searchTerm={input}
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
    setChatMessages((prevState) => {
      const updatedMessages = [...prevState]; // create a copy of prevState

      updatedMessages[index] = {
        prompt: (
          <UserPrompt
            indexval={updatedMessages.length -1 }
            searchTerm={input}
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

  useEffect(() => {
      setChatMessages([
        {
          index: 0,
          prompt: (
            <UserPrompt
              indexval={0}
              searchTerm={searchTerm}
              onChildData={handleChildData}
              onRetry={(input) => {
                setChatMessages((prevState) => prevState.slice(0, -1));
                handleSearch(input, 0);
              }}
            />
          ),
          response: <ResponseContainer searchResults={results} />,
        },
      ]);
    }, [results, searchTerm]);

  const [chatMessages, setChatMessages] = useState([]);
  const data = results;

  if (isLoading) {
    return <LoadingRing />;
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
            <div className="footer"></div>
            <div className="searchbarrow">
              <SearchBar onSearch ={handleSearch} />
            </div>
          </div>
        </div>
  );
};

export default Chat;
