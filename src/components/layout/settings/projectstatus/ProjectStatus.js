import React, { useState, useEffect } from "react";
import { Menu, MenuItem, MenuButton, MenuRadioGroup } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Sidebar from '../Sidebar';
import { Button, Table } from 'react-bootstrap';
import { PlusLg, ChevronDown } from "react-bootstrap-icons";
import { ProjectStatusesList } from "../../../../APIs/SettingsGeneral";
import { Link } from 'react-router-dom';

const colorOptions = [
    { value: "#BAE8FF", color: "#1AB2FF", text: "Blue" },
    { value: "#D1E0FF", color: "#0040C1", text: "Dark Blue" },
    { value: "#EAECF5", color: "#4E5BA6", text: "Deep Blue" },
    { value: "#EBE9FE", color: "#7A5AF8", text: "Light Purple" },
    { value: "#CCFBEF", color: "#15B79E", text: "Green" },
    { value: "#E3FBCC", color: "#66C61C", text: "Light Green" },
    { value: "#FBE8FF", color: "#D444F1", text: "Magenta" },
    { value: "#FFE4E8", color: "#F63D68", text: "Pink" },
    { value: "#FFCCE5", color: "#FF007F", text: "Soft Pink" },
    { value: "#FFE8CD", color: "#FFB258", text: "Orange" },
    { value: "#FFF8D1", color: "#FFD700", text: "Yellow" },
    { value: "#E1E1B8", color: "#6C6C1C", text: "Dark Yellow" }
];

const ProjectStatus = () => {
    const [activeTab, setActiveTab] = useState('recurring-quotes');
    const [options, setOptions] = useState([]);
    const [savedOptions, setSavedOptions] = useState([]);
    // const [colorStatus, setColorStatus] = useState(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ProjectStatusesList();
                setOptions([...data, { id: data.length + 1, color: '#FFE8CD' }]); // Include empty option
            } catch (error) {
                console.error("Error fetching project status data:", error);
            }
        };
        fetchData();
    }, []);

    const addOption = () => {
        setOptions([...options, { id: options.length + 1, color: '#FFE8CD' }]);
    };

    const removeOption = (id) => {
        setOptions(options.filter(option => option.id !== id));
        setSavedOptions(savedOptions.filter(option => option.id !== id));
    };

    const updateOptionColor = (id, color) => {
        setOptions(options.map(option => option.id === id ? { ...option, color } : option));
    };

    const saveOption = (id) => {
        const optionToSave = options.find(option => option.id === id);
        setSavedOptions([...savedOptions.filter(option => option.id !== id), optionToSave]);
    };

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky'>
                        <h1>Organisation Setting</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li className='menuActive'><Link to="/settings/projectstatus/project-status">Project Status</Link></li>
                                <li><Link to="/settings/projectstatus/item2">Item 2</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="content_wrap_main">
                        <div className='content_wrapper'>
                            <div className="listwrapper orgColorStatus">
                                <h4>Custom Order Status</h4>
                                <Table>
                                    <tbody>
                                        {options.map(option => (
                                            <tr key={option.id}>
                                                <td>Status</td>
                                                <td>
                                                    <div className='statuswrapper'>
                                                        <div className='statusTitle'>
                                                            <input
                                                                type="text"
                                                                value={option.title}
                                                                onChange={(e) => setOptions(e.target.value)}
                                                            />
                                                        </div>
                                                        <Menu 
                                                            className='mainSelectMenu' 
                                                            menuButton={
                                                                <MenuButton className="colorSelectBut">
                                                                    <div className="butcolorIn" style={{ background: option.color }}>{colorOptions.text}</div>
                                                                    <ChevronDown size={20} color='#98A2B3'/>
                                                                </MenuButton>
                                                            }>
                                                                
                                                            <MenuRadioGroup
                                                                className='selectOptionMenu'
                                                                value={option.color}
                                                                onRadioChange={(color) => updateOptionColor(option.id, color)}>

                                                                {colorOptions.map(({ value, color, text }) => (
                                                                    <MenuItem key={value} type="radio" value={value}>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <div className='dflexColorStatus' style={{ borderLeft: `4px solid ${color}`, color, borderRadius: '4px', height: '30px', backgroundColor: value }}>
                                                                                {text}
                                                                            </div>
                                                                        </div>
                                                                    </MenuItem>
                                                                ))}
                                                            </MenuRadioGroup>
                                                        </Menu>
                                                    </div>
                                                </td>
                                                <td className="butactionOrg">
                                                    <p><Button className="save" onClick={() => saveOption(option.id)}>Save</Button></p>
                                                    <p><Button className="remove" onClick={() => removeOption(option.id)}>Remove</Button></p>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td id='addmoreOption' colSpan={3}>
                                                <Button onClick={addOption}>
                                                    Add an Option <PlusLg size={20} color='#000000'/>
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStatus;
