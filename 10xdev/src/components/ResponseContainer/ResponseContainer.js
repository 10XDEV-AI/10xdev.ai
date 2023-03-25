import './ResponseContainer.css';
import CodeDiff from '../CodeDiff/CodeDiff';
import AI_Image from '../../images/10x.png';
import { CopyBlock, dracula } from "react-code-blocks";

const ResponseContainer = ({searchResults}) => {

  function SplitBlocks(props) {
    const full_text = props.text;
    const flag = (full_text[0] === "```")? 1 : 0;
    const blocks = full_text.split("```");
    const mapped_blocks = blocks.map((block, index) => {
    if(flag === 0 ) {
        if (index % 2 === 0) {
        return(
        <div key={index}>
            <p>{block}</p>
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
            <p>{block}</p>
        </div>)
        }
    }
    });

    return mapped_blocks;
  }

  return (
    <div className="ResponseContainer">
      <div className="responsePicContainer">
        <img src={AI_Image} alt="Avatar" className="avatar" />
      </div>
      <div className="codediffcontainer">
        {searchResults && (
          <div>
            <SplitBlocks text={searchResults}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseContainer;
