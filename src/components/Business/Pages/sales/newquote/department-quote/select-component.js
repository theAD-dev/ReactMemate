import React, { useState } from 'react';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { ExpandMore } from '@mui/icons-material';
import { ChevronDown } from 'react-bootstrap-icons';

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
                menuButton={
                    <MenuButton
                        style={{
                            width: '150px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 0px',
                            cursor: 'pointer',
                            color: '#98A2B3',
                            fontWeight: 400,
                        }}
                    >
                        {selectedSubOption || selectedOption || "Department"} <span><ChevronDown color="#98A2B3" size={15}/></span>
                    </MenuButton>
                }
            >
                {options?.map(option => (
                    <SubMenu disabled={isShowlabel} key={option.value} label={option.label}>
                        {option?.options?.map(subOption => (
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
