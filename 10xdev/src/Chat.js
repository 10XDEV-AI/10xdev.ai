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

export const Chat = () => {
  const {
    searchTerm,
    isLoading,
    results,
    setIsLoading,
    logFiles, setLogFiles,
    referenced_code,
    checkedFiles,setCheckedFiles,
    sideContainerOpen, setSideContainerOpen,
    repository, setRepository,
    branch, setBranch,
    treeData, setTreeData,
    commitHash,
  } = useContext(SearchContext);
  const [showLeftWelcome, setShowLeftWelcome] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const loadingRingRef = useRef(null);
  const [isTreeLoading, setIsTreeLoading] = useState(false);
  const [filesearchTerm, setFileSearchTerm] = useState("");
  const toggleSideContainer = () => {
    setSideContainerOpen(!sideContainerOpen);
    setShowLeftWelcome(false)
  };

  const handleHamburgerClick = () => {
    setShowLeftWelcome(!showLeftWelcome);
  };

  const handleRemoveFile = (index) => {
    setCheckedFiles((prevState) => {
      const updatedFiles = [...prevState];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleSearch = async (input) => {
    console.log("searching for");
    console.log(input);
    setIsLoading(true);
    setLogFiles([])
    setSideContainerOpen(false);
    setShowLeftWelcome(false)
    setChatMessages((prevState) => [
            ...prevState,
            {
              prompt: {
                searchTerm: input,
              },
              response: {
                searchResults: null,
                files: null,
                referenced_code: null,
              },
            },
          ]);
    try {
      const filesData = await callAPI("/api/search_files", {
        method: "POST",
        body: JSON.stringify({
          chatMessages: chatMessages.slice(0, chatMessages.length - 1),
          checkedFiles: checkedFiles,
          prompt: input,
        }),
      });
      console.log("Received filesData:");
      console.log(filesData);
      setLogFiles(filesData.files);

      // Second API call to get the results
      const data = await callAPI("/api/get_response", {
        method: "POST",
        body: JSON.stringify({
          prompt: input,
          chatMessages: chatMessages.slice(0, chatMessages.length - 1),
          files: filesData.files,
        }),
      });
      console.log(data);
      const results = JSON.stringify(data.response);
      const code = data.referenced_code;
      setChatMessages((prevState) => {
                          const updatedMessages = [...prevState];
                          updatedMessages[chatMessages.length] = {
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
    } catch (error) {
      console.error("Error during API call:", error);
    }
    setIsLoading(false);
    console.log("chatmessages");
    console.log(chatMessages);
  };

  const handleReprompt = async (input, index) => {
    console.log(input);
    setSideContainerOpen(false);
    setShowLeftWelcome(false);
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
    setLogFiles([]);
      try {
            const filesData = await callAPI("/api/search_files", {
              method: "POST",
              body: JSON.stringify({
                chatMessages: chatMessages.slice(0, index),
                checkedFiles: checkedFiles,
                prompt: input,
              }),
            });
            console.log("Received filesData:");
            console.log(filesData);
            setLogFiles(filesData.files);

            // Second API call to get the results
            const data = await callAPI("/api/get_response", {
              method: "POST",
              body: JSON.stringify({
                prompt: input,
                chatMessages: chatMessages.slice(0, index),
                files: filesData.files,
              }),
            });
            console.log(data);
            const results = JSON.stringify(data.response);
            const code = data.referenced_code;
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
          files: logFiles,
          referenced_code: referenced_code,
        },
      },
    ]);
  }, [results, searchTerm, referenced_code]);

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
            {showLeftWelcome &&  <div className="w-6/12 fixed border-r"><LeftWelcome repository={repository} branch={branch} isTreeLoading={isTreeLoading} treeData={treeData} commitHash={commitHash}/></div>}
            <div className={`${showLeftWelcome ? "w-6/12 absolute right-0 " : "w-full"}`}>
              <Navbar LoadProjectInfo="True" file="chat" onHamburgerClick={handleHamburgerClick} />
              <div class="w-full bg-slate-50 p-4 rounded-lg ">
                <div class="flex flex-wrap gap-2 justify-center items-center" >
                  {checkedFiles.length>0&&
                      <div onClick={handleHamburgerClick}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 my-1">
                             <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                           </svg></div>}
                  {checkedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex text-blue-500 border border-blue-500 py-1 pl-6 gap-1 pr-2 rounded-full text-sm font-semibold justify-center items-center">
                        {file}
                          <button
                              className="text-slate-50 hover:text-blue-500"
                              onClick={() => handleRemoveFile(index)}
                          >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${sideContainerOpen ? "w-8/12" : "w-full"}`}>
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
                      searchResults={chatMessage.response.searchResults}
                      files={chatMessage.response.files}
                      referenced_code={chatMessage.response.referenced_code}
                      toggleSideContainer={toggleSideContainer}
                      sideContainerOpen={sideContainerOpen}
                    />
                  )}
                  {index === chatMessages.length - 1 && isLoading && (
                    <div className="my-10 p-10">
                      <LoadingRing/>
                    </div>
                  )}
                </div>
                ))}
                <div className="spacer" ref={loadingRingRef}></div>

              </div>
            </div>
            <div className="footer"></div>
              <div className={`searchbarrow ${sideContainerOpen ? "open z-0" : "z-0"}`}>
              <SearchBar onSearch={handleSearch} />
              </div>
        </div>
    </>
  );
};

export default Chat;
