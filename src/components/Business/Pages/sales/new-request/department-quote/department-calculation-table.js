import React, { useEffect, useState } from 'react';
import { Check, GripVertical, Trash } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import { nanoid } from "nanoid";
import { InputNumber } from 'primereact/inputnumber';
import { toast } from 'sonner';
import { DepartmentQuoteTableRowLoading, DepartmentRowChangeLoading } from './department-quote-table-row-loading';
import SelectComponent from './select-component';
import { getCalculationByReferenceId, getDepartments } from '../../../../../../APIs/CalApi';
import { formatAUD } from '../../../../../../shared/lib/format-aud';
import CreateMergeCalculation from '../../../../features/sales-features/merges-calculation/create-merge-calculation';
import ListMergeCalculations from '../../../../features/sales-features/merges-calculation/list-merge-calculations';
import { romanize } from '../../../../shared/utils/helper';

const DepartmentCalculationTableEmptyRow = ({ srNo, departments, handleChange }) => {
    return (
        <tr>
            <td style={{ width: '24px' }} className='shadowRight-'></td>
            <td style={{ width: '64px', textAlign: 'left' }}>{srNo + 1}</td>
            <td style={{ width: '192px' }}>
                <SelectComponent departments={departments} handleChange={handleChange} isShowlabel={false} />
            </td>
            <td style={{ width: '100%', paddingTop: '10px' }}>
                <textarea disabled rows={1} placeholder='Enter a description...' style={{ background: 'transparent', border: '0px solid #fff', resize: 'none', boxSizing: 'border-box' }} onChange={() => { }}></textarea>
            </td>
            <td style={{ width: '128px' }}>
                <div className='d-flex align-items-center'>
                    <span style={{ color: 'rgb(152, 162, 179)' }}>$</span>
                    <input
                        type="text"
                        disabled
                        style={{ padding: '4px', width: '100px', background: 'transparent', color: '#98A2B3' }}
                        value={`${'0.00'}`}
                        onChange={() => { }}
                    />
                </div>
            </td>
            <td style={{ width: '185px' }}>
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        disabled
                        style={{ padding: '4px', width: '60px', background: 'transparent', color: '#98A2B3' }}
                        value={`${'0.00'}`}
                        onChange={() => { }}
                    />
                    <select value={"MRG"} disabled style={{ border: '0px solid #fff', background: 'transparent' }} onChange={() => { }}>
                        <option value={"MRG"}>MRG %</option>
                        <option value={"AMN"}>AMT $</option>
                        <option value={"MRK"}>MRK %</option>
                    </select>
                </div>
            </td>
            <td style={{ width: '118px', textAlign: 'left', color: 'rgb(152, 162, 179)' }}>$ {"0.00"}</td>
            <td style={{ width: '166px' }}>
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        disabled
                        style={{ padding: '4px', width: '60px', background: 'transparent', color: '#98A2B3' }}
                        value={`${'0.00'}`}
                        onChange={() => { }}
                    />
                    <select value={"Cost"} disabled style={{ border: '0px solid #fff', background: 'transparent' }} onChange={() => { }}>
                        <option value="Cost">1/Q</option>
                        <option value="Hourly">1/H</option>
                    </select>
                </div>
            </td>
            <td style={{ width: '83px' }}>
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        disabled
                        style={{ width: '60px', padding: '4px', background: 'transparent', color: '#98A2B3' }}
                        value={`${"0.00%"}`}
                        onChange={() => { }}
                    />
                </div>
            </td>
            <td style={{ width: '118px', textAlign: 'left', color: 'rgb(152, 162, 179)' }}>$ {"0.00"}</td>
            <td style={{ width: '32px', position: 'sticky', right: '0px' }} className='shadowLeft-'>
                <Trash color="#98A2B3" style={{ cursor: 'not-allowed', opacity: '.5' }} onClick={() => { }} />
            </td>
        </tr>
    );
};

