import React from 'react'
import DepartmentQuoteTable from './department-quote-table'
import DepartmentCalculationTable from './department-calculation-table';

const DepartmentQuote = React.memo(({ totals, setTotals }) => {
  return (
    <div className='DepartmentQuote'>
      <DepartmentCalculationTable totals={totals} setTotals={setTotals} />
    </div>
  )
});

export default DepartmentQuote