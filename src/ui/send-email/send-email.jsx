import React, { useEffect, useState } from 'react';
import style from './send-email.module.scss';
import { Button, Col, Row } from 'react-bootstrap';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from "primereact/autocomplete";
import { InputTextarea } from "primereact/inputtextarea";

import { CountryService } from "./CountryService";
import { InputText } from 'primereact/inputtext';

const schema = yup
    .object({
        from: yup.string().required("From is required"),
    })
    .required();

const SendEmail = ({ show, setShow }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState(null);
    const [filteredCountries, setFilteredCountries] = useState(null);
    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filteredCountries;

            if (!event.query.trim().length) {
                _filteredCountries = [...countries];
            }
            else {
                _filteredCountries = countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCountries(_filteredCountries);
        }, 250);
    }
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data) => {

    }
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
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={() => setShow(false)}>Cancel</Button>
            <Button className='solid-button' onClick={() => { }}>Send {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px', color: '#fff' }} />}</Button>
        </div>
    );

    useEffect(() => {
        CountryService.getCountries().then((data) => setCountries(data));
    }, []);
    return (
        <div>
            <Dialog visible={show} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} style={{ width: '896px' }} onHide={handleClose}>
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
                                                options={[
                                                    { value: 'max@thead.com', label: "max@thead.com" },

                                                ] || []}
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(style.dropdownSelect, 'dropdown-height-fixed', { [style.error]: errors.category })}
                                                style={{ height: '46px' }}
                                                value={field.value}
                                                placeholder="Select from email"
                                            />
                                        )}
                                    />
                                    {errors.from && <p className="error-message">{errors.from.message}</p>}
                                </div>
                            </Col>
                            <Col sm={6}>
                                <div className="d-flex flex-column gap-1 mb-3">
                                    <label className={clsx(style.lable)}>Email Templates</label>
                                    <Controller
                                        name="payment_terms"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={[
                                                    { value: 'Template 1', label: "Template 1" },
                                                ] || []}
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(style.dropdownSelect, 'dropdown-height-fixed', { [style.error]: errors.category })}
                                                style={{ height: '46px' }}
                                                value={field.value}
                                                placeholder="Quote Template 1"
                                            />
                                        )}
                                    />
                                    {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <div className='d-flex gap-3 w-100 mb-3'>
                                    <div className={style.autoCompleteBox} style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D0D5DD', width: '30px', height: '25px', padding: '3px 4px', borderRadius: '6px', position: 'absolute', top: '11px', left: '14px', zIndex: 1 }}>
                                            <span style={{ color: '#344054', fontSize: '14px', fontWeight: 500 }}>TO</span>
                                        </div>
                                        <AutoComplete field="name" multiple value={selectedCountries} suggestions={filteredCountries} completeMethod={search} onChange={(e) => setSelectedCountries(e.value)} className={clsx(style.AutoComplete, 'w-100')} style={{ background: 'transparent' }} />
                                    </div>
                                    <Button className={style.box}>CC</Button>
                                    <Button className={style.box}>BCC</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.lable)}>Subject</label>
                                    <InputText className={clsx(style.inputBox)} placeholder='{Organization} | Quotation: {number} | {reference}' />
                                    {errors.subject && <p className="error-message">{errors.subject.message}</p>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.lable)}>Subject</label>
                                    <InputTextarea className={clsx(style.inputBox)} placeholder='{Organization} | Quotation: {number} | {reference}' rows={5} cols={30} />
                                    {errors.subject && <p className="error-message">{errors.subject.message}</p>}
                                </div>
                            </Col>
                        </Row>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}

export default SendEmail