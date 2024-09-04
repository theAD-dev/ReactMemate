import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg ,PencilSquare,GripVertical} from "react-bootstrap-icons";
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
                <AccordionTab  className={style.accorHeadbox}
                header={
                    <span className="d-flex align-items-center justify-content-between">
                        <span className={style.accorHeadStyle}>Yacht Management</span>
                        <div className='RItem'>
                        <PencilSquare color="#344054" size={20} className="ml-auto" />
                        <GripVertical color="#98A2B3" size={16} className="ml-auto" />
                        </div>
                    </span>
                }
                >
                    <div className="m-0">
         
                       <Accordion>
    <AccordionTab className={style.innerBoxStyle} 
     header={
        <span className="d-flex align-items-center justify-content-between">
            <span className={style.accorHeadStyle}>Advertising - Elite Life Magazine</span>
            <div className='RItem'>
          
            <GripVertical color="#98A2B3" size={16} className="ml-auto" />
            </div>
        </span>
    }
    >
        <p className="m-01">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </AccordionTab>
    <AccordionTab className={style.innerBoxStyle} 
     header={
        <span className="d-flex align-items-center justify-content-between">
            <span className={style.accorHeadStyle}>Creatie Design for A4 Page</span>
            <div className='RItem'>
          
            <GripVertical color="#98A2B3" size={16} className="ml-auto" />
            </div>
        </span>
    }
    >
        <p className="m-01">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            Consectetur, adipisci velit, sed quia non numquam eius modi.
        </p>
    </AccordionTab>
</Accordion>
                    </div>
                </AccordionTab>
                <AccordionTab header="Real Estate Management">
                    <div className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                        quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                        sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </div>
                </AccordionTab>
                <AccordionTab header="Yacht Management">
                    <div className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                        quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                        mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
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
                        <Box className="modelStyleBoxstatus" sx={{ width: 659 }}>
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

export default Departments;
