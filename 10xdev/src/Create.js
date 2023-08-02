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
                    spec : searchTerm,
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

    const handleDownload = async () => {



  };

  return (
    <>
        <div className="flex">
            <div className="w-full">
              <Navbar/>
              <h1 class="mx-[15%] mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 ">Your project will be created based on below instructions</h1>
               <p class="mx-[15%] mb-4 text-lg font-normal text-gray-500 lg:text-xl ">You can edit these instructions to get better results</p>
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
                <div className="px-[15%] p-10">
                    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 ">Your Project is ready!</h1>
                    <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl ">Add this Project to Github first and then to 10XDEV.AI to add more features</p>
                    <a onClick={handleDownload} class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                        Download Zip File
                        <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                </div>
              </div>
            </div>
            </div>
    </>
  );
};

export default Create;
