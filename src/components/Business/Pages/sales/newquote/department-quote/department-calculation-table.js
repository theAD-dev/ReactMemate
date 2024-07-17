import React, { useEffect, useState } from 'react';
import { Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

const DepartmentCalculationTableBody = ({ rows, onDragEnd, updateData, deleteRow, departments, handleChange }) => {
    return (
        <>
            {Object.entries(rows).map(([key, values], id) => (
                <React.Fragment key={key}>
                    {
                        values?.map((value, index) =>
                            <Draggable draggableId={`row-${key}`} key={`${key}-${value.id}`} index={id}>
                                {(provided) => (
                                    <tr
                                        key={value.id}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            cursor: 'default',
                                        }}
                                    >
                                        <td {...provided.dragHandleProps} style={{ width: "2%" }}>
                                            {
                                                index === 0 && <DragIndicator style={{ cursor: 'move' }} />
                                            }
                                        </td>
                                        <td style={{ width: '5%', textAlign: 'center' }}>
                                            {
                                                index === 0 && (
                                                    <div className='d-flex align-items-center'>
                                                        <Checkbox className="checkbox" style={{ visibility: 'hidden' }} />
                                                        {id + 1}
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{ width: '15%' }}>
                                            {
                                                index === 0 && (
                                                    <>
                                                        <SelectComponent departments={departments} handleChange={handleChange} isShowlabel={true} title={value.label} />
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
                                )}
                            </Draggable>
                        )
                    }
                </React.Fragment>
            ))}
        </>
    );
}

const DepartmentCalculationTable = ({ totals, setTotals }) => {
    const [rows, setRows] = useState({});
    const [subItem, setSubItem] = useState(null);
    const [subItemLabel, setSubItemLabel] = useState(null);
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

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        const keys = Object.keys(rows);
        const sourceKey = keys[source.index];
        const destinationKey = keys[destination.index];

        if (!sourceKey || !destinationKey) {
            console.error('Invalid source or destination key.');
            return;
        }

        // Reorder keys
        const reorderedKeys = Array.from(keys);
        const [removedKey] = reorderedKeys.splice(source.index, 1);
        reorderedKeys.splice(destination.index, 0, removedKey);

        // Rebuild the rows object with reordered keys
        const reorderedRows = reorderedKeys.reduce((acc, key) => {
            acc[key] = rows[key];
            return acc;
        }, {});

        setRows(reorderedRows);
    };

    const handleChange = (subitemId, label) => {
        if (subitemId) setSubItem(subitemId);
        if (label) setSubItemLabel(label)
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
        if (data && data.length) data[0].label = subItemLabel;
        else if (data && data.length === 0) {
            data.push({})
            data[0].label = subItemLabel;
        }

        if (subItem && !rows[subItem])
            setRows((prevRows) => ({
                ...prevRows,
                [`_${subItem}_`]: data,
            }));

    }, [data]);

    const calculateSummary = () => {
        let budget = 0;
        let subtotal = 0;

        Object.values(rows).forEach(departmentRows => {
            departmentRows.forEach(item => {
                let rate = item.type === "Hourly" ? parseFloat(item.per_hour) || 0 : parseFloat(item.cost) || 0;
                let quantity = item.type === "Hourly" ? parseFloat(item.assigned_hours) || 0 : parseFloat(item.quantity) || 0;
                let cost = rate * quantity;
                budget += parseFloat(cost || 0);
                subtotal += parseFloat(item.total || 0);
            });
        });

        const tax = subtotal * 0.10;
        const total = subtotal + tax;
        const operationalProfit = subtotal - budget;

        return {
            budget: budget.toFixed(2),
            operationalProfit: operationalProfit.toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    }

    useEffect(() => {
        const summary = calculateSummary();
        setTotals(summary);
    }, [rows]);
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <table className='w-100 department-calculation'>
                <DepartmentCalculationTableHead />
                <Droppable droppableId="departmentQuoteTable">
                    {(provided) => (
                        <tbody {...provided.droppableProps} ref={provided.innerRef}>
                            <DepartmentCalculationTableBody
                                rows={rows}
                                onDragEnd={onDragEnd}
                                updateData={updateData}
                                deleteRow={deleteRow}
                                departments={departments}
                                handleChange={handleChange}
                            />
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>

            <div style={{ width: '250px', padding: '10px' }}>
                <SelectComponent departments={departments} handleChange={handleChange} isShowlabel={false} />
            </div>

        </DragDropContext>
    )
}

export default DepartmentCalculationTable;