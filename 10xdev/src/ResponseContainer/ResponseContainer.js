import './ResponseContainer.css';
import React,{useState} from 'react'
import { CopyBlock, dracula } from "react-code-blocks";
import Sidecontainer from '../Sidecontainer/Sidecontainer';
const ResponseContainer = ({searchResults, files,referenced_code}) => {
    console.log(files);
    console.log(referenced_code);
    console.log(searchResults);

    const [sideContainerOpen, setSideContainerOpen] = useState(false);

  const toggleSideContainer = () => {
    setSideContainerOpen(!sideContainerOpen);
  };

  function SplitBlocks(props) {
    const full_text = props.text;
    const flag = (full_text[0] === "```")? 1 : 0;
    const blocks = full_text.split("```");
    // remove the first and last \n in all blocks if it exists
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i][0] === "\n") {
            blocks[i] = blocks[i].slice(1);
        }
    }
    const mapped_blocks = blocks.map((block, index) => {
    if(flag === 0 ) {
        if (index % 2 === 0) {
        return(
        <div key={index}>
             {block.split('\n').map((sentence, i) => (
               <p key={i}>{sentence}</p>
             ))}
           </div>
            )
        }
        else{
        return(<div key={index}>
                           <CopyBlock
                             text={block}
                             language="jsx"
                             showLineNumbers={true}
                             startingLineNumber={1}
                             theme={dracula}
                             codeBlock
                           />
                         </div>)

        }
    }
    else{
        if (index % 2 === 0) {
        return(<div key={index}>
                   <CopyBlock
                     text={block}
                     language="jsx"
                     showLineNumbers={true}
                     startingLineNumber={1}
                     theme={dracula}
                     codeBlock
                   />
                 </div>)
        }
        else{
        return(
        <div key={index}>
             {block.split('\n').map((sentence, i) => (
               <p key={i}>{sentence}</p>
             ))}
           </div>
           )
        }
    }
    });

    return mapped_blocks;
  }

  return (
    <div className={`ResponseContainer ${sideContainerOpen ? 'open' : ''}`}>
      <div className={`responsePicContainer ${sideContainerOpen ? 'open' : ''}`}>
       <b> AI </b>
      </div>
      <div className="codediffcontainer">
      {searchResults && (
          <div className="codediff">
            <SplitBlocks text={searchResults}/>
            <div className="files">
              <u>
              <Sidecontainer files={files} referenced_code={referenced_code} toggleSideContainer={toggleSideContainer} sideContainerOpen={sideContainerOpen}  />
            </u>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseContainer;