import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg } from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DashboardNotifications = () => {
    const [activeTab, setActiveTab] = useState('dashboard-notifications');
    const [showModal, setShowModal] = useState(false);
    const [dname, setDname] = useState('');
    const [departments, setDepartments] = useState([]);

    const createIndex = () => {
      setShowModal(true);
    };
    
    const handleClose = () => {
      setShowModal(false);
    };

    const handleSave = () => {
      if (dname.trim()) {
        setDepartments([...departments, dname]);
        setDname('');
        setShowModal(false);
      }
    };

    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Notifications</h1>
                <div className='contentMenuTab'>
                <ul>
                       <li className='menuActive'><Link to="/settings/notifications/dashboard-notifications">Dashboard Notifications</Link></li>
                        <li><Link to="/settings/notifications/email-notifications">Email Notifications</Link></li>
                        <li><Link to="/settings/notifications/app-notifications">App Notifications</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                        <div>
                        <h2>Dashboard Notifications</h2>
                        <p>Lorem Ipsum dolores</p>
                        </div>
                       
                    </div>
                    <div>
                      <ul>
                        <li>fdgd</li>
                        <li>fdgd</li>
                        <li>fdgd</li>
                        <li>fdgd</li>
                      </ul>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
       
        </>
    );
}

export default DashboardNotifications;
 