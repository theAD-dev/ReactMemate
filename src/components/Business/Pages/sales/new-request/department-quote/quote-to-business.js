import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Col, Placeholder, Row } from 'react-bootstrap';

const QuoteToBusiness = ({ isLoading, data }) => {
    const [isEdit, setIsEdit] = useState(false);

    const mainAddress = data.addresses.find(address => address.is_main) || (data.addresses?.length ? data.addresses[0] : {});
    const mainContact = data.contact_persons.find(contact => contact.is_main) || (data.contact_persons?.length ? data.contact_persons[0] : {});

    return (
        <>
            {
                <Row>
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
                                </>
                            ) : (
                                <>
                                    <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Company</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{data?.name || "-"}</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>ABN: {data?.abn || "-"}</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{data?.phone || "-"}</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>{mainAddress?.address || "-"}</p>
                                </>
                            )
                        }
                    </Col>
                    <Col>
                        <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Main Contact</p>

                        {isEdit ? (<>
                            <Dropdown />
                        </>) : (<>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{`${mainContact?.firstname || "-"} ${mainContact?.lastname || "-"}`}</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{`${mainContact?.position || "-"}`}</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{`${mainContact?.phone || "-"}`}</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{`${mainContact?.email || "-"}`}</p>
                        </>)}

                    </Col>
                    <Col sm={12}>
                        {/* <button onClick={() => setIsEdit(!isEdit)} className='btn p-0' style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>Change contact</button> */}
                    </Col>
                </Row>
            }
        </>
    )
}

export default QuoteToBusiness