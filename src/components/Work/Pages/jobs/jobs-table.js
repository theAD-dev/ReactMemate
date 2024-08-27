import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './jobs.module.scss';
import { CustomerService } from './data';
import { Person, Repeat } from 'react-bootstrap-icons';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import JobDetails from '../../features/job-table-actions/job-details-dialog';

const JobsTable = () => {
  const [visible, setVisible] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState(null);
  console.log('selectedJobs: ', selectedJobs);
  
  function openDeatils(data) {
    setJobDetails(data);
    setVisible(true);
  }

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) => setJobs(data));
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
    return <div className={`d-flex align-items-center show-on-hover`}>
      <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
        {rowdata.time}
      </div>
      <Button label="Open" onClick={()=> openDeatils(rowdata)} className='primary-text-button ms-3 show-on-hover-element' text />
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

  return (
    <>
      <DataTable value={jobs} scrollable selectionMode={'checkbox'} removableSort columnResizeMode="expand" resizableColumns showGridlines size={'large'} scrollHeight="600px" className="border" selection={selectedJobs} onSelectionChange={(e) => setSelectedJobs(e.value)}>
        <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
        <Column field="jobId" header="Job ID" style={{ minWidth: '100px' }} frozen sortable></Column>
        <Column field="paymentType" header="Payment Type" body={paymentBody} style={{ minWidth: '130px' }} frozen sortable></Column>
        <Column field="time" header="Time" body={timeBody} style={{ minWidth: '118px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen sortable></Column>
        <Column field="start" header="Start" style={{ minWidth: '122px' }} sortable></Column>
        <Column field="finish" header="Finish" style={{ minWidth: '122px' }} sortable></Column>
        <Column field="client" header={clientHeader} body={clientBody} style={{ minWidth: '162px' }}></Column>
        <Column field="jobReference" header="Job Reference" style={{ minWidth: '270px' }}></Column>
        <Column field="name" header="Name A→Z" body={nameBody} style={{ minWidth: '205px' }}></Column>
        <Column field="status" header="Status" body={statusBody} style={{ minWidth: '120px' }}></Column>
        <Column field="timeAssigned" header="Time Assigned" style={{ minWidth: '117px' }} ></Column>
        <Column field="realTime" header="Real Time" style={{ minWidth: '88px' }}></Column>
        <Column field="bonus" header="Bonus" style={{ minWidth: '88px' }} sortable></Column>
        <Column field="total" header="Total" style={{ minWidth: '105px' }} sortable></Column>
        <Column field="linkTo" header="Linked To" style={{ minWidth: '105px' }}></Column>
      </DataTable>
      <JobDetails visible={visible} setVisible={setVisible} jobDetails={jobDetails} />
    </>
  )
}

export default JobsTable;