import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./Clone.css";
import Navbar from "./Navbar";
import SearchContext from "./context/SearchContext";
import LoadingRing from "./Loader/Loader";
import { callAPI } from "./api";
import { BsGithub } from "react-icons/bs";
import { FaGitlab } from "react-icons/fa";
import cookies from "js-cookie";

const Clone = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  const { isLoading, setIsLoading ,setPath} = useContext(SearchContext);
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
      : "NULL";

  const [isauthenticated, setIsAuthenticated] = useState(false);
  const [repos, setRepos] = useState([]);

  function getRepoNameFromURL(url) {
    const gitExtension = '.git';
    const gitIndex = url.indexOf(gitExtension);

    if (gitIndex !== -1) {
      url = url.substring(0, gitIndex);
    }
    const urlParts = url.split('/');
    const repoName = urlParts[urlParts.length - 1];
    return repoName;
  }

  const handleClone = async (repo) => {
    setIsLoading(true);
    try {
      const data = await callAPI(`/api/clone?path=${repo}`, {
        method: "GET",
      });
      console.log(data);
      setBranches(data);
      setPath(getRepoNameFromURL(repo));
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
  const [filteredRepos, setFilteredRepos] = useState([]);

  const SearchRepos = (searchValue) => {
    if (!searchValue) {
      setFilteredRepos(repos);
    } else {
      const filteredRepos = repos.filter((repo) => {
        return repo.full_name.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredRepos(filteredRepos);
    }
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
        getAllPrivateRepos();
        setIsAuthenticated(true);
      }, 2000);
    }
  }, []);

  const getAllPrivateRepos = async () => {
    const accessToken = cookies.get("accesstoken");
    console.log(accessToken);
    try {
      const response = await callAPI(`/api/github/getallrepos?access_token=${accessToken}`, {
        method: "GET",
      });
      console.log(response);
      setRepos(response);
      setFilteredRepos(response);
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
    setIsLoading(true);
    try {
      console.log(branch);
      const data = await callAPI(`/api/setBranch?path=${input}&branch=${branch}`, {
        method: "GET",
      });
      console.log(data);
      navigate(`/train`);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div >
        {isLoading?
        <div  className="h-screen"><LoadingRing dontLog="true"/></div>
            :
            <>
                <Navbar />
                <div className="h-screen" >
                     <div className="p-4 flex">
                       <button className="bg-blue-900 text-white px-4 btn-font rounded-md hover:bg-blue-700" onClick={() => navigate(`/repos`)}>
                         Back
                       </button>
                         <h1 className="text-4xl font-bold mx-auto">Setup Repository</h1>
                       <div className="">
                         <button className="bg-white text-white px-4" onClick={() => navigate(`/repos`)}>
                                Back
                            </button>
                       </div>
                     </div>
                        {!isauthenticated && (
                            <>
                                <div className="">
                                    <div className="w-full flex">
                                        <div className="text-2xl font-bold text-blue-900 mt-20 mx-auto" >Add Your Public Git URL</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <label className="border border-gray-300 centre w-[45%] my-10 rounded-md">
                                            <input
                                              type="text"
                                              value={input}
                                              onChange={handleInputChange}
                                              className="w-full focus:outline-none focus:shadow-outline px-5 my-2 "
                                            />
                                        </label>
                                        <button onClick={() => { handleClone(input); setCheckRepo(""); }}  className="bg-blue-900 text-white p-2 m-2 rounded flex hover:bg-blue-700 my-10">
                                            Add
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-2 w-6 h-6">
                                                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd"/>
                                                </svg>
                                        </button>
                                    </div>
                                </div>
                                { (checkrepo==='repo' ) &&
                                    <div className="flex items-center justify-center">
                                        <div className="border-t border-gray-300 w-full my-5"></div>
                                        <div className="text-2xl mx-5 text-gray-700 font-bold">OR</div>
                                        <div className="border-t border-gray-300 w-full my-5"></div>
                                    </div>
                                }
                            </>
                          )}


                  <div>
                    {(isauthenticated )? (
                      <div></div>
                    ) : (
                      checkrepo==='repo' && (
                                                <div className="">
                                                    <div className="w-full flex">
                                                        <div className="text-2xl font-bold text-blue-900 mx-auto mt-10">Add your public and private repos</div>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <button onClick={loginWithGithub} className="bg-blue-900 text-white px-8 py-2 mt-10 rounded-md flex hover:bg-blue-700">
                                                          Connect with Github <BsGithub className="mr-1 m-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                    )}
                  </div>
                  <div className="w-full items-center justify-center" data-aos="fade-right" data-aos-duration="500">
                    {branches.length > 0 ? (
                      <>
                      <div className="flex ">
                        <h2 className="font-bold text-2xl my-6 mx-auto">Select your desired Branch</h2>
                      </div>
                      <div className="bg-white border-dashed border-gray-300 border-2 rounded-lg p-2 mx-[25%]" >
                        {branches.map((branch) => (
                          <ul key={branch}  className="justify-center">
                            <li className="">
                              <button
                                className="w-full break-words flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mt-2 focus:outline-none focus:ring"
                                onClick={() => handleSelect(branch)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                </svg>
                                {branch}
                              </button>
                            </li>
                          </ul>
                        ))}
                      </div>
                      </>
                    ) : (
                      <div>
                        {repos.length > 0 ? (
                          <>
                          <div className="flex">

                          <form className="flex mx-[28%] w-[80%]">
        <div className="relative w-full m-3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          {/* Step 3: Update the width and height of the input */}
          <input
            type="search"
            id="default-search"
            onChange={(e) => SearchRepos(e.target.value)}
            className="block w-full py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Repository"
            required
          />
        </div>
      </form>

                    </div>
                          <div className=" bg-white border-dashed border-gray-300 border-2 rounded-lg mx-[30%]" data-aos="fade-right" data-aos-duration="500">
                          {filteredRepos.map((repo) => (
              <>
                <ul key={repo.id} className="m-2 flex justify-center">
                  <li className="w-full">
                    <button
                      className="w-full flex text-start bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:ring"
                      onClick={() => {
                        console.log(repo);
                        console.log("User wants to clone " + repo.url);
                        setPath(repo.name);
                        handleClonePrivate(repo.url);
                        setRepos([]);
                      }}
                    >
                      <BsGithub className="mr-3 my-1" />
                      {repo.full_name}
                    </button>
                  </li>
                </ul>
              </>
            ))}
                          </div>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
            </>
        }
    </div>
  );
};

export default Clone;
