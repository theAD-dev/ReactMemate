import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DragIndicator } from '@mui/icons-material';
import Select from 'react-select';

import { Delete } from '@mui/icons-material';

import DepartmentQuoteTableRow from './department-quote-table-row';
import { calcDepartment } from '../../../../../../APIs/CalApi';
import { calcReferenceId } from '../../../../../../APIs/CalApi';
import { DepartmentQuoteTableRowLoading } from './department-quote-table-row-loading';
import SelectComponent from './select-component';

const DepartmentQuoteTable = React.memo(() => {
  const [subItem, setSubItem] = useState(null);
  const [rows, setRows] = useState([]);
  const { data: departments, isLoading, isError } = useQuery({
    queryKey: ['calcIndexes'],
    queryFn: calcDepartment,
    enabled: true,
  });
  const { isLoadingSubIndex, error, data, refetch } = useQuery({
    queryKey: ['calcReferenceId', subItem],
    queryFn: () => calcReferenceId(subItem),
    enabled: !!subItem,
    retry: 1,
  });

  useEffect(()=> {
    setRows(data);
    console.log('data: ', data);
  }, [data])

  console.log('departments: ', departments);


  const options = departments?.map(item => ({
    value: item.id,
    label: item.name,
    options: item.subindexes.map(subitem => ({
      value: subitem.id,
      label: subitem.name
    }))
  }));

  const onDragEnd = (result) => {
    if (!result.destination) { // If dropped outside the list, do nothing
      return;
    }

    // Reorder the rows based on the drag result
    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRows(items);
  };

  const handleChange = (e) => {
    const subitemId = e.value;
    if (subitemId) setSubItem(subitemId);
  }

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

              {rows?.map((row, index) => (
                <DepartmentQuoteTableRow key={row.id} row={row} index={index} />
              ))}

              <tr>
                <td style={{ width: "2%" }}>
                  <DragIndicator style={{ cursor: 'not-allowed' }} />
                </td>
                <td style={{ width: '5%', textAlign: 'center' }}></td>
                <td style={{ width: '15%' }}>
                  <Select options={options} onChange={handleChange} />
                </td>
                <td style={{ width: '25%' }}>
                  <textarea></textarea>
                </td>
                <td style={{ width: '12%' }}>
                  $0
                </td>
                <td style={{ width: '11%' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                    <input type='text' value={0.00} />
                    <select value={"Hourly"} onChange={() => { }}>
                      <option value="Cost of sale">1/Q</option>
                      <option value="Hourly">1/H</option>
                    </select>
                  </div>
                </td>
                <td style={{ width: '11%' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                    <input type='text' value={0.00} />
                    <select value={"margin"}>
                      <option value={"margin"}>Margin  %</option>
                      <option value={"amount"}>Amount $</option>
                      <option value={"markup"}>Markup %</option>
                    </select>
                  </div>
                </td>
                <td style={{ width: '5%' }}>0%</td>
                <td style={{ width: '13%' }}>$ 0.00</td>
                <td style={{ width: '2%' }}>
                  <Delete />
                </td>
              </tr>

              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </table>
    </DragDropContext>
  );
});

export default DepartmentQuoteTable;
