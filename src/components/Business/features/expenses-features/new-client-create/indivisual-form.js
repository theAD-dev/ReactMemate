import clsx from 'clsx';
import { Button, Col, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useEffect, useState } from 'react'
import { PhoneInput } from 'react-international-phone';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from 'primereact/dropdown';

import styles from './new-expense-create.module.scss';
import { Plus } from 'react-bootstrap-icons';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
// import { getCities, getClientCategories, getCountries, getStates } from '../../../../../APIs/ClientsApi';


const schema = yup
    .object({
        searchsupplier: yup.string().required("Search for Supplier is required"),
    })
    .required();

const IndivisualForm = forwardRef(({ onSubmit, defaultValues }, ref) => {



    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });


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
                       <Button className={styles.expensesCreateNew}>Create New Suplier  <Plus size={24} color="#475467" /></Button>
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

            
            </Row>



         

        </form>
    )
})

export default IndivisualForm