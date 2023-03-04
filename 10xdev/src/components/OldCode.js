
import './OldCode.css';

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

const OldCodeTable = () => {
return(
    <table>
        <thead>
            <tr>
                <th className="lineNumber"></th>
                <th>OldCode</th>
            </tr>
        </thead>
        <tbody>
            {old_block.map(({ lineId, lineNumber, code_line, position }) => (
            <tr key={lineId}>
                <td className="lineNumber">
                    {lineNumber}
                </td>
                <td className="oldcode">
                    {code_line}
                </td>
            </tr>
            ))}
        </tbody>
    </table>
)
}

export default OldCodeTable;