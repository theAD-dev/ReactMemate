import React, { useState } from 'react';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { ExpandMore } from '@mui/icons-material';

const SelectComponent = ({ departments, handleChange, isShowlabel = false, title }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedSubOption, setSelectedSubOption] = useState(title || null);

    const options = departments?.map(item => ({
        value: item.id,
        label: item.name,
        options: item.subindexes.map(subitem => ({
            value: subitem.id,
            label: subitem.name
        }))
    }));
    
    const handleMenuItemClick = (value, label) => {
        setSelectedOption(label);
        setSelectedSubOption(null); // Reset sub option on main menu item click
    };

    const handleSubMenuClick = (label, value) => {
        if(isShowlabel) setSelectedSubOption(label);
        handleChange(value, label);
    };

    return (
        <div style={{ position: 'relative', width: '200px' }}>
            <Menu
                style={{
                    maxHeight: '200px', // Max height for the menu to enable scrolling
                    overflowY: 'auto', // Enable vertical scrolling
                    border: '1px solid #ccc', // Optional: Add border to the menu container
                    borderRadius: '4px', // Optional: Add border radius to the menu container
                }}
                menuButton={
                    <MenuButton
                        style={{
                            minWidth: '150px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: '#212529',
                            border: '1px solid #ccc'
                        }}
                    >
                        {selectedSubOption || selectedOption || "Select an option"} <span><ExpandMore /></span>
                    </MenuButton>
                }
            >
                {options?.map(option => (
                    <SubMenu disabled={isShowlabel} key={option.value} label={option.label}>
                        {option.options.map(subOption => (
                            <MenuItem key={subOption.value} onClick={() => handleSubMenuClick(subOption.label, subOption.value)}>
                                {subOption.label}
                            </MenuItem>
                        ))}
                    </SubMenu>
                ))}
            </Menu>
        </div>
    );
};

export default SelectComponent;
