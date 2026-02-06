import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { Check2Circle, CloudUpload, InfoCircle, PlusLg, Trash } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from 'sonner';
import style from './create-proposal.module.scss';
import FileUploader from './file-uploader/file-uploader';
import { getProposalBySalesId, getProposalsTemplate, getProposalsTemplates } from '../../../../../APIs/email-template';
import { SunEditorComponent } from '../../../../../shared/ui/editor';
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

const CreateProposal = ({ show, setShow, refetch, contactPersons, isExist }) => {
    const { unique_id } = useParams();
    const op = React.useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSendModal, setShowSendModal] = useState(false);
    const [payload, setPayload] = useState({});

    const [templateId, setTemplatedId] = useState(null);
    const [sections, setSections] = useState([]);
    const [image, setImage] = useState(null);
    const [isTemplateChanged, setIsTemplateChanged] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const proposalTemplateQuery = useQuery({
        queryKey: ["proposalTemplate"],
        queryFn: getProposalsTemplates,
        staleTime: 0
    });

    const readProposalQuery = useQuery({
        queryKey: ["readProposal", unique_id],
        queryFn: () => getProposalBySalesId(unique_id),
        enabled: !!unique_id && isExist,
        retry: 0,
        staleTime: 0
    });

    useEffect(() => {
        if (readProposalQuery?.data) {
            setTemplatedId(readProposalQuery?.data?.template);
        }
    }, [readProposalQuery?.data]);

    const proposalQuery = useQuery({
        queryKey: ["getProposal", templateId],
        queryFn: () => getProposalsTemplate(templateId),
        enabled: !!templateId,
        retry: 0,
        staleTime: 0
    });
    const sendProposalAction = () => {
        // if (!templateId) return toast.error('Template is required');
        if (!unique_id) return toast.error('Id not found');
        let notdeletedSections = sections?.filter(section => !section.delete);
        if (!notdeletedSections?.length) return toast.error('Please add proposal content');

        const newErrors = {};
        const sectionErrors = sections?.filter(section => !section.delete)?.map((section) => {
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
    };
    const onSubmit = async (action) => {
        // if (!templateId) return toast.error('Template is required');
        if (!unique_id) return toast.error('Id not found');
        let notdeletedSections = sections?.filter(section => !section.delete);
        if (!notdeletedSections?.length) return toast.error('Please add proposal content');
        setErrors({});

        const newErrors = {};
        const sectionErrors = sections?.filter(section => !section.delete)?.map((section) => {
            const sectionError = {};

            if (!section.title) sectionError.title = true;
            if (!section.description) sectionError.description = true;
            return sectionError;
        });
        if (sectionErrors.some(sectionError => Object.keys(sectionError).length > 0)) {
            newErrors.sections = sectionErrors;
        }

        if (!image) {
            toast.error('Please add proposal cover photo');
            newErrors.image = true;
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const formData = new FormData();

            sections.forEach((section, index) => {
                formData.append(`sections[${index}]title`, section.title);
                formData.append(`sections[${index}]description`, section.description);
                formData.append(`sections[${index}]delete`, !!section.delete);
                if (readProposalQuery?.data && section.id) formData.append(`sections[${index}]id`, section.id);
            });
            if (templateId) formData.append('template', templateId);
            else formData.append('template', "");

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

            if (image?.croppedImageBlob) {
                const photoHintId = nanoid(6);
                formData.append('image', image?.croppedImageBlob, `${photoHintId}.jpg`);
            }
            const accessToken = localStorage.getItem("access_token");

            setIsLoading(true);
            let method = "POST";
            let URL = `${process.env.REACT_APP_BACKEND_API_URL}/proposals/new/${unique_id}/`;
            console.log('readProposalQuery?.data: ', readProposalQuery?.data);
            if (readProposalQuery?.data) {
                method = "PUT";
                URL = `${process.env.REACT_APP_BACKEND_API_URL}/proposals/update/${unique_id}/`;
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
    };
    const handleClose = () => {
        setShow(false);
        // setTemplatedId(null);
        // setSections([]);
        // setImage(null);
        // setFileName('');
        setShowSendModal(false);
    };
    const handleAddSection = () => {
        setSections([...sections, { title: "", description: "" }]);
    };
    const handleDeleteSection = (index, id) => {
        if (id) {
            setSections((prevSections) =>
                prevSections.map((section, i) =>
                    i === index ? { ...section, delete: true } : section
                )
            );
        } else {
            setSections((prevSections) =>
                prevSections.filter((section, i) => i !== index)
            );
        }
    };

    const footerContent = (
        <div className='d-flex justify-content-between'>
            <div className='d-flex align-items-center'>
                <Button className='text-button text-danger' onClick={handleClose}>Cancel</Button>
                <Button className='text-button' onClick={() => setIsPreviewOpen(!isPreviewOpen)}>{isPreviewOpen ? "Hide Preview" : "Show Preview"}</Button>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <Button className="btn info-button" onClick={handleAddSection}>
                    Add  New Section <PlusLg color='#106B99' />
                </Button>
                <Button className="outline-button" disabled={isLoading} onClick={onSubmit}>
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
        if (templateId && isTemplateChanged) {
            if (proposalQuery?.data?.image) {
                setImage({ croppedImageBase64: proposalQuery?.data?.image });
            }
            setSections([
                ...readProposalQuery?.data?.sections?.map(section => ({ ...section, delete: true })) || [],
                ...proposalQuery?.data?.sections?.map(({ id, ...rest }) => ({ ...rest })) || []
            ]);
        } else if (templateId === readProposalQuery?.data?.template) {
            if (readProposalQuery?.data?.image) {
                setImage({ croppedImageBase64: readProposalQuery?.data?.image });
            } else if (proposalQuery?.data?.image) {
                setImage({ croppedImageBase64: proposalQuery?.data?.image });
            }
            setSections(readProposalQuery?.data?.sections);
        }
    }, [templateId, proposalQuery?.data, readProposalQuery?.data]);

    return (
        <>
            <Dialog
                visible={show}
                modal={true}
                header={headerElement}
                footer={footerContent}
                className={`${style.modal} custom-modal`}
                style={{ width: "896px", minHeight: '90vh' }}
                onHide={handleClose}
            >
                {
                    isPreviewOpen ? (
                        <div className="px-4 py-4">
                            {sections
                                ?.filter(section => !section.delete)
                                ?.map((section, index) => (
                                    <div key={section?.id || index} className={clsx("mb-4", style.previewSection)}>
                                        <h4 style={{ marginBottom: 12 }}>
                                            {section.title || `Paragraph ${index + 1}`}
                                        </h4>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: section.description || ''
                                            }}
                                        />
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <>
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
                                                setImage(null);
                                                setIsTemplateChanged(true);
                                            }}
                                            value={templateId}
                                            loading={proposalTemplateQuery?.isFetching}
                                            showClear
                                            scrollHeight="380px"
                                            filter
                                            filterInputAutoFocus={true}
                                        />
                                        <div className={style.templateInfo} onClick={(e) => op.current.toggle(e)}>
                                            <InfoCircle size={16} color='#737374ff' />
                                        </div>
                                        <OverlayPanel ref={op}>
                                            <p className='font-12' style={{ color: '#344054', lineHeight: '18px' }}>Choose from your existing templates here.</p>
                                            <div className='font-12' style={{ color: '#344054', lineHeight: '18px' }}>To edit or add new templates, go to<br /> Profile Settings &gt; Templates &gt; Proposal<br /> Templates.</div>
                                        </OverlayPanel>
                                    </div>
                                </Col >
                            </Row >
                            <div className='d-flex flex-column px-4'>
                                <div className='d-flex gap-3 justify-content-center align-items-center mb-1'>
                                    {
                                        image?.croppedImageBase64
                                            ?
                                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsVisible(true)}>
                                                <div className={style.imageBox} style={{ overflow: 'hidden', textAlign: 'center' }}>
                                                    <img
                                                        alt="uploaded-file"
                                                        src={image?.croppedImageBase64}
                                                        style={{ width: "100%", height: "100#" }}
                                                    />
                                                </div>
                                                <div className={clsx(style.trashBox, 'cursor-pointer')} onClick={(e) => { e.stopPropagation(); setImage(null); }}>
                                                    <Trash color='#F04438' size={16} />
                                                </div>
                                            </div>
                                            : <div className={style.uploadBox} style={{ cursor: 'pointer' }} onClick={() => setIsVisible(true)}>
                                                <div className={style.uploadButton}>
                                                    <CloudUpload color='#475467' size={20} />
                                                </div>
                                                <p className={style.uploadText}>Click to upload</p>
                                            </div>
                                    }
                                </div>
                                <FileUploader show={isVisible} setShow={setIsVisible} setPhoto={setImage} />
                                {errors?.image && (
                                    <p className="error-message mb-2 mx-auto">{"Image is required"}</p>
                                )}
                                <Accordion activeIndex={0} className='mt-3'>
                                    {sections?.map((section, originalIndex) => ({ ...section, originalIndex }))?.filter(section => !section.delete)?.map((section, index) => (
                                        <AccordionTab key={section?.id || `accordion-${index}`} className={clsx(style.accordion, { [style.error]: (errors?.sections?.[index]?.title || errors?.sections?.[index]?.description) ? true : false }, 'proposal-accordion')} header={`Paragraph ${index + 1}`}>
                                            <div className="flex flex-column gap-2 w-100" style={{ marginBottom: '16px' }}>
                                                <label className={style.label}>Paragraph title</label>
                                                <IconField>
                                                    <InputIcon>
                                                        {proposalQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                                    </InputIcon>
                                                    <InputText
                                                        value={section?.title}
                                                        className={clsx(style.inputBox, 'w-100 border mt-2')}
                                                        onChange={(e) => {
                                                            setSections(prevSections => {
                                                                const newSections = [...prevSections];
                                                                newSections[section?.originalIndex] = { ...newSections[section?.originalIndex], title: e.target.value };
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
                                                <SunEditorComponent
                                                    value={section.description}
                                                    onChange={(content) => {
                                                        setSections(prevSections => {
                                                            const newSections = [...prevSections];
                                                            newSections[section?.originalIndex] = { ...newSections[section?.originalIndex], description: content };
                                                            return newSections;
                                                        });
                                                    }}
                                                    placeholder="Enter a description..."
                                                    height={299}
                                                    showTable={true}
                                                    showImage={true}
                                                    showLink={true}
                                                    showCodeView={true}
                                                    enableS3Upload={true}
                                                    uploadId={unique_id}
                                                />
                                                {errors?.sections?.[index]?.description && (
                                                    <p className="error-message mb-0">{"Message is required"}</p>
                                                )}
                                            </div>
                                            <div className='bg-white mt-2 pt-2 d-flex justify-content-end'>
                                                <Button className='danger-outline-button' onClick={() => handleDeleteSection(section?.originalIndex, section?.id)}>Delete Paragraph</Button>
                                            </div>
                                        </AccordionTab>
                                    ))}
                                </Accordion>
                            </div>
                        </>
                    )
                }

            </Dialog >
            <SendProposal show={showSendModal} setShow={setShowSendModal} contactPersons={contactPersons} setPayload={setPayload} onSubmit={onSubmit} handleClose={handleClose} />
        </>
    );
};

export default CreateProposal;