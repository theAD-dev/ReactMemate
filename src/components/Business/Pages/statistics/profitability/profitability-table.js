import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from "primereact/dialog";
import { Tag } from 'primereact/tag';
import style from './profitability.module.scss';
import { getListOfOrder } from '../../../../../APIs/OrdersApi';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import exploreOperatingimg from "../../../../../assets/images/icon/exploreOperatingimg.png";
import { formatDate } from '../../../../../shared/lib/date-format';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import Loader from '../../../../../shared/ui/loader/loader';
import ImageAvatar from '../../../../../ui/image-with-fallback/image-avatar';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';

const OrdersTable = forwardRef(({ searchValue, selectedOrder, setSelectedOrder, isShowDeleted, filter }, ref) => {
  const observerRef = useRef(null);
  const { trialHeight } = useTrialHeight();
  const [visible, setVisible] = useState(false);
  const [orders, setOrders] = useState([]);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'number', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: 'number', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setPage(1);
  }, [searchValue, isShowDeleted, filter]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      // Build filter parameters
      const filterParams = {};
      
      if (filter?.status?.length > 0) {
        filterParams.status = filter.status.map(s => s.value).join(',');
      }
      
      if (filter?.clients?.length > 0) {
        filterParams.clients = filter.clients.map(c => c.id).join(',');
      }
      
      if (filter?.date?.length > 0 && filter.date[0].value) {
        const [startDate, endDate] = filter.date[0].value;
        if (startDate) {
          filterParams.create_date_after = formatDateForAPI(startDate);
        }
        if (endDate) {
          filterParams.create_date_before = formatDateForAPI(endDate);
        }
      }

      const data = await getListOfOrder(page, limit, searchValue, order, isShowDeleted, filterParams);

      if (page === 1) setOrders(data.results);
      else {
        if (data?.results?.length > 0)
          setOrders(prev => {
            const existingOrderIds = new Set(prev.map(order => order.unique_id));
            const newOrder = data.results.filter(order => !existingOrderIds.has(order.unique_id));
            return [...prev, ...newOrder];
          });
      }
      setSort(tempSort);
      setHasMoreData(data.count !== orders.length);
      setLoading(false);
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchValue, tempSort, isShowDeleted, filter]);

  function formatDateForAPI(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (orders.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
      if (lastRow) observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [orders, hasMoreData]);

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    const percentage = Math.round((value / total) * 100);
    return percentage > 100 ? -(percentage - 100) : percentage;
  };

  const orderBody = (rowData) => {
    return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
      <div className={`d-flex flex-column`} style={{ lineHeight: '1.385' }}>
        {rowData.number}
        <span style={{ color: '#98A2B3' }} className='font-12'>{formatDate(rowData.created)}</span>
      </div>
      {/* <Button label="Open" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text /> */}
    </div>;
  };

  const customerBody = (rowData) => {
    return <div className='d-flex align-items-center'>
      <ImageAvatar has_photo={rowData?.client?.has_photo} photo={rowData?.client?.photo} is_business={rowData?.client?.is_business} />
      <div className='d-flex flex-column gap-1'>
        <div className={`${style.ellipsis}`}>{rowData.client.name}</div>
        {rowData.deleted ?
          <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
      </div>
    </div>;
  };

  const statusBody = (rowData) => {
    return (
      <div className='d-flex align-items-center'>
        <div className={`d-flex justify-content-center align-items-center`}>
          {rowData.status === "In progress" ? (
            <span className={style.lostProfit}>{rowData.status}</span>
          ) : (
            <span className={style.statusComplete}>{rowData.status}<span className="dots"></span></span>
          )}
        </div>
      </div>
    );
  };

  const redCircularProgressbar = (percentage) => {
    return <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      strokeWidth={11}
      styles={buildStyles({
        pathColor: '#F04438',
        trailColor: '#EAECF0',
        textColor: '#667085',
        textSize: '25px',
        pathTransitionDuration: 0.5,
      })}
    />;
  };

  const yellowCircularProgressbar = (percentage) => {
    return <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      strokeWidth={11}
      styles={buildStyles({
        pathColor: '#F79009',
        trailColor: '#EAECF0',
        textColor: '#667085',
        textSize: '25px',
        pathTransitionDuration: 0.5,
      })}
    />;
  };

  const greenCircularProgressbar = (percentage) => {
    return <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      strokeWidth={11}
      styles={buildStyles({
        pathColor: '#17B26A',
        trailColor: '#EAECF0',
        textColor: '#667085',
        textSize: '25px',
        pathTransitionDuration: 0.5,
      })}
    />;
  };

  const costOfSaleBody = (rowData) => {
    const real_cost = rowData.labor_expenses + rowData.cost_of_sale + rowData.operating_expense;
    const cost_of_sale_percentage = getPercentage(rowData.cost_of_sale, real_cost);

    return <div
      className={`d-flex align-items-center ${style.piCircleStyle} ${style.saleCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        {redCircularProgressbar(cost_of_sale_percentage)}
      </div>
      <span>${formatAUD(rowData.cost_of_sale)}</span>
    </div>;
  };

  const labourBody = (rowData) => {
    const real_cost = rowData.labor_expenses + rowData.cost_of_sale + rowData.operating_expense;
    const labor_expenses_percentage = getPercentage(rowData.labor_expenses, real_cost);

    return <div
      className={`d-flex align-items-center ${style.piCircleStyle} ${style.labourCostCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        {yellowCircularProgressbar(labor_expenses_percentage)}
      </div>
      <span>${formatAUD(rowData.labor_expenses)}</span>
    </div>;
  };

  const OperatingExpenseBody = (rowData) => {
    const real_cost = rowData.labor_expenses + rowData.cost_of_sale + rowData.operating_expense;
    const operating_expense_percentage = getPercentage(rowData.operating_expense, real_cost);

    return <div
      className={`d-flex align-items-center ${style.piCircleStyle} ${style.operCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value={operating_expense_percentage}
          text={`${operating_expense_percentage}%`}
          strokeWidth={11}
          styles={buildStyles({
            pathColor: '#1AB2FF',
            trailColor: '#EAECF0',
            textColor: '#667085',
            textSize: '25px',
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
      <span>${formatAUD(rowData.operating_expense)}</span>
    </div>;
  };

  const realCost = (rowData) => {
    const real_cost = rowData.labor_expenses + rowData.cost_of_sale + rowData.operating_expense;

    return <div
      className={`d-flex align-items-center ${style.piCircleStyle} ${style.RealCostCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <span>${formatAUD(real_cost)}</span>
    </div>;
  };

  const budget = (rowData) => {
    return <div
      className={`d-flex align-items-center ${style.piCircleStyle} ${style.budgetStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <span>${formatAUD(rowData.budget)}</span>
    </div>;
  };

  const totalInvoice = (rowData) => {
    return <div className='d-flex align-items-center'>
      <div className={`d-flex justify-content-center align-items-center`}>
        ${formatAUD(rowData.total)}
      </div>
    </div>;
  };


  const profitBodyTemplate = (rowData) => {
    const real_cost = rowData.labor_expenses + rowData.cost_of_sale + rowData.operating_expense;
    const profit = rowData.total - real_cost;
    const profitPercentage = getPercentage(profit, rowData.total);


    return <div className={`d-flex align-items-center gap-2`}>
      <div style={{ width: 32, height: 32 }}>
        {profitPercentage < 0 ? redCircularProgressbar(profitPercentage)
          : profitPercentage < 10 ? yellowCircularProgressbar(profitPercentage)
            : greenCircularProgressbar(profitPercentage)}
      </div>
      {profitPercentage < 0 ? <Tag className={`profit ${style.lostProfit} rounded`} value={`$ ${formatAUD(rowData.profit)}`} />
        : profitPercentage < 10 ? <Tag className={`profit ${style.completeProfit} rounded`} value={`$ ${formatAUD(rowData.profit)}`} />
          : <Tag className={`profit ${style.inProgressProfit} rounded`} value={`$ ${formatAUD(rowData.profit)}`} />}
    </div>;
  };

  const rowClassName = (data) => (data?.deleted ? style.deletedRow : '');

  const onSort = (event) => {
    const { sortField, sortOrder } = event;

    setTempSort({ sortField, sortOrder });
    setPage(1);  // Reset to page 1 whenever searchValue changes
  };

  const handleClose = () => {
    setVisible(false);
  };

  const headerElementg = (
    <div className={`${style.modalHeader}`}>
      <div className="d-flex align-items-center gap-2">
        <img src={exploreOperatingimg} alt={exploreOperatingimg} />
      </div>
    </div>
  );

  return (
    <>
      <DataTable ref={ref} value={orders} scrollable selectionMode={'checkbox'}
        columnResizeMode="expand" resizableColumns showGridlines size={'large'}
        scrollHeight={`calc(100vh - 175px - 48px - ${trialHeight}px)`} className="border" selection={selectedOrder}
        onSelectionChange={(e) => setSelectedOrder(e.value)}
        loading={loading}
        loadingIcon={Loader}
        emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue} />}
        sortField={sort?.sortField}
        sortOrder={sort?.sortOrder}
        onSort={onSort}
        rowClassName={rowClassName}
      >
        <Column selectionMode="multiple" bodyClassName={'show-on-hover border-end-0'} headerClassName='border-end-0' headerStyle={{ width: '3rem', zIndex: 1 }} frozen></Column>
        <Column field="number" header="Project #" body={orderBody} style={{ minWidth: '155px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen sortable></Column>
        <Column field="client.name" header="Customer" body={customerBody} style={{ minWidth: '224px' }} sortable></Column>
        <Column field="reference" header="Project Reference" body={(rowData) => <div className='ellipsis-width' title={rowData.reference} style={{ maxWidth: '400px' }}>{rowData.reference}</div>} style={{ minWidth: '400px' }} ></Column>
        <Column header="Info" body={<InfoCircle color='#667085' size={16} />} bodyClassName={"text-center"} style={{ minWidth: '68px' }}></Column>
        <Column field="status" header="Status" body={statusBody} style={{ minWidth: '113px' }} sortable></Column>

        <Column field="cost_of_sale" header="Cost of Sale" body={costOfSaleBody} style={{ minWidth: '146x', textAlign: 'center' }} sortable></Column>
        <Column field="labor_expenses" header="Labour" body={labourBody} style={{ minWidth: '149px', textAlign: 'right' }} sortable></Column>
        <Column field="operating_expense" header="Operating Expense" body={OperatingExpenseBody} style={{ minWidth: '152x', textAlign: 'center' }} sortable></Column>

        <Column field="realcost" header="Real Cost" body={realCost} style={{ minWidth: '113px', textAlign: 'right' }} sortable></Column>
        <Column field="budget" header="Budget" body={budget} style={{ minWidth: '110px' }} className='text-end' sortable></Column>

        <Column field="total" body={totalInvoice} header="Total Invoice" style={{ minWidth: '101x', textAlign: 'center' }} sortable></Column>
        <Column field='profit' header="Operational Profit" body={profitBodyTemplate} bodyClassName={"text-end"} style={{ minWidth: '150px' }} sortable></Column>
      </DataTable>

      <Dialog
        visible={visible}
        modal={true}
        header={headerElementg}
        className={`${style.modal} ${style.exploreModel} custom-modal custom-scroll-integration `}
        onHide={handleClose}>
        <div className="d-flex flex-column">
          <h2>Explore Operating Expense</h2>
          <ul>
            <li>
              <h3>Yearly based expenses total amount: <strong>$51894.66</strong></h3>
            </li>
            <li>
              <h3>Monthly based expenses total amount:  <strong>$6893.32</strong></h3>
            </li>
            <li>
              <h3>Number of invoices:  <strong>6</strong></h3>
            </li>
            <li>
              <h3>One month:  <strong>$51894.66 / 12 + $6893.32 = 11217.88;$11217.88 / 6 = $1869.65</strong></h3>
            </li>
          </ul>
        </div>
      </Dialog>
    </>
  );
});
export default OrdersTable;