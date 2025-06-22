import React from 'react';
import { ChevronDown } from 'react-bootstrap-icons';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

const SelectComponent = ({ departments, handleChange, title, keyValue }) => {
    const handleSubMenuClick = (label, value) => {
        handleChange(value, label, keyValue);
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
                    color: title ? '#101828' : '#98A2B3'
                }}>
                    <div className='ellipsis-width' title={title || "Department"}>
                        {title || "Department"}
                    </div>
                    <span>
                        <ChevronDown color="#98A2B3" size={15} />
                    </span>
                </MenuButton>
            }
            overflow="auto"
            position="anchor"
            portal
            className='departmentSelect'
        >
            {departments?.filter((data) => !data?.deleted)?.map((department) => (
                <React.Fragment key={department.id}>
                    {department?.subindexes?.length ? (
                        <SubMenu
                            key={department.id}
                            label={department?.name}
                            direction="right"
                            align="start"
                            menuStyle={{
                                maxHeight: '500px',
                                overflow: 'auto',
                                textAlign: 'left'
                            }}
                        >
                            {department.subindexes?.filter((data) => !data?.deleted)?.map((subitem) => (
                                <MenuItem
                                    key={subitem.id}
                                    onClick={() => handleSubMenuClick(subitem?.name, subitem?.id)}
                                >
                                    {subitem?.name}
                                </MenuItem>
                            ))}
                        </SubMenu>
                    ) : (
                        <MenuItem
                            style={{ textAlign: 'left' }}
                            key={department.id}
                            onClick={() => handleSubMenuClick(department?.name, department?.id)}
                        >
                            {department?.name}
                        </MenuItem>
                    )}
                </React.Fragment>
            ))}
        </Menu>
    );
};

export default SelectComponent;
