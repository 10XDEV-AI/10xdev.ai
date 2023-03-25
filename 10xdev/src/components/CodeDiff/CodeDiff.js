import NewCode from './NewCode';
import OldCode from './OldCode';
import './CodeDiff.css';

const CodeDiff = () => {
  return (
    <div className="codediff">
        <div className="filenamerow">
            <div className="file-name">
              File Name = "test.c"
            </div>
        </div>
        <div className="codeRow">
            <div className="oldcode">
                <OldCode />
            </div>
            <div className="newcode">
                <NewCode />
            </div>
        </div>
    </div>
  );
}

export default CodeDiff;