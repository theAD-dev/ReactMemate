import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import style from './jobtemplate.module.scss';
import BreadCrumbPage from './bread-crumb';

const EditTemplates = () => {
    const [activeTab, setActiveTab] = useState('job-templates');


    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={` settings-content ${style.templateBoxWrap}`}>
            <BreadCrumbPage />
                <div className='headSticky'>
                <h1>Templates</h1>
              
                </div>
               
            </div>
        </div>
        </div>
       
        </>
    );
}

export default EditTemplates;
