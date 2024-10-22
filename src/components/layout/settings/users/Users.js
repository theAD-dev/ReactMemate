import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Plus } from 'react-bootstrap-icons';
import style from './users.module.scss';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Desktop from './desktop';
import clsx from 'clsx';

const Users = () => {
    const [activeTab, setActiveTab] = useState('desktop');
    const [visible, setVisible] = useState(false);
    return (
        <>
            <div className={`settings-wrap ${style.userSettingPage}`}>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <Desktop visible={visible} setVisible={setVisible} />
                </div>
            </div>
        </>
    );
}


export default Users;
