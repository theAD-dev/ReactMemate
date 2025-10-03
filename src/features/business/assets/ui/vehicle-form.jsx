import React, { forwardRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Calendar3 } from 'react-bootstrap-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import * as yup from 'yup';
import styles from './vehicle-form.module.scss';
import { getMobileUserList, getUserList } from '../../../../APIs/task-api';
import { useAuth } from '../../../../app/providers/auth-provider';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';

const schema = yup.object({
  organization: yup.number().required("Organization is required"),
  registration_number: yup.string()
    .required("Registration number is required")
    .min(1, "Registration number must be at least 1 character")
    .max(64, "Registration number must be at most 64 characters"),
  date_of_expiry: yup.date().nullable(),
  make: yup.string()
    .max(64, "Make must be at most 64 characters"),
  model: yup.string()
    .max(64, "Model must be at most 64 characters"),
  year_manufactured: yup.number()
    .nullable()
    .min(1900, "Year must be at least 1900")
    .max(2100, "Year must be at most 2100"),
  fuel_type: yup.string()
    .oneOf(["gasoline", "diesel", "hybrid", "electric", "hydrogen"], "Invalid fuel type"),
  vin_number: yup.string()
    .max(64, "VIN number must be at most 64 characters"),
  engine_number: yup.string()
    .max(64, "Engine number must be at most 64 characters"),
  date_of_purchase: yup.date().nullable(),
  purchased_amount: yup.number().nullable().min(0, "Purchase amount cannot be negative"),
  odometer_km: yup.number()
    .min(0, "Odometer cannot be negative")
    .max(2147483647, "Odometer value is too large"),
  driver: yup.number().nullable(),
  insurer: yup.string()
    .max(128, "Insurer must be at most 128 characters"),
  insurance_policy_number: yup.string()
    .max(128, "Insurance policy number must be at most 128 characters"),
  insurance_expiry: yup.date().nullable(),
  receipt_number: yup.string()
    .max(128, "Receipt number must be at most 128 characters"),
  etag: yup.string()
    .max(64, "Etag must be at most 64 characters"),
  colour: yup.string()
    .max(64, "Colour must be at most 64 characters"),
  body_type: yup.string()
    .oneOf(["sedan", "suv", "hatchback", "truck", "van", "other"], "Invalid body type"),
  trim: yup.string()
    .max(64, "Trim must be at most 64 characters"),
});

