import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Calendar3, X } from 'react-bootstrap-icons';
import { useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import { Chip } from 'primereact/chip';
import { Image } from 'primereact/image';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import ViewAttachements from './view-attachements';
import style from './view-job.module.scss';
import { getJob } from '../../../../APIs/jobs-api';
import { formatDate } from '../../Pages/jobs/jobs-table';
import CreateJob from '../create-job/create-job';



const statusBody = (status) => {
    switch (status) {
        case '1':
            return <Chip className={`status ${style.open} font-14`} label={"Open"} />;
        case '2':
            return <Chip className={`status ${style.ASSIGN} font-14`} label={"Assign"} />;
        case '3':
            return <Chip className={`status ${style.NotConfirmed} font-14`} label={"Not Confirmed"} />;
        case '4':
            return <Chip className={`status ${style.CONFIRMED} font-14`} label={"Confirmed"} />;
        case '5':
            return <Chip className={`status ${style.COMPLETED} font-14`} label={"Completed"} />;
        case '6':
            return <Chip className={`status ${style.MANAGER_DECLINED} font-14`} label={"Canceled"} />;
        case 'a':
            return <Chip className={`status ${style.Accepted} font-14`} label={"Accepted"} />;
        case 'd':
            return <Chip className={`status ${style.DECLINED} font-14`} label={"Declined"} />;
        default:
            return <Chip className={`status ${style.defaultStatus} font-14`} label={status} />;
    }
};

const ViewJob = ({ visible, setVisible, jobId, setRefetch }) => {
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);

    let paymentCycleObj = {
        "7": "WEEK",
        "14": "TWO_WEEKS",
        "28": "FOUR_WEEKS",
        "1": "MONTH"
    };

    const jobQuery = useQuery({
        queryKey: ["jobRead", jobId],
        queryFn: () => getJob(jobId),
        enabled: !!jobId,
        retry: 1,
    });

    const job = jobQuery?.data;

    const handleEditClick = () => {
        setEditMode(true);
    };

    return (
        <>
            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
                content={({ closeIconRef, hide }) => (
                    <div className='create-sidebar d-flex flex-column'>
                        <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className={style.viewBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9.75 1.5C8.5076 1.5 7.5 2.50675 7.5 3.74963V4.5H2.25C1.00736 4.5 0 5.50736 0 6.75V18.75C0 19.9926 1.00736 21 2.25 21H21.75C22.9926 21 24 19.9926 24 18.75V6.75C24 5.50736 22.9926 4.5 21.75 4.5H16.5V3.74963C16.5 2.50675 15.4924 1.5 14.25 1.5H9.75ZM9.75 3H14.25C14.6645 3 15 3.33695 15 3.75092V4.5H9V3.74963C9 3.33566 9.33555 3 9.75 3ZM12.5797 13.3716L22.5 10.7262V18.75C22.5 19.1642 22.1642 19.5 21.75 19.5H2.25C1.83579 19.5 1.5 19.1642 1.5 18.75V10.7262L11.4203 13.3716C11.8001 13.4729 12.1999 13.4729 12.5797 13.3716ZM2.25 6H21.75C22.1642 6 22.5 6.33579 22.5 6.75V9.17379L12.1932 11.9223C12.0666 11.956 11.9334 11.956 11.8068 11.9223L1.5 9.17379V6.75C1.5 6.33579 1.83579 6 2.25 6Z" fill="#079455" />
                                    </svg>
                                </div>
                                <span className={style.viewHeading}>Job Details</span>
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
                                    {statusBody(job?.status)}
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
                                <Card.Header className={clsx(style.background, 'border-0 d-flex flex-column gap-3')}>
                                    <div className='d-flex gap-3'>
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
                                        <div className=''>
                                            <label className={clsx(style.customLabel)}>Payment</label>
                                            <div className={style.paymentBox}>
                                                <div className={style.dollarBox}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M4 10.7813C4.14782 12.4484 5.51294 13.6306 7.59107 13.7837V15H8.63448V13.7837C10.9039 13.6051 12.3125 12.3463 12.3125 10.4836C12.3125 8.89307 11.3647 7.97448 9.35617 7.45565L8.63448 7.26853V3.46659C9.75615 3.57716 10.5126 4.18104 10.7039 5.08262H12.1734C12.0082 3.4836 10.6343 2.33536 8.63448 2.20778V1H7.59107V2.23329C5.65207 2.46294 4.32172 3.70474 4.32172 5.38882C4.32172 6.84326 5.28687 7.87242 6.98241 8.3062L7.59107 8.4678V12.4994C6.44332 12.3293 5.65207 11.6999 5.46077 10.7813H4ZM7.39108 6.94532C6.34767 6.68165 5.79119 6.12029 5.79119 5.32928C5.79119 4.38518 6.49549 3.68773 7.59107 3.50061V6.99635L7.39108 6.94532ZM8.98228 8.81652C10.2692 9.13973 10.8343 9.67558 10.8343 10.5857C10.8343 11.6829 10.0083 12.4143 8.63448 12.5249V8.73147L8.98228 8.81652Z" fill="#158ECC" />
                                                    </svg>
                                                </div>
                                                {job?.cost || 0.00} AUD
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex gap-3'>
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
                                        <div className=''>
                                            <label className={clsx(style.customLabel)}>Payment</label>
                                            <div className={style.paymentBox}>
                                                <div className={style.dollarBox}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8.51496 1.01896C8.34401 1.00635 8.17225 1 8 1V0C8.19685 0 8.39314 0.00726199 8.58852 0.0216722L8.51496 1.01896ZM10.5193 1.46905C10.1985 1.34533 9.86912 1.2454 9.53371 1.17008L9.75282 0.194382C10.1361 0.280463 10.5126 0.394665 10.8792 0.536055L10.5193 1.46905ZM11.889 2.17971C11.7458 2.08402 11.5994 1.99388 11.4503 1.90939L11.9432 1.0393C12.1136 1.13586 12.2809 1.23888 12.4446 1.34824C12.6082 1.4576 12.7674 1.5727 12.9219 1.69322L12.3066 2.48158C12.1715 2.37612 12.0322 2.27541 11.889 2.17971ZM13.7231 3.96934C13.5252 3.68829 13.3068 3.42218 13.0697 3.17321L13.794 2.48368C14.0649 2.76821 14.3145 3.07233 14.5407 3.39353L13.7231 3.96934ZM14.4672 5.32122C14.4012 5.16208 14.3296 5.00583 14.2526 4.85271L15.1458 4.40311C15.2339 4.5781 15.3157 4.75667 15.391 4.93853C15.4664 5.12039 15.5348 5.30453 15.5962 5.49054L14.6467 5.80423C14.5929 5.64147 14.5331 5.48035 14.4672 5.32122ZM14.9979 7.82822C14.9895 7.48455 14.9557 7.14197 14.8969 6.80326L15.8822 6.63231C15.9494 7.01939 15.988 7.41092 15.9976 7.80367L14.9979 7.82822ZM14.8655 9.36563C14.8991 9.1967 14.9264 9.02699 14.9474 8.85687L15.9398 8.97929C15.9159 9.17372 15.8847 9.36766 15.8463 9.56072C15.8079 9.75378 15.7625 9.94489 15.7102 10.1337L14.7464 9.867C14.7922 9.70179 14.8319 9.53457 14.8655 9.36563ZM13.914 11.745C14.0979 11.4546 14.2602 11.151 14.3995 10.8367L15.3137 11.2419C15.1545 11.6011 14.969 11.9481 14.7588 12.28L13.914 11.745ZM12.9497 12.9497C13.0715 12.828 13.1885 12.702 13.3005 12.5722L14.0577 13.2254C13.9297 13.3737 13.796 13.5177 13.6569 13.6569L12.9497 12.9497Z" fill="#158ECC" />
                                                        <path d="M8 1C6.84885 1 5.71545 1.2839 4.70022 1.82655C3.68499 2.3692 2.81926 3.15386 2.17971 4.11101C1.54017 5.06816 1.14654 6.16827 1.03371 7.31388C0.920876 8.45949 1.09232 9.61525 1.53285 10.6788C1.97337 11.7423 2.66939 12.6808 3.55925 13.4111C4.44911 14.1414 5.50533 14.6409 6.63437 14.8655C7.76341 15.0901 8.93041 15.0327 10.032 14.6986C11.1336 14.3644 12.1358 13.7637 12.9497 12.9497L13.6569 13.6569C12.7266 14.5871 11.5812 15.2736 10.3223 15.6555C9.06332 16.0374 7.72961 16.1029 6.43928 15.8463C5.14895 15.5896 3.94183 15.0187 2.92486 14.1841C1.90788 13.3495 1.11243 12.2769 0.608966 11.0615C0.105504 9.846 -0.0904279 8.52514 0.0385242 7.21586C0.167476 5.90659 0.617333 4.64933 1.34825 3.55544C2.07916 2.46155 3.06857 1.5648 4.22883 0.94463C5.38909 0.324457 6.68439 0 8 0V1Z" fill="#158ECC" />
                                                        <path d="M7.5 3C7.77614 3 8 3.22386 8 3.5V8.70984L11.2481 10.5659C11.4878 10.7029 11.5711 11.0083 11.4341 11.2481C11.2971 11.4878 10.9917 11.5711 10.7519 11.4341L7.25193 9.43412C7.09615 9.3451 7 9.17943 7 9V3.5C7 3.22386 7.22386 3 7.5 3Z" fill="#158ECC" />
                                                    </svg>
                                                </div>
                                                {job?.time_type === "1" && formatDate(job?.start_date)}
                                                {job?.time_type === "T" && <>{formatDate(job?.start_date)} - {formatDate(job?.end_date)} </>}
                                                . {job?.duration}
                                            </div>
                                        </div>
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
                                </Card.Header>
                            </Card>

                            <h1 className={clsx(style.heading, 'mb-3')}>Project Photos</h1>
                            <Card className={clsx(style.border, 'mb-3')}>
                                <Card.Header className={clsx(style.background, 'border-0')}>
                                    <label className={clsx(style.customLabel)}>Before</label>
                                    <div className='d-flex gap-2' style={{ overflowX: 'auto' }}>
                                        <Image src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg" alt="Image" className={style.jobGalleri} width="124" preview />
                                        <Image src="https://primefaces.org/cdn/primereact/images/galleria/galleria11.jpg" alt="Image" className={style.jobGalleri} width="124" preview />
                                        <Image src="https://primefaces.org/cdn/primereact/images/galleria/galleria12.jpg" alt="Image" className={style.jobGalleri} width="124" preview />
                                        <Image src="https://primefaces.org/cdn/primereact/images/galleria/galleria13.jpg" alt="Image" className={style.jobGalleri} width="124" preview />
                                        <Image src="https://primefaces.org/cdn/primereact/images/galleria/galleria14.jpg" alt="Image" className={style.jobGalleri} width="124" preview />
                                        <Image src="https://primefaces.org/cdn/primereact/images/galleria/galleria15.jpg" alt="Image" className={style.jobGalleri} width="124" preview />
                                    </div>
                                </Card.Header>
                            </Card>

                            <h1 className={clsx(style.heading, 'mb-3')}>Documents</h1>
                            <Card className={clsx(style.border, 'mb-3')}>
                                <Card.Header className={clsx(style.background, 'border-0')}>
                                    <Button className='outline-button d-flex gap-2' onClick={() => setShow(true)} style={{ borderRadius: '40px' }}>
                                        Viw All Documents
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M1.25 4.375C1.25 3.33947 2.08947 2.5 3.125 2.5H6.57992C7.77713 2.5 8.78091 3.19995 9.46927 3.97997C9.98156 4.56048 10.5984 5 11.25 5H16.8759C17.912 5 18.75 5.84003 18.75 6.875V15.625C18.75 16.6605 17.9105 17.5 16.875 17.5H3.125C2.08947 17.5 1.25 16.6605 1.25 15.625V4.375ZM3.125 3.75C2.77982 3.75 2.5 4.02982 2.5 4.375V7.5H17.5V6.875C17.5 6.52926 17.2205 6.25 16.8759 6.25H11.25C10.0451 6.25 9.11184 5.46409 8.53203 4.80706C7.96726 4.16709 7.27657 3.75 6.57992 3.75H3.125ZM17.5 8.75H2.5V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V8.75Z" fill="#344054" />
                                        </svg>
                                    </Button>
                                </Card.Header>
                            </Card>

                            <h1 className={clsx(style.heading, 'mb-3')}>History</h1>
                            <Card className={clsx(style.border, 'mb-3')}>
                                <Card.Header className={clsx(style.background, 'border-0')}>
                                    <table className='w-100 table table-bordered rounded'>
                                        <thead>
                                            <tr>
                                                <td>Date</td>
                                                <td>User</td>
                                                <td>Status</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </Card.Header>
                            </Card>
                        </div>

                        <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                            <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false); }} className='outline-button'>Cancel</Button>
                            <Button type='button' onClick={handleEditClick} className='solid-button' style={{ minWidth: '75px' }}>Edit {false && <ProgressSpinner
                                style={{ width: "20px", height: "20px", color: "#fff" }}
                            />}</Button>
                        </div>
                    </div>
                )}
            ></Sidebar>
            <ViewAttachements attachments={job?.attachments || []} show={show} setShow={setShow} />

            {/* Edit Job Modal */}
            {editMode && (
                <CreateJob
                    visible={editMode}
                    setVisible={setEditMode}
                    setRefetch={setRefetch}
                    isEditMode={true}
                    jobData={job}
                    jobId={jobId}
                />
            )}
        </>
    );
};

export default ViewJob;