import { useState } from 'react'
import './EdittableTable.css';

const old_block = [
  {
    lineNumber: '01',
    oldcode: '#include <stdio.h>',
  },
  {
      lineNumber: '02',
      oldcode: '#include bijlee,js',
  }
]

const EditableTable = () => {
  const [employeeData, setEmployeeData] = useState(old_block)

  const onChangeInput = (e, lineNumber) => {
    const { name, value } = e.target

    const editData = employeeData.map((item) =>
      item.lineNumber === lineNumber && name ? { ...item, [name]: value } : item
    )

    setEmployeeData(editData)
  }

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>lineNumber</th>
            <th>oldcode</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(({lineNumber,oldcode}) => (
            <tr key={lineNumber}>
              <td>
                  {lineNumber}
              </td>
              <td>
                <input
                  oldcode="oldcode"
                  value={oldcode}
                  type="text"
                  onChange={(e) => onChangeInput(e, lineNumber)}
                  placeholder="Type oldcode"
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