import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronLeft, Eye, PencilSquare } from "react-bootstrap-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Editor } from 'primereact/editor';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { createEmailSignature, deleteEmailSignature, getEmailSignature, updateEmailSignature } from '../../../../../APIs/email-template';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import Sidebar from '../../Sidebar';
import style from '../job-template.module.scss';

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

const CreateEmailSignatureTemplate = () => {
    const { trialHeight } = useTrialHeight();
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const has_work_subscription = !!profileData?.has_work_subscription;
    const has_twilio = !!profileData?.has_twilio;
    const navigate = useNavigate();
    const { id } = useParams();
    const editorRef = useRef(null);
    const [title, setTitle] = useState("");
    const [text, setText] = useState(null);
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('job-templates');
    const [showPreview, setShowPreview] = useState(false);
    const signatureQuery = useQuery({
        queryKey: ["getEmailSignature", id],
        queryFn: () => getEmailSignature(id),
        enabled: !!id,
        retry: 1,
    });
    const mutation = useMutation({
        mutationFn: (templateData) => (id ? updateEmailSignature(id, templateData) : createEmailSignature(templateData)),
        onSuccess: () => {
            toast.success("Template saved successfully!");
            navigate('/settings/templates/email-signatures/');
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            toast.error("Failed to save the template. Please try again.");
        },
    });
    const deleteMutation = useMutation({
        mutationFn: () => (id && deleteEmailSignature(id)),
        onSuccess: () => {
            toast.success("Template deleted successfully!");
            navigate('/settings/templates/email-signatures/');
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
        console.log(templateData);
        toast.error("The Email Signature API is currently being developed and is not available yet.");
        // mutation.mutate(templateData);
    };

    const handleDelete = () => {
        if (id) {
            deleteMutation.mutate();
        }
    };

    useEffect(() => {
        if (signatureQuery?.data) {
            setTitle(signatureQuery?.data?.title);
            setText(signatureQuery?.data?.text);
        }
    }, [signatureQuery?.data]);

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
                                <li className='menuActive'><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
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
                                {!has_twilio ? (
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <Tooltip className='TooltipOverlay width-300' id="tooltip-job-templates">
                                                Your Twilio account has not been set up yet.
                                            </Tooltip>
                                        }
                                    >
                                        <li style={{ opacity: '.5', cursor: 'not-allowed' }}><Link to="#">SMS Templates</Link></li>
                                    </OverlayTrigger>
                                ) : (
                                    <li><Link to="/settings/templates/sms-templates">SMS Templates</Link></li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Email Signature Preview Modal */}
                    <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="font-16 mb-0 p-2">{title || "Email Signature Preview"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className={style.emailPreviewContainer}>
                                <div className={style.emailPreviewHeader}>
                                    <div className={style.emailPreviewHeaderItem}>
                                        <strong>From:</strong> Your Name &lt;your.email@example.com&gt;
                                    </div>
                                    <div className={style.emailPreviewHeaderItem}>
                                        <strong>To:</strong> Recipient &lt;recipient@example.com&gt;
                                    </div>
                                    <div className={style.emailPreviewHeaderItem}>
                                        <strong>Subject:</strong> Email with Signature
                                    </div>
                                </div>
                                <div className={style.emailPreviewBody}>
                                    <p>Hello,</p>
                                    <p>This is a sample email message. Your actual email content would appear here.</p>
                                    <p>Best regards,</p>
                                    <div className={style.emailSignature}>
                                        {text ? (
                                            <div className={style.emailSignatureContent} dangerouslySetInnerHTML={{ __html: text }} />
                                        ) : (
                                            <p>No signature content yet. Please add your signature in the editor.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="outline-button" variant="secondary" onClick={() => setShowPreview(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className={`content_wrap_main mt-0`} style={{ background: '#F9FAFB', paddingBottom: `${trialHeight}px` }}>
                        <div className='content_wrapper d-block px-3' style={{ paddingTop: '24px', paddingBottom: '100px' }}>
                            <Link to='/settings/templates/email-signatures/' className={clsx(style.transparent, 'text-button border px-0')} style={{ width: "fit-content", marginBottom: '16px' }}>
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
                                    {signatureQuery?.isFetching ?
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
                                <label className={clsx(style.lable)}>Signature<span className="required">*</span></label>
                                <InputIcon style={{ position: 'absolute', right: '15px', top: '40px', zIndex: 1 }}>
                                    {signatureQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
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
                                <p className="error-message mb-0">{"Signature is required"}</p>
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
                            <Link to={'/settings/templates/email-signatures/'}>
                                <Button className='outline-button'>Cancel</Button>
                            </Link>
                            <Button onClick={() => setShowPreview(true)} className='outline-button'>
                                <Eye size={16} className="me-1" /> Preview
                            </Button>
                            <Button onClick={handleSubmit} className='solid-button'>{mutation.isPending ? "Loading..." : "Save Template"}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEmailSignatureTemplate;