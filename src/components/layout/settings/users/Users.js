import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import {Plus} from 'react-bootstrap-icons';
import style from './users.module.scss';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import Desktop from './desktop';
                                      
const Users = () => {
    const [activeTab, setActiveTab] = useState('desktop');
    return (
        <>
            <div className={`settings-wrap ${style.userSettingPage}`}>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Users</h1>
                            <div className={`contentMenuTab ${style.contentMenuTab}`}>
                                <ul>
                                <li className='menuActive'><Link to="/settings/users/desktop">Desktop</Link></li>
                                <li><Link to="/settings/users/mobile-app">Mobile App</Link></li>
                                </ul>
                                <Button className={style.addUserBut}>Add <Plus size={20} color="#000" /></Button>
                            </div>
                           
                        </div>
                        <div className={`content_wrap_main ${style.contentwrapmain}`}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <div className={style.userHead}>
                                        <h2>Desktop Users</h2>
                                        <p>3/5 <span>Buy More</span></p>
                                        </div>
                                        
                                    </div>
                                        <Desktop />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default Users;
