import React, { useState } from 'react'
import { Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

const DepartmentQuoteTableRow = ({ row, index }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const toggleRow = (rowId) => {
    if (expandedRows.length) {
      setExpandedRows([]);
      return;
    }
    // call api
    setExpandedRows([
      { id: 1, item: 'Department Item A', description: 'Item A', rate: 100, qty: 2, markup: 10, discount: 5, amount: 200 },
      { id: 2, item: 'Department Item B', description: 'Item B', rate: 150, qty: 1, markup: 8, discount: 3, amount: 150 },
    ]);
  }

  const closeRow = () => { }

  return (
    <React.Fragment>
      <Draggable draggableId={`row-${row.id}`} index={index}>
        {(provided) => (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              cursor: 'default',
            }}
          >
            <td {...provided.dragHandleProps} style={{ width: "2%" }}>
              <DragIndicator style={{ cursor: 'move' }} />
            </td>

            <td style={{ width: '5%', textAlign: 'center' }}>
              <div className='d-flex align-items-center'>
                <Checkbox />
                {index + 1}
              </div>
            </td>
            <td style={{ width: '10%' }}>
              <div className='d-flex w-100 justify-content-between'>
                {row.department}
                <ExpandMore style={{ cursor: 'pointer' }} onClick={() => toggleRow(row.id)}/>
              </div>
            </td>
            <td style={{ width: '25%' }}>{row.description}</td>
            <td style={{ width: '12%' }}>{row.rate}</td>
            <td style={{ width: '11%' }}>{row.qty}</td>
            <td style={{ width: '11%' }}>{row.markup}</td>
            <td style={{ width: '5%' }}>{row.discount}</td>
            <td style={{ width: '18%' }}>{row.amount}</td>
            <td style={{ width: '2%' }}>
              <Delete />
            </td>
          </tr>
        )}
      </Draggable>

      {expandedRows && expandedRows.map((row) =>
        <tr key={row.id}>
          <td colSpan={10}>
            <tr>
              <td style={{ width: '10%' }}>
                <select>
                  <option>
                    {row.item}
                  </option>
                </select>
              </td>
              <td style={{ width: '25%' }}>{row.description}</td>
              <td style={{ width: '15%' }}>{row.rate}</td>
              <td style={{ width: '15%' }}>{row.qty}</td>
              <td style={{ width: '15%' }}>{row.markup}</td>
              <td style={{ width: '5%' }}>{row.discount}</td>
              <td style={{ width: '20%' }}>{row.amount}</td>
            </tr>
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}

export default DepartmentQuoteTableRow;