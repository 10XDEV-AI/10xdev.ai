import { useState } from 'react'
import './EdittableTable.css';

const data = [
  {
    lineNumber: '01',
    oldcode: 'John Doe',
    newcode: 'johndoe@email.com',
  },
  {
    lineNumber: '02',
    oldcode: 'Sara',
    newcode: 'sara@email.com',
  },
  {
    lineNumber: '03',
    oldcode: 'Mike',
    newcode: 'mike@email.com',
  },
]

const EditableTable = () => {
  const [employeeData, setEmployeeData] = useState(data)

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
            <th>lineNumber</th>
            <th>newcode</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(({ lineNumber, oldcode, newcode }) => (
            <tr key={lineNumber}>
              <td>
                  <input
                    oldcode="lineNumber"
                    value={lineNumber}
                    type="text"
                    onChange={(e) => onChangeInput(e, lineNumber)}
                    placeholder="Type lineNumber"
                  />
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
               <td>
                    <input
                      oldcode="lineNumber"
                      value={lineNumber}
                      type="text"
                      onChange={(e) => onChangeInput(e, lineNumber)}
                      placeholder="Type lineNumber"
                    />
                </td>
              <td>
                <input
                  name="newcode"
                  value={newcode}
                  type="text"
                  onChange={(e) => onChangeInput(e, lineNumber)}
                  placeholder="Type newcode"
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