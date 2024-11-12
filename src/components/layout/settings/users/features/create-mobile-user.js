import clsx from 'clsx';
import { nanoid } from 'nanoid';
import style from '../users.module.scss';
import { CloudUpload, Envelope, FileText, PencilSquare, Person, PersonAdd, PersonPlus, PlusCircle, QuestionCircle } from 'react-bootstrap-icons';
import React, { useEffect, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { Card, Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createLocation, deleteLocation, updateLocation } from '../../../../../APIs/location-api';
import { ProgressSpinner } from 'primereact/progressspinner';
import FileUploader from '../../../../../ui/file-uploader/file-uploader';
import { getDesktopUser } from '../../../../../APIs/settings-user-api';
import { Skeleton } from 'primereact/skeleton';

const schema = yup
    .object({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().email('Invalid email address').required('Email is required'),
        hourly_rate: yup.string().required('Hourly rate is required'),
        payment_cycle: yup.string().required('Payment cycle is required'),
        // group: yup.string().required('Group is required'),
    })
    .required();

const CreateMobileUser = ({ visible, setVisible, id = null, setId, refetch }) => {
    const [show, setShow] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { control, register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const readDesktopUserQuery = useQuery({
        queryKey: ["readDesktopUser", id],
        queryFn: () => getDesktopUser(id),
        enabled: !!id,
        retry: 0,
    });

    const handleClose = () => {
        setVisible(false);
        setPhoto(null);
        reset({
            "firstName": "",
            "lastName": "",
            "email": "",
            "group": "",
            "payment_cycle": "7",
            "hourly_rate": ""
        });
    };

    const onSubmit = async (data) => {
        console.log('data: ', data);
        const formData = new FormData();

        formData.append("first_name", data.firstName);
        formData.append("last_name", data.lastName);
        formData.append("email", data.email);
        formData.append("payment_cycle", data.payment_cycle);
        formData.append("hourly_rate", data.hourly_rate);

        if (photo?.croppedImageBlob) {
            const photoHintId = nanoid(6);
            formData.append('photo', photo.croppedImageBlob, `${photoHintId}.jpg`);
        }

        let method = "POST"
        let URL = `${process.env.REACT_APP_BACKEND_API_URL}/settings/mobile-users/create/`;
        if (id) {
            method = "PUT"
            URL = `${process.env.REACT_APP_BACKEND_API_URL}/desktop-users/update/${id}/`
        }
        const accessToken = localStorage.getItem("access_token");
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
                toast.success(`Mobile user created successfully!`);
                refetch();
                return "success";
            } else {
                toast.error(`Failed to create the user. Please try again.`);
                return "error";
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error creating user:", error);
            toast.error(`Failed to create the user. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (readDesktopUserQuery?.data && id) {
            reset({
                "firstName": readDesktopUserQuery?.data?.['first_name'],
                "lastName": readDesktopUserQuery?.data?.['last_name'],
                "email": readDesktopUserQuery?.data?.['email'],
                "group": readDesktopUserQuery?.data?.['group'],
                "payment_cycle": readDesktopUserQuery?.data?.['payment_cycle'],
                "hourly_rate": readDesktopUserQuery?.data?.['hourly_rate'],
            });

            if (readDesktopUserQuery?.data?.photo) {
                setPhoto(readDesktopUserQuery?.data?.photo);
            }
        } else {
            setPhoto('');
            reset({
                "firstName": "",
                "lastName": "",
                "email": "",
                "group": "",
                "payment_cycle": "7",
                "hourly_rate": ""
            });
        }
    }, [readDesktopUserQuery?.data]);

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        {id
                            ? <PencilSquare size={24} color="#17B26A" className='mb-0' />
                            : <PlusCircle size={24} color="#17B26A" className='mb-0' />
                        }
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    Invite New Mobile User
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-between'>
            <span></span>
            <div className='d-flex justify-content-end gap-2'>
                <Button className='outline-button' onClick={handleClose}>Cancel</Button>
                <Button type='submit' onClick={handleSubmit(onSubmit)} className='solid-button'>
                    {id ? "Update" : "Send"} Invite
                    {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                </Button>
            </div>
        </div>
    );

    return (
        <Dialog visible={visible} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
            <div className="d-flex flex-column">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Row>
                        <Col sm={12}>
                            <div className={clsx(style.fileUploadBox, 'cursor-pointer')} onClick={() => setShow(true)}>
                                <div className={clsx(style.uploadedImgBox, 'rounded-circle')} style={{ background: 'linear-gradient(180deg, #F9FAFB 0%, #EDF0F3 100%)' }}>
                                    {photo ? <img src={photo?.croppedImageBase64 || photo} alt='profile-img' /> : <Person size={20} color='#667085' />}
                                </div>
                                <p className={clsx('mb-0', style.uploadedText1)}><span className={clsx('mb-0', style.uploadedText2)}>Click to upload</span></p>
                                <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                            </div>
                            <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} shape="round" />
                        </Col>

                        <Row className='mb-3'>
                            <Col>
                                <Card className={clsx(style.leftBoxParent, style.active)}>
                                    <Card.Body className='d-flex align-items-center gap-3 py-2'>
                                        <div className={style.leftbox}>
                                            <FileText color='#1AB2FF' size={24} />
                                        </div>
                                        <span className={style.leftboxText}>Contractor</span>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                            <Card className={clsx(style.leftBoxParent)}>
                                    <Card.Body className='d-flex align-items-center gap-3 py-2'>
                                        <div className={style.leftbox}>
                                            <PersonAdd color='#667085' size={24} />
                                        </div>
                                        <span className={style.leftboxText}>Employee</span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Col sm={6}>
                            {readDesktopUserQuery?.isFetching ?
                                <>
                                    <Skeleton width="20%" className='mb-2'></Skeleton>
                                    <Skeleton width="100%" height='3rem' className='mb-4'></Skeleton>
                                </>
                                : <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.label)}>First Name</label>
                                    <InputText {...register("firstName")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.firstName })} placeholder='Enter first name' />
                                    {errors?.firstName && <p className="error-message">{errors?.firstName?.message}</p>}
                                </div>
                            }
                        </Col>
                        <Col sm={6}>
                            {readDesktopUserQuery?.isFetching ?
                                <>
                                    <Skeleton width="20%" className='mb-2'></Skeleton>
                                    <Skeleton width="100%" height='3rem' className='mb-4'></Skeleton>
                                </>
                                :
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.label)}>Last Name</label>
                                    <InputText {...register("lastName")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.lastName })} placeholder='Enter last name' />
                                    {errors?.lastName && <p className="error-message">{errors?.lastName?.message}</p>}
                                </div>
                            }
                        </Col>

                        <Col sm={6}>
                            {readDesktopUserQuery?.isFetching ?
                                <>
                                    <Skeleton width="20%" className='mb-2'></Skeleton>
                                    <Skeleton width="100%" height='3rem' className='mb-4'></Skeleton>
                                </>
                                :
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.label)}>Hourly Rate</label>
                                    <IconField iconPosition="left">
                                        <InputIcon><span style={{ position: 'relative', top: '-4px' }}>$</span></InputIcon>
                                        <InputText {...register("hourly_rate")} keyfilter={"num"} onBlur={(e) => setValue('hourly_rate', parseFloat(e?.target?.value || 0).toFixed(2))} style={{ paddingLeft: '28px', paddingRight: '40px' }} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.hourly_rate })} placeholder='20' />
                                        <InputIcon>
                                            <QuestionCircle style={{ position: 'relative', top: '-4px', right: '30px' }} color='#98A2B3' size={16} />
                                        </InputIcon>
                                    </IconField>
                                    {errors?.hourly_rate && <p className="error-message">{errors?.hourly_rate?.message}</p>}
                                </div>
                            }
                        </Col>

                        <Col sm={6}>
                            {readDesktopUserQuery?.isFetching ?
                                <>
                                    <Skeleton width="20%" className='mb-2'></Skeleton>
                                    <Skeleton width="100%" height='3rem' className='mb-4'></Skeleton>
                                </>
                                :
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.label)}>Payment Cycle</label>
                                    <Controller
                                        name="payment_cycle"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={[
                                                    { value: "7", label: "WEEK" },
                                                    { value: "14", label: "TWO_WEEKS" },
                                                    { value: "28", label: "FOUR_WEEKS" },
                                                    { value: "1", label: "MONTH" },
                                                ]}
                                                className={clsx(style.dropdownSelect, 'dropdown-height-fixed', "outline-none")}
                                                placeholder="Select payment cycle"
                                                value={field.value}
                                                disabled
                                                style={{ height: '46px' }}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                    {errors?.payment_cycle && <p className="error-message">{errors?.payment_cycle?.message}</p>}
                                </div>
                            }
                        </Col>
                        <Col sm={6}>
                            {readDesktopUserQuery?.isFetching ?
                                <>
                                    <Skeleton width="20%" className='mb-2'></Skeleton>
                                    <Skeleton width="100%" height='3rem' className='mb-4'></Skeleton>
                                </>
                                :
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.label)}>Email</label>
                                    <IconField iconPosition="left">
                                        <InputIcon><Envelope style={{ position: 'relative', top: '-5px' }} size={20} color='#667085' /></InputIcon>
                                        <InputText {...register("email")} style={{ paddingLeft: '38px' }} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.email })} placeholder='company@email.com' />
                                    </IconField>
                                    {errors?.email && <p className="error-message">{errors?.email?.message}</p>}
                                </div>
                            }
                        </Col>
                        <Col sm={6}>
                            {readDesktopUserQuery?.isFetching ?
                                <>
                                    <Skeleton width="20%" className='mb-2'></Skeleton>
                                    <Skeleton width="100%" height='3rem' className='mb-4'></Skeleton>
                                </>
                                :
                                <div className="d-flex flex-column gap-1 mb-4">
                                    <label className={clsx(style.label)}>Group</label>
                                    <InputText disabled {...register("group")} className={clsx(style.inputText, "outline-none")} placeholder='Select group' />
                                    {errors?.group && <p className="error-message">{errors?.group?.message}</p>}
                                </div>
                            }
                        </Col>
                    </Row>
                </form>
            </div>
        </Dialog>
    );
};

export default CreateMobileUser;
