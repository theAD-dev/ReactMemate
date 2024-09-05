import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg ,PencilSquare,GripVertical,ChevronDown,Plus,PlusCircle} from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import style from './calculators.module.scss';
import Box from '@mui/material/Box';
import { Accordion, AccordionTab } from 'primereact/accordion';


const Departments = () => {
    const [activeTab, setActiveTab] = useState('departments');
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
      
    };

    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Calculators</h1>
                <div className='contentMenuTab'>
                <ul>
                       <li className='menuActive'><Link to="/settings/calculators/departments">Departments</Link></li>
                        <li><Link to="/settings/calculators/subindex">Subindex</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className={`topHeadStyle pb-4 ${style.topHeadBorder}`}>
                        <h2>Departments</h2>
                        <button onClick={() => createIndex()}>Create Index <PlusLg color="#000000" size={20} /></button>
                    </div>
                    <div>
                    <Accordion>
                    <AccordionTab className={`${style.accorHeadbox} `}
                    header={
                    <span className="d-flex align-items-center justify-content-between">
                        <span className={style.accorHeadStyle}>Yacht Management</span>
                        <div className='RItem'>
                        
                        <PencilSquare color="#344054" size={20} />
                        <GripVertical color="#98A2B3" size={16} className={style.iconSpace} />
                        <ChevronDown color="#344054" size={12}/>
                        </div>
                    </span>
                }
                >
                    <div className="m-0">
         
                       <Accordion>
    <AccordionTab className={style.innerBoxStyle} 
     header={
        <span className="d-flex align-items-center justify-content-between">
            <span className={style.accorInHeadStyle}>Advertising - Elite Life Magazine</span>
            <div className='RItem'>
          
            <GripVertical color="#98A2B3" size={16} className="ml-auto" />
            </div>
        </span>
    }>
        <p className={`m-01 ${style.contentStyle}`}>
        <h6>Description</h6>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
    </AccordionTab>
    <AccordionTab className={style.innerBoxStyle} 
     header={
        <span className="d-flex align-items-center justify-content-between">
            <span className={style.accorInHeadStyle}>Creatie Design for A4 Page</span>
            <div className='RItem'>
            <GripVertical color="#98A2B3" size={16} className="ml-auto" />
            
            </div>
        </span>
    }>
         <p className={`m-01 ${style.contentStyle}`}>
            <h6>Description</h6>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
    </AccordionTab>
</Accordion>
<Button className={style.creaeDepartment}><Plus color="#475467" size={20} />Create Sub Department</Button>
                    </div>
                </AccordionTab>
            </Accordion>
                        {departments.map((department, index) => (
                       <>
                       </>
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
                                            <div className={style.iconborderStyle}>
                                                        <PlusCircle color="#17B26A" size={24} />
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
                                  
                                    <div className={`stepBoxStyle ${style.stepBoxStylePayment}`}>
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
                                        <Button className='save' onClick={handleSave}>Save Details</Button>
                                    </div>
                                </>
                            </Typography>
                        </Box>
                    </Modal>
        </>
    );
}

export default Departments;
