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
  let client_id;
    if (hostname === 'localhost') {
        const client_id = "eaae8a43278892ed15e1";
    } else if (hostname === 'test.10xdevai.com') {
        const client_id = "7de77ae768aa62b79e09";
    } else if (hostname === '10xdevai.com') {
        const client_id = "eaae8a43278892ed15e1";
    }
  const [userdata, setUserData] = useState(null);
  const [isauthenticated, setIsAuthenticated] = useState(false);
  const [repos, setRepos] = useState([]);
  const [privateRepolink, setPrivateRepolink] = useState([]);
  const [privateBranch, setPrivateBranch] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);

  const handleClone = async (repo) => {
    setIsLoading(true);
    try {
      const data = await callAPI(`/api/clone?path=${repo}`, {
        method: "GET",
      });
      console.log(data);
      setBranches(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const loginWithGithub = () => {
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
      const response = await callAPI(
        `/api/github/getuser?access_token=${accessToken}`,
        {
          method: "GET",
        }
      );
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
      const response = await callAPI(
        `/api/github/getallrepos?access_token=${accessToken}`,
        {
          method: "GET",
        }
      );
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
      const data = await callAPI(
        `/api/setBranch?path=${input}&branch=${branch}`,
        {
          method: "GET",
        }
      );
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
            <div className="pathsearchlabel">Add public repo URL:</div>
            <label className="pathsearchrow">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                className="pathsearchbar"
              />
            </label>
            <button
              onClick={() => handleClone(input)}
              className="gitIgnorebutton"
            >
              clone
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
              <h3>Add Your Private Repository</h3>
            </div>
            {isauthenticated ? (
              <div></div>
            ) : (
              <div>
                <button
                  onClick={loginWithGithub}
                  className="gitIgnorebutton"
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Connect with Github <BsGithub />
                </button>
                <button className="gitIgnorebutton">
                  Connect with Gitlab <FaGitlab />
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
              <div>
                <div></div>
                <img
                  src={userdata.avatar_url}
                  height="50"
                  style={{
                    borderRadius: "50%",
                  }}
                  width="50"
                  alt="avatar"
                />
                <div>{userdata.name}</div>
                <div>Public Repos: {userdata.public_repos}</div>
              </div>
            </div>
          )}
          <div className="branch-container">
            {branches.length > 0 ? (
              <div className="ignoretips">
                <h2>Select your desired branch</h2>
                {branches.map((branch) => (
                  <ul key={branch} className="branch-list">
                    <li>
                      <button
                        className="branch-buttons"
                        onClick={() => handleSelect(branch)}
                      >
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
                            className="branch-buttons"
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
                    <h2>Select your desired repository</h2>
                    {repos.map(
                      (repo) =>
                        repo.private && (
                          <ul
                            key={repo.id}
                            style={{
                              display: "flex",
                              listStyle: "none",
                              alignContent: "start",
                              justifyContent: "start",
                              alignItems: "start",
                            }}
                          >
                            <li>
                              <button
                                className="branch-buttons"
                                onClick={() => {
                                  setPrivateRepolink(repo.clone_url);
                                  getPrivateBranches(repo.branches_url);
                                  handleClone(repo.clone_url)
                                  setRepos([]);
                                }}
                              >
                                {repo.name}
                              </button>
                            </li>
                          </ul>
                        )
                    )}
                  </div>
                ) : (
                  <div>
                    <h2>💡 Tips on training Repository</h2>
                    <ul>
                      <li>
                        Add big folders and packages not in use to Ignore
                        file
                      </li>
                      <li>
                        Add any other files that are not required for training
                      </li>
                      <li>Break down big files into smaller files</li>
                      <li>Works well with small files</li>
                      <li>Works well for files with comments</li>
                    </ul>
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
