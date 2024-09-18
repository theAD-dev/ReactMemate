import { Link ,useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg} from "react-bootstrap-icons";
import style from './location.module.scss';

const InnovationStudio = () => {
    const [activeTab, setActiveTab] = useState('headquarter');
    const navigate = useNavigate(); 

  

  
    const editTemplateHandle = () => {
     
        navigate("/settings/templates/edit-template/");
      };


    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Locations</h1>
                <div className='contentMenuTab'>
                <ul>
                       <li><Link to="/settings/location/headquarter">Headquarter</Link></li>
                        <li className='menuActive'><Link to="/settings/location/innovation-studio">Innovation Studio</Link></li>
                        <li><Link to="/settings/location/creative-hub">Creative Hub</Link></li>
                       
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                        <h2>Innovation Studio</h2>
                        <button onClick={() => editTemplateHandle()}>Add New <PlusLg color="#000000" size={20} /></button>
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

export default InnovationStudio;
