import React, { useState, useEffect } from 'react';
import "./Sidecontainer.css";
import { CopyBlock, dracula } from "react-code-blocks";

const Sidecontainer = (props) => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);

  const toggleSideContaine = () => {
    setIsContainerOpen(!isContainerOpen);
  };

  const renderUpdated = () => {
    return (
      <>
        {props.referenced_code && props.referenced_code.map((block, index) => {
          const lines = block.split('\n');
          const firstLine = lines[0];
          return (
            <div key={index} style={{ marginTop: '10px', margin: "15px" }}>
              <div className="filename" style={{ margin: "2px" }}>{firstLine}</div>
              <CopyBlock
                style={{ overflowX: 'hidden' }}
                text={block.replace(/^.+\n/, '')}
                language="jsx"
                showLineNumbers={true}
                startingLineNumber={1}
                theme={dracula}
                codeBlock
              />
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      <div
        id="mySidenav"
        className="sidenav bg"
        style={{ width: isContainerOpen ? "30%" : "0" }}
      >
        <div className="referance">References</div>
        <button className="closedbtn" onClick={()=>{props.toggleSideContainer(); 
        toggleSideContaine();}}>
          ⏩
        </button>
        <div style={{ textAlign: 'start', fontSize: '12px' }}>
          {renderUpdated()}
        </div>
      </div>
      <span
        onClick={()=>{
          toggleSideContaine();
          props.toggleSideContainer()}}
        style={{
          cursor: "pointer",
        }}
      >
        {props.files}
      </span>
    </>
  );
}

export default Sidecontainer;
