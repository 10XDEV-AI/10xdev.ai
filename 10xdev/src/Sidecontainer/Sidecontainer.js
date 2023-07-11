import React, { useState } from 'react';
import './Sidecontainer.css';
import { CopyBlock, dracula } from 'react-code-blocks';

const Sidecontainer = (props) => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);

  const toggleSideContainer = () => {
    setIsContainerOpen(!isContainerOpen);
  };

  const renderUpdated = () => {
    return (
      <>
        {props.referenced_code &&
          props.referenced_code.map((block, index) => {
            const lines = block.split('\n');
            const firstLine = lines[0];
            return (
              <div
                key={index}
                style={{ marginTop: '10px', margin: '15px' }}
              >
                <div className="filename" style={{ margin: '2px' }}>
                  {firstLine}
                </div>
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
  };

  const getFileNames = () => {
    return props.files.map((file, index) => {
      const fileName = file.split('/').pop();
      return (
        <span key={index}>
          {fileName}
          {index !== props.files.length - 1 && ', '}
        </span>
      );
    });
  };

  return (
    <>
      <div
        id="mySidenav"
        className="sidenav"
        style={{ width: isContainerOpen ? '33.33%' : '0' }}
      >
        <div className="referance">References</div>
            <button
              className="closedbtn"
              onClick={() => {
                props.toggleSideContainer();
                toggleSideContainer();
              }}
            >
                <span className="closebtn">⏩</span>
            </button>
            <div style={{ textAlign: 'start', fontSize: '12px' }}>
              {renderUpdated()}
            </div>
            <div className="side-spacer">
            </div>
        </div>
      {props.files.length > 0 && (
        <div onClick={() => {
                         toggleSideContainer();
                         props.toggleSideContainer();
                       }}>
          <span>References: </span>
          <span
            onClick={() => {
              toggleSideContainer();
              props.toggleSideContainer();
            }}
            style={{
              cursor: 'pointer',
            }}
          >
            {getFileNames()}
          </span>
        </div>
      )}
    </>
  );
};

export default Sidecontainer;
