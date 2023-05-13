import React from 'react';
import './CoolAlert.css';

const CoolAlert = ({ message,setclicked }) => {
  return (
    <div className="cool-alert">
      <div className="cool-alert-content">
        <span className="cool-alert-icon">&#x2714;</span>
        <p className="cool-alert-message">{message}</p>
        <button className="alert-button" onClick={setclicked} > Go Back⏩ </button>
      </div>
    </div>
  );
};

export default CoolAlert;
