import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import style from './client-order-history.module.scss';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';
import { ArrowLeftCircle, FilePdf, Files, FileText, InfoCircle, Link45deg, PlusSlashMinus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ClientOrderHistoryTable = forwardRef(({ selected, setSelected, clientOrders, isPending }, ref) => {
  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    switch (status) {
      case 'In progress':
        return <Tag className={`status ${style.inProgress}`} value={status} />
      case 'Complete':
        return <Tag className={`status ${style.complete}`} value={status} />
      case 'Lost':
        return <Tag className={`status ${style.lost}`} value={status} />
      default:
        return <Tag className={`status ${style.defaultStatus}`} value={status} />;
    }
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

  const totalBodyTemplate = (rowData) => {
    return `$${rowData.total}`;
  }

  const InvoiceBodyTemplate = (rowData) => {
    return <div className='d-flex align-items-center justify-content-center gap-4'>
      <Link to={rowData.invoice_url}><FilePdf color='#FF0000' size={16}/></Link>
      <Link to={rowData.unique_url}><Link45deg color='#3366CC' size={16}/></Link>
    </div>
  }

  const quoteBodyTemplate = (rowData) => {
    return <div className='d-flex align-items-center justify-content-center gap-4'>
      <Link to={"#"}><div><PlusSlashMinus color='#FDB022' size={16}/></div></Link>
      <Link to={rowData.quote_url}><FilePdf color='#FF0000' size={16}/></Link>
      <Link to={rowData.unique_url}><Link45deg color='#3366CC' size={16}/></Link>
    </div>
  }
  
  return (
    <DataTable ref={ref} value={clientOrders} scrollable selectionMode={'checkbox'} removableSort
      columnResizeMode="expand" resizableColumns showGridlines size={'large'}
      scrollHeight={"calc(100vh - 182px)"} className="border" selection={selected}
      onSelectionChange={(e) => setSelected(e.value)}
      loading={isPending}
      emptyMessage={NoDataFoundTemplate}
    >
      <Column selectionMode="multiple" headerClassName='ps-4' bodyClassName={'show-on-hover ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
      <Column field="number" header="Project ID" frozen sortable style={{ minWidth: '100px' }} headerClassName='shadowRight' bodyClassName='shadowRight'></Column>
      <Column field="reference" header="Reference" style={{ minWidth: '154px' }}></Column>
      <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '113px' }}></Column>
      <Column header="Invoice" body={InvoiceBodyTemplate} style={{ minWidth: '114px' }}></Column>
      <Column header="Quote" body={quoteBodyTemplate} style={{ minWidth: '160px' }}></Column>
      <Column header="History" body={<FileText color='#667085' size={16}/>} bodyClassName={"text-center"} style={{ minWidth: '70px' }}></Column>
      <Column header="Info" body={<InfoCircle color='#667085' size={16}/>} bodyClassName={"text-center"} style={{ minWidth: '68px' }}></Column>
      <Column field="total" header="Total" body={totalBodyTemplate} bodyClassName={"text-end"} style={{ minWidth: '110px' }}></Column>
      <Column field='profit' header="Operational Profit" body={profitBodyTemplate} bodyClassName={"text-end"} style={{ minWidth: '144px' }} sortable></Column>
      <Column header="Replicate" body={<Files color='#667085' size={16} />} bodyClassName={"text-center"} style={{ minWidth: '82px' }}></Column>
      <Column header="Bring Back" body={<ArrowLeftCircle color='#667085' size={16} />} bodyClassName={"text-center"} style={{ minWidth: '110px' }}></Column>
    </DataTable>
  )
})

export default ClientOrderHistoryTable