import React from 'react'
import DepartmentCalculationTable from './department-calculation-table';

const DepartmentQuote = React.memo(({ totals, setTotals, isDiscountDisplayed }) => {

  return (
    <div className='DepartmentQuote' style={{ background: '#fff', borderRadius: '4px', padding: '16px' }}>
      <DepartmentCalculationTable totals={totals} setTotals={setTotals} isDiscountActive={true} />
    </div>
  )
});

export default DepartmentQuote