import React, { useEffect, useState } from 'react';
import { Delete, DragIndicator, ExpandMore } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronDown, GripVertical, Trash } from 'react-bootstrap-icons';
import { Checkbox } from '@mui/material';

import { calcDepartment } from '../../../../../../APIs/CalApi';
import { calcReferenceId } from '../../../../../../APIs/CalApi';
import SelectComponent from './select-component';
import { DepartmentQuoteTableRowLoading } from './department-quote-table-row-loading';
import './select-component.css';
import { Button } from 'react-bootstrap';

const DepartmentCalculationTableEmptyRow = ({ departments, handleChange }) => {
 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleOptions = () => {
        const openDropdowns = document.querySelectorAll(".options.active");
        openDropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
        setDropdownOpen((prevState) => !prevState);
    };

    return (
        <tr>
            <td style={{ width: '24px' }}></td>
            <td style={{ width: '64px', textAlign: 'center' }}>0</td>
            <td style={{ width: '192px' }}>
                <SelectComponent departments={departments} handleChange={handleChange} isShowlabel={false} />

                {/* <div className="select-menu w-100 d-flex justify-content-between">
                    <div className="select-btn" onClick={toggleOptions}>
                        Department
                        <ChevronDown color="#98A2B3" size={16} />
                    </div>
                    <ul className={`options ${dropdownOpen ? "active" : ""}`}>
                        {
                            departments?.map(item => (
                                <li>{item.name}</li>
                            ))
                        }
                    </ul>
                </div> */}

            </td>
            <td style={{ width: '100%', paddingTop: '10px' }}>
                <textarea rows={1} placeholder='Enter a description...' style={{ background: 'transparent', border: '0px solid #fff', resize: 'none', boxSizing: 'border-box' }} onChange={(e) => { }}></textarea>
            </td>
            <td style={{ width: '128px' }}>
                <div className='d-flex align-items-center'>
                    <span style={{ color: '#475467' }}>$</span>
                    <input
                        type="text"
                        disabled
                        style={{ padding: '4px', width: '100px', background: 'transparent', color: '#98A2B3' }}
                        value={`${'0.00'}`}
                        onChange={(e) => { }}
                    />
                </div>
            </td>
            <td style={{ width: '166px' }}>
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        disabled
                        style={{ padding: '4px', width: '40px', background: 'transparent', color: '#98A2B3' }}
                        value={`${'0.00'}`}
                        onChange={(e) => { }}
                    />
                    <select value={"Cost"} style={{ border: '0px solid #fff', background: 'transparent' }} onChange={(e) => { }}>
                        <option value="Cost">1/Q</option>
                        <option value="Hourly">1/H</option>
                    </select>
                </div>
            </td>
            <td style={{ width: '185px' }}>
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        disabled
                        style={{ padding: '4px', width: '40px', background: 'transparent', color: '#98A2B3' }}
                        value={`${'0.00'}`}
                        onChange={(e) => { }}
                    />
                    <select value={"MRG"} style={{ border: '0px solid #fff', background: 'transparent' }} onChange={(e) => { }}>
                        <option value={"MRG"}>MRG %</option>
                        <option value={"AMT"}>Amt $</option>
                        <option value={"MRK"}>MRK %</option>
                    </select>
                </div>
            </td>
            <td style={{ width: '83px' }}>
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        style={{ width: '20px', padding: '4px', background: 'transparent',color: '#98A2B3' }}
                        value={`${0}`}
                        onChange={(e) => { }}
                    />
                    <span>%</span>
                </div>
            </td>
            <td style={{ width: '118px' }}>$ {0}</td>
            <td style={{ width: '32px' }}>
            <Trash color="#98A2B3" onClick={() => {}} />
            </td>
        </tr>
    )
}


