import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import style from './people.module.scss';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Rating } from 'primereact/rating';
import { Chat, Envelope, Person, Plus, PlusLg, Telephone } from 'react-bootstrap-icons';
import { Badge } from 'primereact/badge';
import { getTeamDesktopUser } from '../../../../APIs/team-api';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import clsx from 'clsx';
import { getPrivilegesList } from '../../../../APIs/settings-user-api';
import { useQuery } from '@tanstack/react-query';

const DesktopPeoplesTable = () => {
    const observerRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [peoples, setPeoples] = useState([]);
    const [selectedPeoples, setSelectedPeoples] = useState(null);
    const privilegesQuery = useQuery({ queryKey: ['privileges-list'], queryFn: getPrivilegesList });

    useEffect(() => {
        const getMobileUser = async () => {
            setLoading(true);
            try {
                const users = await getTeamDesktopUser();
                let activeUsers = users?.users?.filter((user) => user.is_active);
                setPeoples(activeUsers || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getMobileUser();
    }, [])

    const nameBody = (rowdata) => {
        return <div className={`d-flex align-items-center justify-content-start gap-2 show-on-hover`}>
            <div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.clientImg} rounded-circle}`}>
                {rowdata.photo ? <img src={rowdata.photo} alt='clientImg' className='w-100' /> : <Person color='#667085' />}
            </div>
            <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
                {rowdata?.first_name} {rowdata?.last_name}
            </div>
            <Button label="View Details" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text />
        </div>
    }

    const typeBody = (rowData) => {
        const type = rowData.privilege;
        let privilege = privilegesQuery?.data?.find((t) => type === t.id);
        return privilege?.name || "-";
    }

    const daysBody = (rowData) => {
        return <Chip className={`custom ${style.defaultDays}`} label={rowData.days_in_company || "-"} />
    }

    const emailBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center justify-content-center'>
            <Link to='#'
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `mailto:${rowData?.email}`;
                }}
            >
                <Envelope size={20} color='#98A2B3' className='email-icon' />
            </Link>
        </div>
    }

    const phoneBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center justify-content-center'>
            <Link to='#'
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `tel:${rowData?.phone}`;
                }}
            >
                <Telephone size={20} color='#98A2B3' className='phone-icon' />
            </Link>
        </div>
    }

    const actionBody = () => {
        return <Button className='text-button bg-tranparent p-0 text-dark' disabled>New Job <Plus color='#667085' size={20} /></Button>
    }

    const loadingIconTemplate = () => {
        return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    }

    return (
        <>
           <h1 className={clsx(style.tableCaption, 'mt-2')}>Desktop User</h1>
            <DataTable value={peoples}
                scrollable selectionMode={'checkbox'} removableSort
                columnResizeMode="expand" resizableColumns showGridlines
                size={'large'}  className="border" selection={selectedPeoples}
                onSelectionChange={(e) => setSelectedPeoples(e.value)}
                loading={loading}
                loadingIcon={loadingIconTemplate}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="name" header="Name" body={nameBody} style={{ minWidth: '400px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen sortable></Column>
                <Column field="role" header="Role" style={{ minWidth: '107px' }}></Column>
                <Column field="privilege" header="Privilege" body={typeBody} style={{ minWidth: '149px' }} sortable></Column>
                <Column field="days" header="Days in company" body={daysBody} style={{ minWidth: '150px' }} className='text-center' sortable></Column>
                <Column field="jobs_completed" header="Jobs complete" style={{ minWidth: '131px', textAlign: 'left' }} sortable></Column>
                <Column header="Email" body={emailBodyTemplate} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column header="Phone" body={phoneBodyTemplate} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column header="Chat" body={<Chat color='#98A2B3' size={20} />} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column field="Actions" header="Status" body={actionBody} style={{ minWidth: '135px' }}></Column>
            </DataTable>
        </>
    )
}

export default DesktopPeoplesTable