import React, { useState } from 'react';
import { PencilSquare } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import * as yup from 'yup';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { useAccountingGetQuery } from '../../../../entities/setting/accounting/department-turnover-plan/models/get-accounting-list.query';
import { useAccountingTargetUpdateMutations } from '../../../../entities/setting/accounting/department-turnover-plan/models/update-accounting-target.mutation';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Sidebar from '../Sidebar';
import style from './accounting.module.scss';

const schema = yup.object().shape({
    target: yup.number().typeError('Target must be a number').required('Target is required').positive('Target must be positive'),
});

const DepartmentTurnoverPlan = () => {
    const { trialHeight } = useTrialHeight();
    const [activeTab, setActiveTab] = useState('industries');
    const [selectedData, setSelectedData] = useState(null);
    const [visible, setVisible] = useState(false);
    const accountingListQuery = useAccountingGetQuery();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onEdit = (rowData) => {
        setSelectedData(rowData);
        setValue('target', rowData.target);
        setVisible(true);
    };

    const onCancel = () => {
        setVisible(false);
        setValue('target', '');
        setSelectedData(null);
    };

    const { mutate: updateTarget, isPending } = useAccountingTargetUpdateMutations();

    const onSubmit = (data) => {
        updateTarget({ id: selectedData?.id, data: { target: data.target } }, {
            onSuccess: () => {
                onCancel();
                accountingListQuery.refetch();
            }
        });
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
                    Edit Target
                </span>
            </div>
        </div>
    );

    const categoryBodyTemplate = (rowData) => {
        return <div className={"d-flex align-items-center justify-content-between show-on-hover"}>
            <span>{rowData.name}</span>
            <Button label="Edit" onClick={() => onEdit(rowData)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>;
    };

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Accounting</h1>
                            <div className='contentMenuTab'>
                                <ul>
                                    <li><Link to="/settings/accounting/expenses">Expenses</Link></li>
                                    <li className='menuActive'><Link to="/settings/accounting/department-turnover-plan">Department Turnover Plan</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className={`content_wrap_main w-100 ${style.tablePrimeBar}`} style={{ paddingBottom: `${trialHeight}px` }}>
                            <div className='content_wrapper w-100'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <h2>Department Turnover Plan</h2>
                                    </div>

                                    <DataTable className='w-100' value={accountingListQuery.data || []} tableStyle={{ minWidth: '100%', border: '1px solid #f2f2f2' }}>
                                        <Column field="name" header="Category Name" body={categoryBodyTemplate} style={{ width: '100%' }}></Column>
                                        <Column field="target" header="Target" body={(rowData) => `$${formatAUD(rowData.target)}`} style={{ width: '56px' }} className='text-end'></Column>
                                    </DataTable>
                                    <Dialog visible={visible} modal={true} header={headerElement} className={`${style.modal} custom-modal`} onHide={() => setVisible(false)}>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="d-flex flex-column mb-4">
                                                <h6 className='mb-3' style={{ fontSize: '16px', color: '#1D2939', fontWeight: 600 }}>{selectedData?.name}</h6>
                                                <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Target</p>
                                                <InputText {...register('target')} className={style.inputBox} />
                                                {errors.target && <small className="p-error">{errors.target.message}</small>}
                                            </div>
                                            <hr />
                                            <div className='d-flex justify-content-end gap-2 mt-3'>
                                                <Button className='outline-button' onClick={onCancel}>Cancel</Button>
                                                <Button className='solid-button' style={{ minWidth: '132px' }} type="submit" loading={isPending}>Save Details</Button>
                                            </div>
                                        </form>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default DepartmentTurnoverPlan;