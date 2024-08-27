import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import style from './people.module.scss';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Rating } from 'primereact/rating';
import { Envelope, Telephone } from 'react-bootstrap-icons';
import { Badge } from 'primereact/badge';

export const CustomerService = {
    getData() {
        return [
            {
                id: 1,
                name: "John Doe",
                type: "Employee",
                lastJob: "J-230064-1",
                group: "Group 1",
                rating: 2,
                days: 55,
                hourly: 31,
                complete: 12,
                status: "Active",
            },
            {
                id: 2,
                name: "Jane Smith",
                type: "Contractor",
                lastJob: "J-230065-2",
                group: "Group 2",
                rating: 4,
                days: 30,
                hourly: 25,
                complete: 18,
                status: "Inactive",
            },
            {
                id: 3,
                name: "Alice Johnson",
                type: "Employee",
                lastJob: "J-230066-3",
                group: "Group 3",
                rating: 5,
                days: 45,
                hourly: 28,
                complete: 22,
                status: "Active",
            },
            {
                id: 4,
                name: "Michael Brown",
                type: "Employee",
                lastJob: "J-230067-4",
                group: "Group 1",
                rating: 3,
                days: 60,
                hourly: 35,
                complete: 15,
                status: "Active",
            },
            {
                id: 5,
                name: "Emily Davis",
                type: "Contractor",
                lastJob: "J-230068-5",
                group: "Group 2",
                rating: 1,
                days: 25,
                hourly: 20,
                complete: 8,
                status: "Inactive",
            },
            {
                id: 6,
                name: "David Wilson",
                type: "Employee",
                lastJob: "J-230069-6",
                group: "Group 3",
                rating: 4,
                days: 70,
                hourly: 40,
                complete: 10,
                status: "Active",
            },
            {
                id: 7,
                name: "Sophia Martinez",
                type: "Contractor",
                lastJob: "J-230070-7",
                group: "Group 1",
                rating: 2,
                days: 15,
                hourly: 22,
                complete: 5,
                status: "Active",
            },
            {
                id: 8,
                name: "James Taylor",
                type: "Employee",
                lastJob: "J-230071-8",
                group: "Group 2",
                rating: 3,
                days: 40,
                hourly: 30,
                complete: 16,
                status: "Inactive",
            },
            {
                id: 9,
                name: "Olivia White",
                type: "Employee",
                lastJob: "J-230072-9",
                group: "Group 3",
                rating: 5,
                days: 20,
                hourly: 27,
                complete: 20,
                status: "Active",
            },
            {
                id: 10,
                name: "Daniel Harris",
                type: "Contractor",
                lastJob: "J-230073-10",
                group: "Group 1",
                rating: 4,
                days: 50,
                hourly: 33,
                complete: 14,
                status: "Inactive",
            },
            // Add more dummy data as needed...
        ];
    },
    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 2));
    },
    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 25));
    },
    getCustomersPaginated(page, rowsPerPage) {
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = page * rowsPerPage;
        return Promise.resolve(this.getData().slice(startIndex, endIndex));
    }
};


const PeoplesTable = () => {
    const observerRef = useRef(null);

    const [peoples, setPeoples] = useState([]);
    console.log('peoples: ', peoples.length);
    const [selectedPeoples, setSelectedPeoples] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const rowsPerPage = 2; // Number of rows to fetch per page

    useEffect(() => {
        const loadData = async () => {
            const data = await CustomerService.getCustomersPaginated(page, rowsPerPage);
            console.log('data: ', data.length);
            if (data.length > 0) {
                setPeoples(prevPeoples => [...prevPeoples, ...data]);
            } else {
                setHasMoreData(false);
            }
        };

        loadData();
    }, [page]);

    useEffect(() => {
        if (peoples.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    console.log('Fetching more data...');
                    setPage(prevPage => prevPage + 1); // Increment the page number
                }
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:last-child');
            if (lastRow) {
                observerRef.current.observe(lastRow);
            }
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [peoples, hasMoreData]);

    const nameBody = (rowdata) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
                {rowdata.name}
            </div>
            <Button label="View Details" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text />
        </div>
    }

    const typeBody = (rowData) => {
        const type = rowData.type;
        switch (type) {
            case 'Employee':
                return <Chip className={`type ${style.employee}`} label={type} />
            case 'Contractor':
                return <Chip className={`type ${style.contractor}`} label={type} />
            default:
                return <Chip className={`type ${style.defaultType}`} label={type} />;
        }
    }

    const lastJobBody = (rowData) => {
        return <Chip className={`custom ${style.defaultLastJob}`} label={rowData.lastJob} />
    }

    const ratingBody = (rowData) => {
        return <Rating value={rowData.rating} className='yellow-rating' style={{ position: 'static' }} readOnly cancel={false} />
    }

    const daysBody = (rowData) => {
        return <Chip className={`custom ${style.defaultDays}`} label={rowData.days} />
    }

    const hourlyBody = (rowData) => {
        return `$ ${rowData.hourly}`
    }

    const statusBody = (rowData) => {
        if (rowData.status === 'Active')
            return <div className={`${style.status} ${style.active}`}>
                <Badge severity="success"></Badge> {rowData.status}
            </div>
        return <div className={`${style.status} ${style.inactive}`}>
            {rowData.status} <Badge severity="danger"></Badge> 
        </div>
    }
    return (
        <>
            <DataTable value={peoples} scrollable selectionMode={'checkbox'} removableSort columnResizeMode="expand" resizableColumns showGridlines size={'large'} scrollHeight="600px" className="border" selection={selectedPeoples} onSelectionChange={(e) => setSelectedPeoples(e.value)}>
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="name" header="Name" body={nameBody} style={{ minWidth: '700px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen sortable></Column>
                <Column field="type" header="Type" body={typeBody} style={{ minWidth: '107px' }} sortable></Column>
                <Column field="lastJob" header="Last Job" body={lastJobBody} style={{ minWidth: '118px' }} sortable></Column>
                <Column field="group" header="Group" style={{ minWidth: '87px' }} sortable></Column>
                <Column field="rating" header="Rating" body={ratingBody} style={{ minWidth: '149px' }} sortable></Column>
                <Column field="days" header="Days in company" body={daysBody} style={{ minWidth: '150px' }} className='text-center' sortable></Column>
                <Column field="hourly" header="Hourly rate" body={hourlyBody} style={{ minWidth: '113px', textAlign: 'right' }} sortable></Column>
                <Column field="complete" header="Jobs complete	" style={{ minWidth: '131px', textAlign: 'right' }} sortable></Column>
                <Column header="Email" body={<Envelope color='#98A2B3' size={20} />} style={{ minWidth: '73px', textAlign: 'center' }} sortable></Column>
                <Column header="Phone" body={<Telephone color='#98A2B3' size={20} />} style={{ minWidth: '73px', textAlign: 'center' }} sortable></Column>
                <Column field="status" header="Status" body={statusBody} style={{ minWidth: '135px' }} sortable></Column>
            </DataTable>
        </>
    )
}

export default PeoplesTable