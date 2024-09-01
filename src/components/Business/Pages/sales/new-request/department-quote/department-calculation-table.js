import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronDown, GripVertical, Trash } from 'react-bootstrap-icons';

import { getCalculationByReferenceId, getDepartments, getMergeItemsByUniqueId, getQuoteByUniqueId } from '../../../../../../APIs/CalApi';
import SelectComponent from './select-component';
import { DepartmentQuoteTableRowLoading } from './department-quote-table-row-loading';
import './select-component.css';
import MergeItems, { EditMergeItems } from './merge-items';
import ViewMergeItems from './view-merge-items';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const DepartmentCalculationTableEmptyRow = ({ srNo, departments, handleChange, isDiscountActive }) => {
    return (
        <tr>
            <td style={{ width: '24px' }}></td>
            <td style={{ width: '64px', textAlign: 'right' }}>{srNo + 1}</td>
            <td style={{ width: '192px' }}>
                <SelectComponent departments={departments} handleChange={handleChange} isShowlabel={false} />
            </td>
            <td style={{ width: '100%', paddingTop: '10px' }}>
                <textarea disabled rows={1} placeholder='Enter a description...' style={{ background: 'transparent', border: '0px solid #fff', resize: 'none', boxSizing: 'border-box' }} onChange={(e) => { }}></textarea>
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
                        style={{ padding: '4px', width: '60px', background: 'transparent', color: '#98A2B3' }}
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
                        style={{ padding: '4px', width: '60px', background: 'transparent', color: '#98A2B3' }}
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
            {isDiscountActive &&
                <td style={{ width: '83px' }}>
                    <div className='d-flex align-items-center'>
                        <input
                            type="text"
                            style={{ width: '30px', padding: '4px', background: 'transparent', color: '#98A2B3' }}
                            value={`${0}`}
                            onChange={(e) => { }}
                        />
                        <span>%</span>
                    </div>
                </td>
            }
            <td style={{ width: '118px', textAlign: 'left' }}>$ {0}</td>
            <td style={{ width: '32px' }}>
                <Trash color="#98A2B3" style={{ cursor: 'not-allowed', opacity: '.5' }} onClick={() => { }} />
            </td>
        </tr>
    )
}

const DepartmentCalculationTableHead = ({ isDiscountActive }) => {
    return (
        <thead>
            <tr>
                <th style={{ width: '24px' }}></th>
                <th style={{ width: '64px', textAlign: 'left' }}>Order</th>
                <th style={{ width: '192px' }}>Department</th>
                <th style={{ width: '100%' }}>Description</th>
                <th style={{ width: '128px' }}>Rate</th>
                <th style={{ width: '166px' }}>Qty / Unit</th>
                <th style={{ width: '185px' }}>Markup / Margin</th>
                {isDiscountActive && <th style={{ width: '83px' }}>Discount</th>}
                <th style={{ width: '118px' }}>Amount</th>
                <th style={{ width: '32px' }}></th>
            </tr>
        </thead>
    )
}

