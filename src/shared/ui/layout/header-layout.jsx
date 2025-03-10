import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';

const HeaderLayout = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="main-wrapper">
                <Outlet />
            </div>
        </React.Fragment>
    );
};

export default HeaderLayout;