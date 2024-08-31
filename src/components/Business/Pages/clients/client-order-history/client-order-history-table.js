import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import clsx from 'clsx';

import style from './client-order-history.module.scss';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';

const ClientOrderHistoryTable = ({ clientOrders, isPending }) => {
  return (
    <DataTable value={clientOrders} scrollable selectionMode={'checkbox'} removableSort
      columnResizeMode="expand" resizableColumns showGridlines size={'large'}
      scrollHeight={"calc(100vh - 182px)"} className="border"
      loading={isPending}
      emptyMessage={NoDataFoundTemplate}
    >
      <Column selectionMode="multiple" headerClassName='ps-4' bodyClassName={'show-on-hover ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
      <Column field="number" header="Project ID" frozen sortable style={{ minWidth: '100px' }} headerClassName='shadowRight' bodyClassName='shadowRight'></Column>
      <Column field="reference" header="Reference" style={{ minWidth: '154px' }}></Column>
      <Column field="status" header="Status" sortable style={{ minWidth: '113px' }}></Column>
      <Column header="Invoice" style={{ minWidth: '114px' }}></Column>
      <Column header="Quote" style={{ minWidth: '160px' }}></Column>
      <Column header="History" style={{ minWidth: '70px' }}></Column>
      <Column header="Info" style={{ minWidth: '68px' }}></Column>
      <Column field="total" header="Total" style={{ minWidth: '68px' }}></Column>
      <Column field='profit' header="Operational Profit" style={{ minWidth: '144px' }} sortable></Column>
      <Column header="Replicate" style={{ minWidth: '82px' }}></Column>
      <Column header="Bring Back" style={{ minWidth: '110px' }}></Column>
    </DataTable>
  )
}

export default ClientOrderHistoryTable