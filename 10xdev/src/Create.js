import React, { useContext, useEffect, useState, useRef } from "react";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import ResponseContainer from "./ResponseContainer/ResponseContainer";
import UserPrompt from "./UserPrompt/UserPrompt";
import "./Chat.css";
import SearchBar from "./SearchBar/SearchBar";
import LeftWelcome from "./LeftWelcome";
import Navbar from "./Navbar";
import { callAPI } from "./api";

export const Create = () => {
  const {
    searchTerm,
    isLoading,
    results,
    setIsLoading,
  } = useContext(SearchContext);
  const [chatMessages, setChatMessages] = useState([]);
  const loadingRingRef = useRef(null);
  const [filesearchTerm, setFileSearchTerm] = useState("");

  const handleReprompt = async (input, index) => {
    console.log(input);
    setChatMessages((prevState) => {
      const updatedMessages = [...prevState];
      updatedMessages[index] = {
        prompt: {
          searchTerm: input,
        },
        response: {
          searchResults: null,
          files: null,
          referenced_code: null,
        },
      };
      updatedMessages.splice(index + 1);
      return updatedMessages;
    });
    setIsLoading(true);
      try {
            const data = await callAPI("/api/create_project_with_spec", {
              method: "POST",
                      body: JSON.stringify({
                        searchTerm,
                      }),
                    });
            const results = JSON.stringify(data.response);
            setChatMessages((prevState) => {
                    const updatedMessages = [...prevState];
                    updatedMessages[index] = {
                      prompt: {
                        searchTerm: searchTerm,
                      },
                      response: {
                        searchResults: data.response,
                        files: null,
                        referenced_code: null,
                      },
                    };
                    return updatedMessages;
                  });
          } catch (error) {
            console.error("Error during API call:", error);
          }
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
          files: null,
          referenced_code: null,
        },
      },
    ]);
  }, [results, searchTerm]);

  useEffect(() => {
    if (isLoading && loadingRingRef.current) {
      loadingRingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isLoading]);

  return (
    <>
        <div className="flex">
            <div className="w-full">
              <Navbar/>
              <h1 class="px-[5%] py-5 text-2xl font-bold bg-slate-50">Your project will be created based on below instructions</h1>
              <div className="w-full">
              {chatMessages.map((chatMessage, index) => (
                <div key={index}>
                  <UserPrompt
                    searchTerm={chatMessage.prompt.searchTerm}
                    onReprompt={handleReprompt}
                    onRetry={handleReprompt}
                    indexval={index}
                  />
                  {chatMessage.response.searchResults && (
                      <ResponseContainer
                        searchResults={results}
                        files={""}
                        referenced_code={""}
                        sideContainerOpen={null}
                      />
                  )}
                  {index === chatMessages.length - 1 && isLoading && (
                    <div className="my-10 p-10">
                      <LoadingRing/>
                    </div>
                  )}
                </div>
                ))}
                <div className="" ref={loadingRingRef}></div>
              </div>
            </div>
            </div>
    </>
  );
};

export default Create;
