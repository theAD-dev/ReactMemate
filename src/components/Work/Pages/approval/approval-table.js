import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Link, Link45deg, Person, Repeat } from 'react-bootstrap-icons';

import style from './approval.module.scss';
import { Tag } from 'primereact/tag';

export const CustomerService = {
    getData() {
        return [
            {
                jobId: 24001,
                paymentType: "Hours",
                time: "TimeFrame",
                start: "09 Dec 2029",
                finish: "09 Dec 2029",
                client: "Emanate Legal",
                jobReference: "Sponsor brochure for Vinkl sailing...",
                name: "John Doe",
                status: "Finished",
                timeAssigned: "07:30h",
                realTime: "08:00h",
                bonus: "$50.00",
                total: "$2,630.44",
                linkTo: "240003"
            },
            {
                jobId: 24002,
                paymentType: "Fix",
                time: "TimeTracker",
                start: "10 Dec 2029",
                finish: "10 Dec 2029",
                client: "Bright Horizons",
                jobReference: "Website redesign consultation...",
                name: "Jane Smith",
                status: "In Progress",
                timeAssigned: "08:00h",
                realTime: "06:45h",
                bonus: "$30.00",
                total: "$1,500.00",
                linkTo: "240004"
            },
            {
                jobId: 24003,
                paymentType: "Hours",
                time: "TimeFrame",
                start: "11 Dec 2029",
                finish: "11 Dec 2029",
                client: "Innovative Solutions",
                jobReference: "Development of AI tool...",
                name: "Alice Johnson",
                status: "Assign",
                timeAssigned: "09:00h",
                realTime: "07:30h",
                bonus: "$40.00",
                total: "$3,100.75",
                linkTo: "240005"
            },
            {
                jobId: 24004,
                paymentType: "Fix",
                time: "TimeTracker",
                start: "12 Dec 2029",
                finish: "12 Dec 2029",
                client: "Quantum Tech",
                jobReference: "App UX/UI design...",
                name: "Mike Brown",
                status: "Draft",
                timeAssigned: "08:30h",
                realTime: "N/A",
                bonus: "$0.00",
                total: "$500.00",
                linkTo: "240006"
            },
            {
                jobId: 24005,
                paymentType: "Hours",
                time: "TimeFrame",
                start: "13 Dec 2029",
                finish: "13 Dec 2029",
                client: "Zenith Media",
                jobReference: "Content creation for marketing campaign...",
                name: "Chris Green",
                status: "Finished",
                timeAssigned: "10:00h",
                realTime: "08:15h",
                bonus: "$60.00",
                total: "$2,950.00",
                linkTo: "240007"
            }
        ]
    },
    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

    getCustomers(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    }
}

const ApprovalTable = () => {
    const [approvals, setApprovals] = useState([]);
    const [selectedApprovals, setSelectedApprovals] = useState(null);

    useEffect(() => {
        CustomerService.getCustomersLarge().then((data) => setApprovals(data));
    }, []);

    const paymentBody = (rowData) => {
        if (rowData.paymentType === 'Hours')
            return <div className='d-flex justify-content-center align-items-center' style={{ gap: '10px' }}>
                <div className={`${style.payment} ${style.paymentHours}`}>{rowData.paymentType}</div>
                <Repeat color='#158ECC' />
            </div>
        else
            return <div className='d-flex justify-content-center align-items-center' style={{ gap: '10px' }}>
                <div className={`${style.payment} ${style.paymentFix}`}>{rowData.paymentType}</div>
                <Repeat color='#158ECC' />
            </div>
    }

    const timeBody = (rowdata) => {
        return <div className={`d-flex align-items-center show-on-hover`}>
            <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
                {rowdata.time}
            </div>
        </div>
    }

    const clientHeader = () => {
        return <div className='d-flex align-items-center'>
            Client
            <small>A→Z</small>
        </div>
    }
    const clientBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientImg}`}><Person color='#667085' /></div>
            {rowData.client}
        </div>
    }

    const nameBody = (rowData) => {
        const name = rowData.name;
        const initials = name.split(' ').map(word => word[0]).join('');
        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>{initials}</div>
            {rowData.name}
        </div>
    }

    const statusBody = (rowData) => {
        const status = rowData.status;
        switch (status) {
            case 'In Progress':
                return <Chip className={`status ${style.inProgress}`} label={status} />
            case 'Finished':
                return <Chip className={`status ${style.finished}`} label={status} />
            case 'Assign':
                return <Chip className={`status ${style.assign}`} label={status} />
            default:
                return <Chip className={`status ${style.defaultStatus}`} label={status} />;
        }
    }

    const linkToBody = (rowData) => {
        return <div className='d-flex align-items-center' style={{ gap: '10px' }}>{rowData.linkTo} <Link45deg color='#3366CC' /> </div>
    }

    const totalBody = (rowData) => {
        return <Tag value={rowData.total} style={{ border: "2px solid var(--Orange-200, #FFE0BC)", background: '#FFF7EE', color: '#FFB258', fontSize: '12px', fontWeight: 500 }} rounded></Tag>
    }

    const header = (
        <div className="flex align-items-center justify-content-end" style={{ }}>
            <p style={{ color: '#344054', fontWeight: 400 }} className='m-0 font-14'>This week Approved</p>
        </div>
    );

    return (
        <DataTable value={approvals} header={header} scrollable selectionMode={'checkbox'} removableSort columnResizeMode="expand" resizableColumns
            showGridlines size={'large'} scrollHeight="600px" className="border" selection={selectedApprovals}
            onSelectionChange={(e) => setSelectedApprovals(e.value)}
        >
            <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
            <Column field="jobId" header="Job ID" style={{ minWidth: '100px' }} frozen sortable></Column>
            <Column field="paymentType" header="Payment Type" body={paymentBody} style={{ minWidth: '130px' }} frozen sortable></Column>
            <Column field="time" header="Time" body={timeBody} style={{ minWidth: '118px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen></Column>
            <Column field="start" header="Submitted" style={{ minWidth: '122px' }} sortable></Column>
            <Column field="jobReference" header="Job Reference" style={{ minWidth: '270px' }}></Column>
            <Column field="client" header={clientHeader} body={clientBody} style={{ minWidth: '162px' }}></Column>
            <Column field="linkTo" header="Linked To Project" body={linkToBody} style={{ minWidth: '105px' }}></Column>

            <Column field="name" header="Name A→Z" body={nameBody} style={{ minWidth: '205px' }}></Column>
            <Column field="bonus" header="Variations" style={{ minWidth: '88px', textAlign: 'end' }} sortable></Column>
            <Column field="total" header="Total" style={{ minWidth: '105px' }} sortable></Column>
            <Column field="realTime" header="Real Time" style={{ minWidth: '88px' }}></Column>

            <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
            <Column field="status" header="Status" body={statusBody} style={{ minWidth: '120px' }}></Column>

        </DataTable>
    )
}

export default ApprovalTable