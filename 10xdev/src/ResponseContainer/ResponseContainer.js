import './ResponseContainer.css';
import { CopyBlock, dracula } from "react-code-blocks";

const ResponseContainer = ({searchResults, files}) => {
    console.log(files);
    console.log(searchResults);
  function SplitBlocks(props) {
    const full_text = props.text;
    const flag = (full_text[0] === "```\n")? 1 : 0;
    const blocks = full_text.split("```\n");
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
    <div className="ResponseContainer">
      <div className="responsePicContainer">
       <b> AI </b>
      </div>
      <div className="codediffcontainer">
        {searchResults && (
          <div className="codediff">
            <SplitBlocks text={searchResults}/>
            <div className="files">
              <u>
                {files}
              </u>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseContainer;