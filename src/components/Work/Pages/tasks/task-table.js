import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import style from './task.module.scss';
import { getListOfTasks } from '../../../../APIs/task-api';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import clsx from 'clsx';
import { FileText } from 'react-bootstrap-icons';
import ViewTaskModal from '../../features/task/view-task/view-task';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
};

const TaskTable = forwardRef(({ searchValue, setTotal, selected, setSelected, refetch, setRefetch }, ref) => {
    const navigate = useNavigate();
    const { trialHeight } = useTrialHeight();
    const observerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [taskId, setTaskId] = useState(null);

    const [page, setPage] = useState(1);
    const [tasks, setTasks] = useState([]);
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

            const data = await getListOfTasks(page, limit, searchValue, order);
            setTotal(() => (data?.count || 0))
            if (page === 1) setTasks(data.results);
            else {
                if (data?.results?.length > 0)
                    setTasks(prev => {
                        const existingIds = new Set(prev.map(data => data.id));
                        const newData = data.results.filter(data => !existingIds.has(data.id));
                        return [...prev, ...newData];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== tasks.length)
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, tempSort, refetch]);

    useEffect(() => {
        if (tasks.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [tasks, hasMoreData]);

    const idBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-center show-on-hover`}>
            <div>{rowData.number}</div>
            <Button label="Open" onClick={() => { setTaskId(rowData?.id); setVisible(true) }} className='primary-text-button ms-3 show-on-hover-element' text />
        </div>
    }

    const nameBody = (rowData) => {
        const name = `${rowData?.user.full_name}`;
        const initials = `${rowData?.alias}`;
        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>
                {rowData?.user?.photo ? <img src={rowData?.user?.photo} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : initials}
            </div>
            {name}
        </div>
    }

    const statusBody = (rowdata) => {
        return <div className={`${style.time} ${rowdata.finished ? style.complete : style.pending}`}>
            {rowdata.finished ? "Complete" : "Not Complete"}
        </div>
    }

    const projectBody = (rowData) => {
        return <div className='d-flex align-items-center gap-2'>
            <div className={clsx(style.projectImg, 'd-flex align-items-center justify-content-center')}>
                <FileText color='#475467' size={13} />
            </div>
            <div>
                <h1 className={clsx(style.projectText, 'mb-0')}>{rowData?.project?.reference}</h1>
                <h6 className={clsx(style.projectNumber, 'mb-0')}>{rowData?.project?.number}</h6>
            </div>
        </div>
    }

    const startBody = (rowData) => {
        return formatDate(rowData.from_date)
    }

    const endBody = (rowData) => {
        return formatDate(rowData.to_date)
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
            <DataTable ref={ref} value={tasks} scrollable selectionMode={'checkbox'}
                columnResizeMode="expand" resizableColumns showGridlines size={'large'}
                scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`} className="border" selection={selected}
                onSelectionChange={(e) => setSelected(e.value)}
                loading={loading}
                loadingIcon={loadingIconTemplate}
                emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue}/>}
                sortField={sort?.sortField}
                sortOrder={sort?.sortOrder}
                onSort={onSort}
                rowClassName={rowClassName}
            >
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field="number" header="Task ID" body={idBody} style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field="title" header="Task Title" style={{ minWidth: '150px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen></Column>
                <Column field="user.full_name" header="Assigne" body={nameBody} style={{ minWidth: '208px' }}></Column>
                <Column field="finished" header="Status" body={statusBody} style={{ minWidth: '120px' }}></Column>
                <Column field="project.reference" header="Project" body={projectBody} style={{ minWidth: '460px' }}></Column>
                <Column field="from_date" header="Start Date" body={startBody} style={{ minWidth: '100px' }} sortable></Column>
                <Column field="to_date" header="Due Date" body={endBody} style={{ minWidth: '100px' }} sortable></Column>
            </DataTable>
            <ViewTaskModal view={visible} setView={setVisible} taskId={taskId} setTaskId={setTaskId} reInitilize={()=> setRefetch((refetch)=> !refetch)}/>
        </>
    )
});

export default TaskTable