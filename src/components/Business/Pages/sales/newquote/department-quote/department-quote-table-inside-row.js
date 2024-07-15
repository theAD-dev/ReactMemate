import React, { useEffect, useState } from 'react'
import Select, { components } from "react-select";
import { useQuery, useMutation } from '@tanstack/react-query';

import { calcReferenceId } from '../../../../../../APIs/CalApi';
import { SelectComponentPage } from './select-component';

const DepartmentQuoteTableInsideRow = ({ row, expandedRows, setExpandedRows }) => {
    const expandedRowsArray = Object.values(expandedRows) || [];
    console.log('expandedRowsArray: ', expandedRowsArray);
    const [subItem, setSubItem] = useState(null);
    const [value, setValue] = useState("");
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['calcReferenceId', subItem],
        queryFn: () => calcReferenceId(subItem),
        enabled: !!subItem,
        retry: 1,
    });

    const options = row?.subindexes?.map(item => ({
        value: item.id,
        text: item.name
    }));

    const handleChange = (e) => {
        const subitemId = e.value;
        if (subitemId) setSubItem(subitemId);
    }

    useEffect(() => {
        if (data) {
            if (data?.id && expandedRows[data.id]) return;
            let item = data[0];

            setExpandedRows(old => ({
                ...old,
                [item.id]: item
            }));
        }
    }, [data]);

    const SelectComponent = ({ val, options, handleChange }) => {
        return (
            <Select
                value={val}
                placeholder="Select Option"
                options={options}
                onChange={handleChange}
                getOptionLabel={(e) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {e.icon}
                        <span
                            style={{
                                marginLeft: 5,
                                maxWidth: "100%",
                                fontSize: "16px",
                                color: "#101828",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {e.text}
                        </span>
                    </div>
                )}
            />
        )
    }

    return (
        <React.Fragment>
            <tr className='insiderowtr'>
                <td colSpan={10} className='insiderowtd'>
                    <table className='w-100'>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th></th>
                                <th></th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapping inserted rows */}
                            {
                                expandedRowsArray.map((data, index) =>
                                    <tr key={data.id}>
                                        <td style={{ width: '20%', background: '#fff' }} >
                                            <input type='text' value={data.title} disabled style={{ background: '#fff' }} />
                                        </td>
                                        <td style={{ width: '25%', background: '#fff' }}>
                                            <textarea className='w-100' placeholder='Enter a description...' defaultValue={data.description}></textarea>
                                        </td>
                                        <td style={{ width: '15%', background: '#fff' }}>
                                            <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                                                <input type='text' value={data.type === "Hourly" ? data.assigned_hours : data.cost } />
                                                <select value={data.type} onChange={() => {}}>
                                                    <option value="Cost of sale">1/Q</option>
                                                    <option value="Hourly">1/H</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ width: '15%', background: '#fff' }}>
                                            <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                                                <input type='text' value={data.margin} />
                                                <select>
                                                    <option>Margin  %</option>
                                                    <option>Amount $</option>
                                                    <option>Markup %</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ width: '20%', background: '#fff' }}>{data.total}</td>
                                    </tr>
                                )
                            }

                            <tr>
                                <td style={{ width: '20%', background: '#fff' }} >
                                    <SelectComponent val={value} options={options} handleChange={handleChange} />
                                </td>
                                <td style={{ width: '25%', background: '#fff' }}>
                                    <textarea className='w-100' placeholder='Enter a description...'></textarea>
                                </td>
                                <td style={{ width: '15%', background: '#fff' }}>
                                    <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                                        <input type='text' />
                                        <select>
                                            <option>Quantity</option>
                                            <option>Hourly</option>
                                        </select>
                                    </div>
                                </td>
                                <td style={{ width: '15%', background: '#fff' }}>
                                    <div style={{ display: 'flex', borderBottom: '1px solid #D0D5DD' }}>
                                        <input type='text' />
                                        <select>
                                            <option>Margin  %</option>
                                            <option>Amount $</option>
                                            <option>Markup %</option>
                                        </select>
                                    </div>
                                </td>
                                <td style={{ width: '5%', background: '#fff' }}>{row.discount}</td>
                                <td style={{ width: '20%', background: '#fff' }}>{row.amount}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </React.Fragment>
    )
}

export default DepartmentQuoteTableInsideRow;