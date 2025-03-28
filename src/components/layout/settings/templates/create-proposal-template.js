import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronLeft, PencilSquare, PlusLg, Trash } from "react-bootstrap-icons";
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
import { deleteProposalTemplates, getProposalsTemplate } from '../../../../APIs/email-template';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Sidebar from '../Sidebar';

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
    const { trialHeight } = useTrialHeight();
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const has_work_subscription = !!profileData?.has_work_subscription;
    const [activeTab, setActiveTab] = useState('job-templates');
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [sections, setSections] = useState([{ title: "", description: "", delete: false }]);
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const proposalQuery = useQuery({
        queryKey: ["getProposal", id],
        queryFn: () => getProposalsTemplate(id),
        enabled: !!id,
        retry: 0,
    });

    const deleteMutation = useMutation({
        mutationFn: () => (id && deleteProposalTemplates(id)),
        onSuccess: () => {
            toast.success("Template deleted successfully!");
            navigate('/settings/templates/proposal-templates/');
        },
        onError: (error) => {
            console.error("Error deleting template:", error);
            toast.error("Failed to delete the template. Please try again.");
        },
    });

    const handleDelete = () => {
        if (id) {
            deleteMutation.mutate();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!name) newErrors.name = true;

        const sectionErrors = sections.map((section) => {
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
            const formData = new FormData();
            formData.append('name', name);
            console.log('sections: ', sections);

            sections.forEach((section, index) => {
                formData.append(`sections[${index}]title`, section.title);
                formData.append(`sections[${index}]description`, section.description);
                formData.append(`sections[${index}]delete`, !!section.delete);
                if (section.id) formData.append(`sections[${index}]id`, section.id);
            });

            const method = id ? 'PUT' : 'POST';
            const URL = id ? `${process.env.REACT_APP_BACKEND_API_URL}/settings/proposals/update/${id}/` : `${process.env.REACT_APP_BACKEND_API_URL}/settings/proposals/new/`;

            setIsLoading(true);
            const accessToken = localStorage.getItem("access_token");
            fetch(URL, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    setIsLoading(false);
                    if (data) {
                        toast.success("Template saved successfully!");
                        navigate('/settings/templates/proposal-templates/');
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error("Error saving template:", error);
                    toast.error("Failed to save the template. Please try again.");
                });
        }
    };

    const handleAddSection = () => {
        setSections([...sections, { title: "", description: "" }]);
    };

    const handleDeleteSection = (index) => {
        setSections((prevSections) =>
            prevSections.map((section, i) =>
                i === index ? { ...section, delete: true } : section
            )
        );
    };

    useEffect(() => {
        if (id && proposalQuery?.data) {
            setName(proposalQuery?.data?.name);
            setSections(proposalQuery?.data?.sections);
        }
    }, [id, proposalQuery?.data]);

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
                                <li className='menuActive'><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
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
                                <li><Link to="#">SMS Templates</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`content_wrap_main mt-0 ${style.createProposal}`} style={{ background: '#F9FAFB', paddingBottom: `${trialHeight}px` }}>
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

                            {sections?.filter(section => !section.delete)?.map((section, index) => (
                                <div key={index} className={style.section}>
                                    <h1 className={clsx(style.sectionName)}>Section {index + 1}</h1>
                                    <div className={clsx(style.deleteButton)} onClick={() => handleDeleteSection(index)}>
                                        <Trash color='#F04438' size={16} />
                                    </div>

                                    <div className="flex flex-column gap-2 w-100" style={{ marginBottom: '16px' }}>
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
                        {id ? (
                            <Button onClick={handleDelete} disabled={deleteMutation.isPending} className='danger-outline-button'>
                                Delete Template {deleteMutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                            </Button>
                        ) : (
                            <span></span>
                        )}
                        <div className='d-flex gap-2'>
                            <Link to={'/settings/templates/proposal-templates/'}>
                                <Button className='outline-button'>Cancel</Button>
                            </Link>
                            <Button onClick={handleSubmit} disabled={isLoading} className='solid-button'>
                                Save Template {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProposalTemplate;
