import { forwardRef, useEffect, useRef, useState } from 'react';
import { InputCursorText, WindowSidebar } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import ActionsMenu from './actions-menu';
import style from './enquiry-forms-table.module.scss';
import { getListOfForms } from '../../../../APIs/enquiries-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatDate } from '../../../../shared/lib/date-format';
import Loader from '../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';

const EnquiryFormsTable = forwardRef(({ searchValue, isShowDeleted, refetch }, ref) => {
  const { trialHeight } = useTrialHeight();
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [forms, setForms] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'id', sortOrder: 1 });
  const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: 1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setPage(1);
  }, [searchValue, isShowDeleted, refetch]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      const data = await getListOfForms(page, limit, searchValue, order, isShowDeleted);
      if (page === 1) setForms(data.results);
      else {
        if (data?.results?.length > 0)
          setForms(prev => {
            const existingFormIds = new Set(prev.map(form => form.id));
            const newForms = data.results.filter(form => !existingFormIds.has(form.id));
            return [...prev, ...newForms];
          });
      }
      setSort(tempSort);
      setHasMoreData(data.count !== forms.length);
      setLoading(false);
    };

    loadData();
  }, [page, searchValue, tempSort, isShowDeleted, refetch]);

  useEffect(() => {
    if (forms.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
      if (lastRow) observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [forms, hasMoreData]);

  const titleBody = (rowData) => {
    return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
      <div className='d-flex align-items-center gap-2'>
        {
          rowData.type == 'web' ? <div className={style.webIcon}>
            <WindowSidebar size={12} color='#9E77ED' />
          </div>
            : <div className={style.formIcon}>
              <InputCursorText size={12} color='#F79009' />
            </div>
        }
        <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
          <span style={{ color: '#667085', fontSize: '14px' }}>{rowData.title || "-"}</span>
          <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created)}</span>
        </div>
      </div>

      <Button label="Open" onClick={() => navigate(`/enquiries/form-builder/${rowData.id}`)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
    </div>;
  };

  const domainBody = (rowData) => {
    return <Link to={`https://${rowData.domain}`} style={{ color: '#667085' }} target="_blank" className={style.ellipsis}>
      {rowData.domain}
    </Link>;
  };

  const createdBody = (rowData) => {
    return new Date(rowData.created * 1000).toLocaleDateString();
  };

  const rowClassName = (data) => (data?.deleted ? style.deletedRow : '');

  const onSort = (event) => {
    const { sortField, sortOrder } = event;
    setTempSort({ sortField, sortOrder });
    setPage(1);
  };

  const actionsBody = (rowData) => {
    return <ActionsMenu rowData={rowData} />;
  };

  return (
    <DataTable ref={ref} value={forms} scrollable columnResizeMode="expand" resizableColumns showGridlines size={'large'} scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`} className="border" loading={loading}
      loadingIcon={Loader}
      emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue || !!isShowDeleted} />}
      sortField={sort?.sortField}
      sortOrder={sort?.sortOrder}
      onSort={onSort}
      rowClassName={rowClassName}
    >
      <Column field="id" header="ID" style={{ width: '70px' }} />
      <Column field="title" header="Name" body={titleBody} style={{ minWidth: '150px' }} sortable />
      <Column field="fields" header="Total Fields" body={(rowData) => <span>{rowData.fields?.length || 0}</span>} style={{ width: '100px', textAlign: 'right', color: '#667085' }} sortable />
      <Column field="domain" header="Domain" body={domainBody} style={{ minWidth: '200px' }} sortable />
      <Column field="created" header="Created At" body={createdBody} style={{ minWidth: '120px', maxWidth: '200px', width: '120px' }} sortable />
      <Column field="submit_to" header="Submit To" body={(rowData) => <span style={{ color: '#667085' }}>{rowData.submit_to}</span>} style={{ minWidth: '250px' }} />
      <Column header="Actions" body={actionsBody} style={{ minWidth: '75px', maxWidth: '75px', width: '75px', textAlign: 'center' }} />
    </DataTable>
  );
});

export default EnquiryFormsTable;