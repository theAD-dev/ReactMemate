import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft, ClockHistory, PencilSquare } from "react-bootstrap-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Editor } from 'primereact/editor';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './job-template.module.scss';
import { createJobTemplate, deleteJobTemplate, getJobTemplate, updateJobTemplate } from '../../../../APIs/email-template';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Sidebar from '../Sidebar';

const renderHeader = () => (
    <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-strike" aria-label="Strikethrough"></button>
        <button className="ql-blockquote" aria-label="Blockquote"></button>
        <button
            className="ql-list"
            value="ordered"
            aria-label="Ordered List"
        ></button>
        <button
            className="ql-list"
            value="bullet"
            aria-label="Bullet List"
        ></button>
        <button className="ql-align" value="" aria-label="Align Left"></button>
        <button
            className="ql-align"
            value="center"
            aria-label="Align Center"
        ></button>
        <button
            className="ql-align"
            value="right"
            aria-label="Align Right"
        ></button>
        <button
            className="ql-align"
            value="justify"
            aria-label="Justify"
        ></button>
        <button className="ql-link" aria-label="Insert Link"></button>
        <button className="ql-image" aria-label="Insert Image"></button>
        <button className="ql-code-block" aria-label="Code Block"></button>
    </span>
);
const header = renderHeader();

