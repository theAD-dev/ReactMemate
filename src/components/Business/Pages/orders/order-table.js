import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Building, InfoCircle, Person } from 'react-bootstrap-icons';
import { Tag } from 'primereact/tag';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Chip } from 'primereact/chip';
import style from './order.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { getListOfOrder } from '../../../../APIs/OrdersApi';
import { Button } from 'primereact/button';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import { Spinner } from 'react-bootstrap';
import { Dialog } from "primereact/dialog";
import exploreOperatingimg from "../../../../assets/images/icon/exploreOperatingimg.png";

const OrdersTable = forwardRef(({ searchValue, selectedOrder, setSelectedOrder, isShowDeleted }, ref) => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [orders, setOrders] = useState([]);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setPage(1);  // Reset to page 1 whenever searchValue changes
  }, [searchValue, isShowDeleted]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      const data = await getListOfOrder(page, limit, searchValue, order, isShowDeleted);

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
      setHasMoreData(data.count !== orders.length)
      setLoading(false);
    };

    loadData();

  }, [page, searchValue, tempSort, isShowDeleted]);

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

  const orderBody = (rowdata) => {
    return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
      <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
        {rowdata.number}
      </div>
      {/* <Button label="Open" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text /> */}
    </div>
  }

  // const calculationBody = (rowData) => {
  //   return <div className='d-flex align-items-center justify-content-center gap-4'>
  //   <Link to={"#"}><div><PlusSlashMinus color='#FDB022' size={16}/></div></Link>
  //   <Link to={rowData.quote_url}><FilePdf color='#FF0000' size={16}/></Link>
  //   <Link to={rowData.unique_url}><Link45deg color='#3366CC' size={16}/></Link>
  // </div>
  // }

  const customerBody = (rowData) => {
    return <div className='d-flex align-items-center'>
      <div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.orderImg} ${rowData.is_business ? "" : "rounded-circle"}`}>
        {rowData.client.has_photo ? <img src={rowData.client.photo} alt='clientImg' className='w-100' /> : rowData.client.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
      </div>
      <div className='d-flex flex-column gap-1'>
        <div className={`${style.ellipsis}`}>{rowData.client.name}</div>
        {rowData.deleted ?
          <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
      </div>
    </div>
  }

  const totalInvocide = (rowData) => {
    return <div className='d-flex align-items-center'>
      <div className={`d-flex justify-content-center align-items-center`}>
        $ {(rowData.total).toFixed(2)}
      </div>
    </div>
  }

  const statusBody = (rowData) => {
    return (
      <div className='d-flex align-items-center'>
        <div className={`d-flex justify-content-center align-items-center`}>
       
            {rowData.status === "In progress" ? (
            <><span className={style.statusComplete}> Complete </span></>
          ) : (
            <>In Complete <span className="dots"></span></>
          )}
        </div>
      </div>
    );
  };
  
  const reaclCost = (rowData) => {
    const realCost = (rowData.labor_expenses + rowData.cost_of_sale + rowData.operating_expense) / rowData.total * 100;

    return <div
      className={`d-flex justify-content-center align-items-center ${style.piCircleStyle} ${style.RealCostCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value={realCost}
          text={`${realCost}%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${realCost / 100})`,
              strokeLinecap: 'butt',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: '#25D5D0',
              strokeLinecap: '#EAECF0',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            text: {
              fill: '#667085',
              fontSize: '30px',
              textAnchor: 'middle',
              dominantBaseline: 'middle',

            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>${rowData.real_cost}</span>
    </div>
  }

  const labourBody = (rowData) => {
    const labourCost = (rowData.real_cost + rowData.cost_of_sale + rowData.operating_expense) / rowData.total * 100;
    return <div
      className={`d-flex justify-content-center align-items-center ${style.piCircleStyle} ${style.labourCostCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >

      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value={labourCost}
          text={`${labourCost}%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${labourCost / 100})`,
              strokeLinecap: 'butt',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: '#F79009',
              strokeLinecap: '#EAECF0',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            text: {
              fill: '#667085',
              fontSize: '30px',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>${rowData.labor_expenses}</span>
    </div>
  }

  const costofSaleBody = (rowData) => {
    const costofsale = (rowData.real_cost + rowData.labor_expenses + rowData.operating_expense) / rowData.total * 100;
    return <div
      className={`d-flex justify-content-center align-items-center ${style.piCircleStyle} ${style.saleCircleStyle}`}
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value={costofsale}
          text={`${costofsale}%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${costofsale / 100})`,
              strokeLinecap: 'butt',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: '#F04438',
              strokeLinecap: '#EAECF0',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            text: {
              fill: '#667085',
              fontSize: '30px',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>${rowData.cost_of_sale}</span>
    </div>
  }

  const OperatingExpenseBody = (rowData) => {
    const oeCast = (rowData.real_cost + rowData.labor_expenses + rowData.cost_of_sale) / rowData.total * 100;
    return <div onClick={setVisible}
      className={`d-flex justify-content-center align-items-center  ${style.piCircleStyle} ${style.operCircleStyle}` }
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value={oeCast}
          text={`${oeCast}%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${oeCast / 100})`,
              strokeLinecap: 'butt',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: '#1AB2FF',
              strokeLinecap: '#EAECF0',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
            text: {
              fill: '#667085',
              fontSize: '30px',
              textAnchor: 'middle',
              dominantBaseline: 'middle',
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>${rowData.operating_expense}</span>
    </div>
  }

  const profitBodyTemplate = (rowData) => {
    const status = rowData.status;
    switch (status) {
      case 'In progress':
        return <Tag className={`profit ${style.inProgressProfit} rounded`} value={`$ ${rowData.profit}`} />
      case 'Complete':
        return <Tag className={`profit ${style.completeProfit} rounded`} value={`$ ${rowData.profit}`} />
      case 'Lost':
        return <Tag className={`profit ${style.lostProfit} rounded`} value={`$ ${rowData.profit}`} />
      default:
        return <Tag className={`profit ${style.defaultProfit} rounded`} value={`$ ${rowData.profit}`} />;
    }
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

  const handleClose = (e) => {
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
      scrollHeight={"calc(100vh - 175px)"} className="border" selection={selectedOrder}
      onSelectionChange={(e) => setSelectedOrder(e.value)}
      loading={loading}
      loadingIcon={loadingIconTemplate}
      emptyMessage={NoDataFoundTemplate}
      sortField={sort?.sortField}
      sortOrder={sort?.sortOrder}
      onSort={onSort}
      rowClassName={rowClassName}
    >
      <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
      <Column field="number" header="Order #" body={orderBody} style={{ minWidth: '205px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen sortable></Column>
      <Column field="client.name" header="Customer" body={customerBody} style={{ minWidth: '186px' }}   sortable></Column>
      <Column field="reference" header="Order Reference" style={{ minWidth: '221px' }} ></Column>
      <Column header="Info" body={<InfoCircle color='#667085' size={16} />} bodyClassName={"text-center"} style={{ minWidth: '68px' }}></Column>
      <Column field="status" header="Status" body={statusBody} style={{ minWidth: '113px' }} sortable></Column>
      <Column field="budget" header="Budget" style={{ minWidth: '110px' }} className='text-end' ></Column>
      <Column field="realcost" header="Real Cost" body={reaclCost} style={{ minWidth: '113px', textAlign: 'right' }} ></Column>
      <Column field="labor_expenses" header="Labour" body={labourBody} style={{ minWidth: '149px', textAlign: 'right' }} sortable></Column>
      <Column field="cost_of_sale" header="Cost of Sale" body={costofSaleBody} style={{ minWidth: '146x', textAlign: 'center' }} sortable></Column>
      <Column field="operating_expense" header="Operating Expense" body={OperatingExpenseBody} style={{ minWidth: '152x', textAlign: 'center' }} sortable></Column>
      <Column field="total" body={totalInvocide} header="Total Invoice" style={{ minWidth: '101x', textAlign: 'center' }} ></Column>
      <Column field='profit' header="operationalprofit" body={profitBodyTemplate} bodyClassName={"text-end"} style={{ minWidth: '150px' }} sortable></Column>
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
) 
})
export default OrdersTable