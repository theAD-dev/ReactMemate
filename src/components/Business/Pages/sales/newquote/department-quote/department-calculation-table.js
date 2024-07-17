import React, { useEffect, useState } from 'react';
import { Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useQuery, useMutation } from '@tanstack/react-query';
import Select from 'react-select';
import { Checkbox } from '@mui/material';

import { calcDepartment } from '../../../../../../APIs/CalApi';
import { calcReferenceId } from '../../../../../../APIs/CalApi';
import SelectComponent from './select-component';

const DepartmentCalculationTableHead = () => {
    return (
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
    )
}

const DepartmentCalculationTableBody = ({ rows, onDragEnd, updateData, deleteRow }) => {
    return (
        <>
            {Object.entries(rows).map(([key, values], id) => (
                <React.Fragment key={key}>
                    {
                        values?.map((value, index) =>
                            <tr key={value.id}>
                                <td style={{ width: "2%" }}>
                                    {
                                        index === 0 && <DragIndicator style={{ cursor: 'move' }} />
                                    }
                                </td>
                                <td style={{ width: '5%', textAlign: 'center' }}>
                                    {
                                        index === 0 && (
                                            <div className='d-flex align-items-center'>
                                                <Checkbox className="checkbox" style={{ visibility: 'hidden' }}/>
                                                {id + 1}
                                            </div>
                                        )
                                    }
                                </td>
                                <td style={{ width: '15%' }}>
                                    {
                                        index === 0 && (
                                            <>
                                            {value.title}
                                            <Select value={value.title}/>
                                            </>
                                        )
                                    }
                                </td>
                                <td style={{ width: '25%' }}>
                                    <textarea value={value.description}
                                        onChange={(e) => updateData(key, value.id, 'description', e.target.value)}
                                    ></textarea>
                                </td>
                                <td style={{ width: '12%' }}>
                                    <div className='d-flex align-items-center'>
                                        <span>$</span>
                                        <input
                                            type="text"
                                            style={{ padding: '4px' }}
                                            value={
                                                value.type === "Hourly"
                                                    ? `${value.per_hour || '0.00'}`
                                                    : `${value.cost || '0.00'}`
                                            }
                                            onChange={
                                                value.type === "Hourly"
                                                    ? (e) => updateData(key, value.id, 'per_hour', e.target.value)
                                                    : (e) => updateData(key, value.id, 'cost', e.target.value)
                                            }
                                        />
                                    </div>
                                </td>
                                <td style={{ width: '11%' }}>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type="text"
                                            style={{ padding: '4px' }}
                                            value={
                                                value.type === "Hourly"
                                                    ? `${value.assigned_hours || '0.00'}`
                                                    : `${value.quantity || '0.00'}`
                                            }
                                            onChange={
                                                value.type === "Hourly"
                                                    ? (e) => updateData(key, value.id, 'assigned_hours', e.target.value)
                                                    : (e) => updateData(key, value.id, 'quantity', e.target.value)
                                            }
                                        />
                                        <select value={value.type} onChange={(e) => updateData(key, value.id, 'type', e.target.value)}>
                                            <option value="Cost of sale">1/Q</option>
                                            <option value="Hourly">1/H</option>
                                        </select>
                                    </div>
                                </td>
                                <td style={{ width: '11%' }}>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type="text"
                                            style={{ padding: '4px' }}
                                            value={value.margin}
                                            onChange={(e) => updateData(key, value.id, 'margin', e.target.value)}
                                        />
                                        <select value={value.margin_type} onChange={(e) => updateData(key, value.id, 'margin_type', e.target.value)}>
                                            <option value={"margin"}>MRG %</option>
                                            <option value={"amount"}>Amt $</option>
                                            <option value={"markup"}>MRK %</option>
                                        </select>
                                    </div>
                                </td>
                                <td style={{ width: '5%' }}>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type="text"
                                            style={{ width: '30px', padding: '4px' }}
                                            value={`${value.discount || 0}`}
                                            onChange={(e) => updateData(key, value.id, 'discount', e.target.value)}
                                        />
                                        <span>%</span>
                                    </div>
                                </td>
                                <td style={{ width: '13%' }}>$ {value.total}</td>
                                <td style={{ width: '2%' }}>
                                    <Delete onClick={() => deleteRow(key, value.id)} />
                                </td>
                            </tr>
                        )
                    }
                </React.Fragment>
            ))}
        </>
    );
}

const DepartmentCalculationTable = ({ totals, setTotals }) => {
    const [rows, setRows] = useState({});
    console.log('rows: ', rows);
    const [subItem, setSubItem] = useState(null);
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

    const options = departments?.map(item => ({
        value: item.id,
        label: item.name,
        options: item.subindexes.map(subitem => ({
            value: subitem.id,
            label: subitem.name
        }))
    }));

    const onDragEnd = (result) => {

    }

    const handleChange = (e) => {
        console.log('e: ', e);
        const subitemId = e.value;
        if (subitemId) setSubItem(subitemId);
    }

    const calculateTotal = (item) => {
        let rate = item.type === "Hourly" ? parseFloat(item.per_hour) || 0 : parseFloat(item.cost) || 0;
        let quantity = item.type === "Hourly" ? parseFloat(item.assigned_hours) || 0 : parseFloat(item.quantity) || 0;
        let subtotal = rate * quantity;

        let margin = parseFloat(item.margin) || 0;
        if (item.margin_type === "markup") {
            subtotal += (subtotal * margin) / 100;
        } else if (item.margin_type === "margin") {
            subtotal = subtotal / (1 - margin / 100);
        } else if (item.margin_type === "amount") {
            subtotal += margin;
        }

        let discount = parseFloat(item.discount) || 0;
        let total = subtotal - (subtotal * discount) / 100;

        return total.toFixed(2);
    }

    const updateData = (key, id, type, value) => {
        setRows(prevRows => {
            const updatedRows = {
                ...prevRows,
                [key]: prevRows[key].map(item => {
                    if (item.id === id) {
                        const updatedItem = { ...item, [type]: value };
                        updatedItem.total = calculateTotal(updatedItem);
                        return updatedItem;
                    }
                    return item;
                })
            };
            return updatedRows;
        });
    };

    const deleteRow = (key, id) => {
        setRows(prevRows => {
            const updatedRows = {
                ...prevRows,
                [key]: prevRows[key].filter(item => item.id !== id)
            };

            if (updatedRows[key].length === 0) delete updatedRows[key];

            return updatedRows;
        });
    };

    useEffect(() => {
        console.log('data: ', data);

        if (subItem && !rows[subItem])
            setRows((prevRows) => ({
                ...prevRows,
                [`_${subItem}_`]: data,
            }));

    }, [data]);

    useEffect(()=> {

    }, [rows])
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <table className='w-100 department-calculation'>
                <DepartmentCalculationTableHead />
                <Droppable droppableId="departmentQuoteTable">
                    {(provided) => (
                        <tbody {...provided.droppableProps} ref={provided.innerRef}>
                            <DepartmentCalculationTableBody rows={rows} onDragEnd={onDragEnd} updateData={updateData} deleteRow={deleteRow} />
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
            <div style={{ width: '250px' }}>
                <Select options={options} onChange={handleChange} className="my-4" />
            </div>
            <SelectComponent/>
        </DragDropContext>
    )
}

export default DepartmentCalculationTable;