import React, { useState } from 'react'
import { Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

import DepartmentQuoteTableInsideRow from './department-quote-table-inside-row';

const DepartmentQuoteTableRow = React.memo(({ row, index }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  
  const toggleRow = (rowId) => {
    setIsOpened(!isOpened);
  };

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
                <ExpandMore style={{ cursor: 'pointer' }} onClick={() => toggleRow(row.id)}/>
              </div>
            </td>
            <td style={{ width: '25%' }}>{row.description}</td>
            <td style={{ width: '12%' }}>{row.rate}</td>
            <td style={{ width: '11%' }}>{row.qty}</td>
            <td style={{ width: '11%' }}>{row.markup}</td>
            <td style={{ width: '5%' }}>{row.discount}</td>
            <td style={{ width: '13%' }}>{row.amount}</td>
            <td style={{ width: '2%' }}>
              <Delete />
            </td>
          </tr>
        )}
      </Draggable>

      { isOpened && <DepartmentQuoteTableInsideRow row={row} expandedRows={expandedRows} setExpandedRows={setExpandedRows} /> }
    </React.Fragment>
  )
});

export default DepartmentQuoteTableRow;