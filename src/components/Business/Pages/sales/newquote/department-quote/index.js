import React from 'react'
import DepartmentCalculationTable from './department-calculation-table';

const DepartmentQuote = React.memo(({ totals, setTotals }) => {
  return (
    <div className='DepartmentQuote'>
      <DepartmentCalculationTable totals={totals} setTotals={setTotals} />
    </div>
  )
});

export default DepartmentQuote