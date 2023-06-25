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
import NewWelcome from "./NewWelcome";
export const Welcome = () => {
  const { setSearchTerm, isLoading, setIsLoading,showSync, setShowSync ,isnewuser, setIsNewUser } = useContext(SearchContext);
  const [input, setInput] = useState("");
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
      const cognitoCode = Cookies.get("cognitoCode");
      if  (cognitoCode) {
        try {
          setIsLoading(true);
          setIsLoading(false);
        } catch (error) {
          // Handle the error
        }
      }

    };

    fetchData();
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

  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const handleFilterClick = () => {
    setShowCheckboxes(!showCheckboxes);
  };

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

  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const { isLoadingProjectInfo, setIsLoadingProjectInfo } = useContext(SearchContext);
  useEffect(() => {
    const fetchData = async () => {
    const cognitoCode = Cookies.get("cognitoCode");
    if(cognitoCode) {
           setIsLoadingProjectInfo(true);
           const data = await callAPI('/api/projectInfo');
            if(data.repo_name==='No Repos selected') {
              setIsNewUser(false);
            }else{
              setIsNewUser(true);
              getTreeData();
            }
           setRepository(data.repo_name);
           setBranch(data.branch_name);
           setIsLoadingProjectInfo(false);
           }
    };
    fetchData();
  }, [setIsLoadingProjectInfo]);

  if (isLoading) {
  return (
  <LoadingRing />
  )}
  else{
  return (<>
    {isnewuser ? (
    <div className="flex ">
      <div className="w-1/2 p-6 bg-slate-50 h-screen">
        {showSync ? (
          <div className="py-2 h-[90vh]">
            <Sync/>
          </div>
        ) : (
            <>
            <div className="flex items-center text-blue-900 justify-center h-[16vh]">
              <h1 className="text-2xl">
                <ProjectInfo isLoadingProjectInfo={isLoadingProjectInfo} repository={repository}  branch={branch} />
              </h1>
              <button className="ml-auto rounded ml-auto hover:text-blue-600" onClick={() => navigate("/repos")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                  </svg>
              </button>
            </div>
            <div className="h-[60vh] overflow-y-auto overflow-x-hidden ">
              <div className="flex items-center justify-center">
              <h2 className="text-xl font-bold mb-2">Your code:</h2>
              {/* Filter Icon */}
              <button className="bg-blue-900 text-white font-bold px-1 rounded-md ml-auto hover:bg-blue-600 shadow-md flex" onClick={handleFilterClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 p-1 my-1">
                  <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
                </svg>
              </button>
              </div>
              <div className="bg-white border border-gray-400 h-[50vh] overflow-y-auto rounded-lg shadow-md">
              <FileTree data={treeData} showCheckboxes={showCheckboxes} />
              </div>
            </div>
            <div className="flex items-center text-blue-900 justify-center">
              <div className="">
                  <h1 className="font-bold">
                    Last synced : {new Date().toLocaleString()}
                  </h1>
              </div>
              <button
                className="bg-blue-900 text-white font-bold p-2 rounded ml-auto hover:bg-blue-600 shadow-md flex"
                onClick={handleSyncClick}>
                Sync
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 m-1">
                  <path fill-rule="evenodd" d="M10 4.5c1.215 0 2.417.055 3.604.162a.68.68 0 01.615.597c.124 1.038.208 2.088.25 3.15l-1.689-1.69a.75.75 0 00-1.06 1.061l2.999 3a.75.75 0 001.06 0l3.001-3a.75.75 0 10-1.06-1.06l-1.748 1.747a41.31 41.31 0 00-.264-3.386 2.18 2.18 0 00-1.97-1.913 41.512 41.512 0 00-7.477 0 2.18 2.18 0 00-1.969 1.913 41.16 41.16 0 00-.16 1.61.75.75 0 101.495.12c.041-.52.093-1.038.154-1.552a.68.68 0 01.615-.597A40.012 40.012 0 0110 4.5zM5.281 9.22a.75.75 0 00-1.06 0l-3.001 3a.75.75 0 101.06 1.06l1.748-1.747c.042 1.141.13 2.27.264 3.386a2.18 2.18 0 001.97 1.913 41.533 41.533 0 007.477 0 2.18 2.18 0 001.969-1.913c.064-.534.117-1.071.16-1.61a.75.75 0 10-1.495-.12c-.041.52-.093 1.037-.154 1.552a.68.68 0 01-.615.597 40.013 40.013 0 01-7.208 0 .68.68 0 01-.615-.597 39.785 39.785 0 01-.25-3.15l1.689 1.69a.75.75 0 001.06-1.061l-2.999-3z" clip-rule="evenodd" />
                </svg>


              </button>
            </div>
            </>
        )
        }
      </div>


      <div className="shadow-xl w-1/2 p-6">
        <div className="text-centre">
          <div className="h-[16vh] ">
            <div className="lg:text-6xl font-bold italic text-blue-900 text-center pt-5 sm:text-3xl">
                10XDEV.AI
            </div>
          </div>

          <div className="">
            <div className="text-xl font-bold mb-2">Describe a task, query, or a bug:</div>
            <div className="border border-gray-400 rounded-lg shadow-md">
              <div className="flex text-base  h-[50vh] pt-2 pl-2 pr-2"  onClick={() => setTypingStarted(true)}>
                {typingStarted ? <textarea
                                                   className="flex-grow h-[48vh] focus:outline-none"
                                                   value={input}
                                                   placeholder=""
                                                   onClick={() => setTypingStarted(true)}
                                                   onChange={handleInputChange}
                                                   onKeyDown={(e) => e.key === 'Enter' && search(e)}
                                                 /> : (
                  <Typewriter className = "h-[48vh]"
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
              <button className="bg-blue-900 text-white mt-6 py-1 px-4 rounded hover:bg-blue-600 shadow-md " onClick={search}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>

            <div className="text-center mt-5 grid grid-cols-8  text-sm">
                  <div classname = ""><div>⭐️</div>Implement Features </div>
                  <div classname = ""><div>❓</div>Explain Code</div>
                  <div classname = ""><div>📖</div>Create Documents</div>
                  <div classname = ""><div>🐞️</div>Fix Bugs & Erorrs</div>
                  <div classname = ""><div>⚡️️</div> Optimse Code </div>
                  <div classname = ""><div>🔬</div>Create Testcases</div>
                  <div classname = ""><div>🕹️</div>Generate commands </div>
                  <div classname = ""><div>🪄</div>and More </div>
            </div>
          </div>
          <div className="absolute top-3 right-5">
            <DropDownButton />
          </div>
        </div>
      </div>
    </div>):(<NewWelcome/>)
    }
    </>
  );
};
}
export default Welcome;