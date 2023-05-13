import React, { useContext } from "react";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import ResponseContainer from "./ResponseContainer/ResponseContainer";
import UserPrompt from "./UserPrompt/UserPrompt";
import "./Chat.css";
import SearchBar from "./SearchBar/SearchBar";
import Navbar from "./Navbar";
import { useState, useEffect, useCallback} from "react";

export const Chat = () => {
  const { searchTerm, isLoading,results,setIsLoading,files } = useContext(SearchContext);

  const handleChildData = useCallback((data, index, input) => {
      setChatMessages((prevState) => {
        const updatedMessages = [...prevState]; // create a copy of prevState

        updatedMessages[index] = {
          prompt: (
            <UserPrompt
              indexval={updatedMessages.length -1 }
              searchTerm={input}
              onChildData={handleChildData}
              onRetry={(input) => {
              setIsLoading(true);
              setChatMessages((prevState) => prevState.slice(0, -1));
              handleSearch(input, index);
              }}
            />
          ),
          response: <ResponseContainer searchResults={data.response} files = {data.files} />,
        };
        return updatedMessages; // return the updated copy as the new state
      });
    },[setIsLoading]);

  const handleSearch = useCallback((input, index) => {
    setIsLoading(true);
    const url = `/api/data?prompt=${input}`;
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
                  setIsLoading(true);
                  setChatMessages((prevState) => prevState.slice(0, -1));
                  handleSearch(input, index);
                }}
              />
            ),
            response: <ResponseContainer searchResults={data.response} files = {data.files} />,
          },
        ]);
        setIsLoading(false); // move the statement here
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // and here
      });
  },[setIsLoading]);



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
                setIsLoading(true);
                setChatMessages((prevState) => prevState.slice(0, -1));
                handleSearch(input, 0);
              }}
            />
          ),
          response: <ResponseContainer searchResults={results} files={files} />,
        },
      ]);
    }, [results, searchTerm,files,handleChildData,handleSearch,setIsLoading]);

  const [chatMessages, setChatMessages] = useState([]);

  if (isLoading) {
    return <LoadingRing />;
  }
  return (
      <div className="container">
        <Navbar LoadSync = "" LoadProjectInfo = "True"/>
        {isLoading ? (
          <LoadingRing />
        ) : (
          <div>
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
        )}
      </div>
    );

};

export default Chat;
