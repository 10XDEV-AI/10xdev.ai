import "./ResponseContainer.css";
import React from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import Sidecontainer from "../Sidecontainer/Sidecontainer";
const ResponseContainer = ({
  searchResults,
  files,
  referenced_code,
  toggleSideContainer,
  sideContainerOpen,
}) => {
  function SplitBlocks(props) {
    const full_text = props.text;
    const flag = full_text[0] === "```" ? 1 : 0;
    const blocks = full_text.split("```");

    // List of supported languages
    const supportedLanguages = [
      "python", "javascript", "java", "c++", "c#", "ruby", "swift", "go", "php",
      "typescript", "kotlin", "rust", "matlab", "r", "bash", "html/css", "sql",
      "assembly", "perl", "lua", "objective-c", "scala", "haskell", "lisp", "prolog",
      "fortran", "vb", "dart", "tcl", "groovy"
    ];

    // Helper function to check if a language is supported
    const isLanguageSupported = (language) => {
      return supportedLanguages.includes(language.toLowerCase());
    };

    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i][0] === "\n") {
        blocks[i] = blocks[i].slice(1);
      }
    }

    const mapped_blocks = blocks.map((block, index) => {
      if (flag === 0) {
        if (index % 2 === 0) {
          return (
            <div key={index}>
              {block.split("\n").map((sentence, i) => (
                <p key={i} className="mb-4">
                  {sentence}
                </p>
              ))}
            </div>
          );
        } else {
          const language = block.split("\n")[0].trim(); // Get the second word after splitting by space
          console.log("XYZ 1:")
          console.log(language)

          // Check if the language is supported
          if (isLanguageSupported(language)) {
            // If supported, remove the language from the block
            block = block.replace(language, "").trim();
            return (
              <div key={index}>
                <CopyBlock
                  text={block}
                  language={language}
                  showLineNumbers={true}
                  startingLineNumber={1}
                  theme={dracula}
                  codeBlock
                />
              </div>
            );
          } else {
            // If not supported, pass the entire block
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
        }
      } else {
        if (index % 2 === 0) {
          const language = block.split(" ")[1].trim(); // Get the second word after splitting by space
          console.log("XYZ 2:")
          console.log(language)

          // Check if the language is supported
          if (isLanguageSupported(language)) {
            // If supported, remove the language from the block
            block = block.replace(language, "").trim();
            return (
              <div key={index}>
                <CopyBlock
                  text={block}
                  language={language}
                  showLineNumbers={true}
                  startingLineNumber={1}
                  theme={dracula}
                  codeBlock
                />
              </div>
            );
          } else {
            // If not supported, pass the entire block
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
        } else {
          return (
            <div key={index}>
              {block.split("\n").map((sentence, i) => (
                <p key={i} className="mb-4">
                  {sentence}
                </p>
              ))}
            </div>
          );
        }
      }
    });

    return mapped_blocks;
  }


  return (
    <div className={"ResponseContainer max-w-full"}>
      <div className="responsePicContainer text-gray-800">
        <b> AI </b>
      </div>
      <div className="codediffcontainer">
        {searchResults && (
          <div className="codediff">
            <SplitBlocks text={searchResults} />
            <div className="files">
              <u>
                <Sidecontainer
                  files={files}
                  referenced_code={referenced_code}
                  toggleSideContainer={toggleSideContainer}
                  sideContainerOpen={sideContainerOpen}
                />
              </u>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseContainer;
