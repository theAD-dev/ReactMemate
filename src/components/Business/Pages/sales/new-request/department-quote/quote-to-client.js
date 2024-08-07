import React, { useState } from 'react';
import { Col, FormControl as BootstrapFormControl } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { ChevronDown, Telephone } from 'react-bootstrap-icons';
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';

const QuoteToClient = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState('');
    const [contact_person, setContactPerson] = useState("");
    const [errors, setErrors] = useState({
        name: false,
    });
    
    return (
        <>
            {isEdit ? (
                <>
                    <Col sm={12}>
                        <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                            <Form.Label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Task Title</Form.Label>
                            <Select
                                value={contact_person}
                                onChange={(e) => setContactPerson(e.target.value)}
                                displayEmpty
                                IconComponent={ChevronDown}
                                style={{ color: '#101828' }}
                            >
                                <MenuItem value="">Paul Stein</MenuItem>
                            </Select>
                        </MUIFormControl>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Email</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter ABN"
                                value={'company@email.com'}
                                className='border-0 p-0'
                                style={{ color: '#475467', fontWeight: 600, fontSize: '16px', boxShadow: 'none', outline: 'none' }}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.taskTitle && <Form.Text className="text-danger">Email is required</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter ABN"
                                    value={'+61-8-8533-5602'}
                                    className='border-0 p-0'
                                    style={{ color: '#475467', fontWeight: 600, fontSize: '16px', boxShadow: 'none', outline: 'none' }}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <InputGroup.Text className='border-0 bg-white'>
                                    <Telephone color='#1AB2FF' />
                                </InputGroup.Text>
                            </InputGroup>
                            {errors.taskTitle && <Form.Text className="text-danger">Task title is required</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col sm={12} className='d-flex' style={{ gap: '16px' }}>
                        <button onClick={() => { }} className='btn p-0' style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>Save</button>
                        <button onClick={() => setIsEdit(!isEdit)} className='btn p-0' style={{ color: '#B42318', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
                    </Col>
                </>
            ) : (
                <Col>
                    <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Main Contact</p>
                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>Paul Smith | Manager </p>
                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>Manager</p>
                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>+61-8-8533-5602</p>
                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>personal@email.com</p>
                    <button className='btn p-0' onClick={() => setIsEdit(!isEdit)} style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>Edit info</button>
                </Col>
            )}
        </>
    );
};

export default QuoteToClient;
