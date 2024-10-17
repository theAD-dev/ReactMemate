import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from "react-bootstrap";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { useQuery } from "@tanstack/react-query";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Accordion, AccordionTab } from 'primereact/accordion';

import style from './create-proposal.module.scss';
import { Check2Circle, PlusLg, Upload } from 'react-bootstrap-icons';
import { getProposalBySalesId, getProposalsTemplate, getProposalsTemplates } from '../../../../../APIs/email-template';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import SendProposal from '../send-proposal/send-proposal';

const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="w-100 d-flex align-items-center gap-2">
            <b className={style.iconStyle}><Check2Circle size={24} color="#079455" /></b>
            <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                Proposal
            </span>
        </div>
    </div>
);

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

const CreateProposal = ({ show, setShow, refetch, contactPersons }) => {
    const { unique_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState('');
    const [errorIndex, setErrorIndex] = useState(null);
    const [showSendModal, setShowSendModal] = useState(false);
    const [payload, setPayload] = useState({});

    const [templateId, setTemplatedId] = useState(null);
    const [sections, setSections] = useState([]);
    const [image, setImage] = useState(null);

    const proposalTemplateQuery = useQuery({
        queryKey: ["proposalTemplate"],
        queryFn: getProposalsTemplates,
    });

    const readProposalQuery = useQuery({
        queryKey: ["readProposal", unique_id],
        queryFn: () => getProposalBySalesId(unique_id),
        enabled: !!unique_id,
        retry: 0,
    });

    useEffect(() => {
      if (readProposalQuery?.data) {
        console.log('read proposal: ', readProposalQuery?.data);
        setTemplatedId(readProposalQuery?.data?.template);
      }
    }, [readProposalQuery?.data])

    const proposalQuery = useQuery({
        queryKey: ["getProposal", templateId],
        queryFn: () => getProposalsTemplate(templateId),
        enabled: !!templateId,
        retry: 0,
    });
    const sendProposalAction = () => {
        if (!templateId) return toast.error('Template is required');
        if (!unique_id) return toast.error('Id not found');
        if (!sections?.length) return toast.error('Please add proposal content');

        const newErrors = {};
        const sectionErrors = sections.map((section, index) => {
            const sectionError = {};

            if (!section.title) sectionError.title = true;
            if (!section.description) sectionError.description = true;
            return sectionError;
        });
        if (sectionErrors.some(sectionError => Object.keys(sectionError).length > 0)) {
            newErrors.sections = sectionErrors;
        }

        // if (!image) {
        //     newErrors.image = true;
        // }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setShow(false);
            setShowSendModal(true);
        }
    }
    const onSubmit = async (action) => {
        if (!templateId) return toast.error('Template is required');
        if (!unique_id) return toast.error('Id not found');
        if (!sections?.length) return toast.error('Please add proposal content');
        setErrors({});

        const newErrors = {};
        const sectionErrors = sections.map((section, index) => {
            const sectionError = {};

            if (!section.title) sectionError.title = true;
            if (!section.description) sectionError.description = true;
            return sectionError;
        });
        if (sectionErrors.some(sectionError => Object.keys(sectionError).length > 0)) {
            newErrors.sections = sectionErrors;
        }

        // if (!image) {
        //     newErrors.image = true;
        // }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();

            sections.forEach((section, index) => {
                formData.append(`sections[${index}]title`, section.title);
                formData.append(`sections[${index}]description`, section.description);
                formData.append(`sections[${index}]delete`, !!section.delete);
                if (readProposalQuery?.data) formData.append(`sections[${index}]id`, section.id);
            });
            formData.append('template', templateId)

            if (action === "send") {
                formData.append('action', 'send');
                formData.append('subject', payload?.subject);
                formData.append('email_body', payload?.email_body);
                formData.append('from_email', payload?.from_email);
                formData.append('to', payload?.to);
                if (payload?.cc) formData.append('cc', payload?.cc);
                if (payload?.bcc) formData.append('bcc', payload?.bcc);
            } else {
                formData.append('action', 'create');
            }

            if (image) formData.append('image', image);
            const accessToken = localStorage.getItem("access_token");

            setIsLoading(true);
            let method = "POST"
            let URL = `${process.env.REACT_APP_BACKEND_API_URL}/proposals/new/${unique_id}/`;
            if (readProposalQuery?.data) {
                method = "PUT"
                URL =  `${process.env.REACT_APP_BACKEND_API_URL}/proposals/update/${unique_id}/` 
            }
            try {
                setIsLoading(true);

                const response = await fetch(URL, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                const data = await response.json();
                setIsLoading(false);

                if (response.ok) {
                    handleClose();
                    toast.success(`Proposal ${action === 'send' ? 'created and send' : 'created'} successfully!`);
                    refetch();
                    readProposalQuery.refetch();
                    return "success";
                } else {
                    toast.error(`Failed to ${action === 'send' ? 'create and send' : 'create'} the proposal. Please try again.`);
                    return "error";
                }
            } catch (error) {
                setIsLoading(false);
                console.error("Error creating proposal:", error);
                toast.error(`Failed to ${action === 'send' ? 'create and send' : 'create'} the proposal. Please try again.`);
                return "error";
            } finally {
                setIsLoading(false);
            }
        }
    }
    const handleClose = () => {
        setShow(false);
        // setTemplatedId(null);
        // setSections([]);
        // setImage(null);
       // setFileName('');
        setShowSendModal(false);
    }
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
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setFileName(file.name);
        }
    };
    const footerContent = (
        <div className='d-flex justify-content-between'>
            <Button className='text-button text-danger' onClick={handleClose}>Cancel</Button>
            <div className="d-flex justify-content-end gap-2">
                <Button className="btn info-button" onClick={handleAddSection}>
                    Add  New Section <PlusLg color='#106B99' />
                </Button>
                <Button className="outline-button" onClick={onSubmit}>
                    Create & Save
                    {isLoading && (
                        <ProgressSpinner
                            style={{ width: "20px", height: "20px", color: "#fff" }}
                        />
                    )}
                </Button>
                <Button className="solid-button" onClick={sendProposalAction}>
                    Send Proposal
                </Button>
            </div>
        </div>
    );

    useEffect(() => {
        if (templateId && templateId != readProposalQuery?.data?.template && proposalQuery?.data) {
            setSections(proposalQuery?.data?.sections);
        } else if (templateId === readProposalQuery?.data?.template) {
            setSections(readProposalQuery?.data?.sections);
        }
    }, [templateId, proposalQuery?.data, readProposalQuery?.data])

    return (
        <>
            <Dialog
                visible={show}
                modal={true}
                header={headerElement}
                footer={footerContent}
                className={`${style.modal} custom-modal p-0`}
                style={{ width: "896px" }}
                onHide={handleClose}
            >
                <Row className='px-4 pt-4 border-bottom mb-3 bg-white'>
                    <Col sm={12} className='mb-3'>
                        <div style={{ position: 'relative' }}>
                            <label className={clsx(style.customLabel)}>Templates</label>
                            <Dropdown
                                options={
                                    (proposalTemplateQuery &&
                                        proposalTemplateQuery.data?.map((template) => ({
                                            value: template.id,
                                            label: `${template.name}`,
                                        }))) ||
                                    []
                                }
                                className={clsx(
                                    style.dropdownSelect,
                                    "dropdown-height-fixed w-100"
                                )}
                                style={{ height: "46px", paddingLeft: '88px' }}
                                placeholder="Select template"
                                onChange={(e) => {
                                    setTemplatedId(e.value);
                                }}
                                value={templateId}
                                loading={proposalTemplateQuery?.isFetching}
                            />
                        </div>
                    </Col>
                </Row>
                <div className='d-flex flex-column px-4'>
                    <div className='d-flex gap-3 align-items-center mb-1'>
                        <Button className='outline-button w-fit' style={{ position: 'relative', cursor: 'pointer' }}>
                            Upload Image <Upload />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                }}
                            />
                        </Button>
                        {fileName && (
                            <span>{fileName}</span>
                        )}
                    </div>
                    {errors?.image && (
                        <p className="error-message mb-2">{"Image is required"}</p>
                    )}
                    <Accordion activeIndex={0} className='mt-3'>
                        {sections?.filter(section => !section.delete)?.map((section, index) => (
                            <AccordionTab key={section?.id} className={clsx(style.accordion, { [style.error]: (errors?.sections?.[index]?.title || errors?.sections?.[index]?.description) ? true : false }, 'proposal-accordion')} header={`Paragraph ${index + 1}`}>
                                <div className="flex flex-column gap-2 w-100" style={{ marginBottom: '16px' }}>
                                    <label className={style.label}>Paragraph title</label>
                                    <IconField>
                                        <InputIcon>
                                            {proposalQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                        </InputIcon>
                                        <InputText
                                            value={section?.title || ""}
                                            className={clsx(style.inputBox, 'w-100 border mt-2')}
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
                                <div className="d-flex flex-column gap-1 w-100 pb-2" style={{ position: 'relative' }}>
                                    <label className={clsx(style.lable)}>Paragraph</label>
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
                                    {errors?.sections?.[index]?.description && (
                                        <p className="error-message mb-0">{"Message is required"}</p>
                                    )}
                                </div>
                                <div className='bg-white mt-2 pt-2 d-flex justify-content-end'>
                                    <Button className='danger-outline-button' onClick={() => handleDeleteSection(index)}>Delete Paragraph</Button>
                                </div>
                            </AccordionTab>
                        ))}
                    </Accordion>
                </div>
            </Dialog >
            <SendProposal show={showSendModal} setShow={setShowSendModal} contactPersons={contactPersons} setPayload={setPayload} onSubmit={onSubmit} handleClose={handleClose}/>
        </>
    )
}

export default CreateProposal