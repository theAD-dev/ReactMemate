import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Desktop from './desktop';
import style from './users.module.scss';

const Users = () => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Helmet>
                <title>MeMate - Desktop Users</title>
            </Helmet>
            <div className={`${style.userSettingPage}`}>
                <Desktop visible={visible} setVisible={setVisible} />
            </div>
        </>
    );
};


export default Users;
