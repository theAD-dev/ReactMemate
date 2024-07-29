import React from 'react'
import DepartmentCalculationTable from './department-calculation-table';

const DepartmentQuote = React.memo(({ totals, setTotals ,isDiscountDisplayed}) => {
  
  return (
    <div className='DepartmentQuote'>
      <DepartmentCalculationTable totals={totals} setTotals={setTotals} isDiscountActive={isDiscountDisplayed} />
    </div>
  )
});

export default DepartmentQuote