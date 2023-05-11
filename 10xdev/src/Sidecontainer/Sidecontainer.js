import React from 'react'
import "./Sidecontainer.css"
import { CopyBlock, dracula } from "react-code-blocks";
const Sidecontainer = (props) => {
  return (
    <>
      <div
        id="mySidenav"
        className="sidenav bg"
        style={{ width: props.sideContainerOpen ? "350px" : "0" }}
      > <div className="referance " >References</div>
        <button  className="closedbtn" onClick={props.toggleSideContainer}>
          ⏩
        </button>
        <div style={{textAlign: 'start',fontSize: '12px'}}>
        {props.referenced_code && props.referenced_code.map((block, index) => {
    // Split the block into lines
    const lines = block.split('\n');
    // Get the first line of the code block
    const firstLine = lines[0];
    
    return (
        <div key={index} style={{ marginTop: '10px' }}>
            {/* Display the first line in an h3 tag */}
            <div className="filename">{firstLine}</div>

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

        </div>
      </div>
      <span
        onClick={props.toggleSideContainer}
        style={{
          cursor: "pointer",
        }}
      >
        {props.files}
      </span>
    </>
  );
}


export default Sidecontainer