const VehicleForm = forwardRef(({ onSubmit, defaultValues }, ref) => {
  const { session } = useAuth();
  const usersList = useQuery({ queryKey: ['getUserList'], queryFn: getUserList });
  const mobileUsersList = useQuery({ queryKey: ['getMobileUserList'], queryFn: getMobileUserList });

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      organization: session?.organization?.id || null,
      odometer_km: 0,
      ...defaultValues
    }
  });

  const fuelTypeOptions = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'hydrogen', label: 'Hydrogen' }
  ];

  const bodyTypeOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={6}>
          <h2 className={styles.sectionTitle}>Vehicle Information</h2>
        </Col>
        <Col sm={6}>
          <div className="d-flex justify-content-end">
            <span style={{ color: '#667085', fontSize: '14px' }}>Vehicle ID: ELT-339047-1</span>
          </div>
        </Col>
      </Row>

      <Row className={clsx(styles.bgGreay)}>
        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Registration Number <span className='required'>*</span></label>
            <IconField>
              <InputIcon>{errors.registration_number && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("registration_number")}
                className={clsx(styles.inputText, { [styles.error]: errors.registration_number })}
                placeholder='Enter car registration number'
              />
            </IconField>
            {errors.registration_number && <p className="error-message">{errors.registration_number.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Date Of Expiry</label>
            <Controller
              name="date_of_expiry"
              control={control}
              render={({ field }) => (
                <Calendar
                  {...field}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(e) => field.onChange(e.value)}
                  showButtonBar
                  placeholder='DD/MM/YY'
                  dateFormat="dd/mm/yy"
                  showIcon
                  style={{ height: '46px' }}
                  icon={<Calendar3 color='#667085' size={20} />}
                  className={clsx(styles.inputText, { [styles.error]: errors.date_of_expiry }, 'p-0 outline-none')}
                />
              )}
            />
            {errors.date_of_expiry && <p className="error-message">{errors.date_of_expiry.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Make</label>
            <IconField>
              <InputIcon>{errors.make && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("make")}
                className={clsx(styles.inputText, { [styles.error]: errors.make })}
                placeholder='Enter car make'
              />
            </IconField>
            {errors.make && <p className="error-message">{errors.make.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Model</label>
            <IconField>
              <InputIcon>{errors.model && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("model")}
                className={clsx(styles.inputText, { [styles.error]: errors.model })}
                placeholder='Enter car model'
              />
            </IconField>
            {errors.model && <p className="error-message">{errors.model.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Year Manufactured</label>
            <Controller
              name="year_manufactured"
              control={control}
              render={({ field }) => (
                <Calendar
                  value={field.value ? new Date(field.value, 0, 1) : null}
                  onChange={(e) => {
                    const year = e.value ? e.value.getFullYear() : null;
                    field.onChange(year);
                  }}
                  view="year"
                  dateFormat="yy"
                  placeholder="YYYY"
                  showIcon
                  style={{ height: '46px' }}
                  icon={<Calendar3 color='#667085' size={20} />}
                  className={clsx(styles.inputText, { [styles.error]: errors.year_manufactured }, 'p-0 outline-none')}
                  yearRange="1900:2100"
                />
              )}
            />
            {errors.year_manufactured && <p className="error-message">{errors.year_manufactured.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Fuel Type</label>
            <Controller
              name="fuel_type"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={fuelTypeOptions}
                  onChange={(e) => field.onChange(e.value)}
                  className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.fuel_type })}
                  style={{ height: '46px' }}
                  value={field.value}
                  placeholder="Select fuel type"
                  scrollHeight="380px"
                />
              )}
            />
            {errors.fuel_type && <p className="error-message">{errors.fuel_type.message}</p>}
          </div>
        </Col>

        <Col sm={12}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>VIN Number</label>
            <IconField>
              <InputIcon>{errors.vin_number && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("vin_number")}
                className={clsx(styles.inputText, { [styles.error]: errors.vin_number })}
                placeholder='Enter VIN number'
              />
            </IconField>
            {errors.vin_number && <p className="error-message">{errors.vin_number.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Engine Number</label>
            <IconField>
              <InputIcon>{errors.engine_number && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("engine_number")}
                className={clsx(styles.inputText, { [styles.error]: errors.engine_number })}
                placeholder='Enter engine number'
              />
            </IconField>
            {errors.engine_number && <p className="error-message">{errors.engine_number.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Date of Purchase</label>
            <Controller
              name="date_of_purchase"
              control={control}
              render={({ field }) => (
                <Calendar
                  {...field}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(e) => field.onChange(e.value)}
                  showButtonBar
                  placeholder='DD/MM/YY'
                  dateFormat="dd/mm/yy"
                  showIcon
                  style={{ height: '46px' }}
                  icon={<Calendar3 color='#667085' size={20} />}
                  className={clsx(styles.inputText, { [styles.error]: errors.date_of_purchase }, 'p-0 outline-none')}
                />
              )}
            />
            {errors.date_of_purchase && <p className="error-message">{errors.date_of_purchase.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Purchased Amount</label>
            <IconField>
              <Controller
                name="purchased_amount"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    prefix="$"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    style={{ height: '46px', padding: '0px' }}
                    className={clsx(styles.inputText, { [styles.error]: errors.purchased_amount })}
                    placeholder='$ Enter purchase amount'
                    maxFractionDigits={2}
                    minFractionDigits={2}
                  />
                )}
              />
              <InputIcon>{errors.purchased_amount && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
            </IconField>
            {errors.purchased_amount && <p className="error-message">{errors.purchased_amount.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Odometer</label>
            <div className={styles.inputGroup}>
              <Controller
                name="odometer_km"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    className={clsx(styles.inputText, { [styles.error]: errors.odometer_km }, 'p-0 pe-5')}
                    placeholder="Enter ODO"
                    useGrouping={false}
                    min={0}
                    max={2147483647}
                  />
                )}
              />
              <span className={styles.unitText}>km</span>
            </div>
            {errors.odometer_km && <p className="error-message">{errors.odometer_km.message}</p>}
          </div>
        </Col>
      </Row>

      <h2 className={clsx(styles.headingInputs)}>Responsible Person</h2>
      <Row className={clsx(styles.bgGreay)}>
        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Person</label>
            <Controller
              name="driver"
              placeholder="Select a person"
              control={control}
              render={({ field }) => {
                const dropdownProps = {
                  ...field,
                  options: [
                    {
                      label: 'Desktop User',
                      items: usersList?.data?.users?.filter((user) => user?.is_active)?.map((user) => ({
                        value: user?.id,
                        label: `${user?.first_name} ${user?.last_name}` || user?.first_name || "-",
                        photo: user?.photo || "",
                        has_photo: user?.has_photo
                      })) || []
                    },
                    ...(session?.has_work_subscription
                      ? [
                        {
                          label: 'Mobile User',
                          items:
                            mobileUsersList?.data?.users
                              ?.filter((user) => user?.status !== 'disconnected')
                              ?.map((user) => ({
                                value: user?.id,
                                label: `${user?.first_name} ${user?.last_name}` || user?.first_name || "-",
                                photo: user?.photo || "",
                                has_photo: user?.has_photo,
                              })) || [],
                        },
                      ]
                      : []),
                  ],
                  onChange: (e) => {
                    field.onChange(e.value);
                  },
                  itemTemplate: (option) => {
                    return (
                      <div className='d-flex gap-2 align-items-center'>
                        <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                          <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={false} size={17} />
                        </div>
                        {option?.label}
                      </div>
                    );
                  },
                  className: clsx(styles.dropdownSelect, 'outline-none', { [styles.error]: errors.driver }),
                  style: { height: '46px' },
                  value: field.value,
                  placeholder: "Select a person",
                  filter: true,
                  filterInputAutoFocus: true,
                  optionGroupLabel: "label",
                  optionGroupChildren: "items",
                  scrollHeight: "400px"
                };

                // Only add valueTemplate if there's a selected value
                if (field.value) {
                  const selectedOption = dropdownProps.options
                    .flatMap(group => group.items)
                    .find(item => item.value === field.value);
                  
                  if (selectedOption) {
                    dropdownProps.valueTemplate = (option) => {
                      return <div className='d-flex gap-2 align-items-center ps-2' style={{ position: 'relative', left: '-10px' }}>
                        <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                          <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={false} size={17} />
                        </div>
                        {option?.label}
                      </div>;
                    };
                  }
                }

                return <Dropdown {...dropdownProps} />;
              }}
            />
            {errors.driver && <p className="error-message">{errors.driver.message}</p>}
          </div>
        </Col>
      </Row>

      <h2 className={clsx(styles.headingInputs)}>Insurance and Legal Information</h2>
      <Row className={clsx(styles.bgGreay)}>
        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Insurer</label>
            <IconField>
              <InputIcon>{errors.insurer && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("insurer")}
                className={clsx(styles.inputText, { [styles.error]: errors.insurer })}
                placeholder='Enter insurer'
              />
            </IconField>
            {errors.insurer && <p className="error-message">{errors.insurer.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Insurance Policy Number</label>
            <IconField>
              <InputIcon>{errors.insurance_policy_number && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("insurance_policy_number")}
                className={clsx(styles.inputText, { [styles.error]: errors.insurance_policy_number })}
                placeholder='Enter insurance policy number'
              />
            </IconField>
            {errors.insurance_policy_number && <p className="error-message">{errors.insurance_policy_number.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Insurance Expiry</label>
            <Controller
              name="insurance_expiry"
              control={control}
              render={({ field }) => (
                <Calendar
                  {...field}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(e) => field.onChange(e.value)}
                  showButtonBar
                  placeholder='DD/MM/YY'
                  dateFormat="dd/mm/yy"
                  showIcon
                  style={{ height: '46px' }}
                  icon={<Calendar3 color='#667085' size={20} />}
                  className={clsx(styles.inputText, { [styles.error]: errors.insurance_expiry }, 'p-0 outline-none')}
                />
              )}
            />
            {errors.insurance_expiry && <p className="error-message">{errors.insurance_expiry.message}</p>}
          </div>
        </Col>
      </Row>

      <h2 className={clsx(styles.headingInputs)}>Other</h2>
      <Row className={clsx(styles.bgGreay)}>
        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Receipt Number</label>
            <IconField>
              <InputIcon>{errors.receipt_number && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("receipt_number")}
                className={clsx(styles.inputText, { [styles.error]: errors.receipt_number })}
                placeholder='Enter invoice number'
              />
            </IconField>
            {errors.receipt_number && <p className="error-message">{errors.receipt_number.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Etag</label>
            <IconField>
              <InputIcon>{errors.etag && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("etag")}
                className={clsx(styles.inputText, { [styles.error]: errors.etag })}
                placeholder='Enter car etag'
              />
            </IconField>
            {errors.etag && <p className="error-message">{errors.etag.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Colour</label>
            <IconField>
              <InputIcon>{errors.colour && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("colour")}
                className={clsx(styles.inputText, { [styles.error]: errors.colour })}
                placeholder='White'
              />
            </IconField>
            {errors.colour && <p className="error-message">{errors.colour.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Body Type</label>
            <Controller
              name="body_type"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={bodyTypeOptions}
                  onChange={(e) => field.onChange(e.value)}
                  className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.body_type })}
                  style={{ height: '46px' }}
                  value={field.value}
                  placeholder="Select body type"
                  scrollHeight="380px"
                />
              )}
            />
            {errors.body_type && <p className="error-message">{errors.body_type.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Trim</label>
            <IconField>
              <InputIcon>{errors.trim && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText
                {...register("trim")}
                className={clsx(styles.inputText, { [styles.error]: errors.trim })}
                placeholder='Black'
              />
            </IconField>
            {errors.trim && <p className="error-message">{errors.trim.message}</p>}
          </div>
        </Col>
      </Row>
    </form>
  );
});

export default VehicleForm;