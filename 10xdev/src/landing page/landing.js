import React from 'react';
import './landing.css';

const LandingPage = () => {
  const hostname = window.location.hostname;
  let redirectUri;

  if (hostname === 'localhost') {
    redirectUri = 'http://localhost:3000/welcome';
  } else if (hostname === 'test.10xdevai.com') {
    redirectUri = 'https://test.10xdevai.com/welcome';
  } else if (hostname === '10xdevai.com') {
    redirectUri = 'https://10xdevai.com/welcome';
  }

  return (
    <div className="landing-page">
      <h1>
        Welcome to <div className="logoLanding">10XDEV.AI</div>
      </h1>
      <h1 className="landing-text">Use the power of Auto GPT to become a 10X developer</h1>
      <p className="landing-text">Click on the button below to get started!</p>
      <a
        className="landing-link"
        href={`https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=5jjlg8ig3demen3praeuur0lea&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=${redirectUri}`}
      >
        <button className="landing-button">Get Started</button>
      </a>
    </div>
  );
};

export default LandingPage;
