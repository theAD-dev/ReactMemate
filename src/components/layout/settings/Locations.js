
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { PlusLg } from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

const Locations = () => {
    const [activeTab, setActiveTab] = useState('locations');
    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false); // Track edit mode
    const [headquarter, setHeadquarter] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  
    const addRow = (index) => {
      setShowModal(true);
      setSelectedRowIndex(index);
      setEditMode(false); // Set edit mode to false when adding a new row
    };

    const editRow = (index) => {
      setShowModal(true);
      setSelectedRowIndex(index);
      setEditMode(true); // Set edit mode to true when editing a row
      // Populate modal inputs with values from selected row
      const selectedRow = rows[index];
      setHeadquarter(selectedRow.headquarter || '');
      setFname(selectedRow.fname || '');
      setLname(selectedRow.lname || '');
      setEmail(selectedRow.email || '');
      setPhone(selectedRow.phone || '');
      setRole(selectedRow.role || '');
      setStatus(selectedRow.status || '');
    };

    const handleClose = () => {
      setShowModal(false);
      setEditMode(false); // Reset edit mode when modal is closed
    };

    const handleDeleteRow = (index) => {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    };
  
    const handleModalSubmit = () => {
      if (fname.trim() !== '' && email.trim() !== '' && phone.trim() !== '') {
        const updatedRows = [...rows];
        // If in edit mode, update the row, otherwise add a new row
        if (editMode && selectedRowIndex !== null && selectedRowIndex >= 0 && selectedRowIndex < rows.length) {
          updatedRows[selectedRowIndex] = { headquarter, fname, lname, email, phone, role, status };
        } else {
          updatedRows.push({ headquarter, fname, lname, email, phone, role, status });
        }
        setRows(updatedRows);
        setHeadquarter('');
        setFname('');
        setLname('');
        setEmail('');
        setPhone('');
        setRole('');
        setStatus('');
        setShowModal(false);
        setSelectedRowIndex(null);
        setEditMode(false); // Reset edit mode
      }
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
               
                </div>
                </div>
                <div className={`content_wrap_main ${editMode ? 'isEditingwrap' : ''}`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                        <h2>{editMode ? 'Edit Headquarter' : 'Headquarter'}</h2>
                        <button onClick={() => addRow(rows.length)}>Add <PlusLg color="#000000" size={20} /></button>
                    </div>
                    <table className="table mt-4" >
                        <thead>
                            <tr>
                            <th>Headquarter name</th>
                                <th>Street address</th>
                                <th>City/Suburb</th>
                                <th>Post code</th>
                                <th>State</th>
                                <th>Country</th>
                
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.headquarter}</td>
                                 <td>{row.fname} {row.lname}</td>
                                 <td>{row.email}</td>
                                 <td>{row.phone}</td>
                                 <td>{row.role}</td>
                                 <td>{row.status}</td>
                                    {/* <td>
                                        <button onClick={() => editRow(index)}>Edit</button>
                                        <button onClick={() => handleDeleteRow(index)}>Delete</button>
                                    </td> */}
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
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
                                            <h2>{editMode ? 'Edit Desktop User' : 'Add Desktop User'}</h2>
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
                                            <label>Headquarter</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="headquarter"
                                                value={headquarter}
                                                placeholder="Main Headquarter"
                                                onChange={(e) => setHeadquarter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="formgroup">
                                            <label>First Name</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="fname"
                                                value={fname}
                                                placeholder="Enter first name"
                                                onChange={(e) => setFname(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="formgroup">
                                            <label>Last Name</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="lname"
                                                value={lname}
                                                placeholder="Enter last name"
                                                onChange={(e) => setLname(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="formgroup">
                                            <label>Email</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="email"
                                                name="email"
                                                value={email}
                                                placeholder="company@email.com"
                                                onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="formgroup">
                                            <label>Phone (Optional)</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="phone"
                                                value={phone}
                                                placeholder="(555) 000-0000"
                                                onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="formgroup">
                                            <label>Role</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="role"
                                                value={role}
                                                placeholder="Manager"
                                                onChange={(e) => setRole(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="formgroup">
                                            <label>Status</label>
                                            <div className={`inputInfo`}>
                                                <input
                                                type="text"
                                                name="status"
                                                value={status}
                                                placeholder="Active"
                                                onChange={(e) => setStatus(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='footerButton'>
                                        <button className='Cancel' onClick={handleClose}>Cancel</button>
                                        <Button className='save' onClick={handleModalSubmit}>Save Details</Button>
                                    </div>
                                </>
                            </Typography>
                        </Box>
                    </Modal>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        </>
    );
}

export default Locations;
