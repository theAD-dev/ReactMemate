import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './jobs.module.scss';
import { Person, Repeat } from 'react-bootstrap-icons';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import JobDetails from '../../features/job-table-actions/job-details-dialog';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getListOfJobs } from '../../../../APIs/jobs-api';

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  const year = date.getFullYear();
  return `${day} ${monthAbbreviation} ${year}`;
};

const JobsTable = forwardRef(({ searchValue, setTotal, selected, setSelected }, ref) => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setPage(1);  // Reset to page 1 whenever searchValue changes
  }, [searchValue]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      const data = await getListOfJobs(page, limit, searchValue, order);
      setTotal(() => (data?.count || 0))
      if (page === 1) setJobs(data.results);
      else {
        if (data?.results?.length > 0)
          setJobs(prev => {
            const existingIds = new Set(prev.map(data => data.id));
            const newData = data.results.filter(data => !existingIds.has(data.id));
            return [...prev, ...newData];
          });
      }
      setSort(tempSort);
      setHasMoreData(data.count !== jobs.length)
      setLoading(false);
    };

    loadData();

  }, [page, searchValue, tempSort]);

  useEffect(() => {
    if (jobs.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
      if (lastRow) observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [jobs, hasMoreData]);

  function openDeatils(data) {
    setJobDetails(data);
    setVisible(true);
  }

  const paymentBody = (rowData) => {
    if (rowData.type_display === 'Hours')
      return <div className='d-flex justify-content-center align-items-center' style={{ gap: '10px' }}>
        <div className={`${style.payment} ${style.paymentHours}`}>{rowData.type_display}</div>
        <Repeat color='#158ECC' />
      </div>
    else
      return <div className='d-flex justify-content-center align-items-center' style={{ gap: '10px' }}>
        <div className={`${style.payment} ${style.paymentFix}`}>{rowData.type_display}</div>
        <Repeat color='#158ECC' />
      </div>
  }

  const timeBody = (rowdata) => {
    return <div className={`d-flex align-items-center show-on-hover`}>
      <div className={`${style.time} ${rowdata.time === '1' ? style.frame : style.tracker}`}>
        {rowdata.time_type_display}
      </div>
      <Button label="Open" onClick={() => openDeatils(rowdata)} className='primary-text-button ms-3 show-on-hover-element' text />
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
      <div className={`d-flex justify-content-center align-items-center ${style.clientImg}`}>
        {rowData?.client?.has_photo ? <img src={rowData?.client?.photo} /> : <Person color='#667085' />}
      </div>
      {rowData?.client?.name}
    </div>
  }

  const nameBody = (rowData) => {
    const name = `${rowData?.worker.first_name} ${rowData?.worker.last_name}`;
    console.log('name: ', name);
    const initials = name.split(' ').map(word => word[0]).join('');
    return <div className='d-flex align-items-center'>
      <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>
        {rowData?.worker?.photo ? <img src={rowData?.worker?.photo} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : initials}
      </div>
      {name}
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

  const startDateBody = (rowData) => {
    return <span style={{ color: '#667085' }}>{formatDate(rowData.start_date)}</span>
  }

  const endDateBody = (rowData) => {
    return <span style={{ color: '#667085' }}>{formatDate(rowData.end_date)}</span>
  }

  const assignedTimeBody = (rowData) => {
    return <span style={{ color: '#667085' }}>{parseFloat(rowData.time_assigned).toFixed(2)}h</span>
  }

  const realTimeBody = (rowData) => {
    const [hours, minutes, seconds] = rowData?.real_time?.split(':').map(Number);

    return <span style={{ color: '#667085' }}>{parseFloat(hours + (minutes / 60) + (seconds / 3600)).toFixed(2)}h</span>
  }

  const bonusBody = (rowData) => {
    return <span style={{ color: '#667085' }}>${parseFloat(rowData.bonus || 0).toFixed(2)}</span>
  }

  const totalBody = (rowData) => {
    return <span style={{ color: '#667085' }}>${parseFloat(rowData.total || 0).toFixed(2)}</span>
  }

  const loadingIconTemplate = () => {
    return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  }

  const rowClassName = (data) => (data?.deleted ? style.deletedRow : '');

  const onSort = (event) => {
    const { sortField, sortOrder } = event;

    setTempSort({ sortField, sortOrder })
    setPage(1);  // Reset to page 1 whenever searchValue changes
  };

  return (
    <>
      <DataTable ref={ref} value={jobs} scrollable selectionMode={'checkbox'}
        columnResizeMode="expand" resizableColumns showGridlines size={'large'}
        scrollHeight={"calc(100vh - 175px)"} className="border" selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        loading={loading}
        loadingIcon={loadingIconTemplate}
        emptyMessage={NoDataFoundTemplate}
        sortField={sort?.sortField}
        sortOrder={sort?.sortOrder}
        onSort={onSort}
        rowClassName={rowClassName}
      >
        <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
        <Column field="number" header="Job ID" style={{ minWidth: '100px' }} frozen sortable></Column>
        <Column field="type_display" header="Payment Type" body={paymentBody} style={{ minWidth: '130px' }} frozen sortable></Column>
        <Column field="time_type" header="Time" body={timeBody} style={{ minWidth: '118px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen sortable></Column>
        <Column field="start_date" header="Start" body={startDateBody} style={{ minWidth: '122px' }} sortable></Column>
        <Column field="end_date" header="Finish" body={endDateBody} style={{ minWidth: '122px' }} sortable></Column>
        <Column field="client.name" header={clientHeader} body={clientBody} style={{ minWidth: '162px' }}></Column>
        <Column field="reference" header="Job Reference" style={{ minWidth: '270px' }}></Column>
        <Column field="worker.firstname" header="Name A→Z" body={nameBody} style={{ minWidth: '205px' }}></Column>
        <Column field="status" header="Status" body={statusBody} style={{ minWidth: '120px' }}></Column>
        <Column field="time_assigned" header="Time Assigned" body={assignedTimeBody} style={{ minWidth: '117px' }} ></Column>
        <Column field="real_time" header="Real Time" body={realTimeBody} bodyClassName={'text-end'} headerClassName='text-center' style={{ minWidth: '88px' }}></Column>
        <Column field="bonus" header="Bonus" body={bonusBody} style={{ minWidth: '88px' }} sortable></Column>
        <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
        <Column field="linkTo" header="Linked To" style={{ minWidth: '105px' }}></Column>
      </DataTable>
      <JobDetails visible={visible} setVisible={setVisible} jobDetails={jobDetails} />
    </>
  )
});

export default JobsTable;