const CreateJobTemplate = () => {
    const { trialHeight } = useTrialHeight();
    const navigate = useNavigate();
    const { id } = useParams();
    console.log('id: ', id);
    const editorRef = useRef(null);
    const subjectRef = useRef(null);
    const [name, setName] = useState("");
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [type, setType] = useState('2');
    const [cost, setCost] = useState(0.00);
    const [duration, setDuration] = useState("");

    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('job-templates');
    const jobQuery = useQuery({
        queryKey: ["getJobTemplate", id],
        queryFn: () => getJobTemplate(id),
        enabled: !!id,
        retry: 1,
    });
    const mutation = useMutation({
        mutationFn: (templateData) => (id ? updateJobTemplate(id, templateData) : createJobTemplate(templateData)),
        onSuccess: () => {
            toast.success("Template saved successfully!");
            navigate('/settings/templates/job-templates/');
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            toast.error("Failed to save the template. Please try again.");
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => (id && deleteJobTemplate(id)),
        onSuccess: () => {
            toast.success("Template deleted successfully!");
            navigate('/settings/templates/job-templates/');
        },
        onError: (error) => {
            console.error("Error deleting template:", error);
            toast.error("Failed to delete the template. Please try again.");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!subject) newErrors.subject = true;
        if (!text) newErrors.text = true;
        if (!type) newErrors.type = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const templateData = {
            name,
            title: subject,
            description: text,
            type,
            cost
        };
        templateData.duration = duration || 0.0;
        mutation.mutate(templateData);
    };

    const handleDelete = () => {
        if (id) {
            deleteMutation.mutate();
        }
    };

    useEffect(() => {
        if (jobQuery?.data) {
            console.log('jobQuery?.data: ', jobQuery?.data);
            setName(jobQuery?.data?.name);
            setSubject(jobQuery?.data?.title);
            setText(jobQuery?.data?.description);
            setType(jobQuery?.data?.type);
            setCost(jobQuery?.data?.cost);
            if (jobQuery?.data?.duration) setDuration(+jobQuery?.data?.duration);
        }
    }, [jobQuery?.data]);

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky' style={{ position: 'relative' }}>
                        <h1>Templates</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li className='menuActive'><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                                <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                <li><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`content_wrap_main mt-0`} style={{ background: '#F9FAFB', paddingBottom: `${trialHeight}px` }}>
                        <div className='content_wrapper d-block px-3' style={{ paddingTop: '24px', paddingBottom: '100px' }}>
                            <a href='/settings/templates/job-templates/' className={clsx(style.transparent, 'text-button border px-0')} style={{ width: "fit-content", marginBottom: '16px' }}>
                                <ChevronLeft color="#475467" size={20} /> <span style={{ color: '#475467' }}>Go Back</span>
                            </a>

                            <div className='d-flex align-items-center w-100'>
                                {
                                    isEdit ? (
                                        <>
                                            <InputText onBlur={() => setIsEdit(false)} className={clsx(style.inputBox, style.templateName, style.transparent, 'me-2 p-0')} value={name} onChange={(e) => {
                                                setName(e.target.value);
                                                setErrors((others) => ({ ...others, name: false }));
                                            }} autoFocus
                                                placeholder='[ Template ]'
                                            />
                                        </>
                                    ) : <span className={clsx(style.templateName, 'me-2')}>{name || "[ Template Name ]"}</span>
                                }
                                <div style={{ width: '30px' }}>
                                    {jobQuery?.isFetching ?
                                        <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px' }} />
                                        : <PencilSquare color='#106B99' onClick={() => setIsEdit(true)} size={16} style={{ cursor: 'pointer' }} />
                                    }
                                </div>
                            </div>
                            {errors?.name && (
                                <p className="error-message mb-0">{"Name is required"}</p>
                            )}

                            <div className={style.divider}></div>

                            <div className="flex flex-column gap-2" style={{ marginBottom: '16px' }}>
                                <label className={style.label}>Subject</label>
                                <IconField>
                                    <InputIcon>
                                        {jobQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                    </InputIcon>
                                    <InputText
                                        ref={subjectRef}
                                        value={subject}
                                        className={clsx(style.inputBox, 'w-100')}
                                        onChange={(e) => {
                                            setSubject(e.target.value);
                                            setErrors((others) => ({ ...others, subject: false }));
                                        }}
                                        placeholder="Enter subject"
                                    />
                                </IconField>
                                {errors?.subject && (
                                    <p className="error-message mb-0">{"Subject is required"}</p>
                                )}
                            </div>

                            <div className="d-flex flex-column gap-1" style={{ position: 'relative' }}>
                                <label className={clsx(style.lable)}>Message</label>
                                <InputIcon style={{ position: 'absolute', right: '15px', top: '40px', zIndex: 1 }}>
                                    {jobQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                </InputIcon>
                                <Editor
                                    ref={editorRef}
                                    style={{ minHeight: "299px" }}
                                    headerTemplate={header}
                                    value={text}
                                    placeholder='Enter a description...'
                                    onTextChange={(e) => {
                                        setText(e.htmlValue);
                                        setErrors((others) => ({ ...others, text: false }));
                                    }}
                                />
                            </div>
                            {errors?.text && (
                                <p className="error-message mb-0">{"Message is required"}</p>
                            )}

                            <div className={clsx(style.formTemplateGroup, "card flex justify-content-center mt-3 pb-4")}>
                                <label className={clsx(style.lable1)}>Time / Money </label>
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
                                                <InputText value={cost} onChange={(e) => setCost(e.target.value)} keyfilter={"num"} onBlur={(e) => setCost(parseFloat(e?.target?.value || 0).toFixed(2))} style={{ paddingLeft: '28px', width: '230px' }} className={clsx(style.inputText, "outline-none")} placeholder='20' />
                                            </IconField>
                                        </>
                                            : <div style={{ width: 'fit-content' }}>
                                                <label className={clsx(style.lable, 'mt-4 mb-2 d-block')}>Duration</label>
                                                <IconField iconPosition="right">
                                                    <InputIcon><ClockHistory color='#667085' size={20} style={{ position: 'relative', top: '-5px' }} /></InputIcon>
                                                    <InputText value={duration} onChange={(e) => setDuration(e.target.value)} keyfilter={"num"} onBlur={(e) => setDuration(parseFloat(e?.target?.value || 0).toFixed(1))} style={{ width: '120px' }} className={clsx(style.inputText, "outline-none")} placeholder='20' />
                                                </IconField>
                                            </div>
                                    }
                                </div>

                                {/* <div className={`${style.typeBorder} ${style.paymentType}`}>
                                    <label className={clsx(style.lable)}>Time</label>
                                    <div className={style.paymentmain}>
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
                                    {errors?.time_type && (
                                        <p className="error-message mb-0">{"Time is required"}</p>
                                    )}
                                </div> */}
                            </div>

                        </div>
                    </div>
                    <div className={style.bottom}>
                        {
                            id ?
                                <Button onClick={handleDelete} className='danger-outline-button'>{deleteMutation.isPending ? "Loading..." : "Delete Template"}</Button>
                                : <span></span>
                        }
                        <div className='d-flex gap-2'>
                            <Link to={'/settings/templates/job-templates/'}>
                                <Button className='outline-button'>Cancel</Button>
                            </Link>
                            <Button onClick={handleSubmit} className='solid-button'>{mutation.isPending ? "Loading..." : "Save Template"}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateJobTemplate;