import React, { forwardRef, useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Calendar3 } from 'react-bootstrap-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import * as yup from 'yup';
import styles from './vehicle-form.module.scss';
import { getVehicle } from '../../../../APIs/assets-api';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";

const schema = yup.object({
    odometer_km: yup.number()
        .required("Odometer reading is required")
        .min(0, "Odometer cannot be negative"),
    date: yup.date()
        .required("Date is required")
        .nullable(),
    upcoming_date: yup.date()
        .required("Upcoming date is required")
        .min(yup.ref('date'), "Upcoming date must be after service date"),
    notes: yup.string()
        .max(500, "Notes must be at most 500 characters"),
});

const ServiceForm = forwardRef(({ onSubmit, defaultValues, setIsDisabled, setExpenseService, vehicleId }, ref) => {
    const getVehicleQuery = useQuery({
        queryKey: ['getVehicle', vehicleId],
        queryFn: () => getVehicle(vehicleId),
        enabled: !!vehicleId,
        staleTime: 0
    });
    const minOdometer = getVehicleQuery.data?.odometer_km || 0;

    const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            odometer_km: 0,
            cost: 0,
            ...defaultValues
        }
    });

    // Enable or disable submit button based on form validity
    const odometerValue = watch('odometer_km');
    const dateValue = watch('date');
    const upcomingDateValue = watch('upcoming_date');
    useEffect(() => {
        const isValid = odometerValue && dateValue && upcomingDateValue;
        setIsDisabled(!isValid);
        setExpenseService({
            odometer_km: odometerValue,
            date: dateValue,
            upcoming_date: upcomingDateValue,
            notes: watch('notes') || '',
        });
    }, [odometerValue, dateValue, upcomingDateValue, setIsDisabled]);

    return (
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12}>
                    <h2 className={styles.sectionTitle}>Service Information</h2>
                </Col>
            </Row>

            <Row className={clsx(styles.bgGreay)}>
                <Col sm={12}>
                    <div className="d-flex flex-column mb-4">
                        <label className={clsx(styles.lable)}>Odometer (Minimum {minOdometer} km) <span className='required'>*</span></label>
                        <div className={styles.inputGroup}>
                            <Controller
                                name="odometer_km"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        className={clsx(styles.inputText, { [styles.error]: errors.odometer_km }, 'p-0')}
                                        placeholder="Enter odometer reading"
                                        useGrouping={false}
                                        min={minOdometer + 1 || 0}
                                        key={minOdometer}
                                    />
                                )}
                            />
                            <span className={styles.unitText}>km</span>
                        </div>
                        {errors.odometer_km && <p className="error-message">{errors.odometer_km.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Date <span className='required'>*</span></label>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(e) => field.onChange(e.value)}
                                    showButtonBar
                                    placeholder='DD/MM/YYYY'
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    style={{ height: '46px' }}
                                    icon={<Calendar3 color='#667085' size={20} />}
                                    className={clsx(styles.inputText, { [styles.error]: errors.date }, 'p-0 outline-none')}
                                />
                            )}
                        />
                        {errors.date && <p className="error-message">{errors.date.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Upcoming Date <span className='required'>*</span></label>
                        <Controller
                            name="upcoming_date"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(e) => field.onChange(e.value)}
                                    showButtonBar
                                    placeholder='DD/MM/YYYY'
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    style={{ height: '46px' }}
                                    icon={<Calendar3 color='#667085' size={20} />}
                                    className={clsx(styles.inputText, { [styles.error]: errors.upcoming_date }, 'p-0 outline-none')}
                                />
                            )}
                        />
                        {errors.upcoming_date && <p className="error-message">{errors.upcoming_date.message}</p>}
                    </div>
                </Col>

                <Col sm={12}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Notes</label>
                        <IconField>
                            <InputIcon>{errors.notes && <img src={exclamationCircle} className='mb-3' alt="error" />}</InputIcon>
                            <InputTextarea
                                {...register("notes")}
                                className={clsx(styles.inputText, { [styles.error]: errors.notes })}
                                placeholder='Enter service notes'
                                rows={4}
                                autoResize
                            />
                        </IconField>
                        {errors.notes && <p className="error-message">{errors.notes.message}</p>}
                    </div>
                </Col>
            </Row>
        </form>
    );
});

export default ServiceForm;
