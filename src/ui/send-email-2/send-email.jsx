import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Modal, Row } from "react-bootstrap";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { useMutation, useQuery } from "@tanstack/react-query";

import style from "./send-email.module.scss";
import { getEmail, getEmailTemplates, getOutgoingEmail } from '../../APIs/email-template';
import clsx from 'clsx';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { toast } from 'sonner';
import { createAndSendInvoiceById } from '../../APIs/management-api';

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

const SendDynamicEmailForm = ({ show, setShow, contactPersons, setPayload, isLoading, projectId, projectCardData, defaultTemplateId }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState([]);
    const [cc, setCC] = useState([]);
    const [bcc, setBCC] = useState([]);
    const [subject, setSubject] = useState(null);
    const [text, setText] = useState(null);

    const [errors, setErrors] = useState({});
    const [filteredEmails, setFilteredEmails] = useState([]);
    const autoCompleteRef = useRef(null);
    const autoCompleteRef2 = useRef(null);
    const autoCompleteRef3 = useRef(null);
    const [showCC, setShowCC] = useState(false);
    const [showBCC, setShowBCC] = useState(false);
    const handleClose = () => {
        setShow(false);
        setEmailTemplatedId(null);
    }
    const [emailTemplateId, setEmailTemplatedId] = useState(null);
    const emailTemplateQuery = useQuery({
        queryKey: ["emailTemplate"],
        queryFn: getEmailTemplates,
    });
    const outgoingEmailTemplateQuery = useQuery({
        queryKey: ["getOutgoingEmail"],
        queryFn: getOutgoingEmail,
    });
    const emailQuery = useQuery({
        queryKey: ["emailQuery", emailTemplateId],
        queryFn: () => getEmail(emailTemplateId),
        enabled: !!emailTemplateId,
        retry: 1,
    });

    useEffect(() => {
        if (outgoingEmailTemplateQuery?.data) {
            if (outgoingEmailTemplateQuery?.data?.outgoing_email)
                setFrom(outgoingEmailTemplateQuery?.data?.outgoing_email);
        }

        if (!emailTemplateId && emailTemplateQuery?.data && defaultTemplateId) {
            setEmailTemplatedId(defaultTemplateId);
        }

    }, [emailQuery, outgoingEmailTemplateQuery]);

    const mutation = useMutation({
        mutationFn: (data) => createAndSendInvoiceById(projectId, data),
        onSuccess: (response) => {
            handleClose();
            toast.success(`Invoice created and send successfully.`);
        },
        onError: (error) => {
            console.error('Error creating task:', error);
            toast.error(`Failed to create and send invoice. Please try again.`);
        }
    });

    const onSubmit = async () => {
        let errorCount = 0;
        setErrors({});

        if (!from) {
            ++errorCount;
            setErrors((others) => ({ ...others, from: true }));
        }

        if (to?.length === 0) {
            ++errorCount;
            setErrors((others) => ({ ...others, to: true }));
        }

        if (!subject) {
            ++errorCount;
            setErrors((others) => ({ ...others, subject: true }));
        }

        if (!text) {
            ++errorCount;
            setErrors((others) => ({ ...others, text: true }));
        }

        if (errorCount) return;

        mutation.mutate({
            subject,
            email_body: text,
            from_email: from,
            to: to?.toString(),
            ...(cc.length > 0 && { cc: cc.toString() }),
            ...(bcc.length > 0 && { bcc: bcc.toString() })
        })
    }

    const search = (event) => {
        const query = event?.query?.toLowerCase() || '';
        let emails = contactPersons.map((data) => (data.email));
        emails = emails.filter((email) => !to.includes(email));
        emails = emails.filter((email) => !cc.includes(email));
        emails = emails.filter((email) => !bcc.includes(email));

        emails = emails.filter((email) =>
            email.toLowerCase().includes(query)
        );

        setFilteredEmails(emails);
    };

    const onInputChange = (e) => {
        const currentValue = e.target.value;
        if (currentValue.includes(',') || e.key === 'Enter') {
            const emails = currentValue.split(/[\s,]+/).filter((email) => email);
            setTo((prev) => [...new Set([...prev, ...emails])]);
            e.target.value = '';
        }
    };

    const onInputChange2 = (e) => {
        const currentValue = e.target.value;
        if (currentValue.includes(',') || e.key === 'Enter') {
            const emails = currentValue.split(/[\s,]+/).filter((email) => email);
            setCC((prev) => [...new Set([...prev, ...emails])]);
            e.target.value = '';
        }
    };

    const onInputChange3 = (e) => {
        const currentValue = e.target.value;
        if (currentValue.includes(',') || e.key === 'Enter') {
            const emails = currentValue.split(/[\s,]+/).filter((email) => email);
            setBCC((prev) => [...new Set([...prev, ...emails])]);
            e.target.value = '';
        }
    };

    const onFocus = () => {
        search();
        if (autoCompleteRef.current) autoCompleteRef.current.show();
    };

    const onFocus2 = () => {
        search();
        if (autoCompleteRef2.current) autoCompleteRef2.current.show();
    };

    const onFocus3 = () => {
        search();
        if (autoCompleteRef3.current) autoCompleteRef3.current.show();
    };

    useEffect(() => {
        if (contactPersons?.length) {
            let emails = contactPersons.map((data) => (data.email))
            setFilteredEmails(emails);
        }
    }, [contactPersons])

    useEffect(() => {
        setPayload((prev) => ({
            ...prev,
            subject: subject,
            email_body: text,
            from_email: from,
            to: to?.toString(),
            ...(cc.length > 0 && { cc: cc.toString() }),
            ...(bcc.length > 0 && { bcc: bcc.toString() })
        }))
    }, [subject, text, from, to, cc, bcc]);

    useEffect(() => {
        setText(emailQuery?.data?.body || "");
        setSubject(emailQuery?.data?.subject);
        setErrors((others) => ({ ...others, subject: false }));
        setErrors((others) => ({ ...others, text: false }));
    }, [emailQuery?.data?.body]);
    return (
        <Modal
            show={show}
            centered
            onHide={handleClose}
            className='invoice-form'
            size='lg'
        >
            <Modal.Header closeButton>
                <div className={`${style.modalHeader}`}>
                    <div className="w-100 d-flex align-items-center gap-2">
                        <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                            Send email
                        </span>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={6} className='mb-3'>
                        <div style={{ position: 'relative' }}>
                            <label className={clsx(style.customLabel)}>FROM</label>
                            <Dropdown
                                options={
                                    (outgoingEmailTemplateQuery && outgoingEmailTemplateQuery?.data && ([{
                                        value: outgoingEmailTemplateQuery?.data?.outgoing_email,
                                        label: `${outgoingEmailTemplateQuery?.data?.outgoing_email}`,
                                    }])) ||
                                    []
                                }
                                className={clsx(
                                    style.dropdownSelect,
                                    "dropdown-height-fixed w-100"
                                )}
                                style={{ height: "46px", paddingLeft: '60px' }}
                                placeholder="Select from email"
                                onChange={(e) => {
                                    setFrom(e.value);
                                    setErrors((others) => ({ ...others, from: false }));
                                }}
                                value={from}
                            />
                        </div>
                        {errors?.from && (
                            <p className="error-message mb-0">{"From email is required"}</p>
                        )}
                    </Col>
                    <Col sm={6} className='mb-3'>
                        <div style={{ position: 'relative' }}>
                            <label className={clsx(style.customLabel)}>Templates</label>
                            <Dropdown
                                options={
                                    (emailTemplateQuery &&
                                        emailTemplateQuery.data?.map((emailTemplate) => ({
                                            value: emailTemplate.id,
                                            label: `${emailTemplate.name}`,
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
                                    setEmailTemplatedId(e.value);
                                }}
                                value={emailTemplateId}
                                loading={emailTemplateQuery?.isFetching}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className='mb-3'>
                        <div className="d-flex gap-3 w-100">
                            <div style={{ position: 'relative' }} className={style.autoCompleteBox}>
                                <div style={{ width: '50px' }} className={style.bag}></div>
                                <label className={clsx(style.customLabel)}>TO</label>
                                <AutoComplete
                                    ref={autoCompleteRef}
                                    value={to}
                                    completeMethod={search}
                                    onChange={(e) => {
                                        setTo(e.value);
                                        setErrors((others) => ({ ...others, to: false }));
                                    }}
                                    multiple
                                    suggestions={filteredEmails}
                                    onClick={onFocus}
                                    onFocus={onFocus}
                                    onKeyUp={onInputChange}
                                    onBlur={(e) => {
                                        const currentValue = e.target.value.trim();
                                        if (currentValue) {
                                            setTo((prev) => [...new Set([...prev, currentValue])]);
                                            e.target.value = '';
                                        }
                                    }}
                                    className={clsx(style.AutoComplete, "w-100")}
                                    placeholder="TO"
                                />
                            </div>
                            <Button
                                className={clsx(style.box, { [style.active]: showCC })}
                                onClick={() => { setShowCC(!showCC); setCC([]) }}
                            >
                                CC
                            </Button>
                            <Button
                                className={clsx(style.box, { [style.active]: showBCC })}
                                onClick={() => { setShowBCC(!showBCC); setBCC([]) }}
                            >
                                BCC
                            </Button>
                        </div>
                        {errors?.to && (
                            <p className="error-message mb-0">{"To email is required"}</p>
                        )}
                    </Col>
                    {
                        showCC &&
                        <Col sm={6} className='mb-3'>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '50px' }} className={style.bag}></div>
                                <label className={clsx(style.customLabel)}>CC</label>
                                <AutoComplete
                                    ref={autoCompleteRef2}
                                    value={cc}
                                    completeMethod={search}
                                    onChange={(e) => { setCC(e.value) }}
                                    multiple
                                    suggestions={filteredEmails}
                                    onClick={onFocus2}
                                    onFocus={onFocus2}
                                    onKeyUp={onInputChange2}
                                    onBlur={(e) => {
                                        const currentValue = e.target.value.trim();
                                        if (currentValue) {
                                            setCC((prev) => [...new Set([...prev, currentValue])]);
                                            e.target.value = '';
                                        }
                                    }}
                                    className={clsx(style.AutoComplete, "w-100")}
                                    placeholder="CC"
                                />
                            </div>
                        </Col>
                    }

                    {
                        showBCC && <Col sm={6} className='mb-3'>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '60px' }} className={style.bag}></div>
                                <label className={clsx(style.customLabel)}>BCC</label>
                                <AutoComplete
                                    ref={autoCompleteRef3}
                                    value={bcc}
                                    completeMethod={search}
                                    onChange={(e) => { setBCC(e.value) }}
                                    multiple
                                    suggestions={filteredEmails}
                                    onClick={onFocus3}
                                    onFocus={onFocus3}
                                    onKeyUp={onInputChange3}
                                    onBlur={(e) => {
                                        const currentValue = e.target.value.trim();
                                        if (currentValue) {
                                            setBCC((prev) => [...new Set([...prev, currentValue])]);
                                            e.target.value = '';
                                        }
                                    }}
                                    className={clsx(style.AutoComplete, style.bcc, "w-100")}
                                    placeholder="BCC"
                                />
                            </div>
                        </Col>
                    }
                    <Col sm={12} className='mb-2'>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '60px' }} className={style.bag}></div>
                            <label className={clsx(style.customLabel)}>SUBJECT</label>
                            <IconField>
                                <InputIcon>
                                    {emailQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                                </InputIcon>
                                <InputText
                                    value={subject}
                                    className={clsx(style.inputBox, 'w-100')}
                                    style={{ paddingLeft: '100px' }}
                                    onChange={(e) => {
                                        setSubject(e.target.value);
                                        setErrors((others) => ({ ...others, subject: false }));
                                    }}
                                    placeholder="{Organization} | Quotation: {number} | {reference}"
                                />
                            </IconField>
                        </div>
                        {errors?.subject && (
                            <p className="error-message mb-0">{"Subject is required"}</p>
                        )}
                    </Col>
                    <Col sm={12}>
                        <div className="d-flex flex-column gap-1" style={{ position: 'relative' }}>
                            <label className={clsx(style.lable)}>Message</label>
                            <InputIcon style={{ position: 'absolute', right: '15px', top: '40px', zIndex: 1 }}>
                                {emailQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                            </InputIcon>
                            <Editor
                                style={{ minHeight: "150px" }}
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
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-between'>
                <span></span>
                <div className="d-flex justify-content-end gap-2">
                    <Button className="outline-button" onClick={handleClose}>
                        Cancel{" "}
                    </Button>
                    <Button className="solid-button" onClick={() => {}}>
                        Send{" "}
                        {isLoading && (
                            <ProgressSpinner
                                style={{ width: "20px", height: "20px", color: "#fff" }}
                            />
                        )}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SendDynamicEmailForm