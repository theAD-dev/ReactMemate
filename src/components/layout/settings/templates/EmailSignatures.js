import { Link ,useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg ,PencilSquare,GripVertical,ChevronDown,Plus,PlusCircle,Trash} from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import style from './job-template.module.scss';

const EmailSignatures = () => {
    const [activeTab, setActiveTab] = useState('job-templates');
    const [showModal, setShowModal] = useState(false);
    const [dname, setDname] = useState('');
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate(); // useNavigate hook
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
    const editTemplateHandle = () => {
     
        navigate("/settings/templates/edit-email/", { state: { departments} });
      };


    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Templates</h1>
                <div className='contentMenuTab'>
                <ul>
                <li><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                        <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                        <li className='menuActive'><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                        <li><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                    <h2>Email Templates</h2>
                        <button onClick={() => createIndex()}>Create New Template <PlusLg color="#000000" size={20} /></button>
                    </div>
                    <div>
                        <div className='boxwrap'>
                        <div className={style.boxlist}>
                        <span>theAd | Management | Thu</span>
                        <div className={style.ricons}> <PencilSquare onClick={() => editTemplateHandle()} className={style.pencilSquare} color="#344054" size={20} />&nbsp;<GripVertical color="#98A2B3" size={16} className={style.iconSpace} /></div>
                        </div>
                       
                        
                        </div>
                        {departments.map((department, index) => (
                          <div key={index} className={style.boxlist}>
                          <span>{department}</span>
                          <div className={style.ricons}> <PencilSquare onClick={() => editTemplateHandle()} className={style.pencilSquare} color="#344054" size={20} />&nbsp;<GripVertical  color="#98A2B3" size={16} className={style.iconSpace} /></div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <Modal
                        show={showModal}
                        onHide={handleClose}
                        centered 
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                    <Box className={style.modelStyleBoxstatus} sx={{ width: 505 }}>
                            <Typography id="modal-modal-title" className={``} variant="h6" component="h2">
                                <>
                                    <div className='modelHeader modelHeaderBillig d-flex justify-content-between align-items-start'>
                                        <span className='modelHeadFlex'>
                                            <div className='iconOutStyle'>
                                                <div className='iconinStyle'>
                                                    <div className='iconinnerStyle'>
                                                        <PlusLg color="#17B26A" size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                            <h2>Create Index</h2>
                                        </span>
                                        <IconButton
                                            edge="end"
                                            color="inherit"
                                            onClick={handleClose}
                                            aria-label="close">
                                            <CloseIcon color="#667085" size={24} />
                                        </IconButton>
                                    </div>
                                    <div className='stepBoxStyle stepBoxStylePayment'>
                                    <div className="formgroup">
                                            <label>Department name</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="dname"
                                                value={dname}
                                                placeholder="Department name"
                                                onChange={(e) => setDname(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='footerButton'>
                                        <button className='Cancel' onClick={handleClose}>Cancel</button>
                                        <Button className='save' onClick={handleSave}>Save</Button>
                                    </div>
                                </>
                            </Typography>
                        </Box>
                    </Modal>
        </>
    );
}

export default EmailSignatures;