const DepartmentCalculationTableHead = (isDiscountActive) => {
    
    console.log('isDiscountActive>>>>>>>>>>>>>>>>>>>>>>>: ', isDiscountActive);
    return (
        <thead>
            <tr>
                <th style={{ width: '24px'}}></th>
                <th style={{ width: '64px', textAlign: 'left' }}>Order</th>
                <th style={{ width: '192px' }}>Department</th>
                <th style={{ width: '100%' }}>Description</th>
                <th style={{ width: '128px' }}>Rate</th>
                <th style={{ width: '166px' }}>Qty / Unit</th>
                <th style={{ width: '185px' }}>Markup / Margin</th>
                <th className={isDiscountActive ? 'discount-active' : 'discount-inactive'} style={{ width: '83px' }}>Discount</th>
                <th style={{ width: '118px' }}>Amount</th>
                <th style={{ width: '32px' }}></th>
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
                            <Draggable draggableId={`row-${key}-${value.id}`} key={`${key}-${value.id}`} index={id}>
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
                                        <td {...provided.dragHandleProps} style={{width: '24px'}}>
                                            {
                                                index === 0 && <GripVertical color="#98A2B3" style={{ cursor: 'move' }} />
                                            }
                                        </td>
                                        <td style={{ width: '64px', textAlign: 'left' }}>
                                            {
                                                index === 0 && (
                                                    <div className='d-flex align-items-center justify-content-start'>
                                                        <Checkbox className="checkbox" style={{ visibility: 'hidden' }} />
                                                        {id + 1}
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{ width: '192px' }}>
                                            {
                                                index === 0 && (
                                                    <div className='disabledSelectBox'><div title={value.label} className='disabledSelectBoxLabel'>{value.label}</div> <ChevronDown color="#98A2B3" size={15} /></div>
                                                )
                                            }
                                        </td>
                                        <td style={{ width: '100%' }}>
                                            <textarea rows={1} style={{ background: 'transparent', border: '0px solid #fff', resize: 'none', boxSizing: 'border-box' }} value={value.description}
                                                onChange={(e) => updateData(key, value.id, 'description', e.target.value)}
                                            ></textarea>
                                        </td>
                                        <td style={{ width: '128px' }}>
                                            <div className='d-flex align-items-center'>
                                                <span>$</span>
                                                <input
                                                    type="text"
                                                    style={{ padding: '4px', width: '100px', background: 'transparent' }}
                                                    value={`${value.cost || '0.00'}`}
                                                    onChange={(e) => updateData(key, value.id, 'cost', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ width: '166px' }}>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="text"
                                                    style={{ padding: '4px', width: '60px', background: 'transparent' }}
                                                    value={`${value.quantity || '0.00'}`}
                                                    onChange={(e) => updateData(key, value.id, 'quantity', e.target.value)}
                                                />
                                                <select value={value.type} style={{ border: '0px solid #fff', background: 'transparent' }} onChange={(e) => updateData(key, value.id, 'type', e.target.value)}>
                                                    <option value="Cost">1/Q</option>
                                                    <option value="Hourly">1/H</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ width: '185px' }}>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="text"
                                                    style={{ padding: '4px', width: '60px', background: 'transparent' }}
                                                    value={`${value.profit_type_value || '0.00'}`}
                                                    onChange={(e) => updateData(key, value.id, 'profit_type_value', e.target.value)}
                                                />
                                                <select value={value.profit_type} style={{ border: '0px solid #fff', background: 'transparent' }} onChange={(e) => updateData(key, value.id, 'profit_type', e.target.value)}>
                                                    <option value={"MRG"}>MRG %</option>
                                                    <option value={"AMT"}>Amt $</option>
                                                    <option value={"MRK"}>MRK %</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ width: '83px' }}>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="text"
                                                    style={{ width: '30px', padding: '4px', background: 'transparent' }}
                                                    value={`${value.discount || 0}`}
                                                    onChange={(e) => updateData(key, value.id, 'discount', e.target.value)}
                                                />
                                                <span>%</span>
                                            </div>
                                        </td>
                                        <td style={{ width: '118px' }}>$ {value.total}</td>
                                        <td style={{ width: '32px' }}>
                                            <Trash color="#98A2B3" onClick={() => deleteRow(key, value.id)} />
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

const DepartmentCalculationTable = ({ totals, setTotals ,isDiscountActive}) => {
    
 
    const [rows, setRows] = useState({});
    const [subItem, setSubItem] = useState(null);
    const [subItemLabel, setSubItemLabel] = useState(null);
    const { data: departments, isLoading, isError } = useQuery({
        queryKey: ['calcIndexes'],
        queryFn: calcDepartment,
        enabled: true,
    });
    const { isLoading: isLoadingSubItem, error, data, refetch } = useQuery({
        queryKey: ['calcReferenceId', subItem],
        queryFn: () => calcReferenceId(subItem),
        enabled: !!subItem,
        retry: 1,
    });

    console.log('isLoadingSubItem: ', isLoadingSubItem);
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
        let rate = parseFloat(item.cost) || 0;
        let quantity = parseFloat(item.quantity) || 0;
        let subtotal = rate * quantity;

        let margin = parseFloat(item.profit_type_value) || 0;
        if (item.profit_type === "MRK") {
            subtotal += (subtotal * margin) / 100;
        } else if (item.profit_type === "MRG") {
            subtotal = subtotal / (1 - margin / 100);
        } else if (item.profit_type === "AMT") {
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
        if (data) {
            if (data.length) {
                data.forEach((item) => {
                    item.label = subItemLabel;
                })
            } else {
                data.push({ label: subItemLabel });
            }

            let filteredData = data.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            if (subItem && !rows[subItem]) {
                setRows((prevRows) => ({
                    ...prevRows,
                    [`_${subItem}_`]: filteredData,
                }));
            }
        }
    }, [data]);

    const calculateSummary = () => {
        let budget = 0;
        let subtotal = 0;

        Object.values(rows)?.forEach(departmentRows => {
            departmentRows?.forEach(item => {
                let rate = parseFloat(item.cost) || 0;
                let quantity = parseFloat(item.quantity) || 0;
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
        console.log(rows);
        const summary = calculateSummary();
        setTotals(summary);
    }, [rows]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <table className='w-100 department-calculation'>
                <DepartmentCalculationTableHead isDiscountActive={isDiscountActive}/>
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

                            {
                                isLoadingSubItem && <DepartmentQuoteTableRowLoading />
                            }

                            <DepartmentCalculationTableEmptyRow departments={departments} handleChange={handleChange} />
                            {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
        </DragDropContext>
    )
}

export default DepartmentCalculationTable;