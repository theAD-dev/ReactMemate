import React, { useState, useEffect } from "react";
import { Menu, MenuItem, MenuButton, MenuGroup } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Sidebar from '../Sidebar';
import { Button, Spinner, Table } from 'react-bootstrap';
import { PlusLg, ChevronDown } from "react-bootstrap-icons";
import { createProjectStatus, deleteProjectStatusById, ProjectStatusesList, updateProjectStatusById } from "../../../../APIs/SettingsGeneral";
import { Link } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import zIndex from "@mui/material/styles/zIndex";

const colorOptions = [
    { value: "#1AB2FF", bg:"#BAE8FF", border:"#1AB2FF", color: "#0A4766", text: "Blue" },
    { value: "#4E5BA6", bg:"#EAECF5", border:"#4E5BA6", color: "#293056", text: "Deep Blue" },
    { value: "#2970FF", bg:"#D1E0FF", border:"#2970FF", color: "#0040C1", text: "Dark Blue" },
    { value: "#FFB258", bg:"#FFE8CD", border:"#FFB258", color: "#6D471A", text: "Orange" },
    { value: "#15B79E", bg:"#CCFBEF", border:"#15B79E", color: "#125D56", text: "Green" },
    { value: "#66C61C", bg:"#E3FBCC", border:"#66C61C", color: "#326212", text: "Light Green" },
    { value: "#7A5AF8", bg:"#EBE9FE", border:"#7A5AF8", color: "#4A1FB8", text: "Light Purple" },
    { value: "#D444F1", bg:"#FBE8FF", border:"#D444F1", color: "#821890", text: "Magenta" },
    { value: "#F63D68", bg:"#FFE4E8", border:"#F63D68", color: "#A11043", text: "Pink" },
    { value: "#FF007F", bg:"#FFCCE5", border:"#FF007F", color: "#6F0A3C", text: "Soft Pink" },
    { value: "#FFD700", bg:"#FFF8D1", border:"#FFD700", color: "#997100", text: "Yellow" },
    { value: "#6C6C1C", bg:"#E1E1B8", border:"#6C6C1C", color: "#444403", text: "Dark Yellow" }
];



const ProjectStatus = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('organisation-setting');
    const [options, setOptions] = useState([]);
    console.log('options>>>>>>>>>>>>>>: ', options);

    const fetchData = async () => {
        try {
            setIsCreating(true);
            const data = await ProjectStatusesList();
            console.log('data: ', data);
            setOptions([...data]); // Include empty option
        } catch (error) {
            console.error("Error fetching project status data:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const updateMutation = useMutation({
        mutationFn: (data) => updateProjectStatusById(data.id, data),
        onSuccess: async () => {
            await fetchData();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
            fetchData();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteProjectStatusById(id),
        onSuccess: () => {
            fetchData();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
            fetchData();
        }
    });

    const createMutation = useMutation({
        mutationFn: (data) => createProjectStatus(data),
        onSuccess: () => {
            fetchData();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
            fetchData();
        }
    });

    const addOption = () => {
        setOptions((oldOptions) => [...oldOptions, { isNew: true, id: oldOptions.length + 1, value: '#FFB258', color: '#FFB258', title: "" }]);
    };

    const updateOptionColor = (id, color) => {
        setOptions(options.map(option => option.id === id ? { ...option, color, isChanged: true } : option));
    };

    const updateOptionTitle = (id, title) => {
        setOptions(options.map(option => option.id === id ? { ...option, title, isChanged: true } : option));
    };

    const saveOption = (id, isNew = false) => {
        const optionToSave = options.find(option => option.id === id);
        if (isNew) {
            console.log('new options to create...', optionToSave);
            createMutation.mutate(optionToSave);
        } else {
            console.log('options to update...', optionToSave);
            updateMutation.mutate(optionToSave);
        }
    };

    const removeOption = (id) => {
        let updatedOptions = options.filter(option => option.id === id);
        console.log('updatedOptions: ', updatedOptions);
        if (updatedOptions && updatedOptions.length && updatedOptions[0].isNew) {
            setOptions(options.filter(option => option.id !== id));
        }
        else if(updatedOptions && updatedOptions.length) deleteMutation.mutate(id);
    };

    useEffect(() => {
        fetchData();
    }, []);






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
                               <div className="top">
                               <h4>Custom Order Status</h4>
                               <p>The status name can be up to 20 characters long.</p>
                               </div>
                                {
                                    isCreating && (
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', }} className="shadow-lg">
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </div>
                                    )
                                }
                                <Table>
                                    <tbody>
                                        {options.map((option, index) => (
                                            <tr key={`option-${option.id}-${index}`}>
                                              
                                                <td>
                                                    <div className='statuswrapper'>
                                                        <div className='statusTitle'>
                                                            <input
                                                                type="text"
                                                                value={option.title}
                                                                onChange={(e) => updateOptionTitle(option.id, e.target.value)}
                                                            />
                                                        </div>
                                               
                                                        <Menu
                                                            className='mainSelectMenu'
                                                            menuButton={
                                                                <MenuButton className="colorSelectBut">
                                                                <div
                                                                    className="butcolorIn"
                                                                    style={{
                                                                        borderColor: option.color,
                                                                        background: colorOptions.find(opt => opt.value === option.color)?.bg || 'transparent',
                                                                        color: option.color,
                                                                    }}
                                                                >
                                                                    {colorOptions.find(opt => opt.value === option.color)?.text || 'Select Color'}
                                                                </div>
                                                                <ChevronDown size={20} color='#98A2B3' />
                                                            </MenuButton>
                                                            
                                                            }
                                                            overflow={"auto"}
                                                            position={"anchor"}>
                                                            <MenuGroup takeOverflow style={{ maxHeight: '230px', overflow: 'auto', boxShadow: ' 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
                                                                {colorOptions.map(({ value,bg,border, color, text }, index) => (
                                                                   
                                                                    <MenuItem onClick={() => updateOptionColor(option.id, value)} key={`${index}-${value}`} value={value} style={{ padding: '8px 10px 8px 8px' }}>
                                                                        <div className="d-flex" style={{ width: '140px', height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                                                                            <div className="h-100" style={{ width: '4px', background: `${border}` }}></div>
                                                                            <div className="h-100 d-flex align-items-center" style={{ width: '100%', background: `${bg}` }}>
                                                                                <span style={{ color: `${color}`, fontSize: '14px', paddingLeft: '12px', fontWeight: '400' }}>{text}</span>
                                                                            </div>
                                                                        </div>
                                                                    </MenuItem>
                                                                ))}
                                                            </MenuGroup>
                                                        </Menu>
                                                    </div>
                                                </td>
                                                <td className="butactionOrg">
                                                    {(option.isNew || option.isChanged) &&
                                                       
                                                            <Button className="save" onClick={() => saveOption(option.id, option.isNew)}>
                                                                {
                                                                    (updateMutation.isPending && updateMutation?.variables?.id === option.id)
                                                                        ||
                                                                        (createMutation.isPending && createMutation?.variables?.id === option.id)
                                                                        ?
                                                                        "Loading..."
                                                                        : "Save"
                                                                }
                                                            </Button>
                                                     
                                                    }
                                                   <Button className="remove" onClick={() => removeOption(option.id)}>{deleteMutation.isPending && deleteMutation?.variables === option.id ? "Loading..." : "Remove"}</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td id='addmoreOption' colSpan={3}>
                                                <Button onClick={addOption}>
                                                    Add an Option  &nbsp;<PlusLg size={20} color='#000000' />
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
