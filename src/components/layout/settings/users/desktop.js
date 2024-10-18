import { Building, Person } from 'react-bootstrap-icons';
import style from './users.module.scss';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useQuery } from '@tanstack/react-query';
import { getDesktopUserList } from '../../../../APIs/settings-user-api';
import { Spinner } from 'react-bootstrap';

const Desktop = () => {
    const desktopUsersQuery = useQuery({ queryKey: ['desktop-users'], queryFn: getDesktopUserList });
    const desktopUsers = desktopUsersQuery?.data || [];
    console.log('desktopUsers: ', desktopUsers);

    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex justify-content-center align-items-center'><div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.userImg} ${data.is_business ? "" : "rounded-circle"}`}>
                {data.photo ? <img src={data.photo} alt='clientImg' className='w-100' /> : data.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
            </div>
                <div className='d-flex flex-column gap-1'>
                    <div className={`${style.ellipsis}`}>{data.name}</div>
                </div></div>
            <Button label="Edit" className='primary-text-button ms-3 show-on-hover-element not-show-checked' />
        </div>
    }

    const StatusBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`styleGrey01  ${style.privilege}`}>
                {data.privilege}
            </div>
        </div>
    }

    return (
        <>
            <div className={`settings-wrap ${style.userSettingPage}`}>
                <DataTable value={desktopUsers} showGridlines tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" style={{ width: 'auto' }} body={nameBody} header="Name"></Column>
                    <Column field="email" style={{ width: '267px' }} header="Email"></Column>
                    <Column field="phone" style={{ width: '210px' }} header="Phone"></Column>
                    <Column field="role" style={{ width: '210px' }} header="Role"></Column>
                    <Column field="privilege" body={StatusBody} style={{ width: '147px' }} header="Privilege"></Column>
                </DataTable>
            </div>
            {
                desktopUsersQuery.isLoading &&
                <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
        </>
    );
}

export default Desktop;
