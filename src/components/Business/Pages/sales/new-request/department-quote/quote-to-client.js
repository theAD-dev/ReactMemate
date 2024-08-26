import React, { useEffect, useState } from 'react';
import { Col, FormControl as BootstrapFormControl, Placeholder } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { ChevronDown, Telephone } from 'react-bootstrap-icons';
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';

const QuoteToClient = ({ isLoading, data }) => {
    // console.log('data: ', data);
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState(data?.name || "");
    const [phone, setPhone] = useState(data?.phone || "");
    const [email, setEmail] = useState(data?.email || "");

    const [contactPerson, setContactPerson] = useState(data?.contact_persons?.[0] || {});

    const [errors, setErrors] = useState({
        name: false,
    });

    useEffect(() => {
        if (data) {
            setName(data.name);
        }

    }, [data]);

    return (
        <>
            {isEdit ? (
                <>
                    <Col sm={12}>
                        <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                            <Select
                                value={contactPerson}
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
                    {
                        isLoading ? (
                            <>
                                <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                                </Placeholder>
                                <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                                </Placeholder>
                                <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                                </Placeholder>
                                <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                                </Placeholder>
                                <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                                </Placeholder>
                                <Placeholder as="div" animation="wave" className="mt-4">
                                    <Placeholder xs={12} bg="secondary" size='md' style={{ width: '100px', height: '30px', borderRadius: '4px' }} />
                                </Placeholder>
                            </>
                        ) : (
                            <>
                                <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Main Contact</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{name || "-"}</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{contactPerson.position || "-"}</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{phone || "-"}</p>
                                <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>{email|| ""}</p>
                                <button className='btn p-0' onClick={() => setIsEdit(!isEdit)} style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>Edit info</button>
                            </>
                        )
                    }
                </Col>
            )}
        </>
    );
};

export default QuoteToClient;
