import React, { useEffect, useState } from "react";
import style from "./send-email.module.scss";
import { Button, Col, Row } from "react-bootstrap";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Editor } from "primereact/editor";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { InputTextarea } from "primereact/inputtextarea";
import { CountryService } from "./CountryService";
import { InputText } from "primereact/inputtext";
import { getEmail, getEmailTemplates } from "../../APIs/email-template";
import { useQuery } from "@tanstack/react-query";

const schema = yup
    .object({
        from: yup.string().required("From is required"),
    })
    .required();

const SendEmail = ({ show, setShow, contactPersons }) => {
    console.log('contactPersons: ', contactPersons);
    const [isLoading, setIsLoading] = useState(false);

    const [to, setTo] = useState([]);
    const [filteredTo, setFilteredTo] = useState([]);

    const [cc, setCC] = useState([]);
    const [filteredCC, setFilteredCC] = useState(contactPersons || []);

    const [bcc, setBCC] = useState([]);
    const [filteredBCC, setFilteredBCC] = useState(contactPersons || []);

    const [showCC, setShowCC] = useState(false); // State to manage CC input visibility
    const [showBCC, setShowBCC] = useState(false); // State to manage BCC input visibility

    const [text, setText] = useState(null);

    const [emailTemplateId, setEmailTemplatedId] = useState(null);
    const emailTemplateQuery = useQuery({
        queryKey: ["emailTemplate"],
        queryFn: getEmailTemplates,
    });
    const emailQuery = useQuery({
        queryKey: ["emailQuery", emailTemplateId],
        queryFn: () => getEmail(emailTemplateId),
        enabled: !!emailTemplateId,
        retry: 1,
    });

    useEffect(() => {
        setText(emailQuery?.data?.body || `<p>Enter a description...</p>`);
    }, [emailQuery?.data?.body]);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => { };

    const handleClose = () => setShow(false);

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex align-items-center gap-2">
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    Send a Quote
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end gap-2">
            <Button className="outline-button" onClick={() => setShow(false)}>
                Cancel
            </Button>
            <Button className="solid-button" onClick={() => { }}>
                Send{" "}
                {isLoading && (
                    <ProgressSpinner
                        style={{ width: "20px", height: "20px", color: "#fff" }}
                    />
                )}
            </Button>
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

    return (
        <div>
            <Dialog
                visible={show}
                modal={true}
                header={headerElement}
                footer={footerContent}
                className={`${style.modal} custom-modal`}
                style={{ width: "896px" }}
                onHide={handleClose}
            >
                <div className="d-flex flex-column">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={6}>
                                <div className="d-flex flex-column gap-1 mb-3">
                                    <label className={clsx(style.lable)}>FROM</label>
                                    <Controller
                                        name="from"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={
                                                    [
                                                        { value: "max@thead.com", label: "max@thead.com" },
                                                    ] || []
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(
                                                    style.dropdownSelect,
                                                    "dropdown-height-fixed",
                                                    { [style.error]: errors.category }
                                                )}
                                                style={{ height: "46px" }}
                                                value={field.value}
                                                placeholder="Select from email"
                                            />
                                        )}
                                    />
                                    {errors.from && (
                                        <p className="error-message">{errors.from.message}</p>
                                    )}
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="d-flex flex-column gap-1 mb-3">
                                    <label className={clsx(style.lable)}>Email Templates</label>
                                    <Controller
                                        name="emailTemplateId"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={
                                                    (emailTemplateQuery &&
                                                        emailTemplateQuery.data?.map((emailTemplate) => ({
                                                            value: emailTemplate.id,
                                                            label: `${emailTemplate.name}`,
                                                        }))) ||
                                                    []
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                    setEmailTemplatedId(e.value);
                                                }}
                                                className={clsx(
                                                    style.dropdownSelect,
                                                    "dropdown-height-fixed",
                                                    { [style.error]: errors.category }
                                                )}
                                                style={{ height: "46px" }}
                                                value={field.value}
                                                placeholder="Quote Template 1"
                                                loading={emailTemplateQuery?.isFetching}
                                            />
                                        )}
                                    />
                                    {errors.emailId && (
                                        <p className="error-message">{errors.emailId.message}</p>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <div className="d-flex gap-3 w-100 mb-3">
                                    <div
                                        className={style.autoCompleteBox}
                                        style={{ position: "relative" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                border: "1px solid #D0D5DD",
                                                width: "30px",
                                                height: "25px",
                                                padding: "3px 4px",
                                                borderRadius: "6px",
                                                position: "absolute",
                                                top: "11px",
                                                left: "14px",
                                                zIndex: 1,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#344054",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                TO
                                            </span>
                                        </div>
                                        <AutoComplete
                                            field="name"
                                            multiple
                                            value={to}
                                            suggestions={filteredTo}
                                            completeMethod={(e) => {
                                                let persons = contactPersons.map((person) => ({ name: person.email, code: person.email }))
                                                let filtered = persons.filter(person => person?.name?.toLowerCase().includes(e.query.toLowerCase()));
                                                setFilteredTo(filtered);
                                            }}
                                            onChange={(e) => setTo(e.value)}
                                            className={clsx(style.AutoComplete, "w-100")}
                                            placeholder="TO"
                                        />
                                    </div>
                                    <Button
                                        className={clsx(style.box, { [style.active]: showCC })}
                                        onClick={() => setShowCC(!showCC)}
                                    >
                                        CC
                                    </Button>
                                    <Button
                                        className={clsx(style.box, { [style.active]: showBCC })}
                                        onClick={() => setShowBCC(!showBCC)}
                                    >
                                        BCC
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                        {/* CC Input Field */}
                        {showCC && (
                            <Row>
                                <Col sm={12}>
                                    <div className="d-flex gap-3 w-100 mb-3">
                                        <div
                                            className={style.autoCompleteBox}
                                            style={{ position: "relative" }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    border: "1px solid #D0D5DD",
                                                    width: "30px",
                                                    height: "25px",
                                                    padding: "3px 4px",
                                                    borderRadius: "6px",
                                                    position: "absolute",
                                                    top: "11px",
                                                    left: "14px",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#344054",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    CC
                                                </span>
                                            </div>
                                            <AutoComplete
                                                field="name"
                                                multiple
                                                value={cc}
                                                suggestions={filteredCC}
                                                completeMethod={(e) => {
                                                    let persons = contactPersons.map((person) => ({ name: person.email, code: person.email }))
                                                    let filtered = persons.filter(person => person?.name?.toLowerCase().includes(e.query.toLowerCase()));
                                                    setFilteredCC(filtered);
                                                }}
                                                onChange={(e) => setCC(e.value)}
                                                className={clsx(style.AutoComplete, "w-100")}
                                                placeholder="CC"
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* BCC Input Field */}
                        {showBCC && (
                            <Row>
                                <Col sm={12}>
                                    <div className="d-flex gap-3 w-100 mb-3">
                                        <div
                                            className={style.autoCompleteBox}
                                            style={{ position: "relative" }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    border: "1px solid #D0D5DD",
                                                    width: "40px",
                                                    height: "25px",
                                                    padding: "3px 4px",
                                                    borderRadius: "6px",
                                                    position: "absolute",
                                                    top: "11px",
                                                    left: "14px",
                                                    zIndex: 1,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#344054",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    BCC
                                                </span>
                                            </div>
                                            <AutoComplete
                                                field="name"
                                                multiple
                                                value={bcc}
                                                suggestions={filteredBCC}
                                                completeMethod={(e) => {
                                                    let persons = contactPersons.map((person) => ({ name: person.email, code: person.email }))
                                                    let filtered = persons.filter(person => person?.name?.toLowerCase().includes(e.query.toLowerCase()));
                                                    setFilteredBCC(filtered);
                                                }}
                                                onChange={(e) => setBCC(e.value)}
                                                className={clsx(style.AutoComplete, style.bcc, "w-100")}
                                                placeholder="BCC"
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        <div className="d-flex flex-column gap-1 mb-3">
                            <label className={clsx(style.lable)}>Subject</label>
                            <InputText
                                value={emailQuery?.data?.subject}
                                className={clsx(style.inputBox)}
                                placeholder="{Organization} | Quotation: {number} | {reference}"
                            />
                        </div>

                        <div className="d-flex flex-column gap-1 mb-3">
                            <label className={clsx(style.lable)}>Message</label>
                            <Editor
                                style={{ height: "150px" }}
                                headerTemplate={header}
                                value={text}
                                onTextChange={(e) => setText(e.htmlValue)}
                            />
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    );
};

export default SendEmail;
