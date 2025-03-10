import React, { useState } from 'react';
import { ChevronDown } from 'react-bootstrap-icons';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

const SelectComponent = ({ departments, handleChange, isShowlabel = false, title }) => {
    const [selectedOption, setSelectedOption] = useState(title || null);
    const handleSubMenuClick = (label, value) => {
        if (isShowlabel) setSelectedOption(label);
        handleChange(value, label);
    };
    return (
        <Menu
            menuButton={
                <MenuButton style={{
                    width: '150px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    color: '#98A2B3'
                }}>
                    <span>{selectedOption || "Department"}</span> <span><ChevronDown color="#98A2B3" size={15} /></span>
                </MenuButton>}
            overflow={"auto"}
            position={"anchor"}
        >
            {departments?.filter((data) => !data?.deleted)?.map((department) => (
                <React.Fragment key={department.id}>
                    {
                        department?.subindexes?.length ? (
                            <SubMenu overflow='auto' menuStyle={{ maxHeight: '320px', overflow: 'auto', textAlign: 'left' }} key={department.id} label={department?.name}> {
                                department.subindexes?.filter((data) => !data?.deleted)?.map((subitem) => (
                                    <MenuItem key={subitem.id} onClick={() => handleSubMenuClick(subitem?.name, subitem?.id)}>{subitem?.name}</MenuItem>
                                ))
                            }
                            </SubMenu>
                        ) : (
                            <MenuItem style={{ textAlign: 'left' }} key={department.id}>{department?.name}</MenuItem>
                        )
                    }
                </React.Fragment>
            ))}
        </Menu>
    );
};

export default SelectComponent;