const DepartmentCalculationTableHead = () => {
    return (
        <thead>
            <tr>
                <th style={{ width: '24px' }}></th>
                <th style={{ width: '64px', textAlign: 'left' }}>Order</th>
                <th style={{ width: '192px' }}>Department</th>
                <th style={{ width: '100%' }}>Description</th>
                <th style={{ width: '128px' }}>Cost</th>
                <th style={{ width: '185px' }}>Markup / Margin</th>
                <th style={{ width: '118px' }}>Unit Price</th>
                <th style={{ width: '166px' }}>Qty / Unit</th>
                <th style={{ width: '83px' }}>Discount</th>
                <th style={{ width: '118px' }}>Amount</th>
                <th style={{ width: '32px' }}></th>
            </tr>
        </thead>
    );
};

const DepartmentCalculationTableBody = ({ rows, updateData, deleteRow, selectItem, setSelectItem, mapMergeItemWithNo, checkedItems = [], departments, handleDepartmentChange, selectKey }) => {
    const handleChange = (event, value, key) => {
        const mergeKey = `${key}-${value.id}`;

        setSelectItem((oldItems) => {
            if (event.target.checked) {
                const items = {
                    label: value.label,
                    description: value?.description,
                    calculator: value?.calculator,
                    index: value?.index,
                    total: value?.total,
                    key: key,
                    merge_id: value?.merge_id
                };

                let newItems = oldItems[mergeKey] || [];
                newItems.push(items);

                return {
                    ...oldItems,
                    [mergeKey]: newItems
                };
            } else {
                const updatedItems = { ...oldItems };
                if (updatedItems[mergeKey]) delete updatedItems[mergeKey];
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
                                        key={`tr-${key}-${value.id}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            cursor: 'default',
                                        }}
                                        className={`calculation-tr ${checkedItems.includes(key) ? 'selected' : ''}`}
                                    >

                                        {
                                            selectKey === key ? (
                                                <>
                                                    <td {...provided.dragHandleProps} style={{ width: '24px' }}>
                                                        {
                                                            index === 0 && <GripVertical color="#98A2B3" style={{ cursor: 'move' }} />
                                                        }
                                                    </td>
                                                    <DepartmentRowChangeLoading />
                                                </>
                                            )
                                                : (
                                                    <>
                                                        <td {...provided.dragHandleProps} style={{ width: '24px' }} className='shadowRight-'>
                                                            {
                                                                index === 0 && <GripVertical color="#98A2B3" style={{ cursor: 'move' }} />
                                                            }
                                                        </td>
                                                        <td style={{ width: '64px', textAlign: 'left' }}>

                                                            <div className='d-flex align-items-center justify-content-end gap-2'>
                                                                {index === 0 && (<span>{id + 1}</span>)}
                                                                {
                                                                    mapMergeItemWithNo[`${key}-${value.calculator}`] ? (
                                                                        <div className='d-flex justify-content-center align-items-center' style={{ width: '20px', height: '20px', borderRadius: '24px', background: '#F2F4F7', border: '1px solid #EAECF0', color: '#344054', fontSize: '10px', marginRight: '0px' }}>
                                                                            {mapMergeItemWithNo[`${key}-${value.calculator}`]}
                                                                        </div>
                                                                    ) : (
                                                                        <label className="customCheckBox checkbox" style={{ marginRight: '0px' }}>
                                                                            <input type="checkbox" checked={selectItem[`${key}-${value.id}`] ? true : false} onChange={(e) => handleChange(e, value, key)} />
                                                                            <span className="checkmark" style={{ top: '0px' }}>
                                                                                <Check color="#1AB2FF" size={20} />
                                                                            </span>
                                                                        </label>
                                                                    )
                                                                }
                                                            </div>
                                                        </td>
                                                        <td style={{ width: '192px' }}>
                                                            {
                                                                index === 0 && (
                                                                    <SelectComponent departments={departments} handleChange={handleDepartmentChange} title={value.label} keyValue={key} />
                                                                )
                                                            }
                                                        </td>
                                                        <td style={{ width: '300px', textAlign: 'left' }}>
                                                            <textarea rows={1} className="auto-expand" style={{ background: 'transparent', border: '0px solid #fff', fontSize: '14px' }} value={value.description}
                                                                onChange={(e) => updateData(key, value.id, 'description', e.target.value)}
                                                                onInput={(e) => {
                                                                    e.target.style.height = 'auto';
                                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                                }}
                                                                onFocus={(e) => {
                                                                    e.target.style.height = 'auto';
                                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                                }}
                                                                onBlur={(e) => {
                                                                    e.target.style.height = '50px';
                                                                }}
                                                                onClick={(e) => {
                                                                    e.target.style.height = 'auto';
                                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                                }}
                                                            ></textarea>
                                                        </td>
                                                        <td style={{ width: '128px' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <InputNumber
                                                                    prefix="$"
                                                                    value={value.cost}
                                                                    onValueChange={(e) => updateData(key, value.id, 'cost', e.target.value)}
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    placeholder='$0.00'
                                                                    inputId="minmaxfraction"
                                                                    className='w-100'
                                                                    inputStyle={{ width: '120px', padding: '4px', background: 'transparent' }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td style={{ width: '185px' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <InputNumber
                                                                    value={value.profit_type_value}
                                                                    onValueChange={(e) => updateData(key, value.id, 'profit_type_value', e.target.value)}
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    placeholder='0.00'
                                                                    inputId="minmaxfraction"
                                                                    className='w-100'
                                                                    inputStyle={{ width: '60px', padding: '4px', background: 'transparent' }}
                                                                />
                                                                <select value={value.profit_type} style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }} onChange={(e) => updateData(key, value.id, 'profit_type', e.target.value)}>
                                                                    <option value={"MRG"}>MRG %</option>
                                                                    <option value={"AMN"}>AMT $</option>
                                                                    <option value={"MRK"}>MRK %</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: '100%', textAlign: 'left', fontSize: '14px' }}>${formatAUD(value.unit_price || "0.00")}</td>
                                                        <td style={{ width: '166px' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <InputNumber
                                                                    value={value.quantity}
                                                                    onValueChange={(e) => updateData(key, value.id, 'quantity', e.target.value)}
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    placeholder='0.00'
                                                                    inputId="minmaxfraction"
                                                                    className='w-100'
                                                                    inputStyle={{ width: '60px', padding: '4px', background: 'transparent' }}
                                                                />
                                                                <select value={value.type} style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }} onChange={(e) => updateData(key, value.id, 'type', e.target.value)}>
                                                                    <option value="Cost">1/Q</option>
                                                                    <option value="Hourly">1/H</option>
                                                                </select>
                                                            </div>
                                                        </td>

                                                        <td style={{ width: '60px' }}>
                                                            <div className='d-flex align-items-center'>
                                                                <InputNumber
                                                                    suffix="%"
                                                                    value={value.discount}
                                                                    onValueChange={(e) => updateData(key, value.id, 'discount', e.target.value)}
                                                                    maxFractionDigits={2}
                                                                    minFractionDigits={2}
                                                                    placeholder='0.00%'
                                                                    inputId="minmaxfraction"
                                                                    className='w-100'
                                                                    inputStyle={{ width: '60px', padding: '4px', background: 'transparent' }}
                                                                />
                                                            </div>
                                                        </td>

                                                        <td style={{ textAlign: 'left', fontSize: '14px' }}>$ {formatAUD(value.total || 0.00)}</td>
                                                        <td style={{ width: '32px', position: 'sticky', right: '0px' }} className='shadowLeft-'>
                                                            <Trash color="#98A2B3" style={{ cursor: 'pointer' }} onClick={() => deleteRow(key, value.id, value.calculator)} />
                                                        </td>
                                                    </>
                                                )
                                        }

                                    </tr>
                                )}
                            </Draggable>
                        )
                    }
                </React.Fragment>
            ))}
        </>
    );
};

const DepartmentCalculationTable = ({ setTotals, setPayload, defaultDiscount, xero_tax, preExistCalculation, preMerges, refetch, setMergeDeletedItems }) => {
    const { unique_id } = useParams();
    const [rows, setRows] = useState({});
    const [subItem, setSubItem] = useState(null);
    const [subItemLabel, setSubItemLabel] = useState(null);
    const [selectKey, setSelectKey] = useState(null);
    const [preExistMerges, setPreExistMerges] = useState([]);

    const [merges, setMerges] = useState([]);
    const [selectItem, setSelectItem] = useState({});
    const [mapMergeItemWithNo, setMapMergeItemWithNo] = useState({});

    const { data: departments } = useQuery({
        queryKey: ['departments'],
        queryFn: getDepartments,
        staleTime: 0,
        refetchOnWindowFocus: true
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
        if (label) setSubItemLabel(label);
    };

    const calculateTotal = (item) => {
        let cost = parseFloat(item.cost) || 0;
        let quantity = parseFloat(item.quantity) || 0;
        let subtotal = cost * quantity;

        let margin = parseFloat(item.profit_type_value) || 0;
        if (item.profit_type === "MRK") {
            subtotal += (subtotal * margin) / 100;
        } else if (item.profit_type === "MRG") {
            subtotal = subtotal / (1 - margin / 100);
        } else if (item.profit_type === "AMN") {
            subtotal += margin;
        }

        let discount = parseFloat(item.discount) || 0;
        let total = subtotal - (subtotal * discount) / 100;

        return parseFloat(total).toFixed(2);
    };

    const calculateUnitPrice = (item) => {
        let cost = parseFloat(item.cost) || 0;
        let unit_price = 0.00;

        let margin = parseFloat(item.profit_type_value) || 0;
        if (item.profit_type === "MRK") {
            unit_price = cost + (cost * (margin / 100));
        } else if (item.profit_type === "MRG") {
            unit_price = cost / (1 - (margin / 100));
        } else if (item.profit_type === "AMN") {
            unit_price = cost + margin;
        }

        return parseFloat(unit_price).toFixed(2);
    };

    const updateData = (key, id, type, value) => {
        setRows(prevRows => {
            const updatedRows = {
                ...prevRows,
                [key]: prevRows[key].map(item => {
                    if (item.id === id) {
                        const updatedItem = { ...item, [type]: value };
                        if (updatedItem.profit_type === "MRG" && updatedItem.profit_type_value >= 100) {
                            updatedItem.profit_type_value = 99.99;
                        }
                        updatedItem.unit_price = calculateUnitPrice(updatedItem);
                        updatedItem.total = calculateTotal(updatedItem);
                        return updatedItem;
                    }
                    return item;
                })
            };
            return updatedRows;
        });
    };

    const deleteMergeCalculator = (calcReferenceId, key) => {
        let idsToDelete = [], mergeCount = 0;

        const updatedMerges = merges.reduce((result, item) => {
            const updatedCalculators = item.calculators.filter(
                calc => !(calc.calculator === calcReferenceId && calc.key === key)
            );

            if (updatedCalculators.length < 2) {
                if (item.id && unique_id) idsToDelete.push(item.id);
                return result;
            }

            mergeCount++;
            const alias = romanize(mergeCount);
            result.push({ ...item, calculators: updatedCalculators, alias });
            return result;
        }, []);
        setMerges(updatedMerges);
        setMergeDeletedItems((prev) => [...new Set([...prev, ...idsToDelete])]);
    };

    const deleteRow = (key, id, calcReferenceId) => {
        setRows(prevRows => {
            const updatedRows = {
                ...prevRows,
                [key]: prevRows[key].filter(item => item.id !== id)
            };

            if (updatedRows[key].length === 0) delete updatedRows[key];

            return updatedRows;
        });
        deleteMergeCalculator(calcReferenceId, key);
    };

    useEffect(() => {
        if (data && data.length && subItem) {
            if (data.length) {
                data.forEach((item) => {
                    item.label = subItemLabel;
                    item.calculator = item.id;
                    item.index = subItem;
                    item.merge_id = nanoid(6);
                    item.discount = defaultDiscount;
                    item.quantity = parseFloat(parseFloat(item.quantity) || 1).toFixed(2);
                    item.unit_price = calculateUnitPrice(item);
                    item.total = calculateTotal(item);
                });
            } else {
                data.push({
                    label: subItemLabel,
                    calculator: data.id,
                    index: subItem,
                    merge_id: nanoid(6),
                    discount: defaultDiscount,
                    quantity: parseFloat(parseFloat(data.quantity) || 1).toFixed(2),
                });
            }

            let filteredData = data.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            let key = `${nanoid(6)}`;
            setRows((prevRows) => ({
                ...prevRows,
                [`${key}`]: filteredData,
            }));

            setSubItem("");
        }

        if (subItem && data?.length === 0) {
            toast.error(`No calculation found inside ${subItemLabel}`);
        }

    }, [data, subItem, defaultDiscount, subItemLabel]);

    const handleDepartmentChange = async (value, label, keyValue) => {
        if (!value || !keyValue) return;

        try {
            setSelectKey(keyValue);
            const calculators = await getCalculationByReferenceId(value);
            if (calculators?.length) {
                calculators.forEach((item) => {
                    item.label = label;
                    item.calculator = item.id;
                    item.index = value;
                    item.merge_id = nanoid(6);
                    item.discount = defaultDiscount;
                    item.quantity = parseFloat(parseFloat(item.quantity) || 1).toFixed(2);
                    item.unit_price = calculateUnitPrice(item);
                    item.total = calculateTotal(item);
                });

                let filteredData = calculators.filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );

                setRows((prevRows) => ({
                    ...prevRows,
                    [`${keyValue}`]: filteredData,
                }));

            } else {
                toast.error(`No calculation found inside ${label}`);
            }
        } catch (error) {
            console.error('Error in handleDepartmentChange:', error);
        } finally {
            setSelectKey(null);
        }
    };

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
            budget: parseFloat(budget || 0.00).toFixed(2),
            operationalProfit: parseFloat(operationalProfit).toFixed(2),
            subtotal: parseFloat(subtotal).toFixed(2),
            tax: parseFloat(tax).toFixed(2),
            total: parseFloat(total).toFixed(2),
        };
    };

    useEffect(() => {
        const summary = calculateSummary(xero_tax);
        setTotals(summary);

        const calculations = Object.entries(rows).flatMap(([key, items], parentIndex) => {
            return items.map((item) => {
                const { id, ...rest } = item;
                return {
                    ...rest,
                    cost: parseFloat(rest.cost || 0.00).toFixed(2),
                    profit_type_value: parseFloat(rest.profit_type_value || 0.00).toFixed(2),
                    unit_price: parseFloat(rest.unit_price || 0.00).toFixed(2),
                    quantity: parseFloat(rest.quantity || 0.00).toFixed(2),
                    discount: parseFloat(rest.discount || 0.00).toFixed(2),
                    order: parentIndex + 1, // Use the parent's index as the order
                };
            });
        });
        setPayload((others) => ({ ...others, expense: summary.total || "", calculations }));
    }, [rows, xero_tax]);

    useEffect(() => {
        setPreExistMerges(preMerges);
    }, [preMerges]);

    useEffect(() => {
        if (!preExistCalculation?.length || !departments?.length) return;

        // Build a map of subindex id to subindex name
        const subindexMap = departments.reduce((map, department) => {
            department.subindexes.forEach(subindex => {
                map[subindex.id] = subindex.name;
            });
            return map;
        }, {});

        // Add merge id to preExistCalculation
        preExistCalculation.forEach(item => {
            if (!item.merge_id) item.merge_id = nanoid(6);
        });

        // Group by order first, then assign nanoid keys
        const orderGroups = preExistCalculation.reduce((acc, { order, index, ...item }) => {
            acc[order] = acc[order] || [];
            let unit_price = item.unit_price;
            if (unit_price === "0.00" || !unit_price) {
                unit_price = calculateUnitPrice(item);
            } else if (unit_price) {
                unit_price = calculateUnitPrice(item);
            }
            acc[order].push({ ...item, unit_price, label: subindexMap[index] || "Unknown", index });
            return acc;
        }, {});

        const reformattedData = Object.keys(orderGroups).reduce((acc, order) => {
            const key = nanoid(6);
            acc[key] = orderGroups[order];
            return acc;
        }, {});

        // Build a mapping of calculator IDs to reformattedData keys
        const calculatorKeyMap = {};
        Object.entries(reformattedData).forEach(([key, items]) => {
            items.forEach(item => {
                calculatorKeyMap[item.id] = key;
            });
        });

        // Create key-index map and reformat preExistMerges data
        const reformattedMerges = preExistMerges.map((merge, index) => {
            const alias = romanize(index + 1);

            const calculators = merge?.calculators?.map(cal => {
                const findData = preExistCalculation.find(data => data.id === cal.calculator);
                const key = calculatorKeyMap[findData?.id];
                return { label: subindexMap[findData?.index], description: findData?.description, total: findData?.total, calculator: findData?.calculator, key, merge_id: findData?.merge_id };
            });

            return { ...merge, alias, calculators };
        });

        setRows(reformattedData);
        setMerges(reformattedMerges);

    }, [preExistCalculation, preExistMerges, departments]);

    useEffect(() => {
        if (departments?.length) {
            const keyIndexMap = {};
            merges?.forEach((merge, index) => {
                const alias = romanize(index + 1);
                merge?.calculators?.forEach(cal => {
                    keyIndexMap[`${cal.key}-${cal.calculator}`] = alias;
                });
            });

            setMapMergeItemWithNo(keyIndexMap);
            setPayload((others) => ({ ...others, merges }));
        }
    }, [merges]);


    return (
        <>
            <div className="pb-3" style={{ overflowX: 'auto', width: '100%' }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <table className='w-100 department-calculation'>
                        <DepartmentCalculationTableHead />
                        <Droppable droppableId="departmentQuoteTable">
                            {(provided) => (
                                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                                    <DepartmentCalculationTableBody
                                        rows={rows}
                                        updateData={updateData}
                                        deleteRow={deleteRow}
                                        defaultDiscount={defaultDiscount}
                                        selectItem={selectItem}
                                        setSelectItem={setSelectItem}
                                        mapMergeItemWithNo={mapMergeItemWithNo}
                                        checkedItems={Object.keys(selectItem)}

                                        selectKey={selectKey}
                                        departments={departments}
                                        handleDepartmentChange={handleDepartmentChange}
                                    />
                                    {
                                        isLoadingSubItem && <DepartmentQuoteTableRowLoading />
                                    }

                                    <DepartmentCalculationTableEmptyRow srNo={Object.keys(rows || {}).length} departments={departments} handleChange={handleChange} />
                                    {provided.placeholder}
                                </tbody>
                            )}
                        </Droppable>
                    </table>
                </DragDropContext>
            </div>
            <div className='merge-section' style={{ marginTop: '20px', textAlign: 'left' }}>
                <CreateMergeCalculation unique_id={unique_id} selectItem={selectItem}
                    setSelectItem={setSelectItem} merges={merges} setMerges={setMerges}
                    setPayload={setPayload} refetch={refetch} setPreExistMerges={setPreExistMerges}
                />
                <ListMergeCalculations unique_id={unique_id} merges={merges}
                    setMerges={setMerges}
                    refetch={refetch}
                    deleteMergeCalculator={deleteMergeCalculator}
                />
            </div>

        </>
    );
};

export default DepartmentCalculationTable;