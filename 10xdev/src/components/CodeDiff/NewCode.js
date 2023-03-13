import { useState } from 'react'
import './NewCode.css';

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

const EditableTable = () => {
  const [lineData, setEmployeeData] = useState(new_block)

  const onChangeInput = (e, lineId) => {
    const { name, value } = e.target

    const editData = lineData.map((item) =>
      item.lineId === lineId && name ? { ...item, [name]: value } : item
    )

    setEmployeeData(editData)
  }

  return (
      <table>
              <thead>
                <tr>
                  <th className="lineNumber"></th>
                  <th>NewCode</th>
                </tr>
              </thead>
              <tbody>
                {lineData.map(({ lineId, lineNumber, code_line, position }) => (
                  <tr key={lineId}>
                    <td className="lineNumber">
                      {lineNumber}
                    </td>
                    <td>
                      <input className="newcodelines"
                        name="code_line"
                        value={code_line}
                        type="text"
                        onChange={(e) => onChangeInput(e, lineId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
  )
}

export default EditableTable