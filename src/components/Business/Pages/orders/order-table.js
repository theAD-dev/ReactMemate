import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from "react-router-dom";
import style from './order.module.scss';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { PlusSlashMinus, FilePdf, Link45deg, Building, Person, InfoCircle } from 'react-bootstrap-icons';
import { Badge } from 'primereact/badge';
import { CircularProgressbar } from 'react-circular-progressbar';

export const CustomerService = {
  getData() {
    return [
      {

        id: 1,
        order: "568129-1",
        calculation: "",
        customer: "Emanate Legal",

        orderreference: "Proj-8103 | RiskManagemen...",
        info: "",
        status: "In Progress",
        budget: "$500.00",
        realcost: "$601.13",
        labour: "$18,000",
        costsale: "$18,000",
        operatingexpense: "$1,200",
        totalinvoice: "$5,678.90",
        operationalprofit: "$4,655.67",
      },

    ];
  },
  getCustomersSmall() {
    return Promise.resolve(this.getData().slice(0, 2));
  },
  getCustomersLarge() {
    return Promise.resolve(this.getData().slice(0, 25));
  },
  getCustomersPaginated(page, rowsPerPage) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = page * rowsPerPage;
    return Promise.resolve(this.getData().slice(startIndex, endIndex));
  }
};


const OrdersTable = () => {
  const observerRef = useRef(null);

  const [order, setOrder] = useState([]);
  console.log('order: ', order.length);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const rowsPerPage = 2; // Number of rows to fetch per page

  useEffect(() => {
    const loadData = async () => {
      const data = await CustomerService.getCustomersPaginated(page, rowsPerPage);
      console.log('data: ', data.length);
      if (data.length > 0) {
        setOrder(prevOrder => [...prevOrder, ...data]);
      } else {
        setHasMoreData(false);
      }
    };

    loadData();
  }, [page]);

  useEffect(() => {
    if (order.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          console.log('Fetching more data...');
          setPage(prevPage => prevPage + 1); // Increment the page number
        }
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:last-child');
      if (lastRow) {
        observerRef.current.observe(lastRow);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [order, hasMoreData]);

  const orderBody = (rowdata) => {
    return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
      <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
        {rowdata.order}
      </div>
      <Button label="Open" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text />
    </div>
  }

  const calculationBody = (rowData) => {
    return <>
      <ul className="disPlayInline disPlayInlineCenter">
        <li className="">
          <Link to="">
            <PlusSlashMinus color="#FDB022" size={16} />
          </Link>
        </li>
        <li className="">
          <Link to="" target="_blank" rel="noopener noreferrer">
            <FilePdf color="#FF0000" size={16} />
          </Link>
        </li>
        <li className="">
          <Link to="" target="_blank" rel="noopener noreferrer">
            <Link45deg color="#3366CC" size={16} />
          </Link>
        </li>
      </ul>
    </>
  }

  const customerBody = (rowData) => {
    return <div className='d-flex align-items-center'>
      <div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData.is_business ? "" : "rounded-circle"}`}>
        {rowData.photo ? <img src={rowData.photo} alt='clientImg' className='w-100' /> : rowData.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
      </div>
      <div className={`${style.ellipsis}`}>{rowData.customer}</div>
    </div>
  }

  const infoBody = () => {
    return <InfoCircle color='#667085' />
  }

  const statusBody = (rowData) => {
    const type = rowData.status;
    switch (type) {
      case 'In Progress':
        return <Chip className={`type ${style.employee}`} label={type} />
      case 'Complete':
        return <Chip className={`type ${style.contractor}`} label={type} />
      case 'Lost':
        return <Chip className={`type ${style.contractor}`} label={type} />
      default:
        return <Chip className={`type ${style.defaultType}`} label={type} />;
    }
  }

  const reaclCost = (rowData) => {
    return <div
      className="RealCostCircleStyle d-flex justify-content-between align-items-center piCircleStyle"
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value="10"
          text={`50%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${60 / 100})`,
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
              fontSize: '40px',
              
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>$600.00</span>
    </div>
  }
  const labourBody = (rowData) => {
    return <div
      className="RealCostCircleStyle d-flex justify-content-between align-item-center piCircleStyle"
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value="10"
          text={`$500%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${60 / 100})`,
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
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>$600.00

      </span>
    </div>
  }
  const costofSaleBody = (rowData) => {
    return <div
      className="RealCostCircleStyle d-flex justify-content-between align-item-center piCircleStyle"
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value="10"
          text={`$500%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${60 / 100})`,
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
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>$600.00

      </span>
    </div>
  }
  const OperatingExpenseBody = (rowData) => {
    return <div
      className="RealCostCircleStyle d-flex justify-content-between align-item-center piCircleStyle"
      style={{ whiteSpace: "normal", textAlign: "left" }}
    >
      <div style={{ width: 32, height: 32 }}>
        <CircularProgressbar
          value="10"
          text={`$500%`}
          strokeWidth={11}
          styles={{
            root: {},
            path: {
              stroke: `rgba(234, 236, 240, ${60 / 100})`,
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
            },
            background: {
              fill: '#ffffff',
            },
          }}

        /></div>
      <span>$600.00

      </span>
    </div>
  }

  return (
    <>
      <DataTable value={order} scrollable selectionMode={'checkbox'} removableSort columnResizeMode="expand" resizableColumns showGridlines size={'large'} scrollHeight="600px" className="border" selection={selectedOrder} onSelectionChange={(e) => setSelectedOrder(e.value)}>
        <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
        <Column field="order" header="Order #" body={orderBody} style={{ minWidth: '205px' }} frozen sortable></Column>
        <Column field="calculation" header="Calculation" body={calculationBody} style={{ minWidth: '160px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen ></Column>
        <Column field="customer" header="Customer" body={customerBody} style={{ minWidth: '186px' }} sortable></Column>
        <Column field="orderreference" header="Order Reference" style={{ minWidth: '221px' }} ></Column>
        <Column field="info" header="Info" body={infoBody} style={{ minWidth: '68px' }} ></Column>
        <Column field="status" header="Status" body={statusBody} style={{ minWidth: '113px' }} sortable></Column>
        <Column field="budget" header="Budget" style={{ minWidth: '110px' }} className='text-center' ></Column>
        <Column field="realcost" header="Real Cost" body={reaclCost} style={{ minWidth: '113px', textAlign: 'right' }} ></Column>
        <Column field="labour" header="Labour" body={labourBody} style={{ minWidth: '149px', textAlign: 'right' }} sortable></Column>
        <Column field="costsale" header="Cost of Sale" body={costofSaleBody} style={{ minWidth: '146x', textAlign: 'center' }} sortable></Column>
        <Column field="operatingexpense" header="Operating Expense" body={OperatingExpenseBody} style={{ minWidth: '152x', textAlign: 'center' }} sortable></Column>
        <Column field="totalinvoice" header="Total Invoice" style={{ minWidth: '101x', textAlign: 'center' }} ></Column>
        <Column field="operationalprofit" header="Operational Profit" style={{ minWidth: '150x', textAlign: 'center' }} ></Column>

      </DataTable>
    </>
  )
}

export default OrdersTable