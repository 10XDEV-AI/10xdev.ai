import OldCode from './OldCode';
import EdittableTable from './EdittableTable';

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


const new_block = [
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
  <div className="container">
    <OldCode data={old_block} />
    <EdittableTable/>
  </div>
  )
};


export default CodeTab;