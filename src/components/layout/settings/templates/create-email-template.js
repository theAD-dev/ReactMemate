import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Sidebar';
import { ChevronLeft, PencilSquare } from "react-bootstrap-icons";
import style from './job-template.module.scss';
import clsx from 'clsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Spinner } from 'react-bootstrap';
import { createEmailTemplate, getEmail, updateEmailTemplate } from '../../../../APIs/email-template';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Editor } from 'primereact/editor';
import { toast } from 'sonner';

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

const CreateEmailTemplate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const editorRef = useRef(null);
    const [name, setName] = useState("");
    const [subject, setSubject] = useState(null);
    const [text, setText] = useState(null);

    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('job-templates');
    const emailQuery = useQuery({
        queryKey: ["getEmail", id],
        queryFn: () => getEmail(id),
        enabled: !!id,
        retry: 1,
    });
    const mutation = useMutation({
        mutationFn: (templateData) => (id ? updateEmailTemplate(id, templateData) : createEmailTemplate(templateData)),
        onSuccess: () => {
            toast.success("Template saved successfully!");
            navigate('/settings/templates/email-templates/');
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            toast.error("Failed to save the template. Please try again.");
        },
    });

    const insertTextAtCursor = (insertedText) => {
        const editorInstance = editorRef.current; // Get the editor instance

        if (editorInstance) {
            const currentHtmlValue = text || ""; // Get the current HTML content
            const selection = window.getSelection(); // Get the current selection
            const range = selection.getRangeAt(0); // Get the range at the cursor point

            // Create a document fragment to insert text at the current cursor position
            const textNode = document.createTextNode(insertedText);
            range.deleteContents(); // Remove any selected text
            range.insertNode(textNode); // Insert the new text node

            // Update the editor's HTML value in the state
            setText(editorInstance.innerHTML);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!subject) newErrors.subject = true;
        if (!text) newErrors.text = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const templateData = {
            name,
            subject,
            body: text,
        };
        mutation.mutate(templateData);
    }

    useEffect(() => {
        if (emailQuery?.data) {
            setName(emailQuery?.data?.name);
            setSubject(emailQuery?.data?.subject);
            setText(emailQuery?.data?.body)
        }
    }, [emailQuery?.data])

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky' style={{ position: 'relative' }}>
                        <h1>Templates</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                                <li className='menuActive'><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                <li><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`content_wrap_main mt-0`} style={{ background: '#F9FAFB' }}>
                        <div className='content_wrapper d-block px-3' style={{ paddingTop: '24px', paddingBottom: '100px' }}>
                            <Link to={'/settings/templates/email-templates/'}>
                                <Button className={clsx(style.transparent, 'text-button px-0')} style={{ marginBottom: '16px' }}>
                                    <ChevronLeft color="#475467" size={20} /> <span style={{ color: '#475467' }}>Go Back</span>
                                </Button>
                            </Link>

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
                                    {emailQuery?.isFetching ?
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
                                        {emailQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                    </InputIcon>
                                    <InputText
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
                                    {emailQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
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

                            <div className='d-flex gap-3 align-items-center' style={{ marginTop: '26px' }}>
                                <Button onClick={() => insertTextAtCursor("%NAME%")} className="outline-button">Name</Button>
                                <Button onClick={() => insertTextAtCursor("%EMAIL%")} className="outline-button">Email</Button>
                                <Button onClick={() => insertTextAtCursor("%PHONE%")} className="outline-button">Phone</Button>
                                <Button onClick={() => insertTextAtCursor("%NUMBER%")} className="outline-button">Number</Button>
                                <Button onClick={() => insertTextAtCursor("%PROJECT NUMBER%")} className="outline-button">Project Number</Button>
                                <Button onClick={() => insertTextAtCursor("%YOUR ORGANISATION%")} className="outline-button">Your Organisation</Button>
                                <Button onClick={() => insertTextAtCursor("%CLIENT ORGANISATION%")} className="outline-button">Client Organisation</Button>
                            </div>

                        </div>
                    </div>
                    <div className={style.bottom}>
                        <Link to={'/settings/templates/email-templates/'}>
                            <Button className='outline-button'>Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} className='solid-button'>{mutation.isPending ? "Loading..." : "Save Template"}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEmailTemplate