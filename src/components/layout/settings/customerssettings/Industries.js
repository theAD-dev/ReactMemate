import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg, PencilSquare } from 'react-bootstrap-icons';
import style from './customer.module.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getIndustriesList, newIndustries,readIndustry ,updateIndustry,deleteIndustry} from '../../../../APIs/industrieslist-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const CustomersIndustries = () => {
    const [activeTab, setActiveTab] = useState('industries');
    const [selectedIndustryId, setSelectedIndustryId] = useState(null);

    
    const { data: industriesList, refetch } = useQuery({
        queryKey: ['industriesList'],
        queryFn: getIndustriesList,
        enabled: true,
    });

    const schema = yup.object({
        name: yup.string().required("Name is required"),
    }).required();

    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(yup.object({
            name: yup.string().required("Name is required"),
        }).required()),
        defaultValues: { name: '' },
    });


    const fetchIndustry = async (industryId) => {
        const industryData = await readIndustry(industryId);
        setValue('name', industryData.name);
    };

    useEffect(() => {
 
        if (selectedIndustryId) {
            fetchIndustry(selectedIndustryId);
        }
    }, [selectedIndustryId]);


    const readIndustryQuery = useQuery({
        queryKey: ['industry', selectedIndustryId],
        queryFn: () => readIndustryQuery(selectedIndustryId),
        enabled: !!selectedIndustryId,
        onSuccess: (data) => {
            setValue('name', data.name); 
        }
    });



    
    const handleEditClick = (industryId) => {
        setSelectedIndustryId(industryId);
        setVisible2(true);
    };


    const mutation = useMutation({
        mutationFn: (data) => newIndustries(data),
        onSuccess: () => {
            refetch();  
            handleClose();
        },
    });


    const updateIndustryMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            if (!id) {
                throw new Error('Industry ID is missing');
            }
            return await updateIndustry(id, data);
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
            return await deleteIndustry(id); 
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
                    Edit Industries
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
                    Create Industries
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

    const editBody = (rowData) => (
        <PencilSquare onClick={() => handleEditClick(rowData.id)} style={{ cursor: 'pointer' }} size={24} color="#667085" className='' />
    );

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Templates</h1>
                            <div className='contentMenuTab'>
                                <ul>
                                    <li className='menuActive'><Link to="/settings/customerssettings/industries">Industries</Link></li>
                                    <li><Link to="/settings/customerssettings/customers-discount-category">Customers Discount Category</Link></li>
                                </ul>
                            </div>
                        </div>
                    
                        <div className={`content_wrap_main ${style.tablePrimeBar}`}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <h2>Industries</h2>
                                        <Button label="Add New" onClick={() => setVisible(true)}> <PlusLg color="#000000" size={20} /></Button>
                                    </div>
                                    <DataTable value={industriesList} tableStyle={{ minWidth: '50rem' }}>
                                        <Column field="name" header="Industry Name" style={{ width: '100%' }}></Column>
                                        <Column field="edit" header="Edit" body={editBody} style={{ width: '56px' }} className='text-end'></Column>
                                    </DataTable>

                                    <Dialog visible={visible2} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
                                        <div className="d-flex flex-column">
                                            <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Industry name</p>
                                            <InputText {...register('name')}  className={style.inputBox} />
                                            {errors.name && <small className="p-error">{errors.name.message}</small>}
                                        </div>
                                    </Dialog>

                                    <Dialog visible={visible} modal={true} header={headerElement1} footer={footerContent1} className={`${style.modal} custom-modal`} onHide={handleClose}>
                                        <div className="d-flex flex-column">
                                            <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Industry name</p>
                                            <InputText {...register('name')} placeholder='Industry name' className={style.inputBox} />
                                            {errors.name && <small className="p-error">{errors.name.message}</small>}
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

export default CustomersIndustries;
