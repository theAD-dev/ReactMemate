import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Calendar3, ClockHistory, CloudUpload, FilePdf, FilePdfFill, Trash, X } from 'react-bootstrap-icons';
import { useMutation, useQuery } from "@tanstack/react-query";

import style from './view-job.module.scss';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getJobTemplate, getJobTemplates } from '../../../../APIs/email-template';
import { Dropdown } from 'primereact/dropdown';
import clsx from 'clsx';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { getTeamMobileUser } from '../../../../APIs/team-api';
import { getManagement } from '../../../../APIs/management-api';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Button as PrimeButton } from 'primereact/button';
import { useDropzone } from 'react-dropzone';
import { getJob } from '../../../../APIs/jobs-api';
import { toast } from 'sonner';

const ViewJob = ({ visible, setVisible, jobId }) => {
    let paymentCycleObj = {
        "7": "WEEK",
        "14": "TWO_WEEKS",
        "28": "FOUR_WEEKS",
        "1": "MONTH"
    }
    const jobQuery = useQuery({
        queryKey: ["jobRead", jobId],
        queryFn: () => getJob(jobId),
        enabled: !!jobId,
        retry: 1,
    });
    const job = jobQuery?.data;

    return (
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px' }}>
                        <div className="d-flex align-items-center gap-3">

                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>


                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 68px - 80px)', overflow: 'auto' }}>
                        <div className={clsx('d-flex justify-content-between align-items-center mb-3')}>
                            <h1 className={style.heading}>Job Details</h1>
                            <div className='d-flex align-items-center gap-2'>
                                <div className={clsx(style.newJobTag, 'mb-0 font-14')}>New Job</div>
                                <span className='font-14'>Job ID: {jobId}</span>
                            </div>
                        </div>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Job Reference</label>
                                    <p className={clsx(style.text)}>{job?.short_description || "-"}</p>
                                </div>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Job Description</label>
                                    <p className={clsx(style.text, style.description)}>{job?.long_description || "-"}</p>
                                </div>
                            </Card.Header>
                        </Card>

                        <h1 className={clsx(style.heading, 'mb-3')}>Assigned to</h1>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Header className={clsx(style.background, 'border-0 py-4')}>
                                <Row className={clsx(style.chooseUserBox, 'flex-nowrap', 'w-75')}>
                                    <Col sm={2} className='p-0'>
                                        <div className='d-flex justify-content-center align-items-center border' style={{ width: '62px', height: '62px', borderRadius: '50%', overflow: 'hidden' }}>
                                            {job?.worker?.has_photo ? <img src={job?.worker?.photo} style={{ width: '62px', height: '62px', borderRadius: '50%' }} />
                                                : <span className='font-16'>{job?.worker?.alias}</span>
                                            }
                                        </div>
                                    </Col>
                                    <Col sm={5} className='pe-0 ps-0'>
                                        <label className={clsx(style.customLabel, 'text-nowrap')}>{job?.worker?.full_name || "-"}</label>
                                        <div style={{ background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center' }}>Employee</div>
                                    </Col>
                                    <Col sm={5} className=''>
                                        <div className='d-flex align-items-center gap-2 mb-3'>
                                            <div style={{ width: '16px', height: '16px', background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</div>
                                            <span>{job?.worker?.hourly_rate || "-"} AUD</span>
                                        </div>
                                        <div className='d-flex align-items-center gap-2'>
                                            <div style={{ width: '16px', height: '16px', background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar3 color="#158ECC" size={16} /></div>
                                            <span>{paymentCycleObj[job?.worker?.payment_cycle] || "-"}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Header>
                        </Card>

                        <h1 className={clsx(style.heading, 'mb-3')}>Time / Money</h1>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex gap-3')}>
                                <div className={style.paymentType}>
                                    <label className={clsx(style.customLabel)}>Payment Type</label>
                                    {
                                        job?.type === "2" &&
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="fix"
                                                value="2"
                                                checked
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="fix" className={clsx(style.radioLabel, style.fix)}>Fix</label>
                                        </div>
                                    }
                                    {
                                        job?.type === "3" &&
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="fix"
                                                value="3"
                                                checked
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="hours" className={clsx(style.radioLabel, style.hours)}>Hours</label>
                                        </div>
                                    }
                                    {
                                        job?.type === "4" &&
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="fix"
                                                value="4"
                                                checked
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="timetracker" className={clsx(style.radioLabel, style.timetracker)}>Time Tracker</label>
                                        </div>
                                    }
                                </div>
                                <div className={style.paymentType}>
                                    <label className={clsx(style.customLabel)}>Time</label>
                                    {
                                        job?.time_type === "1" &&
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="shift"
                                                value="1"
                                                checked
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="shift" className={clsx(style.radioLabel, style.shift)}>Shift</label>
                                        </div>
                                    }
                                    {
                                        job?.time_type === "T" &&
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="shift"
                                                value="T"
                                                checked
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="timeframe" className={clsx(style.radioLabel, style.timeFrame)}>Time Frame</label>
                                        </div>
                                    }
                                </div>
                            </Card.Header>
                        </Card>

                        <h1 className={clsx(style.heading, 'mb-3')}>Link to Project</h1>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Project</label>
                                    <p className={clsx(style.text)}>{job?.project?.number || "-"}</p>
                                </div>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Reference</label>
                                    <p className={clsx(style.text, style.description)}>{job?.project?.reference || "-"}</p>
                                </div>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Description</label>
                                    <p className={clsx(style.text, style.description)}>{job?.project?.description || "-"}</p>
                                </div>
                                <Row>
                                    <Col>
                                        <div className='form-group mb-3'>
                                            <label className={clsx(style.customLabel)}>Unit</label>
                                            <p className={clsx(style.text, style.description)}>{paymentCycleObj[job?.worker?.payment_cycle] || "-"}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-group mb-3'>
                                            <label className={clsx(style.customLabel)}>P/H</label>
                                            <p className={clsx(style.text, style.description)}>{job?.worker?.hourly_rate || "-"}$ AUD</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Header>
                        </Card>
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false) }} className='outline-button'>Cancel</Button>
                        <Button type='button' onClick={() => { }} className='solid-button' style={{ minWidth: '75px' }}>Create {false && <ProgressSpinner
                            style={{ width: "20px", height: "20px", color: "#fff" }}
                        />}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
}

export default ViewJob