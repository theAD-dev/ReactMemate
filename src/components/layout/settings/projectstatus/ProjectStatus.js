import React, { useState, useEffect } from "react";
import { Menu, MenuItem, MenuButton, MenuGroup } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Sidebar from '../Sidebar';
import { Button, Placeholder, Table } from 'react-bootstrap';
import { PlusLg, ChevronDown } from "react-bootstrap-icons";
import { createProjectStatus, deleteProjectStatusById, ProjectStatusesList, updateProjectStatusById } from "../../../../APIs/SettingsGeneral";
import { Link } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";

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
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('organisation-setting');
    const [options, setOptions] = useState([]);
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
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteProjectStatusById(id),
        onSuccess: () => {
            fetchData();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const createMutation = useMutation({
        mutationFn: (data) => createProjectStatus(data),
        onSuccess: () => {
            fetchData();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const addOption = () => {
        setOptions((oldOptions) => [...oldOptions, { isNew: true, id: oldOptions.length + 1, color: '#FFB258' }]);
    };

    const updateOptionColor = (id, color) => {
        setOptions(options.map(option => option.id === id ? { ...option, color } : option));
    };

    const updateOptionTitle = (id, title) => {
        setOptions(options.map(option => option.id === id ? { ...option, title } : option));
    };

    const saveOption = (id, isNew = false) => {
        const optionToSave = options.find(option => option.id === id);
        if (isNew) {
            console.log('new options to create...', optionToSave);
            //if (optionToSave.id) delete optionToSave.id;
            createMutation.mutate(optionToSave);
        } else {
            console.log('options to update...', optionToSave);
            updateMutation.mutate(optionToSave);
        }
    };

    const removeOption = (id) => {
        let updatedOptions = options.filter(option => option.id !== id);
        if (updatedOptions) deleteMutation.mutate(id);
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
                                <h4>Custom Order Status</h4>
                                <Table>
                                    <tbody>
                                        {!isCreating && options.map((option, index) => (
                                            <tr key={`option-${option.id}-${index}`}>
                                                <td>Status</td>
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
                                                                    <div className="butcolorIn" style={{ background: option.color }}>{colorOptions.text}</div>
                                                                    <ChevronDown size={20} color='#98A2B3' />
                                                                </MenuButton>
                                                            }
                                                            overflow={"auto"}
                                                            position={"anchor"}
                                                        >
                                                            <MenuGroup takeOverflow style={{ maxHeight: '230px', overflow: 'auto', boxShadow: ' 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
                                                                {colorOptions.map(({ value, color, text }, index) => (
                                                                    <MenuItem onClick={() => updateOptionColor(option.id, value)} key={`${index}-${value}`} value={value} style={{ padding: '8px 10px 8px 8px' }}>
                                                                        <div className="d-flex" style={{ width: '140px', height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                                                                            <div className="h-100" style={{ width: '4px', background: `${color}` }}></div>
                                                                            <div className="h-100 d-flex align-items-center" style={{ width: '100%', background: `${value}` }}>
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
                                                    <p><Button className="save" onClick={() => saveOption(option.id, option.isNew)}>{(updateMutation.isPending && updateMutation?.variables?.id === option.id) || (createMutation.isPending && createMutation?.variables?.id === option.id) ? "Loading..." : "Save"}</Button></p>
                                                    <p><Button className="remove" onClick={() => removeOption(option.id)}>{deleteMutation.isPending && deleteMutation?.variables?.id === option.id ? "Loading..." : "Remove"}</Button></p>
                                                </td>
                                            </tr>
                                        ))}
                                        {
                                            isCreating && (
                                                <>
                                                <tr>
                                                    <td>
                                                        <Placeholder as="p" animation="wave" className="mb-4 mx-1">
                                                            <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                                                        </Placeholder>
                                                    </td>
                                                    <td>
                                                        <Placeholder as="p" animation="wave" className="mb-4 mx-1">
                                                            <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                                                        </Placeholder>
                                                    </td>
                                                    <td>
                                                        <Placeholder as="p" animation="wave" className="mb-4 mx-1">
                                                            <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                                                        </Placeholder>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <Placeholder as="p" animation="wave" className="mb-4 mx-1">
                                                            <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                                                        </Placeholder>
                                                    </td>
                                                    <td>
                                                        <Placeholder as="p" animation="wave" className="mb-4 mx-1">
                                                            <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                                                        </Placeholder>
                                                    </td>
                                                    <td>
                                                        <Placeholder as="p" animation="wave" className="mb-4 mx-1">
                                                            <Placeholder xs={12} bg="secondary" style={{ height: '30px' }} />
                                                        </Placeholder>
                                                    </td>
                                                </tr>

                                                </>
                                            )
                                        }
                                        <tr>
                                            <td id='addmoreOption' colSpan={3}>
                                                <Button onClick={addOption}>
                                                    Add an Option <PlusLg size={20} color='#000000' />
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
