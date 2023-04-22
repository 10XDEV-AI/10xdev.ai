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

  useEffect(() => {
      setChatMessages([
        {
          index: 0,
          prompt: (
            <UserPrompt
              indexval={0}
              searchTerm={searchTerm}
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
              <SearchBar/>
            </div>
          </div>
        </div>
  );
};

export default Chat;
