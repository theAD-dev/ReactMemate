import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { CloudUpload, Envelope, PencilSquare, PlusCircle } from 'react-bootstrap-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import { toast } from 'sonner';
import * as yup from 'yup';
import { getDesktopUser } from '../../../../../APIs/settings-user-api';
import FileUploader from '../../../../../ui/file-uploader/file-uploader';
import style from '../users.module.scss';

const schema = yup
    .object({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().email('Invalid email address').required('Email is required'),
        phone: yup.string().optional(),
        role: yup.string().required('Role is required'),
        privilege: yup.string().required('Privilege is required'),
        password: yup.string().required('Password is required'),
        repeatPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Repeat Password is required'),
    })
    .required();

const CreateDesktopUser = ({ visible, setVisible, id = null, setId, refetch, privilegeOptions }) => {
    const [show, setShow] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { control, register, reset, handleSubmit, formState: { errors } } = useForm({
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
        setId(null);
        setPhoto(null);
        reset({
            "firstName": "",
            "lastName": "",
            "email": "",
            "phone": "",
            "role": "",
            "privilege": "",
            "password": "",
            "repeatPassword": ""
        });
    };

    const onSubmit = async (data) => {
        console.log('data: ', data);
        const formData = new FormData();

        formData.append("first_name", data.firstName);
        formData.append("last_name", data.lastName);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("role", data.role);
        formData.append("privilege", data.privilege);
        formData.append("password", data.password);

        if (photo?.croppedImageBlob) {
            const photoHintId = nanoid(6);
            formData.append('photo', photo.croppedImageBlob, `${photoHintId}.jpg`);
        }

        let method = "POST";
        let URL = `${process.env.REACT_APP_BACKEND_API_URL}/desktop-users/new/`;
        if (id) {
            method = "PUT";
            URL = `${process.env.REACT_APP_BACKEND_API_URL}/desktop-users/update/${id}/`;
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
                toast.success(`Desktop user created successfully!`);
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
                "phone": readDesktopUserQuery?.data?.['phone'],
                "role": readDesktopUserQuery?.data?.['role'],
                "privilege": readDesktopUserQuery?.data?.['privilege'],
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
                "phone": "",
                "role": "",
                "privilege": "",
                "password": "",
                "repeatPassword": ""
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
                    {id ? 'Edit' : 'Add'} Desktop User
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
                    {id ? "Update" : "Save"} Details
                    {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                </Button>
            </div>
        </div>
    );

    const roleOptions = privilegeOptions?.map((data) => ({ label: data?.name || '', value: data?.id }));

    return (
        <Dialog visible={visible} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
            <div className="d-flex flex-column">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Row>
                        <Col sm={12}>
                            <div className={clsx(style.fileUploadBox, 'cursor-pointer')} onClick={() => setShow(true)}>
                                <div className={clsx(style.uploadedImgBox)}>
                                    {photo ? <img src={photo?.croppedImageBase64 || photo} alt='profile-img' /> : <CloudUpload size={20} color='#667085' />}
                                </div>
                                <p className={clsx('mb-0', style.uploadedText1)}><span className={clsx('mb-0', style.uploadedText2)}>Click to upload</span></p>
                                <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                            </div>
                            <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
                        </Col>
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
                                    <label className={clsx(style.label)}>Phone (optional)</label>
                                    <InputText {...register("phone")} className={clsx(style.inputText, "outline-none")} placeholder='Enter phone number' />
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
                                    <label className={clsx(style.label)}>Role</label>
                                    <InputText {...register("role")} className={clsx(style.inputText, "outline-none")} placeholder='Select role' />
                                    {errors?.role && <p className="error-message">{errors?.role?.message}</p>}
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
                                    <label className={clsx(style.label)}>Privilege</label>
                                    <Controller
                                        name="privilege"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={roleOptions}
                                                className={clsx(style.dropdownSelect, 'dropdown-height-fixed', "outline-none")}
                                                placeholder="Select privilege"
                                                value={field.value}
                                                style={{ height: '46px' }}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                    {errors?.privilege && <p className="error-message">{errors?.privilege?.message}</p>}
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
                                    <label className={clsx(style.label)}>Password</label>
                                    <InputText type="password" {...register("password")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.password })} placeholder='Enter password' />
                                    {errors?.password && <p className="error-message">{errors?.password?.message}</p>}
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
                                    <label className={clsx(style.label)}>Repeat Password</label>
                                    <InputText type="password" {...register("repeatPassword")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.repeatPassword })} placeholder='Repeat password' />
                                    {errors?.repeatPassword && <p className="error-message">{errors?.repeatPassword?.message}</p>}
                                </div>
                            }
                        </Col>
                    </Row>
                </form>
            </div>
        </Dialog>
    );
};

export default CreateDesktopUser;
