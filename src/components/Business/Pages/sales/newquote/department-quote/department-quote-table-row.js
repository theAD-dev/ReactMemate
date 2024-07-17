import React, { useState } from 'react'
import { Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

import DepartmentQuoteTableInsideRow from './department-quote-table-inside-row';

const DepartmentQuoteTableRow = React.memo(({ row, index }) => {
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
            <td style={{ width: '15%' }}>
              <div className='d-flex w-100 justify-content-between'>
                {row.name}
              </div>
            </td>
            <td style={{ width: '25%' }}>
              <textarea value={row.description}></textarea>
            </td>
            <td style={{ width: '12%' }}>
              {
                row.type == 'Cost of sale'
                  ? <input type='text' value={row.cost} />
                  : <input type='text' value={row.per_hour} />
              }
            </td>
            <td style={{ width: '11%' }}>
              {row.qty}
              <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                {
                  row.type == 'Cost of sale'
                    ? <input type='text' value={row.quantity || 1} />
                    : <input type='text' value={row.assigned_hours || 1} />
                }
                <select value={"Hourly"} onChange={() => { }}>
                  <option value="Cost of sale">1/Q</option>
                  <option value="Hourly">1/H</option>
                </select>
              </div>
            </td>
            <td style={{ width: '11%' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                <input type='text' value={row.margin || 0.00} />
                <select value={"margin"}>
                  <option value={"margin"}>Margin  %</option>
                  <option value={"amount"}>Amount $</option>
                  <option value={"markup"}>Markup %</option>
                </select>
              </div>
            </td>
            <td style={{ width: '5%' }}>
              <input type='text' value={`${row.discount || 0}%`} />
            </td>
            <td style={{ width: '13%' }}>$ {row.total}</td>
            <td style={{ width: '2%' }}>
              <Delete />
            </td>
          </tr>
        )}
      </Draggable>
    </React.Fragment>
  )
});

export default DepartmentQuoteTableRow;