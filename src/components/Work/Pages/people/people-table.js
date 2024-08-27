import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './people-table.module.scss';
import { CustomerService } from './data';
import { Person, Repeat } from 'react-bootstrap-icons';

const PeopleTable = () => {
  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedJobs] = useState(null);
  console.log('selectedpeople: ', selectedPeople);

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) => setPeople(data));
  }, []);

  // const balanceTemplate = (rowData) => {
  //   return <span className="font-bold">{formatCurrency(rowData.balance)}</span>;
  // };
  // const formatCurrency = (value) => {
  //   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  // };

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
    return <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
      {rowdata.time}
    </div>
  }

  const clientHeader = () => {
    return <div className='d-flex align-items-center'>
      Days in company	
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
    const name = rowData.name || ''; // Fallback to an empty string if name is undefined or null
    const initials = name.split(' ').map(word => word[0]).join('');
    
    return (
      <div className='d-flex align-items-center'>
        <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>
          {initials}
        </div>
        {name}
      </div>
    );
  }
  

  return (
    <>
         <DataTable value={people} scrollable selectionMode={'checkbox'} removableSort columnResizeMode="expand" resizableColumns showGridlines size={'large'} scrollHeight="1000px" className="border" selection={selectedPeople} onSelectionChange={(e) => setSelectedJobs(e.value)}>
              <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
              <Column field="Name" header="Name" style={{ minWidth: '100px' }} frozen sortable></Column>
              <Column field="Type" header="Type" body={paymentBody} style={{ minWidth: '130px' }} frozen sortable></Column>
              <Column field="LastJob" header="Last Job" body={timeBody} style={{ minWidth: '118px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen sortable></Column>
              <Column field="Group" header="Group" style={{ minWidth: '122px' }} sortable></Column>
              <Column field="Rating" header="Rating" style={{ minWidth: '122px' }} sortable></Column>
              <Column field="DaysCcompany	" header={clientHeader} body={clientBody} style={{ minWidth: '162px' }}></Column>
              <Column field="HourlyRate" header="Hourly rate" style={{ minWidth: '270px' }}></Column>
              <Column field="JobsComplete	" header="Jobs complete A→Z" body={nameBody} style={{ minWidth: '205px' }}></Column>
              <Column field="Email" header="Email" style={{ minWidth: '120px' }}></Column>
              <Column field="Phone" header="Phone " style={{ minWidth: '117px' }} ></Column>
              <Column field="Status" header="Status" style={{ minWidth: '88px' }}></Column>
            </DataTable>
    </>
  )
}

export default PeopleTable;