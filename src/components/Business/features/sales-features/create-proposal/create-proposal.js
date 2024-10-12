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
import { getProposalsTemplate, getProposalsTemplates } from '../../../../../APIs/email-template';

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

const CreateProposal = ({ show, setShow }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [templateId, setTemplatedId] = useState(null);
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});

    console.log('sections: ', sections);
    const proposalTemplateQuery = useQuery({
        queryKey: ["proposalTemplate"],
        queryFn: getProposalsTemplates,
    });
    const proposalQuery = useQuery({
        queryKey: ["getProposal", templateId],
        queryFn: () => getProposalsTemplate(templateId),
        enabled: !!templateId,
        retry: 0,
    });
    const onSubmit = async () => { }
    const handleClose = () => setShow(false);
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
    const footerContent = (
        <div className='d-flex justify-content-between'>
            <Button className='text-button text-danger'>Cancel</Button>
            <div className="d-flex justify-content-end gap-2">
                <Button className="btn info-button" onClick={handleAddSection}>
                    Add  New Section <PlusLg color='#106B99' />
                </Button>
                <Button className="outline-button" onClick={() => {}}>
                    Create & Save
                </Button>
                <Button className="solid-button" onClick={onSubmit}>
                    Send Proposal{" "}
                    {isLoading && (
                        <ProgressSpinner
                            style={{ width: "20px", height: "20px", color: "#fff" }}
                        />
                    )}
                </Button>
            </div>
        </div>

    );

    useEffect(() => {
        if (templateId && proposalQuery?.data) {
            setSections(proposalQuery?.data?.sections);
        }
    }, [templateId, proposalQuery?.data])

    return (
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
                <Button className='outline-button w-fit mb-3'>Upload Image <Upload /></Button>
                <Accordion activeIndex={0}>
                    {sections?.filter(section => !section.delete)?.map((section, index) => (
                        <AccordionTab className={clsx(style.accordion, 'proposal-accordion')} header={`Paragraph ${index + 1}`}>
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
        </Dialog>
    )
}

export default CreateProposal