import clsx from 'clsx';
import { Button, Col, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import styles from './expenses-form.module.scss';
import { Plus, Calendar3 } from 'react-bootstrap-icons';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { Link } from 'react-router-dom';


const schema = yup
    .object({
        searchsupplier: yup.string().required("Search for Supplier is required"),
    })
    .required();

const ExpensesForm = forwardRef(({ onSubmit, defaultValues }, ref) => {

    const [date, setDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });


    const [activeTab, setActiveTab] = useState("tab1");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <form ref={ref} onSubmit={handleSubmit(onSubmit)} >
            <Row className={clsx(styles.bgGreay, 'pt-3')}>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Supplier</label>
                        <IconField>
                            <InputIcon>{errors.searchsupplier && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("searchsupplier")} className={clsx(styles.inputText, { [styles.error]: errors.searchsupplier })} placeholder='Search for Supplier' />
                        </IconField>
                        {errors.searchsupplier && <p className="error-message">{errors.searchsupplier.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex justify-content-end text-md-end flex-column gap-1 mt-4 pt-3 mb-4">
                        <Link to={"/suppliers"}>
                            <Button className={styles.expensesCreateNew}>Create New Suplier  <Plus size={24} color="#475467" /></Button>
                        </Link>
                    </div>
                </Col>

                <Col sm={12}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Invoice/#Ref</label>
                        <IconField>
                            <InputIcon>{errors.invoice?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("invoice.title")} className={clsx(styles.inputText, { [styles.error]: errors.invoice?.title })} placeholder='Enter invoice reference' />
                        </IconField>
                        {errors.invoice?.title && <p className="error-message">{errors.invoice?.title?.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(styles.lable)}>Date</label>
                        <div className={styles.customCalendar}>
                            <Calendar
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.value)}
                                showIcon={false}
                                inputStyle={{ paddingRight: '2rem' }}
                            />
                            <span className={styles.customIcon}>
                                <Calendar3 size={20} color="#667085" />
                            </span>
                        </div>
                        {errors.invoice?.title && <p className="error-message">{errors.invoice?.title?.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(styles.lable)}>Due Date</label>
                        <div className={styles.customCalendar}>
                            <Calendar
                                id="duedate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.value)}
                                showIcon={false}
                                inputStyle={{ paddingRight: '2rem' }}
                            />
                            <span className={styles.customIcon}>
                                <Calendar3 size={20} color="#667085" />
                            </span>
                        </div>
                        {errors.invoice?.title && <p className="error-message">{errors.invoice?.title?.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(styles.lable)}>Total Amount</label>
                        <IconField>
                            <InputIcon>{errors.invoice?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("invoice.title")} className={clsx(styles.inputText, { [styles.error]: errors.invoice?.title })} placeholder='Enter total amount$' />
                        </IconField>
                        {errors.invoice?.title && <p className="error-message">{errors.invoice?.title?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>GST</label>
                        <Controller
                            name="gst"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        { value: 1, label: "GST Exclusive" },

                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    placeholder="Select GST"
                                />
                            )}
                        />
                        {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                    </div>
                </Col>


            </Row>
            <Row className={`mb-4 ${styles.expTotalRow}`}>
                <Col>
                    <div className={styles.CalItem}>
                        <div>
                            <span>Subtotal</span>
                            <strong>$ 1,996.90</strong>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className={styles.CalItem}>
                        <div>
                            <span>Tax</span>
                            <strong>$ 2,326.90</strong>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className={`${styles.CalItemActive} ${styles.CalItem}`}>
                        <div>
                            <span>Total</span>
                            <strong>$ 2,100.26</strong>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className={clsx(styles.bgGreay)}>
                <div>
                    <div className={`tabs ${styles.tabsExpenses}`}>
                        <button
                            className={activeTab === "tab1" ? `${styles.active}` : ""}
                            onClick={() => handleTabClick("tab1")}
                        >
                            Assign to order
                        </button>
                        <button
                            className={activeTab === "tab2" ? `${styles.active}` : ""}
                            onClick={() => handleTabClick("tab2")}
                        >
                            Assign to timeframe
                        </button>

                    </div>

                    <div className="tab-content">
                        {activeTab === "tab1" && <div>
                            <Col sm={8}>
                                <div className="d-flex flex-column gap-1 mt-4 mb-4">
                                    <label className={clsx(styles.lable)}>Expense time interval</label>
                                    <Controller
                                        name="gst"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={[
                                                    { value: 1, label: "Monthly" },

                                                ] || []}
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                                                style={{ height: '46px' }}
                                                value={field.value}
                                                placeholder="Select "
                                            />
                                        )}
                                    />
                                    {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                                </div>
                            </Col>

                        </div>}
                        {activeTab === "tab2" && <div>

                            <Col sm={8}>
                                <div className="d-flex flex-column gap-1 mt-4 mb-4">
                                    <label className={clsx(styles.lable)}>Expense time interval</label>
                                    <Controller
                                        name="gst"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={[
                                                    { value: 1, label: "Monthly" },

                                                ] || []}
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                                                style={{ height: '46px' }}
                                                value={field.value}
                                                placeholder="Select "
                                            />
                                        )}
                                    />
                                    {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                                </div>
                            </Col>
                        </div>}

                    </div>
                </div>

            </Row>

            <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>Account Code </label>
                        <Controller
                            name="gst"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        { value: 1, label: "Select" },

                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    placeholder="Select "
                                />
                            )}
                        />
                        {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>Department</label>
                        <Controller
                            name="gst"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        { value: 1, label: "Select" },

                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    placeholder="Select "
                                />
                            )}
                        />
                        {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                    </div>
                </Col>
            </Row>

        </form>
    )
})

export default ExpensesForm