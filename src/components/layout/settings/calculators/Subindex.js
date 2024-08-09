import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from './../Sidebar';
import { PlusLg } from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

const Subindex = () => {
    const [activeTab, setActiveTab] = useState('departments');
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
                <h1>Calculators</h1>
                <div className='contentMenuTab'>
                <ul>
                       <li><Link to="/settings/calculators/departments">Departments</Link></li>
                        <li className='menuActive'><Link to="/settings/calculators/subindex">Subindex</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main ${editMode ? 'isEditingwrap' : ''}`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                        <h2>{editMode ? 'Edit Desktop User' : 'Add Desktop User'}</h2>
                        <button onClick={() => addRow(rows.length)}>Add <PlusLg color="#000000" size={20} /></button>
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

export default Subindex;
