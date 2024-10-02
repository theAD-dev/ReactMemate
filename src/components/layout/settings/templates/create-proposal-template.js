import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { ChevronLeft, PencilSquare, PlusLg, Trash } from "react-bootstrap-icons";
import style from './job-template.module.scss';
import clsx from 'clsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Spinner } from 'react-bootstrap';
import { createEmailTemplate, createProposalTemplate, deleteEmailTemplates, getEmail, updateEmailTemplate } from '../../../../APIs/email-template';
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
        <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
        <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
        <button className="ql-align" value="" aria-label="Align Left"></button>
        <button className="ql-align" value="center" aria-label="Align Center"></button>
        <button className="ql-align" value="right" aria-label="Align Right"></button>
        <button className="ql-align" value="justify" aria-label="Justify"></button>
        <button className="ql-link" aria-label="Insert Link"></button>
        <button className="ql-image" aria-label="Insert Image"></button>
        <button className="ql-code-block" aria-label="Code Block"></button>
    </span>
);
const header = renderHeader();

const CreateProposalTemplate = () => {
    const [activeTab, setActiveTab] = useState('job-templates');
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [name, setName] = useState("");
    const [sections, setSections] = useState([{ title: "", description: "" }]);

    const isCustom = searchParams.get('isCustom');
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const proposalQuery = useQuery({
        queryKey: ["getEmail", id],
        queryFn: () => getEmail(id),
        enabled: !!id,
        retry: 1,
    });

    const deleteMutation = useMutation({
        mutationFn: () => (id && deleteEmailTemplates(id)),
        onSuccess: () => {
            toast.success("Template deleted successfully!");
            navigate('/settings/templates/proposal-templates/');
        },
        onError: (error) => {
            console.error("Error deleting template:", error);
            toast.error("Failed to delete the template. Please try again.");
        },
    });

    const mutation = useMutation({
        mutationFn: (templateData) => (id ? updateEmailTemplate(id, templateData) : createProposalTemplate(templateData)),
        onSuccess: (data) => {
            if (data){
                toast.success("Template saved successfully!");
                navigate('/settings/templates/proposal-templates/');
            }
        },
        onError: (error) => {
            console.error("Error saving template:", error);
            toast.error("Failed to save the template. Please try again.");
        },
    });

    const handleDelete = () => {
        if (id) {
            // deleteMutation.mutate()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!name) newErrors.name = true;

        const sectionErrors = sections.map((section, index) => {
            const sectionError = {};
            if (!section.title) sectionError.title = true;
            if (!section.description) sectionError.description = true;
            return sectionError;
        });


        if (sectionErrors.some(sectionError => Object.keys(sectionError).length > 0)) {
            newErrors.sections = sectionErrors;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {

            mutation.mutate({name, sections});

            const formData = new FormData();
            formData.append('name', name);
            // formData.append('sections', sections);
            console.log('sections: ', sections);

            sections.forEach((section, index) => {
                formData.append(`sections[${index}]title`, section.title);
                formData.append(`sections[${index}]description`, section.description);
            });
            const method = id ? 'PUT' : 'POST';

            const accessToken = localStorage.getItem("access_token");
            fetch(`${process.env.REACT_APP_BACKEND_API_URL}/settings/proposals/new/`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data){
                        toast.success("Template saved successfully!");
                        navigate('/settings/templates/proposal-templates/');
                    }
                })
                .catch((error) => {
                    console.error("Error saving template:", error);
                    toast.error("Failed to save the template. Please try again.");
                });
        }
    };

    const handleAddSection = () => {
        setSections([...sections, { title: "", description: "" }]);
    };

    const handleDeleteSection = (index) => {
        setSections((prevSections) => prevSections.filter((_, i) => i !== index));
    };

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
                                <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                <li className='menuActive'><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`content_wrap_main mt-0 ${style.createProposal}`} style={{ background: '#F9FAFB' }}>
                        <div className='content_wrapper d-block px-3' style={{ paddingTop: '24px', paddingBottom: '100px' }}>
                            <a href='/settings/templates/proposal-templates/' className={clsx(style.transparent, 'text-button border px-0')} style={{ width: "fit-content", marginBottom: '16px' }}>
                                <ChevronLeft color="#475467" size={20} /> <span style={{ color: '#475467' }}>Go Back</span>
                            </a>

                            <div className='d-flex align-items-center w-100'>
                                {isEdit ? (
                                    <InputText onBlur={() => setIsEdit(false)} className={clsx(style.inputBox, style.templateName, style.transparent, 'me-2 p-0')} value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder='[ Template ]' />
                                ) : (
                                    <span className={clsx(style.templateName, 'me-2')}>{name || "[ Template Name ]"}</span>
                                )}
                                <div style={{ width: '30px' }}>
                                    {proposalQuery?.isFetching ? (
                                        <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px' }} />
                                    ) : (
                                        <PencilSquare color='#106B99' onClick={() => setIsEdit(true)} size={16} style={{ cursor: 'pointer' }} />
                                    )}
                                </div>
                            </div>
                            {errors?.name && (
                                <p className="error-message mb-0">{"Name is required"}</p>
                            )}

                            <div className={style.divider}></div>

                            {sections.map((section, index) => (
                                <div key={index} className={style.section}>
                                    <h1 className={clsx(style.sectionName)}>Section {index + 1}</h1>
                                    <div className={clsx(style.deleteButton)} onClick={() => handleDeleteSection(index)}>
                                        <Trash color='#F04438' size={16} />
                                    </div>

                                    <div className="flex flex-column gap-2 w-100" style={{ marginBottom: '16px', marginBottom: "16px" }}>
                                        <label className={style.label}>Title</label>
                                        <IconField>
                                            <InputIcon>
                                                {proposalQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                            </InputIcon>
                                            <InputText
                                                value={section?.title || ""}
                                                className={clsx(style.inputBox, 'w-100')}
                                                onChange={(e) => {
                                                    setSections(prevSections => {
                                                        const newSections = [...prevSections];
                                                        newSections[index] = { ...newSections[index], title: e.target.value };
                                                        return newSections;
                                                    });
                                                }}
                                                placeholder="Section Title"
                                            />
                                        </IconField>
                                        {errors?.sections?.[index]?.title && (
                                            <p className="error-message mb-0">{"Title is required"}</p>
                                        )}
                                    </div>
                                    <div className="d-flex flex-column gap-1 w-100" style={{ position: 'relative' }}>
                                        <label className={clsx(style.lable)}>Message</label>
                                        <InputIcon style={{ position: 'absolute', right: '15px', top: '40px', zIndex: 1 }}>
                                            {proposalQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                        </InputIcon>
                                        <Editor
                                            style={{ minHeight: "299px" }}
                                            headerTemplate={header}
                                            value={section.description}
                                            placeholder='Enter a description...'
                                            onTextChange={(e) => {
                                                setSections(prevSections => {
                                                    const newSections = [...prevSections];
                                                    newSections[index] = { ...newSections[index], description: e.htmlValue };
                                                    return newSections;
                                                });
                                            }}
                                        />
                                    </div>
                                    {errors?.sections?.[index]?.description && (
                                        <p className="error-message mb-0">{"Message is required"}</p>
                                    )}
                                </div>
                            ))}

                            <Button onClick={handleAddSection} className={`outline-button mt-3 ${style.blueOutlineButton}`}>
                                Add  New Section <PlusLg color='#106B99' />
                            </Button>
                        </div>
                    </div>

                    <div className={style.bottom}>
                        {isCustom === "true" && id ? (
                            <Button onClick={handleDelete} className='danger-outline-button'>
                                {deleteMutation.isPending ? "Loading..." : "Delete Template"}
                            </Button>
                        ) : (
                            <span></span>
                        )}
                        <div className='d-flex gap-2'>
                            <Link to={'/settings/templates/proposal-templates/'}>
                                <Button className='outline-button'>Cancel</Button>
                            </Link>
                            <Button onClick={handleSubmit} className='solid-button'>
                                {mutation.isPending ? "Loading..." : "Save Template"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProposalTemplate;
