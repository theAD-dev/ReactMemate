import React, { useEffect, useState } from 'react'
import Select, { components } from "react-select";

export const SelectComponentPage = ({ val, options }) => {
    const [value, setValue] = useState(val);
    const handleChange = (e) => {
        const subitemId = e.value;
        setValue(subitemId)
    }
    return (
        <Select
            value={value}
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
