import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchContext from "./context/SearchContext";
import "./Welcome.css";
import { callAPI } from "./api";
import Cookies from "js-cookie";
import DropDownButton from "./DropDownButton/DropDownButton";
import Typewriter from "typewriter-effect";
import LoadingRing from "./Loader/Loader";
import NewWelcome from "./NewWelcome";
import LeftWelcome from "./LeftWelcome";
import emoji from 'react-easy-emoji'

export const Welcome = () => {

  const { setSearchTerm, isLoading, setIsLoading, currentuser, showSync, setShowSync, setCurrentUser, currentRepo, showRepos, setShowRepos, isLoadingProjectInfo, setIsLoadingProjectInfo, commitHash,setCommitHash,repository, setRepository,branch, setBranch, treeData, setTreeData} = useContext(SearchContext);
  const [input, setInput] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);
  const navigate = useNavigate();
  const [filesearchTerm, setFileSearchTerm] = useState("");
  const [isTreeLoading, setIsTreeLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const code = urlParams.get("access_token");
      if (code) {
        Cookies.set("cognitoCode", code, { path: "/", secure: true, sameSite: "None" });
        console.log("Set the code");
        console.log(code);
        try {
          setIsLoading(true);
          console.log("Calling API");
          console.log(code);
          await callAPI(`/api/login`, { method: "GET" });
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          setIsLoading(false);
        } catch (error) {
        }
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const cognitoCode = Cookies.get("cognitoCode");
      if (cognitoCode) {
        setIsLoadingProjectInfo(true);
        const data = await callAPI('/api/projectInfo');
        if (data.repo_name === 'No Repos selected') {
          localStorage.setItem('currentuser', "new");
          setCurrentUser("new");
        } else {
          setCurrentUser("old");
          console.log("old user");
          localStorage.setItem('currentuser', "old");
          getTreeData();
          setRepository(data.repo_name);
          setCommitHash(data.latest_commit_hash);
          setBranch(data.branch_name);
        }
        setIsLoadingProjectInfo(false);
      }
    };
    fetchData();
  }, []);

  const convertToTree = (files) => {
    const root = { name: "", children: [] };
    const nodeMap = { root };
    const pathRegex = /[\\/]/; // Matches either forward slash or backslash

    /* Tree data filtering for later
    const filteredData = searchTerm
      ? data.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : data;
    */

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
      if(currentRepo==='No Repos selected') return;
      const data = await callAPI(`/api/Treedata?path=`);
      const tree = convertToTree(data.files2analyze);
      setTreeData(tree);
      setIsTreeLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const search = (e) => {
    e.preventDefault();
    setSearchTerm(input);
    navigate("/chat");
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
  if (isLoading) {
  return (
  <div  className="h-screen">
    <LoadingRing dontLog="true"/>
  </div>
  )}
  else{
  return (<>
    {currentuser!=="new"? (
      <>
        <div className="flex ">
      <div  className="w-1/2">
        <LeftWelcome repository={repository} branch={branch} isTreeLoading={isTreeLoading} treeData={treeData} filesearchTerm={filesearchTerm} commitHash={commitHash}/>
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
                  <div className="">
                   <div className="flex justify-center mx-auto my-1 mt-[5%]">
                     <div className="py-1 px-1"> {emoji('⭐️')}</div>Implement Features
                     <div className="py-1 px-1"> {emoji('❓')}</div>Understand Code
                     <div className="py-1 px-1"> {emoji('⚡️')}</div>Generate commands
                   </div>
                   <div className="flex justify-center">
                     <div className="py-1 px-1">
                       {emoji('🐞')}
                     </div>Fix Bugs & Errors
                     <div className="py-1 px-1">
                       {emoji('🧪')}
                     </div>Create Testcases
                     <div className="py-1 px-1">
                       {emoji('📕')}
                     </div>Create Documentation and More
                     <div className="py-1 px-1">
                     {emoji('🪄')}
                     </div>
                   </div>

                  </div>
                </div>
                <div className="absolute top-3 right-5">
                  <DropDownButton />
                </div>
              </div>
            </div>
          </div>
      </>
        ) : (
          <NewWelcome />
        )}
      </>
    );
  }
};
export default Welcome;
