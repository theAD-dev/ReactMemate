import React, { useState, useEffect } from "react";
import { Menu, MenuItem, MenuButton, MenuRadioGroup } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import Sidebar from '../Sidebar';
import { Button, Table } from 'react-bootstrap';
import { Check,PlusLg } from "react-bootstrap-icons";
import { ProjectStatusesList} from "../../../../APIs/SettingsGeneral";
import { Link } from 'react-router-dom';

const Item2 = () => {
    const [activeTab, setActiveTab] = useState('project-status');
    const [options, setOptions] = useState([{ id: 1, color: '#BAE8FF' }]);
    const [savedOptions, setSavedOptions] = useState(options); 
    const [colorStatus, setColorStatus] = useState(); 
    const [statusData, setStatusData] = useState();
    console.log('statusData: ', statusData);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await ProjectStatusesList();
    
            setStatusData(data);
          } catch (error) {
            console.error("Error fetching Bank information:", error);
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
                       <li><Link to="/settings/projectstatus/project-status">Project Status</Link></li>
                        <li className='menuActive'><Link to="/settings/projectstatus/Item2">Item 2</Link></li>
                    </ul>
                </div>
                    </div>
                    <div className="content_wrap_main">
                        <div className='content_wrapper'>
                            <div className="listwrapper orgColorStatus">
                                <h4>Custom Order Status</h4>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Item2;
