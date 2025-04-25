import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Desktop from './desktop';
import style from './users.module.scss';

const Users = () => {
    const [activeTab, setActiveTab] = useState('desktop');
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Helmet>
                <title>MeMate - Desktop Users</title>
            </Helmet>
            <div className={`settings-wrap ${style.userSettingPage}`}>
                <div className="settings-wrapper">
                    <Desktop visible={visible} setVisible={setVisible} />
                </div>
            </div>
        </>
    );
};


export default Users;
