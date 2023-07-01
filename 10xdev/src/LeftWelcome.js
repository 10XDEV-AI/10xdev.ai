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
import Repos from "./Repos";
import { FaStar, FaQuestion, FaGamepad, FaBug, FaFlask, FaBook, FaMagic } from 'react-icons/fa';


export const LeftWelcome = () => {
  const { setSearchTerm, isLoading, setIsLoading,showSync, setShowSync ,isnewuser, setIsNewUser,showRepos, setShowRepos , isLoadingProjectInfo, setIsLoadingProjectInfo } = useContext(SearchContext);
  const [input, setInput] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const navigate = useNavigate();
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('');
  const handleSyncClick = () => {
    setShowSync(true);
  };
  const handleFilterClick = () => {
      setShowCheckboxes(!showCheckboxes);
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
  return (
          <div className="w-1/2 p-6 bg-slate-50 h-screen">
            {showSync ? (
              <div className="py-2 h-[90vh]">
                <Sync/>
              </div>
            ) : (
                <>
                    {showRepos? <Repos/>:
                    (
                        <>
                        <div className="flex items-center text-blue-900 justify-center h-[16vh]">
                          <h1 className="text-2xl">
                            <ProjectInfo isLoadingProjectInfo={isLoadingProjectInfo} repository={repository}  branch={branch} />
                          </h1>
                          <button className="ml-auto rounded ml-auto hover:text-blue-600" onClick={() => setShowRepos(!showRepos)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                          </button>
                        </div>
                        <div className="h-[60vh] overflow-y-auto overflow-x-hidden ">
                          <div className="flex items-center justify-center">
                          <h2 className="text-xl font-bold mb-2">Your code:</h2>
                          {/* Filter Icon */}
                          <button className="font-bold px-1 rounded-md ml-auto" onClick={handleFilterClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 my-1">
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
                        )}
                </>
            )
            }
          </div>

  );
};
}
export default LeftWelcome;