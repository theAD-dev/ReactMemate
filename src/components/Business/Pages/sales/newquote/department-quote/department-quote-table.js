import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useQuery, useMutation } from '@tanstack/react-query';

import DepartmentQuoteTableRow from './department-quote-table-row';
import { calcDepartment } from '../../../../../../APIs/CalApi';
import { DepartmentQuoteTableRowLoading } from './department-quote-table-row-loading';

const DepartmentQuoteTable = React.memo(() => {
  const { data: departments, isLoading, isError } = useQuery({
    queryKey: ['calcIndexes'],
    queryFn: calcDepartment,
    enabled: true,
  });

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
            <th style={{ width: '15%' }}>Department</th>
            <th style={{ width: '25%' }}>Description</th>
            <th style={{ width: '12%' }}>Rate</th>
            <th style={{ width: '11%' }}>Qty / Unit</th>
            <th style={{ width: '11%' }}>Markup / Margin</th>
            <th style={{ width: '5%' }}>Discount</th>
            <th style={{ width: '13%' }}>Amount</th>
            <th style={{ width: '2%' }}></th>
          </tr>
        </thead>
        <Droppable droppableId="departmentQuoteTable">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {isLoading && (
                <DepartmentQuoteTableRowLoading />
              )}

              {!isLoading && !isError && departments.map((row, index) => (
                <DepartmentQuoteTableRow key={row.id} row={row} index={index} />
              ))}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </table>
    </DragDropContext>
  );
});

export default DepartmentQuoteTable;
