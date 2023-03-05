import OldCode from './OldCode';
import EdittableTable from './EdittableTable';
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

const CodeTab = () => {
  return (
  <div className="codediffcontainer">
    <div className="row">
        <div className="file-name">
            File Name = "test.c"
        </div>
    </div>
    <div className="codediff">
        <div className="oldcode">
            <OldCode data={old_block} />
        </div>
        <div className="newcode">
            <EdittableTable/>
        </div>
    </div>
  </div>
  )
};


export default CodeTab;