const DepartmentCalculationTableBody = ({ rows, updateData, deleteRow, isDiscountActive, setSelectItem, mapMergeItemWithNo, checkedItems = [] }) => {
    const handleChange = (event, key, values) => {
        console.log('values: ', values);
        setSelectItem((oldItems) => {
            if (event.target.checked) {
                const { label, total, calculator } = values.reduce((acc, value, index) => {
                    if (index === 0) acc.label = value.label;
                    acc.total += parseFloat(value.total || 0.00);
                    acc.calculator = value?.id
                    return acc;
                }, { label: '', total: 0, calculator: null });

                return {
                    ...oldItems,
                    [key]: { label, total, calculator }
                };
            } else {
                const updatedItems = { ...oldItems };
                if (updatedItems[key]) delete updatedItems[key];
                return updatedItems;
            }
        });
    };

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
                                        className={`calculation-tr ${checkedItems.includes(key) ? 'selected' : ''}`}
                                    >
                                        <td {...provided.dragHandleProps} style={{ width: '24px' }}>
                                            {
                                                index === 0 && <GripVertical color="#98A2B3" style={{ cursor: 'move' }} />
                                            }
                                        </td>
                                        <td style={{ width: '64px', textAlign: 'left' }}>
                                            {
                                                index === 0 && (
                                                    <div className='d-flex align-items-center justify-content-start'>
                                                        {mapMergeItemWithNo[key] ? (
                                                            <div className='d-flex justify-content-center align-items-center' style={{ width: '20px', height: '20px', borderRadius: '24px', background: '#F2F4F7', border: '1px solid #EAECF0', color: '#344054', fontSize: '10px', marginRight: '10px' }}>
                                                                {mapMergeItemWithNo[key]}
                                                            </div>
                                                        ) : (
                                                            <label className="customCheckBox checkbox" style={{ marginRight: '10px' }}>
                                                                <input type="checkbox" onChange={(e) => handleChange(e, key, values)} />
                                                                <span className="checkmark" style={{ top: '0px' }}>
                                                                    <Check color="#1AB2FF" size={20} />
                                                                </span>
                                                            </label>
                                                        )
                                                        }

                                                        <span>{id + 1}</span>
                                                    </div>
                                                )
                                            }
                                        </td>
                                        <td style={{ width: '192px' }}>
                                            {
                                                index === 0 && (
                                                    <div className='disabledSelectBox'><div title={value.label} className='disabledSelectBoxLabel' style={{ color: '#101828', fontSize: '14px' }}>{value.label}</div> <ChevronDown color="#98A2B3" size={15} /></div>
                                                )
                                            }
                                        </td>
                                        <td style={{ width: '100%' }}>
                                            <textarea rows={1} style={{ background: 'transparent', border: '0px solid #fff', resize: 'none', boxSizing: 'border-box', fontSize: '14px' }} value={value.description}
                                                onChange={(e) => updateData(key, value.id, 'description', e.target.value)}
                                            ></textarea>
                                        </td>
                                        <td style={{ width: '128px' }}>
                                            <div className='d-flex align-items-center'>
                                                <span style={{ fontSize: '14px' }}>$</span>
                                                <input
                                                    type="text"
                                                    style={{ padding: '4px', width: '100px', background: 'transparent', fontSize: '14px' }}
                                                    value={`${value.cost || '0.00'}`}
                                                    onChange={(e) => updateData(key, value.id, 'cost', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ width: '166px' }}>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="text"
                                                    style={{ padding: '4px', width: '60px', background: 'transparent', fontSize: '14px' }}
                                                    value={`${value.quantity || '0.00'}`}
                                                    onChange={(e) => updateData(key, value.id, 'quantity', e.target.value)}
                                                />
                                                <select value={value.type} style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }} onChange={(e) => updateData(key, value.id, 'type', e.target.value)}>
                                                    <option value="Cost">1/Q</option>
                                                    <option value="Hourly">1/H</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ width: '185px' }}>
                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="text"
                                                    style={{ padding: '4px', width: '60px', background: 'transparent', fontSize: '14px' }}
                                                    value={`${value.profit_type_value || '0.00'}`}
                                                    onChange={(e) => updateData(key, value.id, 'profit_type_value', e.target.value)}
                                                />
                                                <select value={value.profit_type} style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }} onChange={(e) => updateData(key, value.id, 'profit_type', e.target.value)}>
                                                    <option value={"MRG"}>MRG %</option>
                                                    <option value={"AMT"}>Amt $</option>
                                                    <option value={"MRK"}>MRK %</option>
                                                </select>
                                            </div>
                                        </td>
                                        {isDiscountActive &&
                                            <td style={{ width: '83px' }}>
                                                <div className='d-flex align-items-center'>
                                                    <input
                                                        type="text"
                                                        style={{ width: '30px', padding: '4px', background: 'transparent', fontSize: '14px' }}
                                                        value={`${value.discount || 0}`}
                                                        onChange={(e) => updateData(key, value.id, 'discount', e.target.value)}
                                                    />
                                                    <span style={{ fontSize: '14px' }}>%</span>
                                                </div>
                                            </td>
                                        }
                                        <td style={{ width: '118px', textAlign: 'left', fontSize: '14px' }}>$ {value.total || 0.00}</td>
                                        <td style={{ width: '32px' }}>
                                            <Trash color="#98A2B3" style={{ cursor: 'pointer' }} onClick={() => deleteRow(key, value.id)} />
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

