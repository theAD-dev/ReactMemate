import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import DepartmentQuoteTableRow from './department-quote-table-row';

const DepartmentQuoteTable = () => {
  const departments = ""

  console.log(departments);
  // Example data for rows
  const [rows, setRows] = useState([
    { id: 1, department: 'Department A', description: 'Item A', rate: 100, qty: 2, markup: 10, discount: 5, amount: 200 },
    { id: 2, department: 'Department B', description: 'Item B', rate: 150, qty: 1, markup: 8, discount: 3, amount: 150 },
    // Add more rows as needed
  ]);



  const onDragEnd = (result) => {
    // If dropped outside the list, do nothing
    if (!result.destination) {
      return;
    }

    // Reorder the rows based on the drag result
    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRows(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <table className='w-100'>
        <thead>
          <tr>
            <th style={{ width: '2%' }}></th>
            <th style={{ width: '5%', textAlign: 'center' }}>Order</th>
            <th style={{ width: '10%' }}>Department</th>
            <th style={{ width: '25%' }}>Description</th>
            <th style={{ width: '12%' }}>Rate</th>
            <th style={{ width: '11%' }}>Qty / Unit</th>
            <th style={{ width: '11%' }}>Markup / Margin</th>
            <th style={{ width: '5%' }}>Discount</th>
            <th style={{ width: '18%' }}>Amount</th>
            <th style={{ width: '2%' }}></th>
          </tr>
        </thead>
        <Droppable droppableId="departmentQuoteTable">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {rows.map((row, index) => (
                <DepartmentQuoteTableRow key={row.id} row={row} index={index}/>
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </table>
    </DragDropContext>
  );
};

export default DepartmentQuoteTable;
