import OldCode from './OldCode';
import NewCode from './NewCode';
import './CodeTab.css';

const old_block = [
{
    lineId: '01',
    lineNumber: '01',
    code_line: '#include <stdio.h>',
  },
  {
    lineId: '02',
    lineNumber: '02',
    code_line: '#include <stdio.h>',
  },
  {
    lineId: '03',
    lineNumber: '03',
    code_line: '#include <stdio.h>',
  },
]

const userPrompt = "Please enter the file name to be created"

const CodeTab = () => {
  return (
  <div className="codetabcontainer">
      <div className="UserPromptContainer">
            <div className="userPicContainer">
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" />
            </div>
            <div className="userPrompttext">
                {userPrompt}
            </div>
            <div className="PromptOptions">
               <span className="editIcon">&#x270E;</span>
               <span className="retryIcon">&#x21BA;</span>
            </div>
      </div>
      <div className="ResponseContainer">
          <div className="responsePicContainer">
                <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar" />
          </div>
          <div className="codediffcontainer">
            <div className="filenamerow">
                <div className="file-name">
                    File Name = "test.c"
                </div>
            </div>
            <div className="codediff">
                <div className="oldcode">
                    <OldCode data={old_block} />
                </div>
                <div className="newcode">
                    <NewCode/>
                </div>
            </div>
          </div>
      </div>
  </div>
  )
};


export default CodeTab;