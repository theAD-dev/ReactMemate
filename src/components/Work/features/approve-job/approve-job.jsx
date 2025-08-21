import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Briefcase, Calendar3, ClockHistory, EmojiFrown, EmojiFrownFill, EmojiNeutral, EmojiNeutralFill, EmojiSmile, EmojiSmileFill, QuestionCircle, X } from 'react-bootstrap-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import L from 'leaflet';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Rating } from 'primereact/rating';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import style from './approve-job.module.scss';
import { createApproval, getApprovedJob, declineJob } from '../../../../APIs/jobs-api';
import { formatAUD } from '../../../../shared/lib/format-aud';
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';
import { formatDate } from '../../Pages/jobs/jobs-table';
import 'leaflet/dist/leaflet.css';
import ViewAttachements from '../view-job/view-attachements';

// Fix default icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ApproveJob = ({ jobId = null, nextJobId = null, handleNextJob, visible = false, setVisible, refetch, refetchApprovedTotal }) => {
    const [isOpenPlannedVsActualSection, setIsOpenPlannedVsActualSection] = useState(true);
    const [isOpenVariationSection, setIsOpenVariationSection] = useState(false);
    const [isOpenHistorySection, setIsOpenHistorySection] = useState(false);
    const [isOpenProjectPhotoSection, setIsOpenProjectPhotoSection] = useState(false);
    const [isOpenDocumentsSection, setIsOpenDocumentsSection] = useState(false);
    const [isOpenJobTrackingSection, setIsOpenJobTrackingSection] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState("planned");
    const [amount, setAmount] = useState(0);
    const [isBonus, setIsBonus] = useState(true);
    const [reason, setReason] = useState("");
    const [show, setShow] = useState(false);

    const jobQuery = useQuery({
        queryKey: ["getApprovedJob", jobId],
        queryFn: () => getApprovedJob(jobId),
        enabled: !!jobId,
        retry: 1,
    });
    const job = jobQuery?.data;

    const formatTime = (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatHours = (totalHours) => {
        const totalSeconds = Math.floor(totalHours * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const calculateHMSFromHours = (hrs) => {
        if (!hrs) return "00:00:00";

        const totalSeconds = Math.floor(hrs * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const calculateHMSFromSeconds = (totalSeconds) => {
        if (!totalSeconds) return "00:00:00";

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const plannedRate = parseFloat(job?.worker?.hourly_rate || 0).toFixed(2);
    const plannedSubtotal = job?.type_display === "Fix" ? parseFloat(job?.cost || 0) : parseFloat(job?.worker?.hourly_rate || 0) * parseFloat(job?.duration || 0);
    const actualSubtotal = parseFloat(job?.real_total || 0);
    const variation = parseFloat(amount || 0);
    const addOnPrice = isBonus ? variation : -variation;

    const plannedTotal = (plannedSubtotal + addOnPrice).toFixed(2);
    const actualTotal = (actualSubtotal + addOnPrice).toFixed(2);

    const handlePlannedRowClick = () => {
        setSelectedColumn("planned");
    };

    const handleActualRowClick = () => {
        setSelectedColumn("actual");
    };

    const resetAndClose = () => {
        setIsOpenPlannedVsActualSection(true);
        setIsOpenVariationSection(true);
        setIsOpenJobTrackingSection(true);
        setSelectedColumn("planned");
        setAmount(0);
        setIsBonus(true);
        setReason("");
        setVisible(false);
        setIsOpenVariationSection(false);
        setIsOpenHistorySection(false);
        setIsOpenProjectPhotoSection(false);
        setIsOpenDocumentsSection(false);
        setIsOpenJobTrackingSection(false);
    };

    const jobTypeBody = (rowData) => {
        if (rowData?.type_display === "Fix" && rowData?.time_type_display === "Shift") {
            return <div className={style.type}>
                <div className={style.shift}>Shift</div>
                <div className={style.fix}>Fix</div>
            </div>;
        }

        if (rowData?.type_display === "Fix" && rowData?.time_type_display === "Time frame") {
            return <div className={style.type}>
                <div className={style.timeFrame}>Time Frame</div>
                <div className={style.fix}>Fix</div>
            </div>;
        }

        if (rowData?.type_display === "Hours" && rowData?.time_type_display === "Shift") {
            return <div className={style.type}>
                <div className={style.shift}>Shift</div>
                <div className={style.hours}>Hours</div>
            </div>;
        }

        if (rowData?.type_display === "Hours" && rowData?.time_type_display === "Time frame") {
            return <div className={style.type}>
                <div className={style.timeFrame}>Time Frame</div>
                <div className={style.hours}>Hours</div>
            </div>;
        }

        if (rowData?.type_display === "Time Tracker" && rowData?.time_type_display === "Time frame") {
            return <div className={style.type}>
                <div className={style.timeTracker}>Time Tracker</div>
                <div className={style.timeFrame2}>Time Frame</div>
            </div>;
        }
        return "";
    };

    const jobDeclineMutation = useMutation({
        mutationFn: (jobId) => declineJob(jobId),
        onSuccess: () => {
            resetAndClose();
            refetch();
            toast.success(`Job declined successfully`);
        },
        onError: (error) => {
            console.error('Error declining job:', error);
            toast.error(`Failed to decline job. Please try again.`);
        }
    });

    const handleDeclineJob = () => {
        if (!jobId) return toast.error("No job id found.");
        jobDeclineMutation.mutate(jobId);
    };

    return (
        <>
            <Sidebar visible={visible} position="right" onHide={resetAndClose} modal={false} dismissable={false} style={{ width: '702px' }}
                content={({ closeIconRef, hide }) => (
                    <div className='create-sidebar d-flex flex-column'>
                        <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className={style.viewBox}>
                                    <Briefcase size={24} color='#079455' />
                                </div>
                                <span className={style.heading}>{job?.number}</span>
                            </div>
                            <span>
                                <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                    <X size={24} color='#667085' />
                                </Button>
                            </span>
                        </div>

                        <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 68px - 80px)', overflow: 'auto' }}>
                            <h1 className={clsx(style.jobDetailHeading, 'mb-3')}>Job Details</h1>

                            <Card className={clsx(style.border, 'mb-4')}>
                                <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                    <label className={clsx(style.customLabel)}>Job Reference</label>
                                    <p className={clsx(style.text)}>{job?.short_description}</p>

                                    <label className={clsx(style.customLabel)}>Description</label>
                                    <p className={clsx(style.text)}>{job?.long_description}</p>
                                </Card.Header>
                            </Card>

                            <Card className={clsx(style.border, 'mb-4')}>
                                <Card.Header className={clsx(style.background, 'border-0 px-4 py-3', style.borderBottom)}>
                                    <Row className={clsx(style.chooseUserBox, 'flex-nowrap')}>
                                        <Col sm={2} className='p-0'>
                                            <div className='d-flex justify-content-center align-items-center' style={{ width: '62px', height: '62px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                                                <FallbackImage photo={job?.worker?.photo} has_photo={job?.worker?.has_photo} is_business={false} size={40} />
                                            </div>
                                        </Col>
                                        <Col sm={5} className='pe-0 ps-0'>
                                            <p className={clsx('text-nowrap font-16 mb-2')} style={{ fontWeight: 600 }}>{job?.worker?.first_name} {job?.worker?.last_name}</p>
                                            <div style={{ background: '#EBF8FF', border: '1px solid #A3E0FF', borderRadius: '23px', textAlign: 'center', width: 'fit-content', padding: '4px 16px' }}>Employee</div>
                                        </Col>
                                        <Col sm={5} className=''>
                                            <div className='d-flex align-items-center gap-2 mb-3'>
                                                <div style={{ width: '28px', height: '28px', background: '#EBF8FF', borderRadius: '23px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</div>
                                                <span>{job?.worker?.hourly_rate || "-"} AUD</span>
                                            </div>
                                            <div className='d-flex align-items-center gap-2'>
                                                <div style={{ width: '28px', height: '28px', background: '#EBF8FF', borderRadius: '23px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar3 color="#158ECC" size={16} /></div>
                                                <span>{job?.worker?.payment_cycle || "Weekly"}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>
                            </Card>

                            <Card className={clsx(style.border, 'mb-4')}>
                                <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenPlannedVsActualSection(!isOpenPlannedVsActualSection)}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 600, fontSize: '18px' }}>Planned vs Actual</h1>
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
                                        <table className={clsx('w-100', style.plannedTable, { [style.plannedActive]: selectedColumn === "planned" })}>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div className='d-flex text-nowrap'>
                                                            {jobTypeBody(job)}
                                                        </div>
                                                    </th>
                                                    <th className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                        <div className='d-flex align-items-center gap-2'>
                                                            <Checkbox style={{ display: 'none' }} checked={selectedColumn === "planned"} onChange={() => setSelectedColumn(selectedColumn === "planned" ? null : "planned")} />
                                                            <label className={clsx(style.customLabel)} style={{ color: '#0A4766', fontWeight: 600 }}>Planned</label>
                                                        </div>
                                                    </th>
                                                    <th className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                        <div className='d-flex justify-content-between'>
                                                            <div className='d-flex align-items-center gap-2'>
                                                                <Checkbox style={{ display: 'none' }} checked={selectedColumn === "actual"} onChange={() => setSelectedColumn(selectedColumn === "actual" ? null : "actual")} />
                                                                <label className={clsx(style.customLabel)} style={{ color: '#0A4766', fontWeight: 600 }}>Actual</label>
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
                                                        <span className='font-14'>{job?.start_date ? formatTime(job.start_date) : "N/A"} | {job?.start_date ? formatDate(job?.start_date) : "N/A"}</span>
                                                    </td>
                                                    <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                        <span className='font-14'>{job?.start ? formatTime(job?.start) : "N/A"} | {job?.start ? formatDate(job?.start) : "N/A"}</span>
                                                    </td>
                                                </tr>
                                                <tr className={style.whiteTr}>
                                                    <td>
                                                        <span className='font-16' style={{ color: '#344054' }}>Finish</span>
                                                    </td>
                                                    <td className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                        <span className='font-14'>{job?.end_date ? formatTime(job?.end_date) : "N/A"} | {job?.end_date ? formatDate(job?.end_date) : "N/A"}</span>
                                                    </td>
                                                    <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                        <span className='font-14'>{job?.finish ? formatTime(job?.finish) : "N/A"} | {job?.finish ? formatDate(job?.finish) : "N/A"}</span>
                                                    </td>
                                                </tr>
                                                <tr className={style.whiteTr}>
                                                    <td>
                                                        <span className='font-16' style={{ color: '#344054' }}>Hours</span>
                                                    </td>
                                                    <td className={selectedColumn === "planned" ? style.active1 : style.nonActive} onClick={handlePlannedRowClick}>
                                                        <span className='font-14'>{job?.type_display === "Fix" ? calculateHMSFromHours(parseFloat(job?.cost / job?.worker.hourly_rate).toFixed(2) || 0) : calculateHMSFromHours(job?.duration || 0)}</span>
                                                    </td>
                                                    <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                        <span className='font-14'>{calculateHMSFromSeconds(job?.spent_time || 0)}</span>
                                                    </td>
                                                </tr>
                                                <tr className={style.whiteTr}>
                                                    <td>
                                                        <span className='font-16 text-nowrap' style={{ color: '#344054' }}>Rate per hour</span>
                                                    </td>
                                                    <td style={{ position: 'relative' }} colSpan={2} className={clsx(selectedColumn === "planned" ? style.active1 : style.active3, 'text-center', selectedColumn !== "planned" ? "" : style.borderRightNone)}>
                                                        <div style={{ zIndex: 5 }} className={clsx(style.moneyBox)}>${formatAUD(plannedRate)}</div>
                                                        <div className={clsx(style.leftColumn)} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '266px', zIndex: 3 }} onClick={handlePlannedRowClick}></div>
                                                        <div className={clsx(style.rightColumn)} style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '266px', zIndex: 3 }} onClick={handleActualRowClick}></div>
                                                    </td>
                                                    {/* <td colSpan={2} className={clsx(selectedColumn === "planned" ? style.active1 : style.active3, 'text-center', style.borderRightNone)}>

                                                    </td> */}
                                                </tr>
                                                <tr>
                                                    <td style={{ background: '#F9FAFB' }}>
                                                        <span className='font-16' style={{ color: '#344054' }}>Subtotal</span>
                                                    </td>
                                                    <td className={clsx(selectedColumn === "planned" ? style.active1 : style.nonActive, selectedColumn === "planned" ? style.active2 : '')} onClick={handlePlannedRowClick}>
                                                        <span className='font-14'>${formatAUD(plannedSubtotal)}</span>
                                                    </td>
                                                    <td className={clsx(selectedColumn === "actual" ? style.active1 : '', selectedColumn === "actual" ? style.active2 : '')} onClick={handleActualRowClick}>
                                                        <span className='font-14'>${formatAUD(actualSubtotal)}</span>
                                                    </td>
                                                </tr>
                                                <tr className={style.whiteTr}>
                                                    <td>
                                                        <span className='font-16' style={{ color: '#344054' }}>Variation</span>
                                                    </td>
                                                    <td style={{ position: 'relative' }} colSpan={2} className={clsx(selectedColumn === "planned" ? style.active1 : style.active3, 'text-center', selectedColumn !== "planned" ? "" : style.borderRightNone)}>
                                                        <div style={{ zIndex: 5}} className={clsx(style.moneyBox, variation === parseFloat(0) ? "" : isBonus ? style.bonusBox : style.deductionBox)}>{isBonus ? "+" : "-"} ${formatAUD(parseFloat(variation || 0).toFixed(2))}</div>
                                                        <div className={clsx(style.leftColumn)} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '266px', zIndex: 3 }} onClick={handlePlannedRowClick}></div>
                                                        <div className={clsx(style.rightColumn)} style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '266px', zIndex: 3 }} onClick={handleActualRowClick}></div>
                                                    </td>
                                                </tr>
                                                <tr className={clsx(style.lastRow)}>
                                                    <td style={{ background: '#F9FAFB' }}>
                                                        <span className='font-16' style={{ color: '#344054' }}>Total</span>
                                                    </td>
                                                    <td className={clsx(selectedColumn === "planned" ? style.active1 : style.nonActive, selectedColumn === "planned" ? style.active2 : '')} onClick={handlePlannedRowClick}>
                                                        <Button className={clsx("outline-button px-3 py-1 font-14 mx-auto gap-2", selectedColumn === "planned" ? style.activeOutlineButton : "")}>
                                                            ${formatAUD(plannedTotal)}
                                                            {
                                                                selectedColumn === "planned" ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                                        <path d="M3.125 10.5C3.125 6.70304 6.20304 3.625 10 3.625C11.2533 3.625 12.4265 3.95978 13.437 4.54437C13.7358 4.71721 14.1182 4.61511 14.291 4.31632C14.4638 4.01753 14.3617 3.6352 14.063 3.46236C12.8672 2.77068 11.4789 2.375 10 2.375C5.51269 2.375 1.875 6.01269 1.875 10.5C1.875 14.9873 5.51269 18.625 10 18.625C14.4873 18.625 18.125 14.9873 18.125 10.5C18.125 10.1548 17.8452 9.875 17.5 9.875C17.1548 9.875 16.875 10.1548 16.875 10.5C16.875 14.297 13.797 17.375 10 17.375C6.20304 17.375 3.125 14.297 3.125 10.5Z" fill="white" />
                                                                        <path d="M19.1919 4.69194C19.436 4.44786 19.436 4.05214 19.1919 3.80806C18.9479 3.56398 18.5521 3.56398 18.3081 3.80806L10 12.1161L6.69194 8.80806C6.44786 8.56398 6.05214 8.56398 5.80806 8.80806C5.56398 9.05214 5.56398 9.44786 5.80806 9.69194L9.55806 13.4419C9.80214 13.686 10.1979 13.686 10.4419 13.4419L19.1919 4.69194Z" fill="white" />
                                                                    </svg> :
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                        <path d="M3.625 10.5C3.625 6.70304 6.70304 3.625 10.5 3.625C11.7533 3.625 12.9265 3.95978 13.937 4.54437C14.2358 4.71721 14.6182 4.61511 14.791 4.31632C14.9638 4.01753 14.8617 3.6352 14.563 3.46236C13.3672 2.77068 11.9789 2.375 10.5 2.375C6.01269 2.375 2.375 6.01269 2.375 10.5C2.375 14.9873 6.01269 18.625 10.5 18.625C14.9873 18.625 18.625 14.9873 18.625 10.5C18.625 10.1548 18.3452 9.875 18 9.875C17.6548 9.875 17.375 10.1548 17.375 10.5C17.375 14.297 14.297 17.375 10.5 17.375C6.70304 17.375 3.625 14.297 3.625 10.5Z" fill="#344054" />
                                                                        <path d="M19.6919 4.69194C19.936 4.44786 19.936 4.05214 19.6919 3.80806C19.4479 3.56398 19.0521 3.56398 18.8081 3.80806L10.5 12.1161L7.19194 8.80806C6.94786 8.56398 6.55214 8.56398 6.30806 8.80806C6.06398 9.05214 6.06398 9.44786 6.30806 9.69194L10.0581 13.4419C10.3021 13.686 10.6979 13.686 10.9419 13.4419L19.6919 4.69194Z" fill="#344054" />
                                                                    </svg>
                                                            }
                                                        </Button>
                                                    </td>
                                                    <td className={selectedColumn === "actual" ? style.active1 : ''} onClick={handleActualRowClick}>
                                                        <Button className={clsx("outline-button px-3 py-1 font-14 mx-auto gap-2", selectedColumn === "actual" ? style.activeOutlineButton : "")}>
                                                            ${formatAUD(actualTotal)}
                                                            {
                                                                selectedColumn === "actual" ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                                                        <path d="M3.125 10.5C3.125 6.70304 6.20304 3.625 10 3.625C11.2533 3.625 12.4265 3.95978 13.437 4.54437C13.7358 4.71721 14.1182 4.61511 14.291 4.31632C14.4638 4.01753 14.3617 3.6352 14.063 3.46236C12.8672 2.77068 11.4789 2.375 10 2.375C5.51269 2.375 1.875 6.01269 1.875 10.5C1.875 14.9873 5.51269 18.625 10 18.625C14.4873 18.625 18.125 14.9873 18.125 10.5C18.125 10.1548 17.8452 9.875 17.5 9.875C17.1548 9.875 16.875 10.1548 16.875 10.5C16.875 14.297 13.797 17.375 10 17.375C6.20304 17.375 3.125 14.297 3.125 10.5Z" fill="white" />
                                                                        <path d="M19.1919 4.69194C19.436 4.44786 19.436 4.05214 19.1919 3.80806C18.9479 3.56398 18.5521 3.56398 18.3081 3.80806L10 12.1161L6.69194 8.80806C6.44786 8.56398 6.05214 8.56398 5.80806 8.80806C5.56398 9.05214 5.56398 9.44786 5.80806 9.69194L9.55806 13.4419C9.80214 13.686 10.1979 13.686 10.4419 13.4419L19.1919 4.69194Z" fill="white" />
                                                                    </svg> :
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                        <path d="M3.625 10.5C3.625 6.70304 6.70304 3.625 10.5 3.625C11.7533 3.625 12.9265 3.95978 13.937 4.54437C14.2358 4.71721 14.6182 4.61511 14.791 4.31632C14.9638 4.01753 14.8617 3.6352 14.563 3.46236C13.3672 2.77068 11.9789 2.375 10.5 2.375C6.01269 2.375 2.375 6.01269 2.375 10.5C2.375 14.9873 6.01269 18.625 10.5 18.625C14.9873 18.625 18.625 14.9873 18.625 10.5C18.625 10.1548 18.3452 9.875 18 9.875C17.6548 9.875 17.375 10.1548 17.375 10.5C17.375 14.297 14.297 17.375 10.5 17.375C6.70304 17.375 3.625 14.297 3.625 10.5Z" fill="#344054" />
                                                                        <path d="M19.6919 4.69194C19.936 4.44786 19.936 4.05214 19.6919 3.80806C19.4479 3.56398 19.0521 3.56398 18.8081 3.80806L10.5 12.1161L7.19194 8.80806C6.94786 8.56398 6.55214 8.56398 6.30806 8.80806C6.06398 9.05214 6.06398 9.44786 6.30806 9.69194L10.0581 13.4419C10.3021 13.686 10.6979 13.686 10.9419 13.4419L19.6919 4.69194Z" fill="#344054" />
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
                                        <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 600, fontSize: '18px' }}>Variation</h1>
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
                                                <div className={clsx(style.amountInputBox, isBonus ? style.bonusInputBox : style.deductionInputBox)}>
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
                                                    <button className={clsx(isBonus ? "info-button" : 'outline-button', "p-0")} style={{ width: '44px', height: '44px' }} onClick={() => setIsBonus(true)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8 0.5C8.34518 0.5 8.625 0.779822 8.625 1.125V7.375H14.875C15.2202 7.375 15.5 7.65482 15.5 8C15.5 8.34518 15.2202 8.625 14.875 8.625H8.625V14.875C8.625 15.2202 8.34518 15.5 8 15.5C7.65482 15.5 7.375 15.2202 7.375 14.875V8.625H1.125C0.779822 8.625 0.5 8.34518 0.5 8C0.5 7.65482 0.779822 7.375 1.125 7.375H7.375V1.125C7.375 0.779822 7.65482 0.5 8 0.5Z" fill="#158ECC" />
                                                        </svg>
                                                    </button>
                                                    <button className={clsx(!isBonus ? "danger-outline-button" : 'outline-button', "p-0")} style={{ width: '44px', height: '44px' }} onClick={() => setIsBonus(false)}>
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
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="Enter a reason..."
                                            />
                                        </div>
                                    </Card.Header>
                                }
                            </Card>

                            <Card className={clsx(style.border, 'mb-4')}>
                                <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenHistorySection(!isOpenHistorySection)}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 600, fontSize: '18px' }}>History</h1>
                                        <button className='text-button p-0'>
                                            {
                                                isOpenHistorySection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </Card.Body>
                                {
                                    isOpenHistorySection &&
                                    <Card.Header className={clsx(style.background, 'border-0 p-0', style.borderBottom)} style={{ overflow: 'auto', maxHeight: '250px' }}>
                                        <div className='d-flex flex-column gap-3 p-3'>
                                            {
                                                job?.history.map((history, index) => (
                                                    <div key={index}>
                                                        <h2 className={style.historyTitle}>{history.title}</h2>
                                                        <p className={style.historySubtitle}>{new Date(history.created).toLocaleDateString() || 'N/A'}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </Card.Header>
                                }
                            </Card>

                            {
                                job?.project_photos && <>
                                    <Card className={clsx(style.border, 'mb-3')}>
                                        <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenProjectPhotoSection(!isOpenProjectPhotoSection)}>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 600, fontSize: '18px' }}>Project Photos</h1>
                                                <button className='text-button p-0'>
                                                    {
                                                        isOpenProjectPhotoSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                                        </svg>
                                                    }
                                                </button>
                                            </div>
                                        </Card.Body>
                                        {
                                            isOpenProjectPhotoSection &&
                                            <Card.Header className={clsx(style.background, 'border-0')}>
                                                <div className='d-flex flex-column gap-1' style={{ overflowX: 'auto' }}>
                                                    {
                                                        job?.project_photos == 1 ? (<>
                                                            <label className={clsx(style.customLabel, 'd-block')}>Before & After</label>
                                                            <div style={{ width: '124px', height: '124px', background: '#f0f0f0' }}></div>
                                                        </>) : job?.project_photos == 2 ? (<>
                                                            <label className={clsx(style.customLabel, 'd-block')}>In Process</label>
                                                            <div style={{ width: '124px', height: '124px', background: '#f0f0f0' }}></div>
                                                        </>) : job?.project_photos == 3 ? (<>
                                                            <label className={clsx(style.customLabel, 'd-block')}>All</label>
                                                            <div style={{ width: '124px', height: '124px', background: '#f0f0f0' }}></div>
                                                        </>) : null
                                                    }
                                                </div>
                                            </Card.Header>
                                        }
                                    </Card>
                                </>
                            }

                            <Card className={clsx(style.border, 'mb-3')}>
                                <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenDocumentsSection(!isOpenDocumentsSection)}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 600, fontSize: '18px' }}>Documents</h1>
                                        <button className='text-button p-0'>
                                            {
                                                isOpenDocumentsSection ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.3536 7.35355C13.1583 7.54882 12.8417 7.54882 12.6464 7.35355L7 1.70711L1.35355 7.35355C1.15829 7.54881 0.841709 7.54881 0.646446 7.35355C0.451184 7.15829 0.451184 6.84171 0.646446 6.64645L6.64645 0.646446C6.84171 0.451184 7.15829 0.451184 7.35355 0.646446L13.3536 6.64645C13.5488 6.84171 13.5488 7.15829 13.3536 7.35355Z" fill="#344054" />
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.64645 4.64645C1.84171 4.45118 2.15829 4.45118 2.35355 4.64645L8 10.2929L13.6464 4.64645C13.8417 4.45118 14.1583 4.45118 14.3536 4.64645C14.5488 4.84171 14.5488 5.15829 14.3536 5.35355L8.35355 11.3536C8.15829 11.5488 7.84171 11.5488 7.64645 11.3536L1.64645 5.35355C1.45118 5.15829 1.45118 4.84171 1.64645 4.64645Z" fill="#344054" />
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </Card.Body>
                                {
                                    isOpenDocumentsSection &&
                                    <Card.Header className={clsx(style.background, 'border-0')}>
                                        <Button className='outline-button d-flex gap-2' onClick={() => setShow(true)} style={{ borderRadius: '40px' }}>
                                            Viw All Documents
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M1.25 4.375C1.25 3.33947 2.08947 2.5 3.125 2.5H6.57992C7.77713 2.5 8.78091 3.19995 9.46927 3.97997C9.98156 4.56048 10.5984 5 11.25 5H16.8759C17.912 5 18.75 5.84003 18.75 6.875V15.625C18.75 16.6605 17.9105 17.5 16.875 17.5H3.125C2.08947 17.5 1.25 16.6605 1.25 15.625V4.375ZM3.125 3.75C2.77982 3.75 2.5 4.02982 2.5 4.375V7.5H17.5V6.875C17.5 6.52926 17.2205 6.25 16.8759 6.25H11.25C10.0451 6.25 9.11184 5.46409 8.53203 4.80706C7.96726 4.16709 7.27657 3.75 6.57992 3.75H3.125ZM17.5 8.75H2.5V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V8.75Z" fill="#344054" />
                                            </svg>
                                        </Button>
                                    </Card.Header>
                                }
                            </Card>

                            {job?.locations?.length &&
                                <Card className={clsx(style.border, 'mb-4')}>
                                    <Card.Body className={clsx(style.borderBottom, style.cardBody, 'cursor-pointer')} onClick={() => setIsOpenJobTrackingSection(!isOpenJobTrackingSection)}>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 600, fontSize: '18px' }}>Job Tracking</h1>
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
                                            <JobLocationsMap locations={job?.locations || []} />
                                        </Card.Header>
                                    }
                                </Card>
                            }
                        </div>

                        <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                            <Button type='button' onClick={handleDeclineJob} className='danger-outline-button' disabled={jobDeclineMutation?.isPending}>
                                Decline
                                {jobDeclineMutation?.isPending &&
                                    <ProgressSpinner
                                        style={{ width: "20px", height: "20px", color: "#fff" }}
                                    />
                                }
                            </Button>
                            <Feedback jobId={jobId} variation={variation} reason={reason} isBonus={isBonus} value={selectedColumn === "planned" ? plannedTotal : actualTotal} planned={plannedSubtotal} actual={actualSubtotal} selectedColumn={selectedColumn} refetch={refetch} resetAndClose={resetAndClose} nextJobId={nextJobId} handleNextJob={handleNextJob} refetchApprovedTotal={refetchApprovedTotal} />
                        </div>
                    </div>
                )}
            ></Sidebar>
            <ViewAttachements attachments={job?.attachments || []} show={show} setShow={setShow} />
        </>
    );
};

