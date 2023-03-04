import { useState } from 'react'
import './EdittableTable.css';

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

const EditableTable = () => {
  const [employeeData, setEmployeeData] = useState(old_block)

  const onChangeInput = (e, lineId) => {
    const { name, value } = e.target

    const editData = employeeData.map((item) =>
      item.lineId === lineId && name ? { ...item, [name]: value } : item
    )

    setEmployeeData(editData)
  }

  return (
    <div className="container">
      <h1 className="title">ReactJS Editable Table</h1>
      <table>
        <thead>
          <tr>
            <th className="lineNumber"></th>
            <th>OldCode</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(({ lineId, lineNumber, code_line, position }) => (
            <tr key={lineId}>
              <td className="lineNumber">
                {lineNumber}
              </td>
              <td>
                <input className="newcode"
                  name="code_line"
                  value={code_line}
                  type="text"
                  onChange={(e) => onChangeInput(e, lineId)}
                  placeholder="Type Email"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
              <thead>
                <tr>
                  <th className="lineNumber"></th>
                  <th>NewCode</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map(({ lineId, lineNumber, code_line, position }) => (
                  <tr key={lineId}>
                    <td className="lineNumber">
                      {lineNumber}
                    </td>
                    <td>
                      <input className="oldcode"
                        name="code_line"
                        value={code_line}
                        type="text"
                        onChange={(e) => onChangeInput(e, lineId)}
                        placeholder="Type Email"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    </div>
  )
}

export default EditableTable