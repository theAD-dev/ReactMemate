import React, { useEffect, useState } from 'react';
import { Chat, Envelope, Plus, Telephone } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Rating } from 'primereact/rating';
import style from './people.module.scss';
import { getTeamMobileUser } from '../../../../APIs/team-api';
import ImageAvatar from '../../../../shared/ui/image-with-fallback/image-avatar';
import Loader from '../../../../shared/ui/loader/loader';


const PeoplesTable = () => {
    const [loading, setLoading] = useState(false);
    const [peoples, setPeoples] = useState([]);
    const [selectedPeoples, setSelectedPeoples] = useState(null);

    useEffect(() => {
        const getMobileUser = async () => {
            setLoading(true);
            try {
                const users = await getTeamMobileUser();
                const activeUsers = users?.users.filter((user) => user.status !== 'disconnected');
                setPeoples(activeUsers || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        getMobileUser();
    }, []);

    const nameBody = (rowdata) => {
        return <div className={`d-flex align-items-center justify-content-start gap-2 show-on-hover`}>
            <ImageAvatar has_photo={rowdata.has_photo} photo={rowdata.photo} is_business={false}/>
            <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
                {rowdata?.first_name} {rowdata?.last_name}
            </div>
            <Button label="View Details" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text />
        </div>;
    };

    const typeBody = (rowData) => {
        const type = rowData.format;
        switch (type) {
            case '1':
                return <Chip className={`type ${style.employee}`} label={"Employee"} />;
            case '2':
                return <Chip className={`type ${style.contractor}`} label={"Contractor"} />;
            default:
                return <Chip className={`type ${style.defaultType}`} label={type} />;
        }
    };

    // const lastJobBody = (rowData) => {
    //     return <Chip className={`custom ${style.defaultLastJob}`} label={rowData.lastJob} />
    // }

    const ratingBody = (rowData) => {
        return <Rating value={rowData.rating} className='yellow-rating' style={{ position: 'static' }} readOnly cancel={false} />;
    };

    const daysBody = (rowData) => {
        return <Chip className={`custom ${style.defaultDays}`} label={rowData.days_in_company} />;
    };

    const hourlyBody = (rowData) => {
        return `$ ${rowData.hourly}`;
    };

    // const statusBody = (rowData) => {
    //     if (rowData.status === 'Active')
    //         return <div className={`${style.status} ${style.active}`}>
    //             <Badge severity="success"></Badge> {rowData.status}
    //         </div>
    //     return <div className={`${style.status} ${style.inactive}`}>
    //         {rowData.status} <Badge severity="danger"></Badge> 
    //     </div>
    // }

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
        </div>;
    };

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
        </div>;
    };

    const actionBody = () => {
        return <Button className='text-button bg-tranparent p-0'>New Job <Plus color='#158ECC' size={20} /></Button>;
    };

    return (
        <>
           <h1 className={clsx(style.tableCaption, 'mt-2')}>Mobile App Users</h1>
            <DataTable value={peoples}
                scrollable selectionMode={'checkbox'} removableSort
                columnResizeMode="expand" resizableColumns showGridlines
                size={'large'} className="border" selection={selectedPeoples}
                onSelectionChange={(e) => setSelectedPeoples(e.value)}
                loading={loading}
                loadingIcon={Loader}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="name" header="Name" body={nameBody} style={{ minWidth: '400px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen sortable></Column>
                <Column field="type" header="Type" body={typeBody} style={{ minWidth: '107px' }}></Column>
                {/* <Column field="lastJob" header="Last Job" body={lastJobBody} style={{ minWidth: '118px' }} sortable></Column>
                <Column field="group" header="Group" style={{ minWidth: '87px' }} sortable></Column> */}
                <Column field="rating" header="Rating" body={ratingBody} style={{ minWidth: '149px' }} sortable></Column>
                <Column field="days" header="Days in company" body={daysBody} style={{ minWidth: '150px' }} className='text-center' sortable></Column>
                {/* <Column field="hourly" header="Hourly rate" body={hourlyBody} style={{ minWidth: '113px', textAlign: 'right' }} sortable></Column> */}
                <Column field="jobs_complete" header="Jobs complete" style={{ minWidth: '131px', textAlign: 'left' }} sortable></Column>
                <Column header="Email" body={emailBodyTemplate} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column header="Phone" body={phoneBodyTemplate} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column header="Chat" body={<Chat color='#98A2B3' size={20} />} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column field="Actions" header="Status" body={actionBody} style={{ minWidth: '135px' }}></Column>
            </DataTable>
        </>
    );
};

export default PeoplesTable;