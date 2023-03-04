import { useState } from 'react'
import './EdittableTable.css';

const old_block = [
  {
  lineId: '01',
    lineNumber: '01',
    oldcode: '#include <stdio.h>',
  },
  {
      lineId: '02',
      lineNumber: '02',
      oldcode: '#include bijlee,js',
  }
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
        <h3>Code Diff </h3>
          <table>
                    <thead>
                      <tr>
                        <th className='lineNumber'></th>
                        <th>oldcode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.map(({lineId,lineNumber,oldcode}) => (
                        <tr key={lineId}>
                          <td className='lineNumber'>
                              {lineNumber}
                          </td>
                          <td>
                            <input className = "oldcode"
                              oldcode="oldcode"
                              value={oldcode}
                              type="text"
                              onChange={(e) => onChangeInput(e, lineId)}
                              placeholder="Type oldcode"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    <table>
                        <thead>
                          <tr>
                            <th className='lineNumber'></th>
                            <th>newcode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeData.map(({lineId,lineNumber,oldcode}) => (
                            <tr key={lineId}>
                              <td className='lineNumber'>
                                  {lineNumber}
                              </td>
                              <td>
                                <input className = "oldcode"
                                  oldcode="oldcode"
                                  value={oldcode}
                                  type="text"
                                  onChange={(e) => onChangeInput(e, lineId)}
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