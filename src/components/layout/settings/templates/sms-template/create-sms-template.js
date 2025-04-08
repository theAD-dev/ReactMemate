import React, { useEffect, useRef, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronLeft, PencilSquare } from "react-bootstrap-icons";
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Editor } from 'primereact/editor';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { createSMSTemplate, deleteSMSTemplate, getSMS, updateSMSTemplate } from '../../../../../APIs/email-template';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import Sidebar from '../../Sidebar';
import style from '../job-template.module.scss';

const CreateSMSTemplate = () => {
    const { trialHeight } = useTrialHeight();
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const has_work_subscription = !!profileData?.has_work_subscription;
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const editorRef = useRef(null);
    const [title, setTitle] = useState("");
    const [text, setText] = useState(null);

    const isCustom = searchParams.get('isCustom');
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('job-templates');
    const smsQuery = useQuery({
        queryKey: ["getSMS", id],
        queryFn: () => getSMS(id),
        enabled: !!id,
        retry: 1,
    });
    const mutation = useMutation({
        mutationFn: (templateData) => (id ? updateSMSTemplate(id, templateData) : createSMSTemplate(templateData)),
        onSuccess: () => {
            toast.success("Template saved successfully!");
            navigate('/settings/templates/sms-templates/');
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            toast.error("Failed to save the template. Please try again.");
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => (id && deleteSMSTemplate(id)),
        onSuccess: () => {
            toast.success("Template deleted successfully!");
            navigate('/settings/templates/sms-templates/');
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
        if (!title) newErrors.title = true;
        if (!text) newErrors.text = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const templateData = {
            title,
            text,
        };
        mutation.mutate(templateData);
    };

    const handleDelete = () => {
        if (id) {
            deleteMutation.mutate();
        }
    };

    useEffect(() => {
        if (smsQuery?.data) {
            setTitle(smsQuery?.data?.title);
            setText(smsQuery?.data?.text);
        }
    }, [smsQuery?.data]);

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky' style={{ position: 'relative' }}>
                        <h1>Templates</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                <li><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                                {!has_work_subscription ? (
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <Tooltip className='TooltipOverlay width-300' id="tooltip-job-templates">
                                                Work environment is not available for this subscription type
                                            </Tooltip>
                                        }
                                    >
                                        <li style={{ opacity: '.5', cursor: 'not-allowed' }}><Link to="#">Job Templates</Link></li>
                                    </OverlayTrigger>
                                ) : (
                                    <li><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                                )}
                                <li className='menuActive'><Link to="#">SMS Templates</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`content_wrap_main mt-0`} style={{ background: '#F9FAFB', paddingBottom: `${trialHeight}px` }}>
                        <div className='content_wrapper d-block px-3' style={{ paddingTop: '24px', paddingBottom: '100px' }}>
                            <Link to='/settings/templates/sms-templates/' className={clsx(style.transparent, 'text-button border px-0')} style={{ width: "fit-content", marginBottom: '16px' }}>
                                <ChevronLeft color="#475467" size={20} /> <span style={{ color: '#475467' }}>Go Back</span>
                            </Link>

                            <div className='d-flex align-items-center w-100'>
                                {
                                    isEdit ? (
                                        <>
                                            <InputText onBlur={() => setIsEdit(false)} className={clsx(style.inputBox, style.templateName, style.transparent, 'me-2 p-0')} value={title} onChange={(e) => {
                                                setTitle(e.target.value);
                                                setErrors((others) => ({ ...others, title: false }));
                                            }} autoFocus
                                                placeholder='[ Template ]'
                                            />
                                        </>
                                    ) : <span className={clsx(style.templateName, 'me-2')}>{title || "[ Template Name ]"}</span>
                                }
                                <div style={{ width: '30px' }}>
                                    {smsQuery?.isFetching ?
                                        <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px' }} />
                                        : <PencilSquare color='#106B99' onClick={() => setIsEdit(true)} size={16} style={{ cursor: 'pointer' }} />
                                    }
                                </div>
                            </div>
                            {errors?.title && (
                                <p className="error-message mb-0">{"Title is required"}</p>
                            )}

                            <div className={style.divider}></div>

                            <div className="d-flex flex-column gap-1" style={{ position: 'relative' }}>
                                <label className={clsx(style.lable)}>Message<span className="required">*</span></label>
                                <InputIcon style={{ position: 'absolute', right: '15px', top: '40px', zIndex: 1 }}>
                                    {smsQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                </InputIcon>
                                <InputTextarea
                                    ref={editorRef}
                                    style={{ minHeight: "150px" }}
                                    value={text}
                                    placeholder='Enter a description...'
                                    onChange={(e) => {
                                        const newText = e.target.value.slice(0, 150); // Limit to 150 characters
                                        setText(newText);
                                        setErrors((others) => ({ ...others, text: false }));
                                    }}
                                />
                                <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '14px', color: '#6c757d' }}>
                                    {text?.length || 0}/150
                                </div>
                            </div>
                            {errors?.text && (
                                <p className="error-message mb-0">{"Message is required"}</p>
                            )}
                        </div>
                    </div>
                    <div className={style.bottom}>
                        {
                            id ?
                                <Button onClick={handleDelete} className='danger-outline-button ms-2'>{deleteMutation.isPending ? "Loading..." : "Delete Template"}</Button>
                                : <span></span>
                        }
                        <div className='d-flex gap-2'>
                            <Link to={'/settings/templates/sms-templates/'}>
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

export default CreateSMSTemplate;