import clsx from 'clsx';
import React, { forwardRef, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

import style from './client-order-history.module.scss';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';
import { ArrowLeftCircle, CardChecklist, Check2Circle, FileEarmark, FilePdf, Files, FileText, InfoCircle, Link45deg, ListCheck, ListUl, PhoneVibrate, PlusSlashMinus } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchduplicateData } from '../../../../../APIs/SalesApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMutation } from '@tanstack/react-query';
import { CloseButton } from 'react-bootstrap';
import { bringBack } from '../../../../../APIs/ClientsApi';

const ClientOrderHistoryTable = forwardRef(({ selected, setSelected, clientOrders, isPending }, ref) => {
  const navigate = useNavigate();
  const [isDuplicating, setIsDuplicating] = useState(null);
  const [isBringBack, setIsBringBack] = useState(null);

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    switch (status) {
      case 'Lost':
        return <Tag className={`status ${style.lost}`} value={status} />
      case 'Completed':
        return <Tag className={`status ${style.complete}`} value={status} />
      case 'In progress':
        return <Tag className={`status ${style.inprogress}`} value={status} />
      case 'Declined':
        return <Tag className={`status ${style.declined}`} value={status} />
      default:
        return <Tag className={`status ${style.defaultStatus}`} value={status} />;
    }
  }

  const profitBodyTemplate = (rowData) => {
    const status = rowData.status;
    switch (status) {
      case 'Lost':
        return <Tag className={`profit ${style.lostProfit} rounded`} value={`$ ${rowData.profit}`} />
      case 'Completed':
        return <Tag className={`profit ${style.completeProfit} rounded`} value={`$ ${rowData.profit}`} />
      case 'In progress':
        return <Tag className={`profit ${style.inprogressProfit}`} value={`$ ${rowData.profit}`} />
      case 'Declined':
        return <Tag className={`profit ${style.declinedProfit} rounded`} value={`$ ${rowData.profit}`} />
      default:
        return <Tag className={`profit ${style.defaultProfit} rounded`} value={`$ ${rowData.profit}`} />;
    }
  }

  const totalBodyTemplate = (rowData) => {
    return `$${rowData.total}`;
  }

  const InvoiceBodyTemplate = (rowData) => {
    return <div className='d-flex align-items-center justify-content-center gap-4'>
      <Link to={rowData.invoice_url}><FilePdf color='#FF0000' size={16} /></Link>
      <Link to={rowData.unique_url}><Link45deg color='#3366CC' size={16} /></Link>
    </div>
  }

  const quoteBodyTemplate = (rowData) => {
    return <div className='d-flex align-items-center justify-content-center gap-4'>
      <Link to={"#"}><div><PlusSlashMinus color='#FDB022' size={16} /></div></Link>
      <Link to={rowData.quote_url}><FilePdf color='#FF0000' size={16} /></Link>
      <Link to={rowData.unique_url}><Link45deg color='#3366CC' size={16} /></Link>
    </div>
  }

  const duplicateSale = async (projectId) => {
    try {
      if (!projectId) return toast.error("Project id not found");
      setIsDuplicating(projectId);
      const data = await fetchduplicateData(projectId);
      navigate('/sales');
      toast.success('Sale has been successfully duplicated');
    } catch (error) {
      console.error('Error is duplicating:', error);
      toast.error(`Failed to duplicate sale. Please try again.`);
    } finally {
      setIsDuplicating(null);
    }
  }

  const bringBackSale = async (projectId, status) => {
    try {
      if (!projectId) return toast.error("Project id not found");
      setIsBringBack(projectId);
      const data = await bringBack(projectId);
      if (data) {
        if (status === 'Lost' || status === "In progress") navigate('/sales');
        else if (status === 'Completed' || status === 'Declined') navigate('/management');
        else window.location.reload();
      } else {
        toast.error(`Failed to update sendBack to sales. Please try again.`);
      }
    } catch (error) {
      console.error('Error updating sendBack to sales:', error);
      toast.error(`Failed to update sendBack to sales. Please try again.`);
    } finally {
      setIsBringBack(null);
    }
  }

  const HistoryBodyTemplate = (rowData) => {
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const anchorProps = useClick(isOpen, setOpen);

    const historyDescription = (history) => {
      const timestamp = +history.created * 1000;
      const date = new Date(timestamp);
      const options = { weekday: 'short' };
      const day = date.toLocaleString('en-US', options).substring(0, 3);
      const time = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).replace(',', '');
      const formattedDate = date.toLocaleDateString('en-GB').replaceAll('\/', '.');
      const result = `${time} | ${day} | ${formattedDate} by ${history?.manager || "-"}`
      return result;
    }

    function getIconByType(type) {
      switch (type) {
        case 'billing':
          return <PhoneVibrate size={16} color="#1AB2FF" />;
        case 'quote':
          return <FileEarmark size={16} color="#1AB2FF" />;
        case 'invoice':
          return <FileText size={16} color="#1AB2FF" />;
        case 'task':
          return <Check2Circle size={16} color="#1AB2FF" />;
        case 'order':
          return <Check2Circle size={16} color="#1AB2FF" />;
        case 'note':
          return <CardChecklist size={16} color="#1AB2FF" />;
        case 'tag':
          return <ListCheck size={16} color="#1AB2FF" />;
        default:
          return '-';
      }
    }

    return <React.Fragment>
      <FileText color='#667085' size={16} className='cursor-pointer' ref={ref} {...anchorProps} />
      <div className='fixedMenu' style={{ position: 'fixed', top: '50%', left: '40%' }} key={rowData.id}>
        <ControlledMenu
          state={isOpen ? 'open' : 'closed'}
          anchorRef={ref}
          onClose={() => setOpen(false)}
          menuStyle={{ padding: '24px 24px 20px 24px', width: '405px', textAlign: 'left' }}
        >
          <div className='d-flex justify-content-between mb-4'>
            <div className='BoxNo'>
              <div>
                <ListUl color='#FFFFFF' size={24} />
              </div>
            </div>
            <CloseButton onClick={() => setOpen(false)} />
          </div>
          <h1 className={clsx(style.orderHeading, 'mb-3')}>Order card history </h1>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {
              rowData?.history?.map((history) => (
                <div className='d-flex flex-column mb-4 text-start'>
                  <div className='d-flex align-items-center gap-1'>
                    {getIconByType(history.type)}
                    <p className={clsx(style.historyTitle, 'mb-0')}>{history?.title || "-"}</p>
                  </div>
                  {history?.text && <p className={clsx(style.historyText, 'mb-1')} dangerouslySetInnerHTML={{ __html: history?.text }} />}
                  <p className={clsx(style.historyDescription, 'mb-0')}>
                    {historyDescription(history)}
                  </p>
                </div>
              ))
            }
          </div>
        </ControlledMenu>
      </div>
    </React.Fragment>
  }

  const InfoBodyTemplate = (rowData) => {
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const anchorProps = useClick(isOpen, setOpen);
    return <React.Fragment>
      <InfoCircle color='#667085' size={16} className='cursor-pointer' ref={ref} {...anchorProps} />
      <div className='fixedMenu' style={{ position: 'fixed', top: '40%', left: '40%' }}>
        <ControlledMenu
          state={isOpen ? 'open' : 'closed'}
          anchorRef={ref}
          onClose={() => setOpen(false)}
          menuStyle={{ padding: '24px 24px 20px 24px', width: '365px', marginTop: '45px' }}
        >
          <div className='d-flex justify-content-between mb-4'>
            <div className='BoxNo'>
              <div>
                <ListUl color='#FFFFFF' size={24} />
              </div>
            </div>
            <CloseButton onClick={() => setOpen(false)} />
          </div>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {
              rowData?.indexes?.map(index => (
                <div key={index[0]} className={clsx('mb-3 text-start')}>
                  <h1 className={style.department}>{index[1]}</h1>
                  <h5 className={style.subdepartment}>{index[2]}</h5>
                </div>
              ))
            }
          </div>
        </ControlledMenu>
      </div>
    </React.Fragment>
  }

  const duplicateBodyTemplate = (rowData) => {
    return <>
      {rowData?.unique_id === isDuplicating
        ? <ProgressSpinner style={{ width: '18px', height: '18px', position: 'relative', top: '2px' }} />
        : <Files color='#667085' size={16} className='cursor-pointer' onClick={() => duplicateSale(rowData?.unique_id)} />}
    </>
  }

  const bringBackBodyTemplate = (rowData) => {
    return <>
      {rowData?.unique_id === isBringBack
        ? <ProgressSpinner style={{ width: '18px', height: '18px', position: 'relative', top: '2px' }} />
        : <ArrowLeftCircle color='#667085' size={16} className='cursor-pointer' onClick={() => bringBackSale(rowData?.unique_id, rowData.status)} />}
    </>
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
      <Column header="History" body={HistoryBodyTemplate} bodyClassName={"text-center"} style={{ minWidth: '70px' }}></Column>
      <Column header="Info" body={InfoBodyTemplate} bodyClassName={"text-center"} style={{ minWidth: '68px' }}></Column>
      <Column field="total" header="Total" body={totalBodyTemplate} bodyClassName={"text-end"} style={{ minWidth: '110px' }}></Column>
      <Column field='profit' header="Operational Profit" body={profitBodyTemplate} bodyClassName={"text-end"} style={{ minWidth: '144px' }} sortable></Column>
      <Column header="Duplicate" body={duplicateBodyTemplate} bodyClassName={"text-center"} style={{ minWidth: '82px' }}></Column>
      <Column header="Bring Back" body={bringBackBodyTemplate} bodyClassName={"text-center"} style={{ minWidth: '110px' }}></Column>
    </DataTable>
  )
})

export default ClientOrderHistoryTable