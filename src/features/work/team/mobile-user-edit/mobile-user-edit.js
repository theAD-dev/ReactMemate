import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Rating } from 'primereact/rating';
import style from './mobile-user-edit.module.scss';
import { dateFormat } from '../../../../components/Business/shared/utils/helper';
import { formatAUD } from '../../../../shared/lib/format-aud';

const MobileUserEdit = ({ user }) => {
    const [message, setMessage] = useState("");
    const [paymentCycle, setPaymentCycle] = useState("");
    const [gst, setGst] = useState(false);
    const [hourlyRate, setHourlyRate] = useState(null);

    return (
        <>
            {/* User Details */}
            <div className={clsx(style.box)}>
                <Row>
                    <Col sm={12} className='mb-3'>
                        <label className={clsx(style.label)}>Rating</label>
                        <Rating value={3} className='yellow-rating' style={{ position: 'static' }} readOnly cancel={false} />
                    </Col>
                    <Col sm={6} className='mb-3'>
                        <label className={clsx(style.label)}>First Name</label>
                        <p className={clsx(style.text)}>{user?.firstName || 'John'}</p>
                    </Col>
                    <Col sm={6} className='mb-3'>
                        <label className={clsx(style.label)}>Last Name</label>
                        <p className={clsx(style.text)}>{user?.lastName || 'Doe'}</p>
                    </Col>
                    <Col sm={6} className='mb-0'>
                        <label className={clsx(style.label)}>Date of Birthday</label>
                        <p className={clsx(style.text)}>{dateFormat(user?.dob || '1995-12-17')}</p>
                    </Col>
                    <Col sm={6} className='mb-0'>
                        <label className={clsx(style.label)}>ABN/TFN</label>
                        <p className={clsx(style.text)}>{user?.abn || '32 635 443 221'}</p>
                    </Col>
                </Row>
            </div>

            {/* Contact Person */}
            <h5 className={clsx(style.boxLabel, 'mb-2')}>Contact Person</h5>
            <div className={clsx(style.box)}>
                <Row>
                    <Col sm={6} className='mb-0'>
                        <label className={clsx(style.label)}>Email</label>
                        <p className={clsx(style.text)}>{user?.email || 'client@email.com'}</p>
                    </Col>
                    <Col sm={6} className='mb-0'>
                        <label className={clsx(style.label)}>Phone</label>
                        <p className={clsx(style.text)}>{user?.phone || '07 3803 4998'}</p>
                    </Col>
                </Row>
            </div>

            {/* Address */}
            <h5 className={clsx(style.boxLabel, 'mb-2')}>Address</h5>
            <div className={clsx(style.box)}>
                <Row>
                    <Col sm={6} className='mb-3'>
                        <label className={clsx(style.label)}>Country</label>
                        <p className={clsx(style.text)}>{user?.country || 'Australia'}</p>
                    </Col>
                    <Col sm={6}></Col>
                    <Col sm={6} className='mb-3'>
                        <label className={clsx(style.label)}>State</label>
                        <p className={clsx(style.text)}>{user?.state || 'New South Wales'}</p>
                    </Col>
                    <Col sm={6} className='mb-3'>
                        <label className={clsx(style.label)}>City/Suburb</label>
                        <p className={clsx(style.text)}>{user?.city || 'Winburndale'}</p>
                    </Col>
                    <Col sm={6}>
                        <label className={clsx(style.label)}>Street Address</label>
                        <p className={clsx(style.text)}>{user?.street || 'Sydney Street of 914'}</p>
                    </Col>
                    <Col sm={6}>
                        <label className={clsx(style.label)}>Postcode</label>
                        <p className={clsx(style.text)}>{user?.postcode || '2795'}</p>
                    </Col>
                </Row>
            </div>

            {/* Payment */}
            <h5 className={clsx(style.boxLabel, 'mb-2')}>Payment</h5>
            <div className={clsx(style.box, 'border')}>
                <Row>
                    <Col sm={5}>
                        <label className={clsx(style.label)}>P/H</label>
                        <IconField className='w-100 border rounded' iconPosition="right">
                            <InputIcon><span style={{ position: 'relative', top: '-4px', left: '10px' }}>$</span></InputIcon>
                            <InputText value={hourlyRate} keyfilter={"num"} onBlur={(e) => setHourlyRate(e?.target?.value || 0)} style={{ paddingLeft: '28px', paddingRight: '40px', height: '46px' }} className={clsx(style.inputText, "outline-none", 'w-100')} placeholder='20' />
                            <InputIcon>
                                <QuestionCircle style={{ position: 'relative', top: '-4px', right: '5px' }} color='#98A2B3' size={16} />
                            </InputIcon>
                        </IconField>
                    </Col>
                    <Col sm={5}>
                        <label className={clsx(style.label)}>Payment cycle</label>
                        <Dropdown
                            options={[
                                { value: "7", label: "WEEK" },
                                { value: "14", label: "TWO_WEEKS", disabled: true },
                                { value: "28", label: "FOUR_WEEKS", disabled: true },
                                { value: "1", label: "MONTH", disabled: true },
                            ]}
                            className={clsx(style.dropdownSelect, 'dropdown-height-fixed', "outline-none")}
                            placeholder="Select payment cycle"
                            value={paymentCycle}
                            style={{ height: '46px', width: '180px' }}
                            onChange={(e) => setPaymentCycle(e.value)}
                        />
                    </Col>
                    <Col sm={2} className='d-flex align-items-center pt-4 gap-2'>
                        <Checkbox onChange={e => setGst(e.checked)} checked={gst} />
                        GST
                    </Col>
                </Row>
            </div>

            {/* Emergency Contact */}
            <h5 className={clsx(style.boxLabel, 'mb-2')}>Emergency Contact</h5>
            <div className={clsx(style.box)}>
                <Row>
                    <Col sm={6}>
                        <label className={clsx(style.label)}>Full Name</label>
                        <p className={clsx(style.text)}>{user?.emergencyContactName || 'Paul Stein'}</p>
                    </Col>
                    <Col sm={6}>
                        <label className={clsx(style.label)}>Phone</label>
                        <p className={clsx(style.text)}>{user?.emergencyPhone || '1300882582'}</p>
                    </Col>
                </Row>
            </div>

            {/* Manager Notes */}
            <h5 className={clsx(style.boxLabel, 'mb-2')}>Manager notes:</h5>
            <div className={clsx(style.box)}>
                <InputTextarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} cols={30} className={clsx(style.inputText, 'w-100')} style={{ resize: 'none' }} placeholder='Enter a note...' />
            </div>
        </>
    );
};

export default MobileUserEdit;