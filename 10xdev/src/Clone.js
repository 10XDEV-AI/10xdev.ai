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
  const hostname = window.location.hostname;
  const navigate = useNavigate();
  const client_id =
    hostname === "localhost"
      ? "eaae8a43278892ed15e1"
      : hostname === "test.10xdevai.com"
      ? "7de77ae768aa62b79e09"
      : hostname === "10xdevai.com"
      ? "eaae8a43278892ed15e1"
      : "YoYOHS";
  const [userdata, setUserData] = useState(null);
  const [isauthenticated, setIsAuthenticated] = useState(false);
  const [repos, setRepos] = useState([]);
  const [privateRepolink, setPrivateRepolink] = useState([]);
  const [privateBranch, setPrivateBranch] = useState([]);

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

  const getPrivateBranches = async (repo) => {
    const sub = repo.substring(0, repo.length - 9);
    console.log(sub);
    const accessToken = cookies.get("accesstoken");
    try {
      // Fetch repo branches using repo URL
      const response = await fetch(sub, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (response.ok) {
        const branches = await response.json(); // Parse response as JSON
        console.log(branches); // Print branches data
        setPrivateBranch(branches);
      } else {
        console.error("Failed to retrieve branches:", response.status);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <LoadingRing />
      ) : (
        <div>
          <div className="GetIgnorecontainer">
            <div className="font-bold text-xl m-3">Your Public Repository URL:</div>
            <label className="pathsearchrow">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="w-full focus:outline-none focus:shadow-outline mx-5 my-2"
              />
            </label>
            <button
              onClick={() => handleClone(input)}
              className="bg-blue-900 text-white p-2 m-2 rounded-full flex hover:bg-blue-700"
            >
              Clone Repo
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
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "20px",
            }}
          >
            <div>
              <h3 className="font-bold text-xl">Add Your Private Repository</h3>
            </div>
            {isauthenticated ? (
              <div></div>
            ) : (
              <div className="flex">
                <button
                  onClick={loginWithGithub}
                  className="bg-blue-900 text-white p-2 m-2 rounded-md flex hover:bg-blue-700"
                >
                  Connect with Github <BsGithub className="ml-3 mr-1 m-1" />
                </button>
                <button className="bg-blue-900 text-white p-2 m-2 rounded-md flex hover:bg-blue-700">
                  Connect with Gitlab <FaGitlab className="ml-3 mr-1 m-1" />
                </button>
              </div>
            )}
          </div>
          {userdata && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                margin: "20px",
                backgroundColor: "#f5f5f5",
              }}
            >
              {/* HTML JSX for userdata */}
            </div>
          )}
          <div className="branch-container">
            {branches.length > 0 ? (
              <div>
                <h2 className="font-bold text-2xl">Select your desired branch</h2>
                {branches.map((branch) => (
                  <ul key={branch} className="branch-list">
                    <li>
                      <button className="branch-buttons" onClick={() => handleSelect(branch)}>
                        {branch}
                      </button>
                    </li>
                  </ul>
                ))}
              </div>
            ) : (
              <div className="ignoretips">
                {privateBranch.length > 0 && (
                  <div>
                    <h2>Select your desired branch</h2>
                    {privateBranch.map((branch) => (
                      <ul key={branch.name} className="branch-list">
                        <li>
                          <button
                            className="branch-buttons "
                            onClick={() => {
                              setInput(privateRepolink);
                              handleSelect(branch.name);
                            }}
                          >
                            {branch.name}
                          </button>
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
                {repos.length > 0 ? (
                  <div>
                    <h2 className="font-bold text-2xl">Select your desired repository</h2>
                    {repos.map(
                      (repo) =>
                        repo.private && (
                          <ul key={repo.id} className="">
                            <li>
                              <button
                                className="repo-buttons"
                                onClick={() => {
                                  console.log(repo);
                                  console.log("User wants to clone " + repo.url);
                                  handleClonePrivate(repo.url);
                                  setPrivateRepolink(repo.ssh_url);
                                }}
                              >
                                {repo.full_name}
                              </button>
                            </li>
                          </ul>
                        )
                    )}
                  </div>
                ) : (
                  <div>
                    <h3>Connect your Github to see private repositories</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clone;
