import React from 'react'
import PaidDialog from './paid-dialog';
import UnPaidDialog from './unpaid-dialog';

const TotalExpenseDialog = ({ showDialog, setShowDialog, setRefetch }) => {
    const { data, show } = showDialog;
    return (
        <>
            {
                (show && !data?.paid)
                    ? <PaidDialog visible={show} details={data} setVisible={() => setShowDialog({ data: null, show: false })} setRefetch={setRefetch} />
                    : show ? <UnPaidDialog visible={show} details={data} setVisible={() => setShowDialog({ data: null, show: false })} setRefetch={setRefetch} /> : ""
            }
        </>
    )
}

export default TotalExpenseDialog