import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { ChevronDown, QuestionCircle, Telephone } from 'react-bootstrap-icons';
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';

const QuoteToBusiness = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('+61-8-8533-5602');
    const [email, setEmail] = useState('company@email.com');
    const [contact_person, setContactPerson] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({
        name: false,
    });



    return (
        <>
            {
                isEdit ? (
                    <Row>
                        <Col sm={6}>
                            <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                                <Select
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    displayEmpty
                                    IconComponent={ChevronDown}
                                    style={{ color: '#101828' }}
                                >
                                    <MenuItem value="">[ Business Name 1 ]</MenuItem>
                                </Select>
                            </MUIFormControl>
                        </Col>
                        <Col sm={6}>
                            <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
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
                                <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>ABN</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter ABN"
                                    value={'32 635 443 221'}
                                    className='border-0 p-0'
                                    style={{ color: '#475467', fontWeight: 600, fontSize: '16px', boxShadow: 'none', outline: 'none' }}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.taskTitle && <Form.Text className="text-danger">ABN is required</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter phone"
                                        value={phone}
                                        className='border-0 p-0'
                                        style={{ color: '#475467', fontWeight: 600, fontSize: '16px', boxShadow: 'none', outline: 'none' }}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <InputGroup.Text className='border-0 bg-white'>
                                        <Telephone color='#1AB2FF' />
                                    </InputGroup.Text>
                                </InputGroup>
                                {errors.taskTitle && <Form.Text className="text-danger">Phone number is required</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Email</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter email"
                                    value={email}
                                    className='border-0 p-0'
                                    style={{ color: '#475467', fontWeight: 600, fontSize: '16px', boxShadow: 'none', outline: 'none' }}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.taskTitle && <Form.Text className="text-danger">Email is required</Form.Text>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                                <Select
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    displayEmpty
                                    IconComponent={ChevronDown}
                                    style={{ color: '#101828' }}
                                >
                                    <MenuItem value="">Client Address</MenuItem>
                                </Select>
                            </MUIFormControl>
                        </Col>
                        <Col sm={12} className='d-flex' style={{ gap: '16px' }}>
                            <button onClick={() => { }} className='btn p-0' style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>Save</button>
                            <button onClick={() => setIsEdit(!isEdit)} className='btn p-0' style={{ color: '#B42318', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
                        </Col>
                    </Row>
                )
                    : (
                        <>
                            <Col>
                                <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Company</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>The Creative Business</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>ABN: 78 167 098 704</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>+61 299660414</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>Unit 5 84 Reserve Rd. Artarmon NSW 2064</p>
                                <button onClick={() => setIsEdit(!isEdit)} className='btn p-0' style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>Edit info</button>
                            </Col>
                            <Col>
                                <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Main Contact</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>Paul Stein / Manager</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>Manager</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>+61458987490</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>personal@email.com</p>
                            </Col>
                        </>)
            }
        </>
    )
}

export default QuoteToBusiness