import './ResponseContainer.css';
import CodeDiff from '../CodeDiff/CodeDiff';
import AI_Image from '../../images/10x.png';
import { CopyBlock, dracula } from "react-code-blocks";

const ResponseContainer = ({searchResults}) => {

  function SplitBlocks(props) {
    const text = props.text;
    const blocks = text.split("```").map((block, index) => {
      if (index % 2 === 0) {
        // This is normal text
        return (
          <div key={index}>
            <p>{block}</p>
          </div>
        );
      } else {
        // This is code
        return (
          <div key={index}>
            <CopyBlock
              text={block}
              language="jsx"
              showLineNumbers={true}
              startingLineNumber={1}
              theme={dracula}
              codeBlock
            />
          </div>
        );
      }
    });
    return blocks;
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
