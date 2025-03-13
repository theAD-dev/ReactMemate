import React, { useState, useEffect } from 'react';
import { PlusLg, PencilSquare } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import * as yup from 'yup';
import style from './customer.module.scss';
import { getCategoriesList, newCategories, readCategories, updateCategories, deleteCategories } from '../../../../APIs/industrieslist-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Sidebar from '../Sidebar';

const CustomersDiscountCategory = () => {
    const { trialHeight } = useTrialHeight();
    const [activeTab, setActiveTab] = useState('industries');
    const [selectedIndustryId, setSelectedIndustryId] = useState(null);

    const { data: industriesList, refetch } = useQuery({
        queryKey: ['industriesList'],
        queryFn: getCategoriesList,
        enabled: true,
    });

    const schema = yup.object({
        name: yup.string().required("Name is required"),
        value: yup.string().required("Value is required"),
    }).required();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name: '', value: '' },
    });

    const fetchIndustry = async (industryId) => {
        const industryData = await readCategories(industryId);
        setValue('name', industryData.name);
        setValue('value', industryData.value);
    };

    useEffect(() => {
        if (selectedIndustryId) {
            fetchIndustry(selectedIndustryId);
        }
    }, [selectedIndustryId]);

    const readIndustryQuery = useQuery({
        queryKey: ['industry', selectedIndustryId],
        queryFn: () => readCategories(selectedIndustryId),
        enabled: !!selectedIndustryId,
        onSuccess: (data) => {
            setValue('name', data.name);
            setValue('value', data.value);
        }
    });

    const handleEditClick = (industryId) => {
        setSelectedIndustryId(industryId);
        setVisible2(true);
    };

    const mutation = useMutation({
        mutationFn: (data) => newCategories(data),
        onSuccess: () => {
            refetch();
            handleClose();
        },
    });

    const updateIndustryMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!id) throw new Error('Industry ID is missing');
            return await updateCategories(id, data);
        },
        onSuccess: () => {
            refetch();
            handleClose();
        },
    });


    const deleteIndustryMutation = useMutation({
        mutationFn: async (id) => {
            if (!id) {
                throw new Error('Industry ID is missing');
            }
            return await deleteCategories(id);
        },
        onSuccess: () => {
            refetch();
            handleClose();
        },
    });


    const onSubmit = (data) => {
        if (selectedIndustryId) {
            updateIndustryMutation.mutate({ id: selectedIndustryId, data });
        } else {
            mutation.mutate(data);
        }
        handleClose();
    };

    const [visible2, setVisible2] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setVisible2(false);
        reset();
        setVisible(false);
        setSelectedIndustryId(null);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PencilSquare size={24} color="#17B26A" className='mb-3' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    Edit Category
                </span>
            </div>
        </div>
    );

    const headerElement1 = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PencilSquare size={24} color="#17B26A" className='mb-3' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    Create Category
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={() => deleteIndustryMutation.mutate(selectedIndustryId)}>
                Delete
            </Button>
            <Button className='solid-button' style={{ width: '132px' }} onClick={handleSubmit(onSubmit)}>Save Details</Button>
        </div>
    );
    const footerContent1 = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={handleClose}>Cancel</Button>
            <Button className='solid-button' style={{ width: '132px' }} onClick={handleSubmit(onSubmit)}>Save Details</Button>
        </div>
    );

    const editBody = (rowData) => {
        if (rowData.name === "Regular" || rowData.name === "regular") return "";
        return <PencilSquare onClick={() => handleEditClick(rowData.id)} style={{ cursor: 'pointer' }} size={24} color="#667085" />;
    };

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Customers Settings</h1>
                            <div className='contentMenuTab'>
                                <ul>
                                    <li><Link to="/settings/customerssettings/industries">Industries</Link></li>
                                    <li className='menuActive'><Link to="/settings/customerssettings/customers-discount-category">Customers Discount Category</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className={`content_wrap_main ${style.tablePrimeBar}`} style={{ paddingBottom: `${trialHeight}px` }}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <h2>Customers Discount Category</h2>
                                        <Button label="Add New" onClick={() => setVisible(true)}> <PlusLg color="#000000" size={20} /></Button>
                                    </div>
                                    <DataTable value={industriesList} tableStyle={{ minWidth: '50rem' }}>
                                        <Column field="name" header="Category Name" style={{ width: '70%' }}></Column>
                                        <Column field="value" header="Value" style={{ width: '376px' }} className='text-left'></Column>
                                        <Column field="edit" header="Edit" body={editBody} style={{ width: '56px' }} className='text-end'></Column>
                                    </DataTable>

                                    <Dialog visible={visible2} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
                                        <div className="d-flex flex-column">
                                            <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Category name</p>
                                            <InputText {...register('name')} className={style.inputBox} />
                                            {errors.name && <small className="p-error">{errors.name.message}</small>}
                                        </div>
                                        <div className="mt-3 d-flex flex-column">
                                            <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Value</p>
                                            <InputText {...register('value')} className={style.inputBox} />
                                            {errors.value && <small className="p-error">{errors.value.message}</small>}
                                        </div>
                                    </Dialog>

                                    <Dialog visible={visible} modal={true} header={headerElement1} footer={footerContent1} className={`${style.modal} custom-modal`} onHide={handleClose}>
                                        <div className="d-flex flex-column">
                                            <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Category name</p>
                                            <InputText {...register('name')} placeholder='Industry name' className={style.inputBox} />
                                            {errors.name && <small className="p-error">{errors.name.message}</small>}
                                        </div>
                                        <div className="mt-3 d-flex flex-column">
                                            <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Value</p>
                                            <InputText {...register('value')} placeholder='Category Value' className={style.inputBox} />
                                            {errors.value && <small className="p-error">{errors.value.message}</small>}
                                        </div>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomersDiscountCategory;
