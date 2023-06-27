import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Clone.css";
import Navbar from "./Navbar";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import { callAPI } from "./api";
import { BsGithub } from "react-icons/bs";
import { FaGitlab } from "react-icons/fa";
import cookies from "js-cookie";

const Clone = () => {
  const { isLoading, setIsLoading } = useContext(SearchContext);
  const [branches, setBranches] = useState([]);
  const [input, setInput] = useState("");
  const [checkrepo, setCheckRepo] = useState("repo");
  const hostname = window.location.hostname;
  const navigate = useNavigate();
  const client_id =
    hostname === "localhost"
      ? "eaae8a43278892ed15e1"
      : hostname === "test.10xdevai.com"
      ? "7de77ae768aa62b79e09"
      : hostname === "10xdevai.com"
      ? "40acda1a937125d9193b"
      : "YoYOHS";
  const [userdata, setUserData] = useState(null);
  const [isauthenticated, setIsAuthenticated] = useState(false);
  const [repos, setRepos] = useState([]);

  const handleClone = async (repo) => {
    setIsLoading(true);
    try {
      const data = await callAPI(`/api/clone?path=${repo}`, {
        method: "GET",
      });
      console.log(data);
      setBranches(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleClonePrivate = async (repo_url) => {
    setIsLoading(true);
    const accessToken = cookies.get("accesstoken");
    console.log(accessToken);
    try {
      const data = await callAPI(`/api/clone-private?path=${repo_url}&access_token=${accessToken}`, {
        method: "GET",
      });
      console.log(data);
      setBranches(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const loginWithGithub = () => {
    console.log("login with github");
    console.log(client_id);
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo`
    );
  };

  useEffect(() => {
    cookies.remove("accesstoken");
    setIsAuthenticated(false);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (code) {
      const fetchToken = async () => {
        const response = await callAPI(`/api/github?code=${code}&client_id=${client_id}`, {
          method: "GET",
        });
        if (response.access_token) {
          cookies.set("accesstoken", response.access_token.toString());
        }
      };
      fetchToken();
      setTimeout(() => {
        getGithubUser();
        getAllPrivateRepos();
        setIsAuthenticated(true);
      }, 2000);
    }
  }, []);

  const getGithubUser = async () => {
    const accessToken = cookies.get("accesstoken");
    console.log(accessToken);
    try {
      const response = await callAPI(`/api/github/getuser?access_token=${accessToken}`, {
        method: "GET",
      });
      console.log(response);
      setUserData(response);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getAllPrivateRepos = async () => {
    const accessToken = cookies.get("accesstoken");
    console.log(accessToken);
    try {
      const response = await callAPI(`/api/github/getallrepos?access_token=${accessToken}`, {
        method: "GET",
      });
      console.log(response);
      setRepos(response);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSelect = async (branch) => {
    try {
      console.log(branch);
      const data = await callAPI(`/api/setBranch?path=${input}&branch=${branch}`, {
        method: "GET",
      });
      console.log(data);
      navigate(`/repos`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div >
      <Navbar />
        <div className="h-screen">

          {!isauthenticated && (
            <><div className="font-bold text-center text-xl m-3">Your Public Repository URL</div>
            <div className="GetIgnorecontainer">
            
              <label className="pathsearchrow w-1/2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none focus:shadow-outline mx-5 my-2"
                />
              </label>
              <button
                onClick={() => {
                  handleClone(input);
                  setCheckRepo("");
                  }}
                className="bg-blue-900 text-white p-2 m-2 rounded flex hover:bg-blue-700"
              >
                Add
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mx-2 w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            { (checkrepo==='repo' ) && <div className="flex items-center justify-center">
              <div className="border-t border-gray-300 w-full my-5"></div>
              <div className="mx-5 text-gray-700 font-bold">OR</div>
              <div className="border-t border-gray-300 w-full my-5"></div>
            </div>}
            </>
          )}
          <br />

            {/* lets add OR in between and horizontal ines in right and left of it  */}
         
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "20px",
            }}
          >
           
            {(isauthenticated )? (
              <div></div>
            ) : (
              checkrepo==='repo' && (
                <>
              <div className="flex">
                <button
                  onClick={loginWithGithub}
                  className="bg-blue-900 text-white px-8 py-2 mx-10 my-5 rounded-md flex hover:bg-blue-700"
                >
                  Connect with Github <BsGithub className="ml-3  mx-6 mr-1 m-1" />
                </button>
                <button className="bg-blue-900 text-white px-8 py-2 mx-10 my-5 rounded-md flex hover:bg-blue-700">
                  Connect with Gitlab <FaGitlab className="ml-3 mx-6 mr-1 m-1" />
                </button>
              </div>
              </>)
            )}
          </div>
          <div className="w-full items-center justify-center">
            {branches.length > 0 ? (
              <div className="branch-container bg-white border-dashed border-gray-300 border-2 rounded-lg p-6 mx-20">
                  <h2 className="font-bold text-2xl">Select your desired Branch</h2>  
                {branches.map((branch) => (
                  <ul key={branch}  className="px-10 mx-10 flex justify-center">
                    <li className="w-full">
                      <button
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mt-2 focus:outline-none focus:ring"
                        onClick={() => handleSelect(branch)}
                      >
                        {branch}
                      </button>
                    </li>
                  </ul>
                ))}
              </div>
            ) : (
              <div>
                {repos.length > 0 ? (
                  <div className="branch-container bg-white border-dashed border-gray-300 border-2 rounded-lg p-6 mx-20">
                  <h2 className="font-bold text-2xl">Select your desired Repository</h2>      
                    {repos.map((repo) =>(
                          <>
                          <ul key={repo.id} className="px-10 mx-10 flex justify-center">
                            <li className="w-full">
                              <button
                                className="w-full text-start bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mt-2 focus:outline-none focus:ring"
                                onClick={() => {
                                  console.log(repo);
                                  console.log("User wants to clone " + repo.url);
                                  handleClonePrivate(repo.url);
                                  setRepos([]);
                                }}
                              >
                                {repo.full_name}
                              </button>
                            </li>
                          </ul>
                          </>
                        )
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Clone;
