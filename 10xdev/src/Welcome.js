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

export const Welcome = () => {
  const { setSearchTerm, isLoading, setIsLoading } = useContext(SearchContext);
  const [input, setInput] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);
  const navigate = useNavigate(); // for redirecting to search page

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
  return (
    <div className="flex flex-wrap">
      <div className="w-1/2 p-4 pt-[6%]">
        <div className="flex items-center text-blue-900 justify-center py-2">
          <h1 className="text-2xl">
            <ProjectInfo />
          </h1>
          <button className="bg-blue-500 text-white px-4 rounded ml-auto">
            Change Repo
          </button>
        </div>
        <div className="bg-sky-50 border border-gray-400 mt-10 p-4 rounded-lg h-[60vh] overflow-y-auto overflow-x-hidden">
            <h2 className="text-xl font-bold mb-2">
              Codebase:
            </h2>
            <FileTree data={treeData} />
          </div>
      </div>

          <div className="shadow-xl w-1/2 h-screen">
            <div className="text-centre">
              <div className="text-6xl font-bold italic text-blue-900 mt-[10%] mb-4 text-center">
                10XDEV.AI
              </div>

              <div className="p-4">
                <div className="text-xl font-bold mt-2 mb-4">Describe a task, query, or a bug:</div>
                <div className="border border-gray-400 rounded-lg">
                  <div className="flex text-sm p-1">
                    {typingStarted ? null : (
                      <Typewriter
                        options={{
                          strings: shuffledStrings,
                          autoStart: true,
                          loop: true,
                          cursor: '',
                          delay: 50,
                        }}
                        onInit={(typewriter) => {
                          typewriter.pauseFor(2000).start();
                        }}
                      />
                    )}
                    <textarea
                      className="resize-none flex-grow m-2 h-[50vh]"
                      value={input}
                      placeholder=""
                      onClick={() => setTypingStarted(true)}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button className="bg-blue-500 text-white mt-3 py-1 px-4 rounded" onClick={search}>Go</button>
                </div>
              </div>
              <div className="absolute top-3 right-2">
                <DropDownButton />
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default Welcome;