import React from 'react';
import clsx from 'clsx';
import style from './list-merge-calculation.module.scss';
import DeleteMerge from '../delete-merge-calculation';
import EditMergeCalculation from '../edit-merge-calculation';
import ViewMerge from '../view-merge-calculation';

const ListMergeCalculations = ({ merges, setMerges, refetch, deleteMergeCalculator }) => {
    return (
        <>
            <div className={clsx('w-100', style.divider)} style={{}}></div>

            {(merges?.length && <p className='mb-0' style={{ fontSize: '14px', fontWeight: '500', color: '#475467' }}>Merged Items</p>) || ''}

            {
                merges.map((merge, index) => (
                    <div key={`${index}-${merge.id}`} className={clsx('d-flex align-items-center gap-3', style.mergeListItem)}>
                        <div className={clsx('d-flex justify-content-center align-items-center', style.mergeListSrBox)}>
                            {merge?.alias}
                        </div>
                        <div className='d-flex align-items-center gap-3' style={{ width: '317px' }}>
                            <ViewMerge title={merge.title} alias={merge?.alias} items={merge.calculators} />
                            <EditMergeCalculation merge={merge} setMerges={setMerges} alias={merge?.alias} deleteMergeCalculator={deleteMergeCalculator} />
                        </div>
                        <span style={{ minWidth: '120px', color: '#667085' }}>$ {merge?.calculators?.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2) || "0.00"}</span>
                        <DeleteMerge id={merge.id} alias={merge?.alias} refetch={refetch} setMerges={setMerges} />
                    </div>
                ))
            }

            {(merges?.length && <div className={clsx('w-100', style.divider2)}></div>) || ""}
        </>
    );
};

export default ListMergeCalculations;