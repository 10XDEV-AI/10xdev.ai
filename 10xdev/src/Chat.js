import React, { useContext } from "react";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import ResponseContainer from "./ResponseContainer/ResponseContainer";
import UserPrompt from "./UserPrompt/UserPrompt";
import "./Chat.css";
import SearchBar from "./SearchBar/SearchBar";
import Navbar from "./Navbar";
import { useState, useEffect} from "react";

export const Chat = () => {
  const { searchTerm, isLoading, results, setIsLoading, files ,referenced_code} = useContext(SearchContext);
  const [ sideContainerOpen, setSideContainerOpen] = useState(false);
  const [ chatMessages, setChatMessages] = useState([]);

  const toggleSideContainer = () => {
    setSideContainerOpen(!sideContainerOpen);
  };

  const handleSearch = async(input) => {
    console.log("searching for");
    console.log(input);
    setIsLoading(true);
    const response = await fetch(`/api/data?prompt=${input}`);
        const data = await response.json();
        console.log(data);
        const results = JSON.stringify(data.response);
        const files  = (data.files);
        const code = (data.referenced_code);
        console.log(results);
        console.log(files);
        console.log(code);
        setChatMessages((prevState) => [
          ...prevState,
          {
            prompt:
              {
              searchTerm: input,
              }
              ,
              response: {
                searchResults: data.response,
                files: data.files,
                referenced_code: data.referenced_code
              }
          }
          ]);
         setIsLoading(false);
         console.log("chatmessages");
         console.log(chatMessages);
     };

  const handleReprompt = async (input, index) => {
    console.log("searching for");
    console.log(input);
    setIsLoading(true);
    const response = await fetch(`/api/data?prompt=${input}`);
    const data = await response.json();
    console.log(data);
    const results = JSON.stringify(data.response);
    const files = data.files;
    const code = data.referenced_code;
    console.log(results);
    console.log(files);
    console.log(code);
    console.log("index");
    console.log(index);
    setChatMessages((prevState) => {
      const updatedMessages = [...prevState];
      updatedMessages[index] = {
        prompt: {
          searchTerm: input,
        },
        response: {
          searchResults: data.response,
          files: data.files,
          referenced_code: data.referenced_code,
        },
      };
      return updatedMessages;
    });
    console.log("Updated chat messages");
    console.log(chatMessages);
    setIsLoading(false);
  };

  useEffect(() => {
    setChatMessages([
      {
        index: 0,
        prompt: {
          searchTerm: searchTerm,
        },
        response: {
          searchResults: results,
          files: files,
          referenced_code: referenced_code,
        },
      },
    ]);
  }, [results, searchTerm, files, referenced_code]);


return (
    <>
    <Navbar LoadSync="" LoadProjectInfo="True" />
    <div className="spacer-top"></div>
    <div  className={`container ${sideContainerOpen ? 'open' : ''}`}>
      {isLoading ? (<LoadingRing />) : (
      <div>
        {chatMessages.map((chatMessage, index) => (
          <div key={index}>
            <UserPrompt
                searchTerm={chatMessage.prompt.searchTerm}
                onReprompt={handleReprompt}
                onRetry={handleReprompt}
                indexval={index}
            />
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
