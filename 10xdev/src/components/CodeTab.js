import CodeDiff from './CodeDiff/CodeDiff';
import './CodeTab.css';
import { useState } from 'react';
import UserPrompt from './UserPrompt/UserPrompt';


const CodeTab = () => {

  return (
    <div className="codetabcontainer">
      <div className="UserPromptContainer">
        <UserPrompt/>
      </div>
      <div className="ResponseContainer">
        <div className="responsePicContainer">
          <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar" />
        </div>
        <div className="codediffcontainer">
          <div className="codediff">
            <CodeDiff/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTab;
