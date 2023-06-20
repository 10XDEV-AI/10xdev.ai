import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchContext from "./context/SearchContext";
import "./Welcome.css";
import { callAPI } from "./api";
import Cookies from "js-cookie";
import ProjectInfo from "./ProjectInfo/ProjectInfo";
import DropDownButton from "./DropDownButton/DropDownButton";
import Typewriter from "typewriter-effect";
import LoadingRing from "./Loader/Loader";
import FileTree from "./FileTree";
import Sync from "./Sync/Sync";

export const Welcome = () => {
  const { setSearchTerm, isLoading, setIsLoading } = useContext(SearchContext);
  const [input, setInput] = useState("");
  const [showSync, setShowSync] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const navigate = useNavigate();

  const handleSyncClick = () => {
    setShowSync(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const code = urlParams.get("access_token");
      if (code) {
        Cookies.set("cognitoCode", code, { path: "/", secure: true, sameSite: "strict" });
        console.log("Got the code");
        try {
          setIsLoading(true);
          await callAPI(`/api/login`, { method: "GET" });
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          // Handle the error
        }
      }
      setIsLoading(false);
    };

    fetchData();
    getTreeData();
  }, [navigate]);

  const search = (e) => {
    e.preventDefault();
    setSearchTerm(input);
    navigate("/chat"); // add this line to redirect to /chat
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setTypingStarted(true);
  };

  const typewriterStrings = [
    "Implement a user registration form with validation",
    "Create a responsive layout for mobile devices",
    "Integrate a third-party payment gateway for online transactions",
    "Optimize database queries for improved performance",
    "Implement a search functionality with autocomplete suggestions",
    "Add pagination to the list of search results",
    "Implement social media sharing functionality for articles",
    "Add password reset functionality using email verification",
    "Create a dashboard to display real-time analytics",
    "Implement a file upload feature with progress tracking",
    "Add support for multiple languages using localization",
    "Implement a commenting system for blog posts",
    "Integrate a chatbot for customer support",
    "Implement two-factor authentication for user accounts",
    "Optimize website loading speed by compressing static assets",
    "Add support for push notifications on mobile devices",
    "Implement a user role management system with different access levels",
    "Integrate a recommendation engine based on user preferences",
    "Implement a newsletter subscription feature",
    "Add image cropping and resizing functionality",
    "Integrate a geolocation service to display user location",
    "Implement a rating and review system for products",
    "Add support for dark mode in the user interface",
    "Implement an email notification system for user actions",
    "Integrate a video streaming service for multimedia content",
    "Add support for third-party authentication providers (e.g., Google, Facebook)",
    "Implement an inventory management system for an e-commerce platform",
    "Optimize website for search engine optimization (SEO)",
    "Implement a real-time chat feature using websockets",
    "Add a progress bar to indicate the status of long-running tasks",
  ];

  const shuffledStrings = typewriterStrings.sort(() => Math.random() - 0.5);

  const [treeData, setTreeData] = useState([]);

  const convertToTree = (files) => {
    const root = { name: "", children: [] };
    const nodeMap = { root };
    const pathRegex = /[\\/]/; // Matches either forward slash or backslash

    files.forEach((file) => {
      const pathComponents = file.Path.split(pathRegex);
      let parent = root;

      for (let i = 0; i < pathComponents.length; i++) {
        const nodeName = pathComponents[i];

        if (!nodeMap[nodeName]) {
          const newNode = { name: nodeName, children: [] };
          nodeMap[nodeName] = newNode;
          parent.children.push(newNode);
        }

        parent = nodeMap[nodeName];
      }
    });

    return root;
  };

  const getTreeData = async () => {
    try {
      const data = await callAPI(`/api/FilesToAnalyzedata?path=`);
      const tree = convertToTree(data.files2analyze);
      setTreeData(tree);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
  return (
  <LoadingRing />
  )}
  else{
  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 p-6 pt-[6%] bg-slate-50 ">
        {showSync ? (
          <div className="py-2 h-[90vh]">
            <Sync setShowSync={setShowSync} />
          </div>
        ) : (
            <>
            <div className="flex items-center text-blue-900 justify-center py-2">
              <h1 className="text-2xl">
                <ProjectInfo />
              </h1>
              <button className="px-4 rounded ml-auto hover:text-blue-600" onClick={() => navigate("/repos")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </button>
            </div>
            <div className="bg-sky-50 border border-gray-400 mt-10 p-4 rounded-lg h-[60vh] overflow-y-auto overflow-x-hidden shadow-md">
              <h2 className="text-xl font-bold mb-2">Codebase:</h2>
              <div className="bg-white h-[50vh] overflow-y-auto rounded-lg">
              <FileTree data={treeData} />
              </div>
            </div>
            <div className="flex items-center text-blue-900 justify-center py-5">
              <div className="">
                  <h1 className="font-bold">
                    Last synced : {new Date().toLocaleString()}
                  </h1>
              </div>
              <button
                className="bg-blue-900 text-white p-2 rounded ml-auto hover:bg-blue-600 shadow-md "
                onClick={handleSyncClick}>
                Sync Now
              </button>
            </div>
            </>
        )
        }
      </div>


      <div className="shadow-xl w-1/2 h-screen p-6">
        <div className="text-centre">
          <div className="text-6xl font-bold italic text-blue-900 mt-[7%] mb-[5%] text-center">
            10XDEV.AI
          </div>

          <div className="">
            <div className="text-xl font-bold mt-6 mb-3">Describe a task, query, or a bug:</div>
            <div className="border border-gray-400 rounded-lg shadow-md">
              <div className="flex text-base  h-[50vh] pt-2 pl-2 pr-2"  onClick={() => setTypingStarted(true)}>
                {typingStarted ? <textarea
                                                   className="flex-grow h-[48vh] focus:outline-none"
                                                   value={input}
                                                   placeholder=""
                                                   onClick={() => setTypingStarted(true)}
                                                   onChange={handleInputChange}
                                                 /> : (
                  <Typewriter className = "h-[50vh]"
                    options={{
                      strings: shuffledStrings,
                      autoStart: true,
                      loop: true,
                      cursor: " |",
                      delay: 30,
                    }}
                    onInit={(typewriter) => {
                      typewriter.pauseFor(3000).start();
                    }}
                  />
                )}

              </div>
            </div>

            <div className="flex items-end justify-end">
              <button className="bg-blue-900 text-white mt-3 py-1 px-4 rounded hover:bg-blue-600 shadow-md " onClick={search}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="absolute top-3 right-5">
            <DropDownButton />
          </div>
        </div>
      </div>
    </div>
  );
};
}
export default Welcome;