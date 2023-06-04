import React from 'react';
import './landing.css';
import Typewriter from 'typewriter-effect';
const LandingPage = () => {
  const hostname = window.location.hostname;
  let redirectUri;

  if (hostname === 'localhost') {
    redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fwelcome';
  } else if (hostname === 'test.10xdevai.com') {
    redirectUri = 'https%3A%2F%2Ftest.10xdevai.com%2Fwelcome';
  } else if (hostname === '10xdevai.com') {
    redirectUri = 'https%3A%2F%2F10xdevai.com%2Fwelcome';
  }

  return (
    <div className="landing-page">
      <h1>
        Welcome to <div className="logoLanding">
        <Typewriter
  options={{
    strings: ['10XDEV.AI'],
    autoStart: true,
    loop: true,
  }}
/>
        </div>
      </h1>
      <h1 className="landing-text">Use the power of Auto GPT to become a 10X developer</h1>
      <p className="landing-text">Click on the button below to get started!</p>
      
      <a
        className="landing-link"
      
        href={`https://10xdevgoogleauth.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=7rj9u2ntqm57fsqeod3lmgloag&response_type=token&scope=email+openid+phone&redirect_uri=${redirectUri}`}
      >
        <button className="landing-button">Get Started</button>
      </a>
    </div>
  );
};

export default LandingPage;
