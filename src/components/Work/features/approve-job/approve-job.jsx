import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { ClockHistory, QuestionCircle, X } from 'react-bootstrap-icons';
import { useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import style from './approve-job.module.scss';
import { getApprovedJob } from '../../../../APIs/jobs-api';
import { getTeamMobileUser } from '../../../../APIs/team-api';
import { formatDate } from '../../Pages/jobs/jobs-table';

const ApproveJob = ({ jobId = null, visible = false, setVisible }) => {
    const [isOpenJobDetailsSection, setIsOpenJobDetailsSection] = useState(true);
    const [isOpenPlannedVsActualSection, setIsOpenPlannedVsActualSection] = useState(true);
    const [isOpenVariationSection, setIsOpenVariationSection] = useState(true);
    const [isOpenJobTrackingSection, setIsOpenJobTrackingSection] = useState(true);
    const [selectedColumn, setSelectedColumn] = useState("planned");
    const [amount, setAmount] = useState(0);
    const [currentClient, setCurrentClient] = useState(null);

    const increment = () => setAmount(prev => prev + 1);
    const decrement = () => setAmount(prev => Math.max(0, prev - 1));

    const jobQuery = useQuery({
        queryKey: ["getApprovedJob", jobId],
        queryFn: () => getApprovedJob(jobId),
        enabled: !!jobId,
        retry: 1,
    });
    const job = jobQuery?.data;
    console.log('job: ', job);

    const mobileUserQuery = useQuery({
        queryKey: ["mobileuser"],
        queryFn: getTeamMobileUser,
    });

    useEffect(() => {
        if (job && mobileUserQuery?.data?.users) {
            let findClient = mobileUserQuery?.data?.users?.find(user => user?.id === job?.worker?.id);
            console.log('findClient: ', findClient, job?.worker?.id, mobileUserQuery?.data?.users);
            setCurrentClient(findClient);
        }
    }, [mobileUserQuery?.data, job]);


    const formatTime = (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatHours = (hours) => {
        const totalMinutes = hours * 60;
        const h = Math.floor(totalMinutes / 60);
        const m = Math.round(totalMinutes % 60);
        return `${h}:${m.toString().padStart(2, '0')}`;
    };

    const calculateActualHours = () => {
        if (job?.start && job?.finish) {
            const start = parseInt(job.start) * 1000;
            const finish = parseInt(job.finish) * 1000;
            const diffMs = finish - start;
            const hours = diffMs / (1000 * 60 * 60);
            return formatHours(hours);
        }
        return "0:00";
    };

    const plannedHours = "1:00";
    const plannedRate = parseFloat(currentClient?.hourly_rate || 0);
    const plannedSubtotal = parseInt(plannedHours.split(':')[0]) * plannedRate;
    const actualHours = job?.spent_time || 0;
    const actualSubtotal = (actualHours * plannedRate).toFixed(2);
    const variation = 0;
    const plannedTotal = (plannedSubtotal + variation).toFixed(2);
    const actualTotal = (parseFloat(actualSubtotal) + variation).toFixed(2);

    const mapEmbedUrl = job?.locations?.length > 0
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(job.locations[0].longitude) - 0.005},${parseFloat(job.locations[0].latitude) - 0.005},${parseFloat(job.locations[0].longitude) + 0.005},${parseFloat(job.locations[0].latitude) + 0.005}&marker=${job.locations[0].latitude},${job.locations[0].longitude}`
        : null;

    const handlePlannedRowClick = () => {
        setSelectedColumn("planned");
    };

    const handleActualRowClick = () => {
        setSelectedColumn("actual");
    };

    return (
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px' }}>
                        <div className="d-flex align-items-center gap-3">
                            <span className={style.heading}>{job?.id}-{job?.number}</span>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 68px - 80px)', overflow: 'auto' }}>

                        <Card className={clsx(style.border, 'mb-4')}>
                            <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenJobDetailsSection(!isOpenJobDetailsSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Job Details</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenJobDetailsSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenJobDetailsSection &&
                                <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                    <h1 className={clsx(style.jobDetailHeading, 'mb-3')}>Link to Project</h1>

                                    <label className={clsx(style.customLabel)}>Short Description</label>
                                    <p className={clsx(style.text)}>{job?.short_description}</p>

                                    <label className={clsx(style.customLabel)}>Long Description</label>
                                    <p className={clsx(style.text)}>{job?.long_description}</p>

                                    <Row>
                                        <Col sm={6}>
                                            <label className={clsx(style.customLabel)}>Client</label>
                                            <p className={clsx(style.text)}>{job?.client?.name}</p>
                                        </Col>
                                        <Col sm={6}>
                                            <label className={clsx(style.customLabel)}>Location</label>
                                            <p className={clsx(style.text)}>{job?.location?.name}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={6}>
                                            <label className={clsx(style.customLabel)}>Start Date</label>
                                            <p className={clsx(style.text)}>{job?.start_date ? formatDate(job?.start_date) : "N/A"}</p>
                                        </Col>
                                        <Col sm={6}>
                                            <label className={clsx(style.customLabel)}>End Date</label>
                                            <p className={clsx(style.text)}>{job?.end_date ? formatDate(job?.end_date) : "N/A"}</p>
                                        </Col>
                                    </Row>
                                </Card.Header>
                            }
                        </Card>

                        <Card className={clsx(style.border, 'mb-4')}>
                            <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenPlannedVsActualSection(!isOpenPlannedVsActualSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Planned vs Actual</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenPlannedVsActualSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenPlannedVsActualSection &&
                                <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between px-0 py-0', style.borderBottom)}>
                                    <table className={clsx('w-100', style.plannedTable)}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <div className={style.fixRateBox}>Fix Rate</div>
                                                        <div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <path d="M10 5C10.3452 5 10.625 5.27982 10.625 5.625V9.375H14.375C14.7202 9.375 15 9.65482 15 10C15 10.3452 14.7202 10.625 14.375 10.625H10.625V14.375C10.625 14.7202 10.3452 15 10 15C9.65482 15 9.375 14.7202 9.375 14.375V10.625H5.625C5.27982 10.625 5 10.3452 5 10C5 9.65482 5.27982 9.375 5.625 9.375H9.375V5.625C9.375 5.27982 9.65482 5 10 5Z" fill="#667085" />
                                                            </svg>
                                                        </div>
                                                        <div className={style.shiftBox}>Shift</div>
                                                    </div>
                                                </th>
                                                <th className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <Checkbox checked={selectedColumn === "planned"} onChange={() => setSelectedColumn(selectedColumn === "planned" ? null : "planned")} />
                                                        <label className={clsx(style.customLabel)}>Planned</label>
                                                    </div>
                                                </th>
                                                <th className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                    <div className='d-flex justify-content-between'>
                                                        <div className='d-flex align-items-center gap-2'>
                                                            <Checkbox checked={selectedColumn === "actual"} onChange={() => setSelectedColumn(selectedColumn === "actual" ? null : "actual")} />
                                                            <label className={clsx(style.customLabel)}>Actual</label>
                                                        </div>
                                                        <div className={style.clockIcon}>
                                                            <ClockHistory color='#475467' size={16} />
                                                        </div>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={style.whiteTr}>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Start</span>
                                                </td>
                                                <td className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                    <span className='font-14'>{job?.start ? formatTime(job.start) : "N/A"} | {job?.start_date ? formatDate(job?.start_date) : "N/A"}</span>
                                                </td>
                                                <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                    <span className='font-14'>{job?.start ? formatTime(job.start) : "N/A"} | {job?.start_date ? formatDate(job?.start_date) : "N/A"}</span>
                                                </td>
                                            </tr>
                                            <tr className={style.whiteTr}>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Finish</span>
                                                </td>
                                                <td className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                    <span className='font-14'>{job?.finish ? formatTime(job.finish) : "N/A"} | {job?.end_date ? formatDate(job?.end_date) : "N/A"}</span>
                                                </td>
                                                <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                    <span className='font-14'>{job?.finish ? formatTime(job.finish) : "N/A"} | {job?.end_date ? formatDate(job?.end_date) : "N/A"}</span>
                                                </td>
                                            </tr>
                                            <tr className={style.whiteTr}>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Hours</span>
                                                </td>
                                                <td className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                    <span className='font-14'>{plannedHours}</span>
                                                </td>
                                                <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                    <span className='font-14'>{calculateActualHours()}</span>
                                                </td>
                                            </tr>
                                            <tr className={style.whiteTr}>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Rate per hour</span>
                                                </td>
                                                <td colSpan={2} className={clsx(selectedColumn === "planned" ? style.active1 : style.active3, 'text-center', style.borderRightNone)}>
                                                    <div className={clsx(style.moneyBox)}>${plannedRate.toFixed(2)}</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Subtotal</span>
                                                </td>
                                                <td className={clsx(selectedColumn === "planned" ? style.active1 : style.nonActive, selectedColumn === "planned" ? style.active2 : '')} onClick={handlePlannedRowClick}>
                                                    <span className='font-14'>${plannedSubtotal.toFixed(2)}</span>
                                                </td>
                                                <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                    <span className='font-14'>${actualSubtotal}</span>
                                                </td>
                                            </tr>
                                            <tr className={style.whiteTr}>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Variation</span>
                                                </td>
                                                <td colSpan={2} className={clsx(selectedColumn === "planned" ? style.active1 : style.active3, 'text-center', selectedColumn !== "planned" ? "" : style.borderRightNone)}>
                                                    <div className={clsx(style.moneyBox)}>${variation.toFixed(2)}</div>
                                                </td>
                                            </tr>
                                            <tr className={clsx(style.lastRow)}>
                                                <td>
                                                    <span className='font-16' style={{ color: '#344054' }}>Total</span>
                                                </td>
                                                <td className={clsx(selectedColumn === "planned" ? style.active1 : style.nonActive, selectedColumn === "planned" ? style.active2 : '')} onClick={handlePlannedRowClick}>
                                                    <Button className={clsx("outline-button px-3 py-1 font-14 mx-auto gap-2", selectedColumn === "planned" ? style.activeOutlineButton : "")}>
                                                        ${plannedTotal}
                                                        {
                                                            selectedColumn === "planned" ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 4.65482 0.279822 4.375 0.625 4.375L7.86612 4.375L5.18306 1.69194C4.93898 1.44786 4.93898 1.05214 5.18306 0.808058C5.42714 0.56398 5.82286 0.56398 6.06694 0.808058L9.81694 4.55806C10.061 4.80213 10.061 5.19786 9.81694 5.44194L6.06694 9.19194C5.82286 9.43602 5.42714 9.43602 5.18306 9.19194C4.93898 8.94786 4.93898 8.55213 5.18306 8.30806L7.86612 5.625H0.625C0.279822 5.625 0 5.34518 0 5Z" fill="white" />
                                                                </svg> :
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 5C0.5 4.65482 0.779822 4.375 1.125 4.375L8.36612 4.375L5.68306 1.69194C5.43898 1.44786 5.43898 1.05214 5.68306 0.808058C5.92714 0.56398 6.32286 0.56398 6.56694 0.808058L10.3169 4.55806C10.561 4.80213 10.561 5.19786 10.3169 5.44194L6.56694 9.19194C6.32286 9.43602 5.92714 9.43602 5.68306 9.19194C5.43898 8.94786 5.43898 8.55213 5.68306 8.30806L8.36612 5.625H1.125C0.779822 5.625 0.5 5.34518 0.5 5Z" fill="#344054" />
                                                                </svg>
                                                        }
                                                    </Button>
                                                </td>
                                                <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                    <Button className={clsx("outline-button px-3 py-1 font-14 mx-auto gap-2", selectedColumn === "actual" ? style.activeOutlineButton : "")}>
                                                        ${actualTotal}
                                                        {
                                                            selectedColumn === "actual" ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 4.65482 0.279822 4.375 0.625 4.375L7.86612 4.375L5.18306 1.69194C4.93898 1.44786 4.93898 1.05214 5.18306 0.808058C5.42714 0.56398 5.82286 0.56398 6.06694 0.808058L9.81694 4.55806C10.061 4.80213 10.061 5.19786 9.81694 5.44194L6.06694 9.19194C5.82286 9.43602 5.42714 9.43602 5.18306 9.19194C4.93898 8.94786 4.93898 8.55213 5.18306 8.30806L7.86612 5.625H0.625C0.279822 5.625 0 5.34518 0 5Z" fill="white" />
                                                                </svg> :
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 5C0.5 4.65482 0.779822 4.375 1.125 4.375L8.36612 4.375L5.68306 1.69194C5.43898 1.44786 5.43898 1.05214 5.68306 0.808058C5.92714 0.56398 6.32286 0.56398 6.56694 0.808058L10.3169 4.55806C10.561 4.80213 10.561 5.19786 10.3169 5.44194L6.56694 9.19194C6.32286 9.43602 5.92714 9.43602 5.68306 9.19194C5.43898 8.94786 5.43898 8.55213 5.68306 8.30806L8.36612 5.625H1.125C0.779822 5.625 0.5 5.34518 0.5 5Z" fill="#344054" />
                                                                </svg>
                                                        }
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card.Header>
                            }
                        </Card>

                        <Card className={clsx(style.border, 'mb-4')}>
                            <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenVariationSection(!isOpenVariationSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Variation</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenVariationSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenVariationSection &&
                                <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                    <div className='form-group mb-3 w-100'>
                                        <label className={clsx(style.customLabel)}>Amount</label>
                                        <div className={style.amountRow}>
                                            <div className={style.amountInputBox}>
                                                <span className={style.dollar}>$</span>
                                                <InputNumber
                                                    className={clsx(style.inputText)}
                                                    value={amount}
                                                    onChange={(e) => setAmount(parseFloat(e.value || 0))}
                                                />
                                                <span className={style.helpIcon}>
                                                    <QuestionCircle size={16} color='#98A2B3' />
                                                </span>
                                            </div>
                                            <div className={style.buttonGroup}>
                                                <button className='info-button p-0' style={{ width: '44px', height: '44px' }} onClick={increment}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8 0.5C8.34518 0.5 8.625 0.779822 8.625 1.125V7.375H14.875C15.2202 7.375 15.5 7.65482 15.5 8C15.5 8.34518 15.2202 8.625 14.875 8.625H8.625V14.875C8.625 15.2202 8.34518 15.5 8 15.5C7.65482 15.5 7.375 15.2202 7.375 14.875V8.625H1.125C0.779822 8.625 0.5 8.34518 0.5 8C0.5 7.65482 0.779822 7.375 1.125 7.375H7.375V1.125C7.375 0.779822 7.65482 0.5 8 0.5Z" fill="#158ECC" />
                                                    </svg>
                                                </button>
                                                <button className='outline-button p-0' style={{ width: '44px', height: '44px' }} onClick={decrement}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2" fill="none">
                                                        <path d="M0 1C0 0.447715 0.447715 0 1 0H9C9.55229 0 10 0.447715 10 1C10 1.55228 9.55229 2 9 2H1C0.447715 2 0 1.55228 0 1Z" fill="#B42318" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='form-group mb-3 w-100'>
                                        <label className={clsx(style.customLabel)}>Reason</label>
                                        <InputTextarea
                                            className={clsx('w-100', style.InputTextarea)}
                                            rows={4}
                                            placeholder="Enter the detailed quote for the client contract here. Include all relevant information such as project scope, deliverables, timelines, costs, payment terms, and any special conditions. Ensure the quote is clear, comprehensive, and aligns with the client's requirements and expectations."
                                        />
                                    </div>
                                </Card.Header>
                            }
                        </Card>

                        <Card className={clsx(style.border, 'mb-4')}>
                            <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenJobTrackingSection(!isOpenJobTrackingSection)}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Job Tracking</h1>
                                    <button className='text-button p-0'>
                                        {
                                            isOpenJobTrackingSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                            </svg>
                                        }
                                    </button>
                                </div>
                            </Card.Body>
                            {
                                isOpenJobTrackingSection &&
                                <Card.Header className={clsx(style.background, 'border-0 p-0', style.borderBottom)}>
                                    {mapEmbedUrl ? (
                                        <>
                                            <iframe
                                                width="100%"
                                                height="300"
                                                frameBorder="0"
                                                style={{ border: 0 }}
                                                src={mapEmbedUrl}
                                                allowFullScreen
                                            ></iframe>
                                        </>
                                    ) : (
                                        <p className={clsx(style.text)}>Location map unavailable: No coordinates provided.</p>
                                    )}
                                </Card.Header>
                            }
                        </Card>

                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false); }} className='danger-outline-button'>Decline</Button>
                        <Button type='button' onClick={() => { }} className='info-button' style={{ minWidth: '75px' }}>Approve</Button>
                        <Button type='button' onClick={() => { }} className='solid-button' style={{ minWidth: '75px' }}>Approve & See Next  {false && <ProgressSpinner
                            style={{ width: "20px", height: "20px", color: "#fff" }}
                        />}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};

export default ApproveJob;