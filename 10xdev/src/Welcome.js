import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchContext from './context/SearchContext';
import './Welcome.css';
import { callAPI } from './api';
import Cookies from 'js-cookie';
import ProjectInfo from './ProjectInfo/ProjectInfo';
import DropDownButton from './DropDownButton/DropDownButton';
import Typewriter from 'typewriter-effect';
import LoadingRing from "./Loader/Loader";

export const Welcome = () => {
  const { setSearchTerm,isLoading, setIsLoading} = useContext(SearchContext);
  const [input, setInput] = useState('');
  const [typingStarted, setTypingStarted] = useState(false);
  const navigate = useNavigate();   //for redirecting to search page

  useEffect(() => {
    const fetchData = async () => {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const code = urlParams.get('access_token');
        if (code) {
        Cookies.set('cognitoCode', code, { path: '/', secure: true, sameSite: 'strict' });
        console.log("Got the code")
        try {
            setIsLoading(true);
          await callAPI(`/api/login`, {
            method: 'GET',
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          // Handle the error
        }
      }
        setIsLoading(false);
    };

    fetchData();
  }, [navigate]);

  const search = (e) => {
    e.preventDefault();
    setSearchTerm(input);
    navigate('/chat'); // add this line to redirect to /chat
  }

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setTypingStarted(true);
  }

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
      ]

  const shuffledStrings = typewriterStrings.sort(() => Math.random() - 0.5);

  return (
    <div>
    <>
            {isLoading ? (
              <LoadingRing />
            ) : (
              <div className='container'>
                <div className="logoContainer">
                  10XDEV.AI
                </div>
                <div className="bottomText">
                  🦾Train AI on code  ❓ Explain Code  ⚠️ Fix Bugs   🔬 Create Testcases   📖  Write Documentation  🕹️Generate commands ＆ More 🪄
                </div>
                <div className='welcomesearchrow'>
                  <div className="searchbarcol" onChange={handleInputChange}>
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
                      className="mainsearchinput resize-none"
                      value={input}
                      placeholder=""
                      onClick={() => setTypingStarted(true)} // Trigger handleInputChange on click
                      onChange={handleInputChange} // Keep the onChange handler for input changes
                    />
                  </div>
                  <div className="gobuttoncol flex items-end">
                    <button className="GoButton mb-2" onClick={search}>
                      🔍
                    </button>
                  </div>
                </div>
                <div className="projectinfo">
                  <ProjectInfo />
                </div>
                <div className="userProfileContainer">
                  <DropDownButton/>
                </div>
              </div>
            )}
          </>
    </div>
    )
}


export default Welcome;
