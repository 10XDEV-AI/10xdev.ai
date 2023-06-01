import React from 'react';
import "./landing.css"
const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to 
      <div className="logoLanding"> 10XDEV.AI</div>
      </h1>
      <h1 className="landing-text">Use the power of Auto GPT to become a 10X developer</h1>
      <p className="landing-text">Click on the button below to get started!</p>
        {/*a1 - DEV a2- UAT a3- Production
        <a className="landing-link" href="https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=5jjlg8ig3demen3praeuur0lea&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fwelcome">
        <a className="landing-link" href="https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=5jjlg8ig3demen3praeuur0lea&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=http%3A%2F%2Ftest.10xdevai.com%2Fwelcome">
        <a className="landing-link" href="https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=5jjlg8ig3demen3praeuur0lea&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=https%3A%2F%2F10xdevai.com%2Fwelcome">
        */}
        <a className="landing-link" href="https://10xdevai.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=5jjlg8ig3demen3praeuur0lea&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=http%3A%2F%2Ftest.10xdevai.com%2Fwelcome">
            <button className="landing-button">Get Started</button>
        </a>
    </div>
  );
};

export default LandingPage;
