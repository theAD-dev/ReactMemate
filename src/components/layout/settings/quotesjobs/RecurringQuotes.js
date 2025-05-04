import React, { useEffect, useState } from 'react';
import { CardChecklist, CheckCircleFill } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { toast } from 'sonner';
import style from './quote.module.scss';
import RecurringJobActions from './RecurringJobActions';
import { getRecurring } from '../../../../APIs/settings-recurring-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Loader from '../../../../shared/ui/loader/loader';

function formatDate(timestampMs) {
    const date = new Date(+timestampMs * 1000);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const frequencyMap = {
    D: 'Daily',
    W: 'Weekly',
    B: 'Biweekly',
    M: 'Monthly',
    L: 'Last Day of the Month',
    Q: 'Quarterly',
    Y: 'Yearly',
};

const RecurringQuotes = () => {
    const { trialHeight } = useTrialHeight();
    const [currentPage, setCurrentPage] = useState(1);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const itemsPerPage = 5;

    const offset = (currentPage - 1) * itemsPerPage;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['recurring', itemsPerPage, offset],
        queryFn: () => getRecurring({ limit: itemsPerPage, offset }),
        keepPreviousData: true,
    });

    useEffect(() => {
        refetch();
    }, [currentPage, refetch]);

    const { results = [], count } = data || {};
    const totalPages = Math.ceil(count / itemsPerPage) || 1;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleActionComplete = (action) => {
        // Show a success message based on the action
        const actionMessages = {
            'delete': 'Recurring job deleted successfully',
            'pause': 'Recurring job paused successfully',
            'activate': 'Recurring job activated successfully'
        };

        toast.success(actionMessages[action] || 'Action completed successfully');

        // Refetch the data to update the UI
        refetch();
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <CardChecklist size={24} color="#1AB2FF" className='mb-0' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    Recurring History
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-between'>
            <span></span>
            <div className='d-flex justify-content-end gap-2'>
                <Button className='outline-button' onClick={() => setShowHistory(false)}>Close</Button>
            </div>
        </div>
    );

    const handleOpen = (pk) => {
        const currentHistory = results.find((item) => item.pk === pk);
        setHistory(currentHistory.history || []);
        setShowHistory(true);
    };

    return (
        <>
            <Helmet>
                <title>MeMate - Recurring Quotes</title>
            </Helmet>
            <div className='headSticky'>
                <h1>Quotes & Jobs</h1>
                <div className='contentMenuTab'>
                    <ul>
                        <li className='menuActive'><Link to="/settings/quotesjobs/recurring-quotes">Recurring Quotes</Link></li>
                        <li><Link to="/settings/quotesjobs/recurring-jobs">Recurring Jobs</Link></li>
                    </ul>
                </div>
            </div>
            <div className={`content_wrap_main`} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
                <div className='listwrapper'>
                    <div className="topHeadStyle mb-4 align-items-center">
                        <h2 className='mb-0'>Recurring Quotes</h2>
                    </div>

                    <DataTable value={results} showGridlines tableStyle={{ minWidth: '50rem' }}>
                        <Column header="Client name" field="client.name" body={(rowData) => (
                            <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
                                <div className='ellipsis-width'>{rowData.client.name}</div>
                                <Button label="Open" onClick={() => handleOpen(rowData.pk)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
                            </div>
                        )} style={{ width: 'auto' }}></Column>
                        <Column header="Order Reference" field="project.reference" body={(rowData) => <div className='ellipsis-width' style={{ maxWidth: '300px', fontWeight: 600 }}>{rowData?.project?.reference || ''}</div>} style={{ width: 'auto' }}></Column>
                        <Column header="Frequency" field="frequency" body={(rowData) => frequencyMap[rowData.frequency]} style={{ width: 'auto' }}></Column>
                        <Column header="Date started" field="start_date" body={(rowData) => formatDate(rowData.start_date)} style={{ width: 'auto' }}></Column>
                        <Column header="Occurrences" field="occurrences" style={{ width: 'auto' }}></Column>
                        <Column header="Processed" field="processed" style={{ width: 'auto' }}></Column>
                        <Column header="Status" field="active" body={(rowData) => rowData.active ? <CheckCircleFill size={24} color="#17B26A" /> : ''} style={{ width: 'auto' }}></Column>
                        <Column header="Actions" field="" className='text-center' body={(rowData) => (
                            <RecurringJobActions
                                jobId={rowData.pk}
                                status={rowData.active ? 'active' : 'inactive'}
                                onActionComplete={handleActionComplete}
                            />
                        )} style={{ width: 'auto' }}></Column>
                    </DataTable>

                    <div className="bottomPagenation">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        className="page-link"
                                        style={{ borderRadius: '20px' }}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        className="page-link"
                                        style={{ borderRadius: '20px' }}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <div className="countpage">
                            <p>Page {currentPage} of {totalPages}</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                isLoading && <Loader />
            }
            <Dialog visible={showHistory} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => setShowHistory(false)}>
                <DataTable value={history || []} showGridlines tableStyle={{ minWidth: '50rem' }}>
                    <Column header="#" field="pk" body={(rowData, { rowIndex }) => <>{rowIndex + 1}</>} style={{ width: 'auto' }}></Column>
                    <Column header="Date" field="date" body={(rowData) => formatDate(rowData.date)} style={{ width: 'auto' }}></Column>
                    <Column header="Project Number" field="project.number" style={{ width: 'auto' }}></Column>
                    <Column header="Project Reference" field="project.reference" body={(rowData) => <div className='ellipsis-width' style={{ maxWidth: '300px' }}>{rowData?.project?.reference || ''}</div>} style={{ width: 'auto' }}></Column>
                    <Column header="Processed" field="processed" body={(rowData) => rowData.processed ? <CheckCircleFill size={24} color="#17B26A" /> : ''} style={{ width: 'auto' }}></Column>
                </DataTable>
            </Dialog>
        </>
    );
};

export default RecurringQuotes;