const DepartmentCalculationTable = ({ setTotals, setPayload, isDiscountActive, xero_tax, preExistCalculation, preExistMerges }) => {
    const { unique_id } = useParams();
    const [rows, setRows] = useState({});
    const [subItem, setSubItem] = useState(null);
    const [subItemLabel, setSubItemLabel] = useState(null);
    const [mergeItems, setMergeItems] = useState({});
    console.log('mergeItems: ', mergeItems);
    const [selectItem, setSelectItem] = useState({});
    const [mapMergeItemWithNo, setMapMergeItemWithNo] = useState({});
    const { data: departments } = useQuery({
        queryKey: ['departments'],
        queryFn: getDepartments,
        enabled: true,
    });
    const { isLoading: isLoadingSubItem, data } = useQuery({
        queryKey: ['calcReferenceId', subItem],
        queryFn: () => getCalculationByReferenceId(subItem),
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
        if (data && data.length) {
            if (data.length) {
                data.forEach((item) => {
                    item.label = subItemLabel;
                    item.calculator = item.id;
                    item.index = subItem;
                })
            } else {
                data.push({
                    label: subItemLabel,
                    calculator: data.id,
                    index: subItem,
                });
            }

            let filteredData = data.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id) // remove duplicates
            );

            if (subItem && !rows[subItem]) {
                setRows((prevRows) => ({
                    ...prevRows,
                    [`_${subItem}_`]: filteredData,
                }));
            }
        }

        if (data?.length === 0) {
            console.log('data.length: ', data.length);
            toast.error(`No calculation found inside ${subItemLabel}`)
        }
    }, [data]);

    const calculateSummary = (taxType) => {
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

        let tax = 0;
        let total = 0;

        if (taxType === 'ex') {
            tax = subtotal * 0.10;
            total = subtotal + tax;
        } else if (taxType === 'in') {
            total = subtotal;
            tax = total * 0.10 / 1.10;
            subtotal = total - tax;
        } else if (taxType === 'no') {
            tax = 0;
            total = subtotal;
        }

        const operationalProfit = subtotal - budget;

        return {
            budget: budget.toFixed(2),
            operationalProfit: operationalProfit.toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
        };
    }

    useEffect(() => {
        const summary = calculateSummary(xero_tax);
        setTotals(summary);

        const calculations = Object.values(rows)?.flat().map((item, index) => {
            const { id, ...rest } = item; // Remove 'id' using destructuring
            return {
                ...rest,
                order: index // Add 'order' key with index value
            };
        });
        setPayload((others) => ({ ...others, expense: summary.total || "", calculations }));
    }, [rows, xero_tax]);

    useEffect(() => {
        if (preExistCalculation?.length && departments?.length) {
            console.log('preExistCalculation: ', preExistCalculation);
            const subindexMap = {};
            departments?.forEach(item => {
                item.subindexes.forEach(subindex => {
                    subindexMap[subindex.id] = subindex.name;
                });
            });

            const reformattedData = preExistCalculation?.reduce((acc, item) => {
                const key = `_${item.index}_`;
                if (!acc[key]) acc[key] = [];
                item.label = subindexMap[item.index];
                const { order, index, ...rest } = item;
                acc[key].push(rest);

                return acc;
            }, {});

            console.log('preExistCalculation reformatted data: ', reformattedData);
            setRows(reformattedData);
        }
    }, [preExistCalculation, departments])



    
    useEffect(() => {
        let map = {};
        if (Object.keys(mergeItems)?.length) {
            Object.entries(mergeItems)?.map(([key, value]) => {
                return value?.keys.map(key => {
                    return map[key] = value.romanNo;
                })
            })
        }
        setMapMergeItemWithNo(map);
    }, [mergeItems]);

    const deleteMergeItem = (key) => {
        setMergeItems((oldItems) => {
            const updatedItems = { ...oldItems };
            if (updatedItems[key]) delete updatedItems[key];

            Object.keys(updatedItems).forEach((itemKey, index) => {
                updatedItems[itemKey] = {
                    ...updatedItems[itemKey],
                    romanNo: romanize(index + 1),
                };
            });

            return updatedItems;
        })
    }

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <table className='w-100 department-calculation'>
                    <DepartmentCalculationTableHead isDiscountActive={isDiscountActive} />
                    <Droppable droppableId="departmentQuoteTable">
                        {(provided) => (
                            <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                <DepartmentCalculationTableBody
                                    rows={rows}
                                    updateData={updateData}
                                    deleteRow={deleteRow}
                                    isDiscountActive={isDiscountActive}
                                    setSelectItem={setSelectItem}
                                    mapMergeItemWithNo={mapMergeItemWithNo}
                                    checkedItems={Object.keys(selectItem)}
                                />
                                {
                                    isLoadingSubItem && <DepartmentQuoteTableRowLoading isDiscountActive={isDiscountActive} />
                                }

                                <DepartmentCalculationTableEmptyRow srNo={Object.keys(rows || {}).length} departments={departments} handleChange={handleChange} isDiscountActive={isDiscountActive} />
                                {provided.placeholder}
                            </tbody>
                        )}
                    </Droppable>
                </table>
            </DragDropContext>

            <div className='merge-section' style={{ marginTop: '20px', textAlign: 'left' }}>
                <MergeItems mergeItems={mergeItems} setMergeItems={setMergeItems} selectItems={selectItem} setSelectItems={setSelectItem} setMapMergeItemWithNo={setMapMergeItemWithNo} />
                <div className='w-100' style={{ height: '1px', background: "#EAECF0", margin: "20px 0px" }}></div>
                {(Object.keys(mergeItems)?.length && <p className='mb-0' style={{ fontSize: '14px', fontWeight: '500', color: '#475467' }}>Merged Items</p>) || ''}

                {
                    Object.entries(mergeItems)?.map(([key, value]) =>
                        <div key={key} className='d-flex align-items-center' style={{ margin: '20px 0px' }}>
                            <div className='d-flex justify-content-center align-items-center' style={{ width: '20px', height: '20px', borderRadius: '24px', background: '#F2FAFF', border: '1px solid #A3E0FF', color: '#106B99', fontSize: '10px' }}>
                                {value.romanNo}
                            </div>
                            <div className='my-0 d-flex align-items-center' style={{ color: '#101828', fontSize: '16px', marginLeft: '10px', marginRight: '56px', minWidth: '283px', gap: '10px' }}>
                                <ViewMergeItems romanNo={value.romanNo} items={value.items} title={value.title} />
                                <EditMergeItems key={key} id={key} setMergeItems={setMergeItems} romanNo={value.romanNo} items={value.items} title={value.title} description={value.description} />
                            </div>
                            <span style={{ color: '#667085', fontSize: '14px', marginRight: '37px' }}>$ &nbsp; {value.total}</span>
                            <Trash onClick={() => deleteMergeItem(key)} color="#98A2B3" style={{ cursor: 'pointer' }} />
                        </div>)
                }

                {(Object.keys(mergeItems || {})?.length && <div className='w-100' style={{ height: '1px', background: "#EAECF0", margin: "0px 0px 20px 0px" }}></div>) || ""}
            </div>
        </div>
    )
}

function romanize(num) {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

export default DepartmentCalculationTable;