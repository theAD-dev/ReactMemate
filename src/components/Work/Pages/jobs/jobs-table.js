import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ChatText, Repeat } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import style from './jobs.module.scss';
import { getListOfJobs } from '../../../../APIs/jobs-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';
import Loader from '../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import JobDetails from '../../features/job-table-actions/job-details-dialog';
import ViewJob from '../../features/view-job/view-job';

export const formatDate = (timestamp) => {
  try {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const JobsTable = forwardRef(({ searchValue, setTotal, selected, setSelected, refetch, setRefetch, createJobVisible }, ref) => {
  const navigate = useNavigate();
  const { trialHeight } = useTrialHeight();
  const observerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState({ visible: false, jobId: null });
  const [editMode, setEditMode] = useState(false);
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
  }, [searchValue, refetch]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      const data = await getListOfJobs(page, limit, searchValue, order);
      setTotal(() => (data?.count || 0));
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
      setHasMoreData(data.count !== jobs.length);
      setLoading(false);
    };

    loadData();

  }, [page, searchValue, tempSort, refetch]);

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

  const jobIDTemplate = (rowData) => {
    return <div className={`d-flex gap-2 align-items-center justify-content-center show-on-hover`}>
      <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
        <span>{rowData.number}</span>
        <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created || rowData.start_date)}</span>
      </div>
      {rowData?.is_recurring && <Repeat color='#158ECC' />}
      <Button label="Open"
        onClick={() => {
          createJobVisible(false);
          setEditMode(false);
          setShow({ jobId: rowData.id, visible: true });
        }}
        className='primary-text-button ms-3 show-on-hover-element' text
      />
    </div>;
  };

  const jobTypeBody = (rowData) => {
    if (rowData.type_display === "Fix" && rowData.time_type_display === "Shift") {
      return <div className={style.type}>
        <div className={style.shift}>Shift</div>
        <div className={style.fix}>Fix</div>
      </div>;
    }

    if (rowData.type_display === "Fix" && rowData.time_type_display === "Time frame") {
      return <div className={style.type}>
        <div className={style.timeFrame}>Time Frame</div>
        <div className={style.fix}>Fix</div>
      </div>;
    }

    if (rowData.type_display === "Hours" && rowData.time_type_display === "Shift") {
      return <div className={style.type}>
        <div className={style.shift}>Shift</div>
        <div className={style.hours}>Hours</div>
      </div>;
    }

    if (rowData.type_display === "Hours" && rowData.time_type_display === "Time frame") {
      return <div className={style.type}>
        <div className={style.timeFrame}>Time Frame</div>
        <div className={style.hours}>Hours</div>
      </div>;
    }

    if (rowData.type_display === "Time Tracker" && rowData.time_type_display === "Time frame") {
      return <div className={style.type}>
        <div className={style.timeTracker}>Time Tracker</div>
        <div className={style.timeFrame2}>Time Frame</div>
      </div>;
    }
    return "";
  };

  const nameBody = (rowData) => {
    const status = rowData.status;
    if (status === '1') {
      return <div className='d-flex align-items-center'>
        <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
            <path d="M7.14307 6.57171C6.82748 6.57171 6.57164 6.82754 6.57164 7.14314C6.57164 7.45873 6.82748 7.71457 7.14307 7.71457H12.8574C13.1729 7.71457 13.4288 7.45873 13.4288 7.14314C13.4288 6.82754 13.1729 6.57171 12.8574 6.57171H7.14307Z" fill="#475467" />
            <path d="M7.14307 8.85742C6.82748 8.85742 6.57164 9.11326 6.57164 9.42885C6.57164 9.74444 6.82748 10.0003 7.14307 10.0003H10.5716C10.8872 10.0003 11.1431 9.74444 11.1431 9.42885C11.1431 9.11326 10.8872 8.85742 10.5716 8.85742H7.14307Z" fill="#475467" />
            <path fillRule="evenodd" clipRule="evenodd" d="M10.0002 3.14314C11.2626 3.14314 12.2859 2.11979 12.2859 0.857422H15.1431C16.0898 0.857422 16.8574 1.62493 16.8574 2.57171V17.4289C16.8574 18.3756 16.0898 19.1431 15.1431 19.1431H4.85735C3.91058 19.1431 3.14307 18.3756 3.14307 17.4289V2.57171C3.14307 1.62493 3.91058 0.857422 4.85735 0.857422H7.7145C7.7145 2.11979 8.73784 3.14314 10.0002 3.14314ZM10.0002 4.28599C11.493 4.28599 12.763 3.33193 13.2337 2.00028H15.1431C15.4587 2.00028 15.7145 2.25612 15.7145 2.57171V17.4289C15.7145 17.7444 15.4587 18.0003 15.1431 18.0003H4.85735C4.54176 18.0003 4.28592 17.7444 4.28592 17.4289V2.57171C4.28592 2.25612 4.54176 2.00028 4.85735 2.00028H6.76673C7.2374 3.33193 8.50739 4.28599 10.0002 4.28599Z" fill="#475467" />
          </svg>
        </div>
        Open Jobs
      </div>;
    }

    const name = `${rowData?.worker?.first_name} ${rowData?.worker?.last_name}`;
    return <div className='d-flex align-items-center'>
      <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>
        <FallbackImage photo={rowData?.worker?.photo} is_business={false} has_photo={!!(rowData?.worker?.photo) || false} />
      </div>
      {name}
    </div>;
  };

  const statusBody = (rowData) => {
    if (!rowData.published) {
      return <Chip className={`status ${style.Draft} font-14`} label={"Unpublished"} />;
    }

    if (rowData.action_status) {
      return <Chip className={`status ${style.open} font-14`} label={"In Progress"} />;
    }

    const status = rowData.status;
    switch (status) {
      case '1':
        return <Chip className={`status ${style.open} font-14`} label={"Open"} />;
      case '2':
        return <Chip className={`status ${style.ASSIGN} font-14`} label={"Assigned"} />;
      case '6':
        return <div className='d-flex gap-2 align-items-center'>
          <Chip className={`status ${style.NotConfirmed} font-14`} label={"Declined"} />
          <ChatText color='#158ECC' />
        </div>;
      case 'a':
        return <Chip className={`status ${style.CONFIRMED} font-14`} label={"Confirmed"} />;
      default:
        return <Chip className={`status ${style.defaultStatus} font-14`} label={status} />;
    }
  };

  const startDateBody = (rowData) => {
    return <span style={{ color: '#667085' }}>{formatDate(rowData.start_date)}</span>;
  };

  const endDateBody = (rowData) => {
    return <span style={{ color: '#667085' }}>{formatDate(rowData.end_date)}</span>;
  };

  const assignedTimeBody = (rowData) => {
    return <span style={{ color: '#667085' }}>{parseFloat(rowData.time_assigned).toFixed(2)}h</span>;
  };

  const realTimeBody = (rowData) => {
    const [hours, minutes, seconds] = rowData?.real_time?.split(':').map(Number);

    return <span style={{ color: '#667085' }}>{parseFloat(hours + (minutes / 60) + (seconds / 3600)).toFixed(2)}h</span>;
  };

  const bonusBody = (rowData) => {
    return <span style={{ color: '#667085' }}>${formatAUD(rowData.bonus || 0)}</span>;
  };

  const totalBody = (rowData) => {
    return <span style={{ color: '#667085' }}>${formatAUD(rowData.total || 0)}</span>;
  };

  const linkToBody = (rowData) => {
    if (!rowData?.project) return '-';

    return <div className='d-flex align-items-center'>
      <div className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData?.client?.is_business ? style.square : 'rounded-circle'}`}>
        <FallbackImage photo={rowData?.client?.photo} is_business={rowData?.client?.is_business || false} has_photo={rowData?.client?.has_photo || false} />
      </div>
      <div className='d-flex flex-column'>
        <span>{rowData?.project?.reference}</span>
        <span className='font-12' style={{ color: '#98A2B3' }}>{rowData?.project?.number} | {rowData?.client?.name}</span>
      </div>
    </div>;
  };

  const rowClassName = (data) => (data?.deleted ? style.deletedRow : '');

  const onSort = (event) => {
    const { sortField, sortOrder } = event;

    setTempSort({ sortField, sortOrder });
    setPage(1);  // Reset to page 1 whenever searchValue changes
  };

  return (
    <>
      <DataTable ref={ref} value={jobs} scrollable selectionMode={'checkbox'}
        columnResizeMode="expand" resizableColumns showGridlines size={'large'}
        scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`} className="border" selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        loading={loading}
        loadingIcon={Loader}
        emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue} />}
        sortField={sort?.sortField}
        sortOrder={sort?.sortOrder}
        onSort={onSort}
        rowClassName={rowClassName}
      >
        <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
        <Column field="number" header="Job ID" body={jobIDTemplate} style={{ minWidth: '100px' }} className='ps-0' headerClassName='ps-0' frozen sortable></Column>
        <Column field='type' header="Job Type" body={jobTypeBody} style={{ minWidth: '100px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen sortable></Column>
        <Column field="start_date" header="Start" body={startDateBody} style={{ minWidth: '122px' }} sortable></Column>
        <Column field="end_date" header="Finish" body={endDateBody} style={{ minWidth: '122px' }} sortable></Column>
        <Column field="worker.firstname" header="Name A→Z" body={nameBody} style={{ minWidth: '205px' }}></Column>
        <Column field="reference" header="Job Reference" style={{ minWidth: '270px' }}></Column>
        <Column field='project.number' header="Linked To Project" body={linkToBody} style={{ minWidth: '105px' }} />
        <Column field="status" header="Status" body={statusBody} style={{ minWidth: '120px' }}></Column>
        <Column field="time_assigned" header="Time Assigned" body={assignedTimeBody} style={{ minWidth: '117px' }} ></Column>
        <Column field="real_time" header="Real Time" body={realTimeBody} bodyClassName={'text-end'} headerClassName='text-center' style={{ minWidth: '88px' }}></Column>
        <Column field="bonus" header="Bonus" body={bonusBody} style={{ minWidth: '88px' }} sortable></Column>
        <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
      </DataTable>
      <JobDetails visible={visible} setVisible={setVisible} jobDetails={jobDetails} />
      <ViewJob visible={show?.visible} jobId={show?.jobId} setVisible={(bool) => setShow((others) => ({ ...others, visible: bool }))} setRefetch={setRefetch} editMode={editMode} setEditMode={setEditMode} />
    </>
  );
});

export default JobsTable;