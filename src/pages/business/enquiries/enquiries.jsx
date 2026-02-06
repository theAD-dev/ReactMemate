import { useState } from 'react';
import { ArrowCounterclockwise, Gear, InputCursorText, Trash, WindowSidebar } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { useDebounce } from 'primereact/hooks';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import EnquiriesTable from './enquires-table';
import style from './enquiries.module.scss';
import { bulkDeleteSubmissions, bulkRestoreSubmissions, getEnquiryCounts } from '../../../APIs/enquiries-api';
import { useAuth } from '../../../app/providers/auth-provider';
import CreateEnquiry from '../../../features/business/enquiries/create-enquiry/create-enquiry';
import { EnquiryFilterDropdown, EnquiryFilters } from '../../../features/business/enquiries/enquiry-filters';

const Enquiries = () => {
  const { session } = useAuth();
  const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [isShowDeleted, setIsShowDeleted] = useState(false);
  const [showCreateEnquiry, setShowCreateEnquiry] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState({});

  const enquiriesCountQuery = useQuery({ queryKey: ['getEnquiryCounts'], queryFn: () => getEnquiryCounts(session?.organization?.id), enabled: !!session?.organization?.id });
  document.querySelectorAll('.enquiries-badge').forEach(el => {
    el.style.display = enquiriesCountQuery?.data?.count > 0 ? 'inline-block' : 'none';
    el.innerText = enquiriesCountQuery?.data?.count > 99 ? '99+' : enquiriesCountQuery?.data?.count;
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => bulkDeleteSubmissions(ids),
    onSuccess: () => {
      setSelectedSubmissions([]);
      setRefetchTrigger((prev) => !prev);
      enquiriesCountQuery?.refetch();
      toast.success('Submissions deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting submissions:', error);
      toast.error('Failed to delete submissions');
    }
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids) => bulkRestoreSubmissions(ids),
    onSuccess: () => {
      setSelectedSubmissions([]);
      setRefetchTrigger((prev) => !prev);
      enquiriesCountQuery?.refetch();
      toast.success('Submissions restored successfully');
    },
    onError: (error) => {
      console.error('Error restoring submissions:', error);
      toast.error('Failed to restore submissions');
    }
  });

  const handleBulkDelete = () => {
    if (selectedSubmissions.length === 0) return;
    const ids = selectedSubmissions.map(submission => submission.id);
    bulkDeleteMutation.mutate(ids);
  };

  const handleBulkRestore = () => {
    if (selectedSubmissions.length === 0) return;
    const ids = selectedSubmissions.map(submission => submission.id);
    bulkRestoreMutation.mutate(ids);
  };

  return (
    <>
      <Helmet>
        <title>MeMate - Enquiries</title>
      </Helmet>
      <div className={`topbar ${selectedSubmissions?.length ? style.active : ''} ${isShowDeleted ? style.deletedMode : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
        <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
          {selectedSubmissions?.length ? (
            <>
              <h6 className={style.selectedCount}>Selected: {selectedSubmissions?.length}</h6>
              <div className='filtered-box d-flex' style={{ gap: '8px' }}>
                {isShowDeleted ? (
                  <button 
                    className={style.restoreButton} 
                    onClick={handleBulkRestore}
                    disabled={bulkRestoreMutation.isPending}
                    title="Restore selected"
                  >
                    {bulkRestoreMutation.isPending ? (
                      <ProgressSpinner style={{ width: '16px', height: '16px' }} strokeWidth="4" />
                    ) : (
                      <ArrowCounterclockwise size={16} color="#067647" />
                    )}
                  </button>
                ) : (
                  <button 
                    className={style.actionButton} 
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    title="Delete selected"
                  >
                    {bulkDeleteMutation.isPending ? (
                      <ProgressSpinner style={{ width: '16px', height: '16px' }} strokeWidth="4" />
                    ) : (
                      <Trash size={16} color="#D92D20" />
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className='filtered-box'>
                <EnquiryFilterDropdown 
                  setFilters={setStatusFilter} 
                  filter={statusFilter} 
                  isShowDeleted={isShowDeleted}
                  setIsShowDeleted={(value) => {
                    setSelectedSubmissions([]);
                    setIsShowDeleted(value);
                  }}
                />
              </div>
              <div className="searchBox" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                  </svg>
                </div>
                <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
              </div>
            </>
          )}
        </div>
        <div className="featureName d-flex align-items-center gap-3" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <Link
            to={"/enquiries"}
            className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink, { [style.active]: filterType === 'all' })}
            onClick={() => setFilterType('all')}
          >
            <span className={style.topBarText}>All</span>
          </Link>

          <Link
            to={"/enquiries"}
            className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink, { [style.active]: filterType === 'web' })}
            onClick={() => setFilterType('web')}
          >
            <WindowSidebar color='#9E77ED' size={16} className='me-2' />
            <span className={style.topBarText}>Web</span>
          </Link>

          <Link
            to={"/enquiries"}
            className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink, { [style.active]: filterType === 'form' })}
            onClick={() => setFilterType('form')}
          >
            <InputCursorText color='#F79009' size={16} className='me-2' />
            <span className={style.topBarText}>Form</span>
          </Link>

          {/* <Link 
            to={"/enquiries"} 
            className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink, { [style.active]: filterType === 'fb-in' })}
            onClick={() => setFilterType('fb-in')}
          >
            <Collection color='#084095' size={16} className='me-2' />
            <span className={style.topBarText}>Fb/In</span>
          </Link> */}
        </div>
        <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
          <Button
            className={`solid-button font-14 ${style.newButton}`}
            onClick={() => setShowCreateEnquiry(true)}
          >
            New Enquiry
          </Button>
          <Link to={"/enquiries/forms"}><Button className='info-button py-1 font-14'>Set Up <Gear color='#158ECC' size={20} /></Button></Link>
        </div>
      </div>

      {Object.keys(statusFilter).length > 0 && (
        <EnquiryFilters setFilters={setStatusFilter} filter={statusFilter} />
      )}

      <EnquiriesTable
        searchValue={debouncedValue}
        selectedSubmissions={selectedSubmissions}
        setSelectedSubmissions={setSelectedSubmissions}
        isShowDeleted={isShowDeleted}
        refetchTrigger={refetchTrigger}
        setRefetchTrigger={setRefetchTrigger}
        filterType={filterType}
        enquiriesCountQuery={enquiriesCountQuery}
        statusFilter={statusFilter}
      />

      {/* Create Enquiry Sidebar */}
      <CreateEnquiry
        refetchTrigger={setRefetchTrigger}
        visible={showCreateEnquiry}
        setVisible={setShowCreateEnquiry}
        enquiriesCountQuery={enquiriesCountQuery}
      />
    </>
  );
};

export default Enquiries;