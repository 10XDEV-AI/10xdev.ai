import React, { useContext, useState } from "react";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/LoaderwithoutRunInBag";
import ResponseContainer from "./ResponseContainer/ResponseContainer";
import UserPrompt from "./UserPrompt/UserPrompt";
import "./Chat.css";
import SearchBar from "./SearchBar/SearchBar";
import Navbar from "./Navbar";

export const Chat = () => {
  const { searchTerm, isLoading, results, setIsLoading, files ,referenced_code} = useContext(SearchContext);
  const [sideContainerOpen, setSideContainerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const toggleSideContainer = () => {
    setSideContainerOpen(!sideContainerOpen);
  };

  const handleSearch = (input, index) => {
    setIsLoading(true);
    const url = `http://127.0.0.1:5000/api/data?prompt=${input}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
            response: {
              searchResults: data.response,
              files: data.files,
              referenced_code: data.referenced_code
            }
          },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleChildData = (data, index, input) => {
    setChatMessages((prevState) => {
      const updatedMessages = [...prevState];
      updatedMessages[index] = {
        prompt: (
          <UserPrompt
            indexval={updatedMessages.length - 1}
            searchTerm={input}
            onChildData={handleChildData}
            onRetry={(input) => {
              setIsLoading(true);
              setChatMessages((prevState) => prevState.slice(0, -1));
              handleSearch(input, index);
            }}
          />
        ),
        response: {
          searchResults: data.response,
          files: data.files,
          referenced_code: data.referenced_code
        } 
      };
      return updatedMessages;
    });
  };

  if (isLoading) {
    return <LoadingRing />;
  }
  return (
    <>
    <Navbar LoadSync="True" />
    <div  className={`container ${sideContainerOpen ? 'open' : ''}`}>
      
      {isLoading ? (
          <LoadingRing />
        ) : (
      <div  >
        {/* Initial prompt */}
        <div>
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
          <ResponseContainer
              searchResults={results}
              files={files}
              referenced_code={referenced_code}
              toggleSideContainer={toggleSideContainer}
              sideContainerOpen={sideContainerOpen}
            />
        </div>
        {chatMessages.map((chatMessage, index) => (
          <div key={index}>
            {chatMessage.prompt}
            <ResponseContainer
              searchResults={chatMessage.response.searchResults}
              files={chatMessage.response.files}
              referenced_code={chatMessage.response.referenced_code}
              toggleSideContainer={toggleSideContainer}
              sideContainerOpen={sideContainerOpen}
            />
          </div>
        ))}
      </div>
      )}
      <div className="spacer"></div>
      <div className="footer"></div>
      <div className={`searchbarrow ${sideContainerOpen ? 'open' : ''}`  }>
        <SearchBar onSearch={handleSearch}  />
      </div>
    </div>
    </>
  );
  
};

export default Chat;