const Feedback = ({ jobId, variation, reason, isBonus, value, planned, actual, selectedColumn, refetch, resetAndClose, nextJobId, handleNextJob, refetchApprovedTotal }) => {
    const [visible, setVisible] = useState(false);
    const [quality, setQuality] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isNextJob, setIsNextJob] = useState(false);

    const createApprovalMutation = useMutation({
        mutationFn: (data) => createApproval(jobId, data),
        onSuccess: () => {
            toast.success(`Job approved successfully.`);
            refetch();
            refetchApprovedTotal();
            resetAndClose();
            setVisible(false);
            setQuality(null);
            setSpeed(null);
            setFeedback(null);
            setIsNextJob(false);
        },
        onError: (error) => {
            console.error('Error approving job:', error);
            toast.error(`Failed to approve job. Please try again.`);
        }
    });

    const handleRate = async () => {
        await createApprovalMutation.mutateAsync({
            quality_rating: quality,
            speed_rating: speed,
            feedback_rating: feedback,
            deduction: isBonus ? 0 : variation,
            deduction_reason: isBonus ? "" : reason,
            bonus: isBonus ? variation : 0,
            bonus_reason: isBonus ? reason : "",
            is_bonus: isBonus,
            planned,
            actual,
            value,
            type: selectedColumn
        });

        if (isNextJob) {
            handleNextJob(nextJobId);
        }
    };

    return (
        <>
            <div className='d-flex align-items-center gap-3'>
                <Button type='button' onClick={() => setVisible(true)} className='info-button' style={{ minWidth: '75px' }}>Approve</Button>
                <Button type='button' disabled={nextJobId === null || createApprovalMutation?.isPending} onClick={() => { setIsNextJob(true); setVisible(true); }} className='solid-button' style={{ minWidth: '75px' }}>Approve & See Next</Button>
            </div>
            <Dialog header="Approve & Rate" visible={visible} style={{ width: '512px' }} headerClassName='border-bottom' headerStyle={{ fontSize: '22px' }} onHide={() => setVisible(false)}>
                <div className='p-4'>
                    <div className="mb-4 text-center">
                        <h5 className={style.feedbackLabel}>Quality</h5>
                        <div className='d-flex align-items-center justify-content-center gap-2'>
                            <Rating value={quality} size={40} onChange={(e) => setQuality(e.value)} cancel={false} />
                        </div>
                    </div>
                    <div className="mb-4 text-center">
                        <h5 className={style.feedbackLabel}>Speed</h5>
                        <div className='d-flex align-items-center justify-content-center gap-4'>
                            {speed !== 0
                                ? <Button className='px-2 py-2 rounded-circle bg-transparent border-0' onClick={() => setSpeed(0)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                                        <path d="M5.33345 11.1301C6.70129 9.70661 8.31614 8.84008 10.1792 8.78564V11.1939L6.68545 12.5877L5.33345 11.1301Z" fill="#98A2B3" />
                                        <path d="M19.5729 5.74967C19.0329 5.74967 18.5951 5.2946 18.5951 4.73323C18.5951 4.17187 19.0329 3.7168 19.5729 3.7168C20.113 3.7168 20.5508 4.17187 20.5508 4.73323C20.5508 5.2946 20.113 5.74967 19.5729 5.74967Z" fill="#98A2B3" />
                                        <path d="M23.6982 5.07007L23.4228 4.93479L23.3196 4.61426L23.5946 4.74954L23.6982 5.07007Z" fill="#98A2B3" />
                                        <path d="M1.68146 17.4966C1.8464 17.3443 2.12346 17.1899 2.39809 17.1119C2.81084 14.9503 3.69849 13.0401 4.91237 11.5975L6.38868 13.1835L5.67043 17.025C5.85568 17.0392 6.03646 17.0567 6.20546 17.0741L6.84165 13.1859L10.4589 11.6576L14.0778 13.1859L14.714 17.0782C14.8922 17.0586 15.071 17.0456 15.2502 17.0392L14.5283 13.1835L15.39 12.2597C15.3737 12.1028 15.3583 11.9611 15.3489 11.8997C15.3087 11.7661 15.273 11.6381 15.2356 11.5069L14.2326 12.5875L10.7319 11.1908V8.78582C12.3256 8.83213 13.741 9.47644 14.974 10.5514C14.0327 6.88375 14.1277 4.36825 15.2669 3.07232C15.9973 2.24113 17.2786 1.78369 18.8744 1.78369C21.1965 1.78369 24.117 2.81028 24.9551 4.71235C25.2265 5.32863 25.4995 6.58029 24.2824 8.04685L23.8846 8.52582L23.7518 8.45188C23.6612 9.78641 22.9312 11.2343 20.1918 11.2343C20.0314 11.2343 19.9863 11.2834 19.9619 11.3107C19.5841 11.7242 19.6637 13.3257 19.7222 14.4953C19.8055 16.1645 19.8843 17.7408 19.1323 18.5643C19.0446 18.6605 18.9459 18.7393 18.8415 18.8092C18.7395 19.3215 18.514 19.7485 18.1504 20.1031C18.4653 20.9924 18.7001 21.9292 18.7663 22.7251C19.0507 22.9412 19.4033 23.7005 19.4033 24.9826C19.4033 25.4404 17.3968 25.4778 17.11 25.0342C16.9504 25.0488 16.7797 25.0569 16.5933 25.0569C15.3156 25.0569 13.8129 24.7267 13.7495 24.712L13.3628 24.6263L13.4595 24.2278C13.5342 23.9219 13.5744 23.5839 13.5935 23.2321C12.6636 23.2178 11.5944 23.0143 11.5944 23.0143C11.7166 22.5813 11.7317 22.0686 11.6943 21.5543C10.8574 21.5722 10.0202 21.5717 9.18327 21.5526C9.35349 21.9845 9.40143 22.3741 9.22065 22.6003C8.81805 23.1013 6.76243 23.2341 6.76243 23.2341C6.78234 22.9798 6.75105 22.7048 6.69418 22.4285L6.68077 22.4517C6.34277 22.9639 5.95318 23.3938 5.56074 23.7062C5.50102 24.0515 5.34543 24.4927 5.03749 24.9883C4.85509 25.2832 3.60059 24.3265 3.48399 23.8459C2.6589 23.1427 1.80293 21.7078 1.40034 20.9814L1.12815 20.4903L1.66562 20.3928C2.06699 20.3201 2.41312 20.199 2.70196 20.0324C2.36802 19.6806 2.16002 19.2626 2.06862 18.7625C1.9764 18.8685 1.8854 18.9827 1.79846 19.1123C1.32965 19.8123 0.9429 20.6142 0.834024 20.2266C0.724337 19.8391 1.04243 18.0869 1.68146 17.4966ZM3.3024 19.5161C3.33968 19.4701 3.37492 19.4226 3.40802 19.3735C3.59896 19.0786 3.69362 18.7576 3.73749 18.4663H2.79743C2.85024 18.8673 3.00137 19.2175 3.3024 19.5161ZM18.787 17.6742C19.5609 15.8359 17.8786 10.4413 20.1918 10.4413C22.4282 10.4413 22.9994 9.40819 22.9994 8.14638C22.9994 8.14638 22.8056 8.23738 22.4449 8.23738C21.8676 8.23738 20.863 8.0046 19.5414 6.79153C19.6304 6.78959 19.7194 6.78864 19.8083 6.78869C22.3653 6.78869 23.7055 7.52888 23.7055 7.52888C26.0816 4.66563 22.1171 2.57588 18.8744 2.57588C17.6109 2.57588 16.4568 2.89316 15.8307 3.60613C14.3284 5.31522 15.4907 9.72263 16.0871 11.695C16.0875 11.6966 16.0879 11.7003 16.0887 11.7019C16.6688 12.4384 17.1754 13.5365 17.9493 13.7953C18.6542 14.0313 18.4799 15.9996 16.8963 16.8332C16.9951 17.1558 17.106 17.4418 17.2299 17.6742H18.787ZM16.5937 24.2635C16.9508 24.2635 17.2018 24.2347 17.3842 24.1961C17.5651 23.8375 17.7796 23.4969 18.0249 23.1788C18.0379 21.4645 16.885 18.6776 16.1436 17.8403C16.0237 17.8322 15.8312 17.8224 15.602 17.8224C14.7188 17.8224 14.0371 17.9602 13.6788 18.2043C13.9128 19.066 14.6152 21.9219 14.2809 24.0104C14.7972 24.1071 15.7617 24.2635 16.5937 24.2635ZM13.4229 20.6824C13.3632 20.3002 13.2953 19.9374 13.2279 19.6136C13.1921 19.7172 13.1523 19.8196 13.1056 19.9187C12.9671 20.199 12.7887 20.4537 12.5742 20.6581C12.5458 20.6853 12.5153 20.7105 12.4861 20.7361C12.7986 20.7229 13.1109 20.705 13.4229 20.6824ZM8.74452 20.747C9.31675 20.7649 9.88923 20.7736 10.4617 20.773C11.0813 20.773 11.6504 20.7641 12.1777 20.747C12.2554 20.6545 12.3302 20.5597 12.402 20.4627C12.5675 20.2382 12.7118 19.9988 12.833 19.7477C12.9426 19.521 13.0322 19.2851 13.1007 19.0428C13.0447 18.8064 12.9955 18.6114 12.9569 18.4668H7.68706C7.71712 18.6321 7.75124 18.7938 7.79268 18.9502C7.86658 19.2247 7.966 19.4917 8.08965 19.7477C8.21117 19.9988 8.3556 20.2381 8.52109 20.4627C8.59137 20.5598 8.66774 20.6532 8.74452 20.747ZM8.43699 20.7361C8.40774 20.7105 8.37768 20.6853 8.34883 20.6581C8.13 20.4443 7.95006 20.1941 7.81705 19.9187C7.76505 19.8078 7.72118 19.692 7.68259 19.5754C7.6513 19.9467 7.58996 20.3172 7.4884 20.6812C7.80428 20.7047 8.12052 20.723 8.43699 20.7361ZM4.07062 23.334C4.53862 23.1 4.96477 22.9822 5.2268 22.9611C5.5433 22.6795 5.82103 22.3571 6.05271 22.0023C6.44474 21.4076 7.27715 19.8557 6.81402 17.9451C6.38746 17.8874 5.48437 17.7782 4.77831 17.7782C4.68812 17.7782 4.60443 17.7802 4.52765 17.7834C4.55609 18.2705 4.51302 19.0818 4.04584 19.8082C3.66599 20.3989 3.08952 20.8137 2.32659 21.0468C2.95952 22.1076 3.65218 23.0115 4.07062 23.334Z" fill="#98A2B3" />
                                    </svg>
                                </Button>
                                : <Button className='info-button px-2 py-2' onClick={() => setSpeed(null)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                                        <path d="M5.33345 11.1301C6.70129 9.70661 8.31614 8.84008 10.1792 8.78564V11.1939L6.68545 12.5877L5.33345 11.1301Z" fill="#98A2B3" />
                                        <path d="M19.5729 5.74967C19.0329 5.74967 18.5951 5.2946 18.5951 4.73323C18.5951 4.17187 19.0329 3.7168 19.5729 3.7168C20.113 3.7168 20.5508 4.17187 20.5508 4.73323C20.5508 5.2946 20.113 5.74967 19.5729 5.74967Z" fill="#98A2B3" />
                                        <path d="M23.6982 5.07007L23.4228 4.93479L23.3196 4.61426L23.5946 4.74954L23.6982 5.07007Z" fill="#98A2B3" />
                                        <path d="M1.68146 17.4966C1.8464 17.3443 2.12346 17.1899 2.39809 17.1119C2.81084 14.9503 3.69849 13.0401 4.91237 11.5975L6.38868 13.1835L5.67043 17.025C5.85568 17.0392 6.03646 17.0567 6.20546 17.0741L6.84165 13.1859L10.4589 11.6576L14.0778 13.1859L14.714 17.0782C14.8922 17.0586 15.071 17.0456 15.2502 17.0392L14.5283 13.1835L15.39 12.2597C15.3737 12.1028 15.3583 11.9611 15.3489 11.8997C15.3087 11.7661 15.273 11.6381 15.2356 11.5069L14.2326 12.5875L10.7319 11.1908V8.78582C12.3256 8.83213 13.741 9.47644 14.974 10.5514C14.0327 6.88375 14.1277 4.36825 15.2669 3.07232C15.9973 2.24113 17.2786 1.78369 18.8744 1.78369C21.1965 1.78369 24.117 2.81028 24.9551 4.71235C25.2265 5.32863 25.4995 6.58029 24.2824 8.04685L23.8846 8.52582L23.7518 8.45188C23.6612 9.78641 22.9312 11.2343 20.1918 11.2343C20.0314 11.2343 19.9863 11.2834 19.9619 11.3107C19.5841 11.7242 19.6637 13.3257 19.7222 14.4953C19.8055 16.1645 19.8843 17.7408 19.1323 18.5643C19.0446 18.6605 18.9459 18.7393 18.8415 18.8092C18.7395 19.3215 18.514 19.7485 18.1504 20.1031C18.4653 20.9924 18.7001 21.9292 18.7663 22.7251C19.0507 22.9412 19.4033 23.7005 19.4033 24.9826C19.4033 25.4404 17.3968 25.4778 17.11 25.0342C16.9504 25.0488 16.7797 25.0569 16.5933 25.0569C15.3156 25.0569 13.8129 24.7267 13.7495 24.712L13.3628 24.6263L13.4595 24.2278C13.5342 23.9219 13.5744 23.5839 13.5935 23.2321C12.6636 23.2178 11.5944 23.0143 11.5944 23.0143C11.7166 22.5813 11.7317 22.0686 11.6943 21.5543C10.8574 21.5722 10.0202 21.5717 9.18327 21.5526C9.35349 21.9845 9.40143 22.3741 9.22065 22.6003C8.81805 23.1013 6.76243 23.2341 6.76243 23.2341C6.78234 22.9798 6.75105 22.7048 6.69418 22.4285L6.68077 22.4517C6.34277 22.9639 5.95318 23.3938 5.56074 23.7062C5.50102 24.0515 5.34543 24.4927 5.03749 24.9883C4.85509 25.2832 3.60059 24.3265 3.48399 23.8459C2.6589 23.1427 1.80293 21.7078 1.40034 20.9814L1.12815 20.4903L1.66562 20.3928C2.06699 20.3201 2.41312 20.199 2.70196 20.0324C2.36802 19.6806 2.16002 19.2626 2.06862 18.7625C1.9764 18.8685 1.8854 18.9827 1.79846 19.1123C1.32965 19.8123 0.9429 20.6142 0.834024 20.2266C0.724337 19.8391 1.04243 18.0869 1.68146 17.4966ZM3.3024 19.5161C3.33968 19.4701 3.37492 19.4226 3.40802 19.3735C3.59896 19.0786 3.69362 18.7576 3.73749 18.4663H2.79743C2.85024 18.8673 3.00137 19.2175 3.3024 19.5161ZM18.787 17.6742C19.5609 15.8359 17.8786 10.4413 20.1918 10.4413C22.4282 10.4413 22.9994 9.40819 22.9994 8.14638C22.9994 8.14638 22.8056 8.23738 22.4449 8.23738C21.8676 8.23738 20.863 8.0046 19.5414 6.79153C19.6304 6.78959 19.7194 6.78864 19.8083 6.78869C22.3653 6.78869 23.7055 7.52888 23.7055 7.52888C26.0816 4.66563 22.1171 2.57588 18.8744 2.57588C17.6109 2.57588 16.4568 2.89316 15.8307 3.60613C14.3284 5.31522 15.4907 9.72263 16.0871 11.695C16.0875 11.6966 16.0879 11.7003 16.0887 11.7019C16.6688 12.4384 17.1754 13.5365 17.9493 13.7953C18.6542 14.0313 18.4799 15.9996 16.8963 16.8332C16.9951 17.1558 17.106 17.4418 17.2299 17.6742H18.787ZM16.5937 24.2635C16.9508 24.2635 17.2018 24.2347 17.3842 24.1961C17.5651 23.8375 17.7796 23.4969 18.0249 23.1788C18.0379 21.4645 16.885 18.6776 16.1436 17.8403C16.0237 17.8322 15.8312 17.8224 15.602 17.8224C14.7188 17.8224 14.0371 17.9602 13.6788 18.2043C13.9128 19.066 14.6152 21.9219 14.2809 24.0104C14.7972 24.1071 15.7617 24.2635 16.5937 24.2635ZM13.4229 20.6824C13.3632 20.3002 13.2953 19.9374 13.2279 19.6136C13.1921 19.7172 13.1523 19.8196 13.1056 19.9187C12.9671 20.199 12.7887 20.4537 12.5742 20.6581C12.5458 20.6853 12.5153 20.7105 12.4861 20.7361C12.7986 20.7229 13.1109 20.705 13.4229 20.6824ZM8.74452 20.747C9.31675 20.7649 9.88923 20.7736 10.4617 20.773C11.0813 20.773 11.6504 20.7641 12.1777 20.747C12.2554 20.6545 12.3302 20.5597 12.402 20.4627C12.5675 20.2382 12.7118 19.9988 12.833 19.7477C12.9426 19.521 13.0322 19.2851 13.1007 19.0428C13.0447 18.8064 12.9955 18.6114 12.9569 18.4668H7.68706C7.71712 18.6321 7.75124 18.7938 7.79268 18.9502C7.86658 19.2247 7.966 19.4917 8.08965 19.7477C8.21117 19.9988 8.3556 20.2381 8.52109 20.4627C8.59137 20.5598 8.66774 20.6532 8.74452 20.747ZM8.43699 20.7361C8.40774 20.7105 8.37768 20.6853 8.34883 20.6581C8.13 20.4443 7.95006 20.1941 7.81705 19.9187C7.76505 19.8078 7.72118 19.692 7.68259 19.5754C7.6513 19.9467 7.58996 20.3172 7.4884 20.6812C7.80428 20.7047 8.12052 20.723 8.43699 20.7361ZM4.07062 23.334C4.53862 23.1 4.96477 22.9822 5.2268 22.9611C5.5433 22.6795 5.82103 22.3571 6.05271 22.0023C6.44474 21.4076 7.27715 19.8557 6.81402 17.9451C6.38746 17.8874 5.48437 17.7782 4.77831 17.7782C4.68812 17.7782 4.60443 17.7802 4.52765 17.7834C4.55609 18.2705 4.51302 19.0818 4.04584 19.8082C3.66599 20.3989 3.08952 20.8137 2.32659 21.0468C2.95952 22.1076 3.65218 23.0115 4.07062 23.334Z" fill="#1AB2FF" />
                                    </svg>
                                </Button>
                            }
                            {
                                speed !== 1 ?
                                    <Button className='px-2 py-2 rounded-circle bg-transparent border-0' onClick={() => setSpeed(1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path d="M24.0665 28.1587L20.4265 21.8387C20.4265 19.532 18.9998 18.052 17.2665 18.052C16.0665 18.052 15.0265 18.7187 14.4932 19.7054C14.9332 19.452 15.4532 19.3187 15.9998 19.3187C17.7332 19.3187 19.1465 20.732 19.1465 22.4654C19.1465 24.212 17.7465 25.6387 15.9998 25.6387H20.3998V28.1587H9.05316C8.73316 28.1587 8.39983 28.0387 8.15983 27.7854C7.92371 27.548 7.79116 27.2268 7.79116 26.892C7.79116 26.5572 7.92371 26.236 8.15983 25.9987L8.8265 25.332C8.37316 25.132 7.99983 24.8254 7.6265 24.5054C7.33316 25.172 6.6665 25.6387 5.89316 25.6387C5.38925 25.6387 4.90598 25.4385 4.54966 25.0822C4.19334 24.7259 3.99316 24.2426 3.99316 23.7387C3.99316 23.2348 4.19334 22.7515 4.54966 22.3952C4.90598 22.0389 5.38925 21.8387 5.89316 21.8387L6.51983 21.9454V19.3187C6.51807 18.4882 6.68034 17.6656 6.99733 16.8981C7.31432 16.1305 7.77978 15.4331 8.367 14.8459C8.95421 14.2586 9.65162 13.7932 10.4192 13.4762C11.1868 13.1592 12.0094 12.9969 12.8398 12.9987H12.8665C15.6932 13.012 17.8932 14.1187 17.8932 12.372C17.8932 11.132 18.1598 10.6387 18.6132 9.94536C17.6398 9.49202 16.5332 9.21202 15.3732 9.21202C14.6665 9.21202 14.1065 8.65203 14.1065 7.94536C14.1065 7.37203 14.4798 6.89202 14.9998 6.73202L14.1065 6.67869C13.4132 6.67869 12.8398 6.11869 12.8398 5.42536C12.8398 4.71869 13.4132 4.15869 14.1065 4.15869H15.3732C18.1732 4.15869 20.6265 5.69202 21.9465 7.95869L22.3198 7.94536C23.2665 7.94536 24.1465 8.25202 24.8665 8.75869L25.4665 9.26536C28.3598 11.8654 27.9998 13.6254 27.9998 13.6387C27.9998 15.3454 26.5865 16.7454 24.8665 16.7454L24.2132 16.6787V16.7854C24.2132 18.2654 23.5732 19.5854 22.5732 20.5187L26.9865 28.1587H24.0665ZM24.2132 10.4787C23.5065 10.4787 22.9465 11.0387 22.9465 11.732C22.9465 12.4387 23.5065 12.9987 24.2132 12.9987C24.9065 12.9987 25.4798 12.4387 25.4798 11.732C25.4798 11.0387 24.9065 10.4787 24.2132 10.4787Z" fill="#98A2B3" />
                                        </svg>
                                    </Button>
                                    : <Button className='info-button px-2 py-2' onClick={() => setSpeed(null)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path d="M24.0665 28.1587L20.4265 21.8387C20.4265 19.532 18.9998 18.052 17.2665 18.052C16.0665 18.052 15.0265 18.7187 14.4932 19.7054C14.9332 19.452 15.4532 19.3187 15.9998 19.3187C17.7332 19.3187 19.1465 20.732 19.1465 22.4654C19.1465 24.212 17.7465 25.6387 15.9998 25.6387H20.3998V28.1587H9.05316C8.73316 28.1587 8.39983 28.0387 8.15983 27.7854C7.92371 27.548 7.79116 27.2268 7.79116 26.892C7.79116 26.5572 7.92371 26.236 8.15983 25.9987L8.8265 25.332C8.37316 25.132 7.99983 24.8254 7.6265 24.5054C7.33316 25.172 6.6665 25.6387 5.89316 25.6387C5.38925 25.6387 4.90598 25.4385 4.54966 25.0822C4.19334 24.7259 3.99316 24.2426 3.99316 23.7387C3.99316 23.2348 4.19334 22.7515 4.54966 22.3952C4.90598 22.0389 5.38925 21.8387 5.89316 21.8387L6.51983 21.9454V19.3187C6.51807 18.4882 6.68034 17.6656 6.99733 16.8981C7.31432 16.1305 7.77978 15.4331 8.367 14.8459C8.95421 14.2586 9.65162 13.7932 10.4192 13.4762C11.1868 13.1592 12.0094 12.9969 12.8398 12.9987H12.8665C15.6932 13.012 17.8932 14.1187 17.8932 12.372C17.8932 11.132 18.1598 10.6387 18.6132 9.94536C17.6398 9.49202 16.5332 9.21202 15.3732 9.21202C14.6665 9.21202 14.1065 8.65203 14.1065 7.94536C14.1065 7.37203 14.4798 6.89202 14.9998 6.73202L14.1065 6.67869C13.4132 6.67869 12.8398 6.11869 12.8398 5.42536C12.8398 4.71869 13.4132 4.15869 14.1065 4.15869H15.3732C18.1732 4.15869 20.6265 5.69202 21.9465 7.95869L22.3198 7.94536C23.2665 7.94536 24.1465 8.25202 24.8665 8.75869L25.4665 9.26536C28.3598 11.8654 27.9998 13.6254 27.9998 13.6387C27.9998 15.3454 26.5865 16.7454 24.8665 16.7454L24.2132 16.6787V16.7854C24.2132 18.2654 23.5732 19.5854 22.5732 20.5187L26.9865 28.1587H24.0665ZM24.2132 10.4787C23.5065 10.4787 22.9465 11.0387 22.9465 11.732C22.9465 12.4387 23.5065 12.9987 24.2132 12.9987C24.9065 12.9987 25.4798 12.4387 25.4798 11.732C25.4798 11.0387 24.9065 10.4787 24.2132 10.4787Z" fill="#1AB2FF" />
                                        </svg>
                                    </Button>
                            }
                            {
                                speed !== 2 ?
                                    <Button className='px-2 py-2 rounded-circle bg-transparent border-0' onClick={() => setSpeed(2)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path d="M24.5019 4.15874C24.3437 4.15874 24.2025 4.18868 24.0951 4.24687C24.2476 5.35185 24.355 5.6055 25.2306 6.18962C24.0499 8.36399 24.8126 9.01364 18.7736 8.2623C16.1072 7.929 14.0904 8.40918 12.1471 9.87232C9.41857 11.9286 8.5147 13.081 7.08546 16.849C6.06578 19.5381 7.09111 25.0629 3.24007 23.1083C2.87626 22.984 2.48986 22.9615 2.79604 23.4812C3.33441 24.3116 4.34166 24.8991 5.61724 24.385C7.61648 23.5716 7.45266 20.8374 8.92144 17.5382C9.42987 16.3802 10.5879 13.6234 11.6782 14.9001C12.0511 15.3407 12.4578 16.2446 12.2488 16.6739C11.3506 18.5551 10.8139 19.8714 9.40727 20.9503C9.61629 23.3343 9.5372 25.9103 8.25484 27.7689L8.75197 28.1587C9.49766 27.6333 10.345 27.0854 10.5879 26.3227C10.6444 25.2211 10.8083 25.0799 10.7179 22.7524C11.7008 21.7695 12.712 20.9729 13.5877 19.3121C15.2146 18.8432 16.2032 17.5213 17.576 16.2446C17.8245 16.013 18.0336 15.7757 18.2369 15.5497C18.6889 14.6572 18.4177 13.5895 18.0787 12.567C18.9826 13.0472 19.3724 13.855 19.4571 14.6063C20.1802 14.5724 20.7847 14.499 21.4118 14.3069C21.214 13.2505 21.5756 12.5557 22.4456 11.8269C21.9315 13.1827 21.7564 13.5443 22.1744 14.0471C22.18 14.0414 22.1913 14.0358 22.197 14.0358C22.4682 14.5837 22.4625 15.1147 22.4738 15.6966C22.18 16.0977 21.7451 15.9904 21.344 15.996L20.474 17.0976C21.2253 17.0016 23.389 16.5666 23.4003 16.2276C23.4455 15.2899 23.6488 14.2843 23.3438 13.4143C23.9256 12.985 24.4567 12.3636 24.8973 11.7535C25.5187 10.8835 25.7108 10.1548 26.4056 8.93455C26.5525 8.67469 28.2416 9.35824 28.5523 9.26221C29.0438 9.10968 29.3601 8.90066 29.3093 8.36964C29.298 8.22276 28.5354 7.74258 28.1286 7.43752C28.1286 7.43752 28.1964 6.8952 28.0439 6.68788C27.8066 6.36305 26.9254 6.15573 26.9254 6.15573C26.7615 4.9355 25.3605 4.1514 24.5019 4.15874ZM27.462 6.8534C27.6259 6.8534 27.7558 6.98107 27.7558 7.13586C27.7558 7.2929 27.6259 7.41493 27.462 7.41493C27.2982 7.41493 27.1683 7.2929 27.1683 7.13586C27.1683 6.98107 27.2982 6.85453 27.462 6.8534Z" fill="#98A2B3" />
                                        </svg>
                                    </Button>
                                    : <Button className='info-button px-2 py-2' onClick={() => setSpeed(null)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path d="M24.5019 4.15874C24.3437 4.15874 24.2025 4.18868 24.0951 4.24687C24.2476 5.35185 24.355 5.6055 25.2306 6.18962C24.0499 8.36399 24.8126 9.01364 18.7736 8.2623C16.1072 7.929 14.0904 8.40918 12.1471 9.87232C9.41857 11.9286 8.5147 13.081 7.08546 16.849C6.06578 19.5381 7.09111 25.0629 3.24007 23.1083C2.87626 22.984 2.48986 22.9615 2.79604 23.4812C3.33441 24.3116 4.34166 24.8991 5.61724 24.385C7.61648 23.5716 7.45266 20.8374 8.92144 17.5382C9.42987 16.3802 10.5879 13.6234 11.6782 14.9001C12.0511 15.3407 12.4578 16.2446 12.2488 16.6739C11.3506 18.5551 10.8139 19.8714 9.40727 20.9503C9.61629 23.3343 9.5372 25.9103 8.25484 27.7689L8.75197 28.1587C9.49766 27.6333 10.345 27.0854 10.5879 26.3227C10.6444 25.2211 10.8083 25.0799 10.7179 22.7524C11.7008 21.7695 12.712 20.9729 13.5877 19.3121C15.2146 18.8432 16.2032 17.5213 17.576 16.2446C17.8245 16.013 18.0336 15.7757 18.2369 15.5497C18.6889 14.6572 18.4177 13.5895 18.0787 12.567C18.9826 13.0472 19.3724 13.855 19.4571 14.6063C20.1802 14.5724 20.7847 14.499 21.4118 14.3069C21.214 13.2505 21.5756 12.5557 22.4456 11.8269C21.9315 13.1827 21.7564 13.5443 22.1744 14.0471C22.18 14.0414 22.1913 14.0358 22.197 14.0358C22.4682 14.5837 22.4625 15.1147 22.4738 15.6966C22.18 16.0977 21.7451 15.9904 21.344 15.996L20.474 17.0976C21.2253 17.0016 23.389 16.5666 23.4003 16.2276C23.4455 15.2899 23.6488 14.2843 23.3438 13.4143C23.9256 12.985 24.4567 12.3636 24.8973 11.7535C25.5187 10.8835 25.7108 10.1548 26.4056 8.93455C26.5525 8.67469 28.2416 9.35824 28.5523 9.26221C29.0438 9.10968 29.3601 8.90066 29.3093 8.36964C29.298 8.22276 28.5354 7.74258 28.1286 7.43752C28.1286 7.43752 28.1964 6.8952 28.0439 6.68788C27.8066 6.36305 26.9254 6.15573 26.9254 6.15573C26.7615 4.9355 25.3605 4.1514 24.5019 4.15874ZM27.462 6.8534C27.6259 6.8534 27.7558 6.98107 27.7558 7.13586C27.7558 7.2929 27.6259 7.41493 27.462 7.41493C27.2982 7.41493 27.1683 7.2929 27.1683 7.13586C27.1683 6.98107 27.2982 6.85453 27.462 6.8534Z" fill="#1AB2FF" />
                                        </svg>
                                    </Button>
                            }
                        </div>
                    </div>
                    <div className="mb-4 text-center">
                        <h5 className={style.feedbackLabel}>Customer Feedback</h5>
                        <div className='d-flex align-items-center justify-content-center gap-5'>
                            {feedback !== 0 ? <EmojiFrown size={20} className={clsx('cursor-pointer')} onClick={() => setFeedback(0)} /> : <EmojiFrownFill size={20} color='#FFCB45' onClick={() => setFeedback(null)} className={clsx('cursor-pointer')} />}
                            {feedback !== 1 ? <EmojiNeutral size={20} className={clsx('cursor-pointer')} onClick={() => setFeedback(1)} /> : <EmojiNeutralFill size={20} color='#FFCB45' onClick={() => setFeedback(null)} className={clsx('cursor-pointer')} />}
                            {feedback !== 2 ? <EmojiSmile size={20} className={clsx('cursor-pointer')} onClick={() => setFeedback(2)} /> : <EmojiSmileFill size={20} color='#FFCB45' onClick={() => setFeedback(null)} className={clsx('cursor-pointer')} />}
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 border-top pt-4">
                    <Button className="outline-button" disabled={createApprovalMutation?.isPending} onClick={() => setVisible(false)}>Cancel</Button>
                    <Button className="solid-button" disabled={createApprovalMutation?.isPending} onClick={handleRate} autoFocus>
                        Approve Job
                        {createApprovalMutation?.isPending && (
                            <ProgressSpinner
                                style={{ width: "20px", height: "20px", color: "#fff" }}
                            />
                        )}
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

const JobLocationsMap = ({ locations }) => {
    if (!locations || locations.length === 0) return null;

    const center = [
        parseFloat(locations[0].latitude),
        parseFloat(locations[0].longitude),
    ];

    return (
        <MapContainer center={center} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {locations.map((loc, idx) => (
                <Marker
                    key={idx}
                    position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                >
                    <Popup>
                        📍 Latitude: {loc.latitude} <br />
                        📍 Longitude: {loc.longitude} <br />
                        🕒 Timestamp: {new Date(loc.date * 1000).toLocaleString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ApproveJob;