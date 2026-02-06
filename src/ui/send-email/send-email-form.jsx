import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { InfoCircle } from 'react-bootstrap-icons';
import { useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from 'primereact/overlaypanel';
import { ProgressSpinner } from "primereact/progressspinner";
import style from "./send-email.module.scss";
import { getEmail, getEmailTemplates, getOutgoingEmail, getSignatureTemplates } from '../../APIs/email-template';

const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="w-100 d-flex align-items-center gap-2">
            <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                Send email
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

const SendEmailForm = ({ show, setShow, contactPersons, setPayload, save, defaultTemplate = 'Quote' }) => {
    const op = useRef(null);
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState([]);
    const [cc, setCC] = useState([]);
    const [bcc, setBCC] = useState([]);
    const [subject, setSubject] = useState(null);
    const [text, setText] = useState(null);
    const [signature, setSignature] = useState(null);
    const [errors, setErrors] = useState({});
    const [filteredEmails, setFilteredEmails] = useState([]);
    const autoCompleteRef = useRef(null);
    const autoCompleteRef2 = useRef(null);
    const autoCompleteRef3 = useRef(null);
    const [showCC, setShowCC] = useState(false);
    const [showBCC, setShowBCC] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => setShow(false);

    // Email validation function
    const isValidEmail = useCallback((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }, []);

    // Validate array of emails
    const validateEmailArray = useCallback((emailArray) => {
        if (!emailArray || emailArray.length === 0) return true; // Empty array is valid
        return emailArray.every(email => isValidEmail(email));
    }, [isValidEmail]);

    // Get invalid emails from array
    const getInvalidEmails = useCallback((emailArray) => {
        if (!emailArray || emailArray.length === 0) return [];
        return emailArray.filter(email => !isValidEmail(email));
    }, [isValidEmail]);

    // Clean email array by removing invalid emails
    const cleanEmailArray = useCallback((emailArray) => {
        if (!emailArray || emailArray.length === 0) return [];
        return emailArray.filter(email => isValidEmail(email));
    }, [isValidEmail]);

    // Validate and clean all email fields
    const validateAndCleanAllEmails = useCallback(() => {
        let hasErrors = false;
        
        // Check TO emails
        if (to.length > 0) {
            const invalidToEmails = getInvalidEmails(to);
            if (invalidToEmails.length > 0) {
                console.log('Found invalid TO emails:', invalidToEmails);
                setTo(cleanEmailArray(to));
                hasErrors = true;
            }
        }
        
        // Check CC emails
        if (cc.length > 0) {
            const invalidCcEmails = getInvalidEmails(cc);
            if (invalidCcEmails.length > 0) {
                console.log('Found invalid CC emails:', invalidCcEmails);
                setCC(cleanEmailArray(cc));
                hasErrors = true;
            }
        }
        
        // Check BCC emails
        if (bcc.length > 0) {
            const invalidBccEmails = getInvalidEmails(bcc);
            if (invalidBccEmails.length > 0) {
                console.log('Found invalid BCC emails:', invalidBccEmails);
                setBCC(cleanEmailArray(bcc));
                hasErrors = true;
            }
        }
        
        return !hasErrors; // Return true if no errors found
    }, [to, cc, bcc, getInvalidEmails, cleanEmailArray]);

    const [emailTemplateId, setEmailTemplatedId] = useState(null);
    const emailTemplateQuery = useQuery({
        queryKey: ["emailTemplate"],
        queryFn: getEmailTemplates,
    });
    const signatureQuery = useQuery({
        queryKey: ["getSignatureTemplates"],
        queryFn: getSignatureTemplates,
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
            if (outgoingEmailTemplateQuery?.data?.outgoing_email && outgoingEmailTemplateQuery?.data?.outgoing_email_verified)
                setFrom(outgoingEmailTemplateQuery?.data?.outgoing_email);
            else
                setFrom('no-reply@memate.com.au');
        }

        if (emailTemplateQuery?.data) {
            const activeTemplateId = emailTemplateQuery?.data?.find((template) => template.type === defaultTemplate);
            if (activeTemplateId?.id) setEmailTemplatedId(activeTemplateId?.id);
        }

    }, [emailTemplateQuery, outgoingEmailTemplateQuery, defaultTemplate]);

    const onSubmit = async () => {
        let errorCount = 0;
        setErrors({});

        // First, validate and clean all email arrays
        const allEmailsValid = validateAndCleanAllEmails();
        if (!allEmailsValid) {
            console.log('Some emails were invalid and have been cleaned');
        }

        if (!from) {
            ++errorCount;
            setErrors((others) => ({ ...others, from: true }));
        }

        if (to?.length === 0) {
            ++errorCount;
            setErrors((others) => ({ ...others, to: true }));
        } else if (!validateEmailArray(to)) {
            ++errorCount;
            const invalidEmails = getInvalidEmails(to);
            console.log('Invalid TO emails:', invalidEmails);
            setErrors((others) => ({ ...others, to: true, toInvalid: true, invalidToEmails: invalidEmails }));
        }

        if (cc.length > 0 && !validateEmailArray(cc)) {
            ++errorCount;
            const invalidEmails = getInvalidEmails(cc);
            console.log('Invalid CC emails:', invalidEmails);
            setErrors((others) => ({ ...others, cc: true, invalidCcEmails: invalidEmails }));
        }

        if (bcc.length > 0 && !validateEmailArray(bcc)) {
            ++errorCount;
            const invalidEmails = getInvalidEmails(bcc);
            console.log('Invalid BCC emails:', invalidEmails);
            setErrors((others) => ({ ...others, bcc: true, invalidBccEmails: invalidEmails }));
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
        setIsLoading(true);
        await save();
        setIsLoading(false);
    };

    const footerContent = (
        <div className="d-flex justify-content-end gap-2">
            <Button className="outline-button" onClick={() => setShow(false)}>
                Cancel
            </Button>
            <Button disabled={isLoading} className="solid-button" onClick={onSubmit}>
                Send{" "}
                {isLoading && (
                    <ProgressSpinner
                        style={{ width: "20px", height: "20px", color: "#fff" }}
                    />
                )}
            </Button>
        </div>
    );

    const search = (event) => {
        const query = event?.query?.toLowerCase() || '';
        let emails = contactPersons.map((data) => (data.email)).filter(email => email);
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
            // Validate emails before adding
            const validEmails = emails.filter(email => isValidEmail(email));
            setTo((prev) => [...new Set([...prev, ...validEmails])]);
            // Clear error if emails are valid
            if (validEmails.length === emails.length && validEmails.length > 0) {
                setErrors((others) => ({ ...others, to: false, toInvalid: false }));
            }
            e.target.value = '';
        }
    };

    const onInputChange2 = (e) => {
        const currentValue = e.target.value;
        if (currentValue.includes(',') || e.key === 'Enter') {
            const emails = currentValue.split(/[\s,]+/).filter((email) => email);
            // Validate emails before adding
            const validEmails = emails.filter(email => isValidEmail(email));
            setCC((prev) => [...new Set([...prev, ...validEmails])]);
            // Clear error if emails are valid
            if (validEmails.length === emails.length) {
                setErrors((others) => ({ ...others, cc: false }));
            }
            e.target.value = '';
        }
    };

    const onInputChange3 = (e) => {
        const currentValue = e.target.value;
        if (currentValue.includes(',') || e.key === 'Enter') {
            const emails = currentValue.split(/[\s,]+/).filter((email) => email);
            // Validate emails before adding
            const validEmails = emails.filter(email => isValidEmail(email));
            setBCC((prev) => [...new Set([...prev, ...validEmails])]);
            // Clear error if emails are valid
            if (validEmails.length === emails.length) {
                setErrors((others) => ({ ...others, bcc: false }));
            }
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
            let emails = contactPersons.map((data) => (data.email)).filter(email => email);
            setFilteredEmails(emails);
        }
    }, [contactPersons]);

    useEffect(() => {
        setPayload((prev) => ({
            ...prev,
            subject: subject,
            email_body: text,
            from_email: from,
            to: to?.toString(),
            ...(cc.length > 0 && { cc: cc.toString() }),
            ...(bcc.length > 0 && { bcc: bcc.toString() }),
            ...(signature && { signature: signature })
        }));
    }, [subject, text, from, to, cc, bcc, signature, setPayload]);

    useEffect(() => {
        if (signatureQuery?.data) {
            setSignature(signatureQuery?.data?.find((template) => template.id === profileData.email_signature)?.id);
        }
    }, [signatureQuery?.data, profileData.email_signature]);

    useEffect(() => {
        setText(emailQuery?.data?.body || "");
        setSubject(emailQuery?.data?.subject);
        setErrors((others) => ({ ...others, subject: false }));
        setErrors((others) => ({ ...others, text: false }));
    }, [emailQuery?.data]);

    // Auto-clean invalid emails from arrays
    useEffect(() => {
        if (to.length > 0) {
            const invalidToEmails = getInvalidEmails(to);
            if (invalidToEmails.length > 0) {
                console.log('Auto-cleaning invalid TO emails:', invalidToEmails);
                const validEmails = cleanEmailArray(to);
                setTo(validEmails);
            }
        }
    }, [to, getInvalidEmails, cleanEmailArray]);

    useEffect(() => {
        if (cc.length > 0) {
            const invalidCcEmails = getInvalidEmails(cc);
            if (invalidCcEmails.length > 0) {
                console.log('Auto-cleaning invalid CC emails:', invalidCcEmails);
                const validEmails = cleanEmailArray(cc);
                setCC(validEmails);
            }
        }
    }, [cc, getInvalidEmails, cleanEmailArray]);

    useEffect(() => {
        if (bcc.length > 0) {
            const invalidBccEmails = getInvalidEmails(bcc);
            if (invalidBccEmails.length > 0) {
                console.log('Auto-cleaning invalid BCC emails:', invalidBccEmails);
                const validEmails = cleanEmailArray(bcc);
                setBCC(validEmails);
            }
        }
    }, [bcc, getInvalidEmails, cleanEmailArray]);
    return (
        <Dialog
            visible={show}
            modal={true}
            header={headerElement}
            footer={footerContent}
            className={`${style.modal} custom-modal`}
            style={{ width: "896px" }}
            onHide={handleClose}
        >
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
                            filterInputAutoFocus={true}
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
                            filterInputAutoFocus={true}
                            scrollHeight="380px"
                        />
                        <div className={style.templateInfo} onClick={(e) => op.current.toggle(e)}>
                            <InfoCircle size={16} color='#737374ff' />
                        </div>
                        <OverlayPanel ref={op}>
                            <p className='font-12' style={{ color: '#344054', lineHeight: '18px' }}>Choose from your existing templates here.</p>
                            <div className='font-12' style={{ color: '#344054', lineHeight: '18px' }}>To edit or add new templates, go to<br /> Profile Settings &gt; Templates &gt; Email<br /> Templates.</div>
                        </OverlayPanel>
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
                                    setErrors((others) => ({ ...others, to: false, toInvalid: false }));
                                }}
                                multiple
                                suggestions={filteredEmails}
                                onClick={onFocus}
                                onFocus={onFocus}
                                onKeyUp={onInputChange}
                                onBlur={(e) => {
                                    const currentValue = e.target.value.trim();
                                    if (currentValue) {
                                        if (isValidEmail(currentValue)) {
                                            setTo((prev) => [...new Set([...prev, currentValue])]);
                                            setErrors((others) => ({ ...others, to: false, toInvalid: false }));
                                        } else {
                                            setErrors((others) => ({ ...others, toInvalid: true }));
                                        }
                                        e.target.value = '';
                                    }
                                }}
                                className={clsx(style.AutoComplete, "w-100")}
                                placeholder="TO"
                            />
                        </div>
                        <Button
                            className={clsx(style.box, { [style.active]: showCC })}
                            onClick={() => { setShowCC(!showCC); setCC([]); }}
                        >
                            CC
                        </Button>
                        <Button
                            className={clsx(style.box, { [style.active]: showBCC })}
                            onClick={() => { setShowBCC(!showBCC); setBCC([]); }}
                        >
                            BCC
                        </Button>
                    </div>
                    {errors?.to && !errors?.toInvalid && (
                        <p className="error-message mb-0">{"To email is required"}</p>
                    )}
                    {errors?.toInvalid && (
                        <div>
                            <p className="error-message mb-0">{"Please enter valid email addresses for TO"}</p>
                            {errors?.invalidToEmails && errors.invalidToEmails.length > 0 && (
                                <p className="error-message mb-0 mt-1" style={{ fontSize: '12px', color: '#dc3545' }}>
                                    Invalid emails: {errors.invalidToEmails.join(', ')}
                                </p>
                            )}
                        </div>
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
                                onChange={(e) => { 
                                    setCC(e.value);
                                    setErrors((others) => ({ ...others, cc: false }));
                                }}
                                multiple
                                suggestions={filteredEmails}
                                onClick={onFocus2}
                                onFocus={onFocus2}
                                onKeyUp={onInputChange2}
                                onBlur={(e) => {
                                    const currentValue = e.target.value.trim();
                                    if (currentValue) {
                                        if (isValidEmail(currentValue)) {
                                            setCC((prev) => [...new Set([...prev, currentValue])]);
                                            setErrors((others) => ({ ...others, cc: false }));
                                        } else {
                                            setErrors((others) => ({ ...others, cc: true }));
                                        }
                                        e.target.value = '';
                                    }
                                }}
                                className={clsx(style.AutoComplete, "w-100")}
                                placeholder="CC"
                            />
                        </div>
                        {errors?.cc && (
                            <div>
                                <p className="error-message mb-0">{"Please enter valid email addresses for CC"}</p>
                                {errors?.invalidCcEmails && errors.invalidCcEmails.length > 0 && (
                                    <p className="error-message mb-0 mt-1" style={{ fontSize: '12px', color: '#dc3545' }}>
                                        Invalid emails: {errors.invalidCcEmails.join(', ')}
                                    </p>
                                )}
                            </div>
                        )}
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
                                onChange={(e) => { 
                                    setBCC(e.value);
                                    setErrors((others) => ({ ...others, bcc: false }));
                                }}
                                multiple
                                suggestions={filteredEmails}
                                onClick={onFocus3}
                                onFocus={onFocus3}
                                onKeyUp={onInputChange3}
                                onBlur={(e) => {
                                    const currentValue = e.target.value.trim();
                                    if (currentValue) {
                                        if (isValidEmail(currentValue)) {
                                            setBCC((prev) => [...new Set([...prev, currentValue])]);
                                            setErrors((others) => ({ ...others, bcc: false }));
                                        } else {
                                            setErrors((others) => ({ ...others, bcc: true }));
                                        }
                                        e.target.value = '';
                                    }
                                }}
                                className={clsx(style.AutoComplete, style.bcc, "w-100")}
                                placeholder="BCC"
                            />
                        </div>
                        {errors?.bcc && (
                            <div>
                                <p className="error-message mb-0">{"Please enter valid email addresses for BCC"}</p>
                                {errors?.invalidBccEmails && errors.invalidBccEmails.length > 0 && (
                                    <p className="error-message mb-0 mt-1" style={{ fontSize: '12px', color: '#dc3545' }}>
                                        Invalid emails: {errors.invalidBccEmails.join(', ')}
                                    </p>
                                )}
                            </div>
                        )}
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
                <Col sm={12} className='mb-3'>
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
                <Col sm={12}>
                    <div style={{ position: 'relative' }}>
                        <label className={clsx(style.customLabel)}>Signature</label>
                        <Dropdown
                            options={
                                (signatureQuery &&
                                    signatureQuery.data?.map((template) => ({
                                        value: template.id,
                                        label: `${template.name}`,
                                    }))) ||
                                []
                            }
                            panelClassName='px880-dropdown-item'
                            className={clsx(
                                style.dropdownSelect,
                                "dropdown-height-fixed w-100"
                            )}
                            style={{ height: "46px", paddingLeft: '88px' }}
                            placeholder="Select signature"
                            onChange={(e) => {
                                setSignature(e.value);
                            }}
                            value={signature}
                            loading={signatureQuery?.isFetching}
                            filterInputAutoFocus={true}
                        />
                    </div>
                </Col>
            </Row>
        </Dialog>
    );
};

export default SendEmailForm;