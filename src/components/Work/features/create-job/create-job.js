import { Sidebar } from 'primereact/sidebar';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Calendar3, ClockHistory, CloudUpload, FilePdf, FilePdfFill, Trash, X } from 'react-bootstrap-icons';
import { useQuery } from "@tanstack/react-query";

import style from './create-job.module.scss';
import { getJobTemplate, getJobTemplates } from '../../../../APIs/email-template';
import { Dropdown } from 'primereact/dropdown';
import clsx from 'clsx';
import { ProgressSpinner } from 'primereact/progressspinner';
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

const CreateJob = ({ visible, setVisible }) => {
    const [templateId, setTemplatedId] = useState(null);
    const [jobReference, setJobReference] = useState(null);
    const [description, setDescription] = useState(null);

    const [userId, setUserId] = useState(null);
    const [hourlyRate, setHourlyRate] = useState("0.00");
    const [paymentCycle, setPaymentCycle] = useState(null);

    const [projectId, setProjectId] = useState(null);
    // const [projectReference, setProjectReference] = useState(null);
    // const [projectDescription, setProjectDescription] = useState(null);
    const [repeat, setRepeat] = useState('');
    const [weeks, setWeeks] = useState([]);
    const [months, setMonths] = useState([]);
    const [repeatStart, setRepeatStart] = useState(null);
    const [ending, setEnding] = useState([]);
    const [repeatEnd, setRepeatEnd] = useState(null);
    const [occurrences, setOccurrences] = useState(null);

    const [projectPhotoDeliver, setProjectPhotoDeliver] = useState(null);


    const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });


    const [type, setType] = useState('2');
    const [cost, setCost] = useState(0.00);
    const [time_type, set_time_type] = useState('');
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [duration, setDuration] = useState("");

    const [errors, setErrors] = useState({});

    const templateQuery = useQuery({
        queryKey: ["jobTemplate"],
        queryFn: getJobTemplates,
    });
    const getTemplateByIDQuery = useQuery({
        queryKey: ["templateId", templateId],
        queryFn: () => getJobTemplate(templateId),
        enabled: !!templateId,
        retry: 1,
    });

    const mobileuserQuery = useQuery({
        queryKey: ["mobileuser"],
        queryFn: getTeamMobileUser,
    });

    const projectQuery = useQuery({
        queryKey: ["getManagement"],
        queryFn: getManagement,
        staleTime: Infinity,
    });

    const itemTemplate = (option) => {
        return (
            <div className="d-flex gap-2 align-items-center">
                <img alt={option.label}
                    src={option.image} style={{ width: '18px', borderRadius: '50%' }} />
                <div>{option.label}</div>
            </div>
        );
    }
    const selectedItemTemplate = (option, props) => {
        if (option) {
            return (
                <div className="d-flex gap-2 align-items-center">
                    <img alt={option.label}
                        src={option.image} style={{ width: '18px', borderRadius: '50%' }} />
                    <div>{option.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    useEffect(() => {
        setJobReference(getTemplateByIDQuery?.data?.title || "");
        setDescription(getTemplateByIDQuery?.data?.description || "");
        setErrors((others) => ({ ...others, jobReference: false }));
        setErrors((others) => ({ ...others, description: false }));
    }, [getTemplateByIDQuery?.data]);
    return (
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ position: 'relative', textAlign: 'start' }}>
                                <Dropdown
                                    options={
                                        (templateQuery &&
                                            templateQuery.data?.map((template) => ({
                                                value: template.id,
                                                label: `${template.name}`,
                                            }))) ||
                                        []
                                    }
                                    className={clsx(
                                        style.dropdownSelect,
                                        "dropdown-height-fixed",
                                        "outline-none"
                                    )}
                                    style={{ height: "44px", width: '606px' }}
                                    placeholder="Select template"
                                    onChange={(e) => {
                                        setTemplatedId(e.value);
                                    }}
                                    value={templateId}
                                    loading={templateQuery?.isFetching}
                                    filter
                                />
                            </div>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 68px - 80px)', overflow: 'auto' }}>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx('d-flex justify-content-between align-items-center', style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Job Details</h1>
                                <div className={clsx(style.newJobTag, 'mb-0')}>New Job</div>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Job Reference</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {getTemplateByIDQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputText
                                                value={jobReference}
                                                className={clsx(style.inputBox, 'w-100')}
                                                onChange={(e) => {
                                                    setJobReference(e.target.value);
                                                    setErrors((others) => ({ ...others, subject: false }));
                                                }}
                                                placeholder="Enter job reference"
                                            />
                                        </IconField>
                                    </div>
                                </div>

                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Job Description</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {getTemplateByIDQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputTextarea
                                                value={description}
                                                className={clsx(style.inputBox, 'w-100 outline-none')}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                    setErrors((others) => ({ ...others, description: false }));
                                                }}
                                                style={{
                                                    height: '126px'
                                                }}
                                                placeholder="Enter the detailed quote for the client contract here. Include all relevant information such as project scope, deliverables, timelines, costs, payment terms, and any special conditions. Ensure the quote is clear, comprehensive, and aligns with the client's requirements and expectations."
                                            />
                                        </IconField>
                                    </div>
                                </div>

                            </Card.Header>
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Header className={clsx(style.background, 'border-0 py-4')}>
                                <h1 className='font-16 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Assigned to*</h1>
                                <Row>
                                    <Col className='d-flex align-items-center'>
                                        <div style={{ position: 'relative', textAlign: 'start' }}>
                                            <label className={clsx(style.customLabel)}>Choose User</label>
                                            <Dropdown
                                                options={
                                                    (mobileuserQuery &&
                                                        mobileuserQuery.data?.users?.map((user) => ({
                                                            value: user.id,
                                                            label: `${user.first_name} ${user.last_name}`,
                                                            image: user?.photo
                                                        }))) ||
                                                    []
                                                }
                                                itemTemplate={itemTemplate}
                                                className={clsx(
                                                    style.dropdownSelect,
                                                    "dropdown-height-fixed",
                                                    "outline-none"
                                                )}
                                                style={{ height: "44px", width: '100%' }}
                                                placeholder="Select user"
                                                onChange={(e) => {
                                                    setUserId(e.value);
                                                    let user = mobileuserQuery?.data?.users?.find(user => user.id === e.value)
                                                    let paymentCycleObj = {
                                                        "7": "WEEK",
                                                        "14": "TWO_WEEKS",
                                                        "28": "FOUR_WEEKS",
                                                        "1": "MONTH"
                                                    }
                                                    if (user) {
                                                        setHourlyRate(parseFloat(user?.hourly_rate || 0).toFixed(2))
                                                        setPaymentCycle(paymentCycleObj[user?.payment_cycle] || "")
                                                    }
                                                }}
                                                value={userId}
                                                valueTemplate={selectedItemTemplate}
                                                loading={mobileuserQuery?.isFetching}
                                                filter
                                            />
                                        </div>
                                    </Col>
                                    <Col className='ps-0'>
                                        <div className={clsx(style.chooseUserBox, 'd-flex justify-content-between')}>
                                            <div className='d-flex flex-column'>
                                                <label className={clsx(style.customLabel)}>Hourly Rate</label>
                                                <h1 className='font-16'>${hourlyRate || 0.00} AUD</h1>
                                            </div>
                                            <div className='d-flex flex-column'>
                                                <label className={clsx(style.customLabel)}>Payment cycle </label>
                                                <h1 className='font-16'>{paymentCycle || "-"}</h1>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Header>
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Time / Money</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0 pt-2', style.borderBottom)}>
                                <div className={style.paymentType}>
                                    <label className={clsx(style.lable)}>Payment Type</label>
                                    <div className={style.paymentmain}>
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="fix"
                                                name="paymentype"
                                                value="2"
                                                onChange={(e) => setType(e.target.value)}
                                                checked={type === '2'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="fix" className={clsx(style.radioLabel, style.fix)}>Fix</label>
                                        </div>
                                        <span>OR</span>
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="hours"
                                                name="paymentype"
                                                value="3"
                                                onChange={(e) => setType(e.target.value)}
                                                checked={type === '3'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="hours" className={clsx(style.radioLabel, style.hours)}>Hours</label>
                                        </div>
                                        <span>OR</span>
                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="timetracker"
                                                name="paymentype"
                                                value="4"
                                                onChange={(e) => setType(e.target.value)}
                                                checked={type === '4'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="timetracker" className={clsx(style.radioLabel, style.timetracker)}>Time Tracker</label>
                                        </div>
                                    </div>
                                    {errors?.type && (
                                        <p className="error-message mb-0">{"Payment Type is required"}</p>
                                    )}
                                    {
                                        type === "2" ? <>
                                            <label className={clsx(style.lable, 'mt-4 mb-2')}>Payment</label>
                                            <IconField iconPosition="left">
                                                <InputIcon><span style={{ position: 'relative', top: '-4px' }}>$</span></InputIcon>
                                                <InputText value={cost} onChange={(e) => setCost(e.target.value)} keyfilter={"num"} onBlur={(e) => setCost(parseFloat(e?.target?.value || 0).toFixed(2))} style={{ paddingLeft: '28px', width: '230px' }} className={clsx(style.inputBox, "outline-none")} placeholder='20' />
                                            </IconField>
                                        </>
                                            : <div style={{ width: 'fit-content' }}>
                                                <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Hours</label>
                                                <IconField iconPosition="left">
                                                    <InputIcon><span style={{ position: 'relative', top: '-4px' }}>H</span></InputIcon>
                                                    <InputText value={duration} onChange={(e) => setDuration(e.target.value)} keyfilter={"num"} onBlur={(e) => setDuration(parseFloat(e?.target?.value || 0).toFixed(1))} style={{ paddingLeft: '28px', width: '150px' }} className={clsx(style.inputBox, "outline-none")} placeholder='1.0' />
                                                </IconField>
                                            </div>
                                    }
                                </div>
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className={style.paymentType}>
                                    <label className={clsx(style.lable)}>Time</label>
                                    <div className={style.paymentmain}>
                                        {
                                            type !== "4" && <>
                                                <div className={`flex align-items-center ${style.RadioButton}`}>
                                                    <input
                                                        type="radio"
                                                        id="shift"
                                                        name="timetype"
                                                        value="1"
                                                        onChange={(e) => set_time_type(e.target.value)}
                                                        checked={time_type === '1'}
                                                        className={style.customRadio}
                                                    />
                                                    <label htmlFor="shift" className={clsx(style.radioLabel, style.shift)}>Shift</label>
                                                </div>
                                                <span>OR</span>
                                            </>
                                        }

                                        <div className={`flex align-items-center ${style.RadioButton}`}>
                                            <input
                                                type="radio"
                                                id="timeframe"
                                                name="timetype"
                                                value="T"
                                                onChange={(e) => set_time_type(e.target.value)}
                                                checked={time_type === 'T'}
                                                className={style.customRadio}
                                            />
                                            <label htmlFor="timeframe" className={clsx(style.radioLabel, style.timeFrame)}>Time Frame</label>
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex gap-3'>
                                    <div className='form-group'>
                                        <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Starts</label>
                                        <Calendar
                                            value={start}
                                            onChange={(e) => setStart(e.value)}
                                            showButtonBar
                                            placeholder='17 Jun 2021'
                                            dateFormat="dd M yy"
                                            showIcon
                                            style={{ height: '46px', width: '180px', overflow: 'hidden' }}
                                            icon={<Calendar3 color='#667085' size={20} />}
                                            className={clsx(style.inputBox, 'p-0 outline-none')}
                                        />
                                    </div>
                                    {
                                        time_type !== '1' && <div className='form-group'>
                                            <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>End</label>
                                            <Calendar
                                                value={end}
                                                onChange={(e) => setEnd(e.value)}
                                                showButtonBar
                                                placeholder='20 Jun 2021'
                                                dateFormat="dd M yy"
                                                showIcon
                                                style={{ height: '46px', width: '180px', overflow: 'hidden' }}
                                                icon={<Calendar3 color='#667085' size={20} />}
                                                className={clsx(style.inputBox, 'p-0 outline-none')}
                                            />
                                        </div>
                                    }
                                    {
                                        (time_type === '1' || (time_type !== '1' && type === '4')) && <div style={{ width: 'fit-content' }}>
                                            <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Hours</label>
                                            <IconField iconPosition="right">
                                                <InputIcon><ClockHistory color='#667085' size={20} style={{ position: 'relative', top: '-5px' }} /></InputIcon>
                                                <InputText value={duration} onChange={(e) => setDuration(e.target.value)} keyfilter={"num"} onBlur={(e) => setDuration(parseFloat(e?.target?.value || 0).toFixed(1))} style={{ paddingLeft: '12px', width: '150px' }} className={clsx(style.inputBox, "outline-none")} placeholder='1.0' />
                                            </IconField>
                                        </div>
                                    }
                                </div>

                            </Card.Header>
                        </Card>

                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Link to Project</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                <div style={{ position: 'relative', textAlign: 'start' }}>
                                    <label className={clsx(style.customLabel)}>Project</label>
                                    <Dropdown
                                        options={
                                            (projectQuery &&
                                                projectQuery.data?.map((project) => ({
                                                    value: project.unique_id,
                                                    label: `${project.reference} - ${project.number}`
                                                }))) ||
                                            []
                                        }
                                        className={clsx(
                                            style.dropdownSelect,
                                            "dropdown-height-fixed",
                                            "outline-none",
                                            "mb-3"
                                        )}
                                        style={{ height: "44px", width: '100%' }}
                                        placeholder="Select project"
                                        onChange={(e) => {
                                            setProjectId(e.value);
                                        }}
                                        value={projectId}
                                        loading={projectQuery?.isFetching}
                                        filter
                                    />
                                </div>
                            </Card.Header>
                            {/* <Card.Header className={clsx(style.background, 'border-0')}>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Reference</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {projectQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputText
                                                value={projectReference}
                                                className={clsx(style.inputBox, 'w-100')}
                                                onChange={(e) => {
                                                    setProjectReference(e.target.value);
                                                    setErrors((others) => ({ ...others, projectReference: false }));
                                                }}
                                                placeholder="Enter project reference"
                                            />
                                        </IconField>
                                    </div>
                                </div>
                                <div className='form-group mb-3'>
                                    <label className={clsx(style.customLabel)}>Description</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconField>
                                            <InputIcon>
                                                {projectQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-40px' }} />}
                                            </InputIcon>
                                            <InputTextarea
                                                value={projectDescription}
                                                style={{ height: '120px' }}
                                                className={clsx(style.inputBox, 'w-100 outline-0')}
                                                onChange={(e) => {
                                                    setProjectDescription(e.target.value);
                                                    setErrors((others) => ({ ...others, projectDescription: false }));
                                                }}
                                                placeholder="Enter a description..."
                                            />
                                        </IconField>
                                    </div>
                                </div>
                            </Card.Header> */}
                        </Card>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Set to repeat</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                <div className='d-flex align-items-center gap-4 py-1'>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="Weekly" name="repeat" value="Weekly" onChange={(e) => setRepeat(e.value)} checked={repeat === 'Weekly'} />
                                        <label htmlFor="Weekly" className="ms-2 cursor-pointer">Weekly</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="Monthly" name="repeat" value="Monthly" onChange={(e) => setRepeat(e.value)} checked={repeat === 'Monthly'} />
                                        <label htmlFor="Monthly" className="ms-2 cursor-pointer">Monthly</label>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                <div className='d-flex flex-column'>
                                    <label className='mb-2'>Repeat on</label>
                                    {
                                        repeat === 'Weekly' && <div className='d-flex gap-3 align-items-center'>
                                            {
                                                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) =>
                                                    <button onClick={() => {
                                                        setWeeks((prevWeeks) =>
                                                            prevWeeks.includes(day)
                                                                ? prevWeeks.filter((d) => d !== day)
                                                                : [...prevWeeks, day]
                                                        );
                                                    }} className={clsx('outline-button', { 'active-outline-button': weeks.includes(day) })}>
                                                        {day}
                                                    </button>
                                                )
                                            }
                                        </div>
                                    }
                                    {
                                        repeat === 'Monthly' && <div className='d-flex gap-2 align-items-center flex-wrap'>
                                            {
                                                Array.from({ length: 31 }, (_, i) => i + 1).map((month) => (
                                                    <button onClick={() => {
                                                        setMonths((prevMonths) =>
                                                            setMonths.includes(month)
                                                                ? prevMonths.filter((m) => m !== month)
                                                                : [...prevMonths, month]
                                                        );
                                                    }} className={clsx('outline-button', { 'active-outline-button': months.includes(month) })}>
                                                        {month}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    }

                                </div>
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0', style.borderBottom)}>
                                <label className='mb-2'>Starts</label>
                                <Calendar
                                    value={repeatStart}
                                    onChange={(e) => setRepeatStart(e.value)}
                                    showButtonBar
                                    placeholder='17 Jun 2021'
                                    dateFormat="dd M yy"
                                    showIcon
                                    style={{ height: '46px', width: '180px', overflow: 'hidden' }}
                                    icon={<Calendar3 color='#667085' size={20} />}
                                    className={clsx(style.inputBox, 'p-0 outline-none')}
                                />
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex', style.borderBottom)}>
                                <div className='d-flex flex-column'>
                                    <label className='mb-1'>Ends</label>
                                    <div className='d-flex align-items-center gap-4 py-1'>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="On" name="ending" value="On" onChange={(e) => setEnding(e.value)} checked={repeat === 'On'} />
                                            <label htmlFor="On" className="ms-2 cursor-pointer">On</label>
                                        </div>
                                        <Calendar
                                            value={repeatEnd}
                                            onChange={(e) => setRepeatEnd(e.value)}
                                            showButtonBar
                                            placeholder='20 Jun 2021'
                                            dateFormat="dd M yy"
                                            showIcon
                                            style={{ height: '46px', width: '180px', overflow: 'hidden' }}
                                            icon={<Calendar3 color='#667085' size={20} />}
                                            className={clsx(style.inputBox, 'p-0 outline-none')}
                                        />
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="Never" name="ending" value="Never" onChange={(e) => setEnding(e.value)} checked={repeat === 'Never'} />
                                            <label htmlFor="Never" className="ms-2 cursor-pointer">Never</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex flex-column ms-3'>
                                    <label className='mb-1'>Occurrences</label>
                                    <Dropdown
                                        options={
                                            [
                                                { label: 1, value: 1 },
                                                { label: 2, value: 2 },
                                                { label: 3, value: 3 },
                                                { label: 4, value: 4 },
                                                { label: 5, value: 5 },
                                                { label: 6, value: 6 },
                                                { label: 7, value: 7 },
                                            ]
                                        }
                                        className={clsx(
                                            style.dropdownSelect,
                                            "dropdown-height-fixed",
                                            "outline-none",
                                            "mb-3"
                                        )}
                                        style={{ height: "44px", width: '100%' }}
                                        placeholder="Select Occurrences"
                                        onChange={(e) => {
                                            setProjectId(e.value);
                                        }}
                                        value={projectId}
                                        loading={projectQuery?.isFetching}
                                        filter
                                    />
                                </div>
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex flex-column', style.borderBottom)}>
                                <label className='mb-1'>Set Schedule Ahead</label>
                                <Dropdown
                                    options={
                                        [
                                            { label: "1 Week", value: 1 },
                                            { label: "2 Week", value: 2 },
                                            { label: "3 Week", value: 3 },
                                            { label: "4 Week", value: 4 },
                                            { label: "5 Week", value: 5 },
                                            { label: "6 Week", value: 6 },
                                            { label: "7 Week", value: 7 },
                                        ]
                                    }
                                    className={clsx(
                                        style.dropdownSelect,
                                        "dropdown-height-fixed",
                                        "outline-none",
                                        "mb-3"
                                    )}
                                    style={{ height: "44px", width: '250px' }}
                                    placeholder="Select week"
                                    onChange={(e) => {
                                        setOccurrences(e.value);
                                    }}
                                    value={occurrences}
                                />
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between', style.borderBottom)}>
                                <Button className='outline-button'>Cancel</Button>
                                <Button className='outline-button active-outline-button'>Apply</Button>
                            </Card.Header>
                        </Card>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Project Photos</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between', style.borderBottom)}>
                                <div className='d-flex align-items-center gap-4 py-1'>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="Before and After" name="projectPhotoDeliver" value="Before and After" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver === 'Before and After'} />
                                        <label htmlFor="Before and After" className="ms-2 cursor-pointer">Before and After</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="After" name="projectPhotoDeliver" value="After" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver === 'After'} />
                                        <label htmlFor="After" className="ms-2 cursor-pointer">After</label>
                                    </div>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="All" name="projectPhotoDeliver" value="All" onChange={(e) => setProjectPhotoDeliver(e.value)} checked={projectPhotoDeliver === 'All'} />
                                    <label htmlFor="All" className="ms-2 cursor-pointer">All</label>
                                </div>
                            </Card.Header>
                        </Card>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body className={clsx(style.borderBottom)}>
                                <h1 className='font-16 mb-0 font-weight-light' style={{ color: '#475467', fontWeight: 400 }}>Attachments</h1>
                            </Card.Body>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex justify-content-between')}>
                                <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #EAECF0', marginTop: '16px' }}>
                                    <input {...getInputProps()} />
                                    <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '8px', marginBottom: '16px' }}>
                                        <CloudUpload />
                                    </button>
                                    <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
                                    <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                                </div>
                            </Card.Header>
                            <Card.Header className={clsx(style.background, 'border-0 d-flex flex-column', style.borderBottom)}>
                                <div className='d-flex flex-column gap-3'>
                                    <div className={style.fileBox}>
                                        <div className={style.imgBox}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="41" viewBox="0 0 32 41" fill="none">
                                                <path d="M0 4.5874C0 2.37826 1.79086 0.587402 4 0.587402H20L32 12.5874V36.5874C32 38.7965 30.2091 40.5874 28 40.5874H4C1.79086 40.5874 0 38.7965 0 36.5874V4.5874Z" fill="#D92D20" />
                                                <path opacity="0.3" d="M20 0.587402L32 12.5874H24C21.7909 12.5874 20 10.7965 20 8.5874V0.587402Z" fill="white" />
                                            </svg>
                                            <div className={style.fileType}>PDF</div>
                                        </div>
                                        <div className={style.fileNameBox}>
                                            <p className='mb-0'>Tech design requirements.pdf</p>
                                            <p className='mb-0'>200 KB – 100% uploaded</p>
                                        </div>
                                        <div className='ms-auto'>
                                            <div className={style.deleteBox}>
                                                <Trash color='#F04438' size={16}/>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                        </Card>


                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false) }} className='outline-button'>Cancel</Button>
                        <Button type='button' onClick={() => { }} className='solid-button' style={{ minWidth: '75px' }}>{false ? "Loading..." : "Save"}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    )
}

export default CreateJob