import React from 'react';
import "./landing.css"
const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to 
      <div className="logoLanding"> 10XDEV.AI</div>
      </h1>
      <p className="landing-text">Discover the power of accelerated development!</p>
      <p className="landing-text">10xdev.ai is a tool that helps you find the code you need to build your application.</p>
      <p className="landing-text">It uses the power of GPT-3 to find the code you need to build your application.</p>
      <p className="landing-text">Click on the button below to get started!</p>
      <a className="landing-link" href="https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=5jjlg8ig3demen3praeuur0lea&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=https%3A%2F%2Ftest.10xdevai.com">
        <button className="landing-button">Get Started</button>
      </a>
    </div>
  );
};

export default LandingPage;
