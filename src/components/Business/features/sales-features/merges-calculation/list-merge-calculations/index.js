import React from 'react'
import style from './list-merge-calculation.module.scss';
import clsx from 'clsx';
import { Trash } from 'react-bootstrap-icons';
import ViewMerge from '../view-merge-calculation';
import { toast } from 'sonner';
import DeleteMerge from '../delete-merge-calculation';

const ListMergeCalculations = ({ unique_id, merges, refetch }) => {
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
                            <ViewMerge title={merge.title} alias={merge?.alias} items={merge.items} />
                            <button onClick={() => toast.error(`EDIT API is under construction...`)} className='btn text-button p-0 mt-1'>Edit</button>
                        </div>
                        <span style={{ minWidth: '120px', color: '#667085' }}>$ {merge?.items?.reduce((sum, item) => sum + parseFloat(item.value), 0).toFixed(2) || "0.00"}</span>
                        <DeleteMerge id={merge.id} refetch={refetch} />
                    </div>
                ))
            }

            {(merges?.length && <div className={clsx('w-100', style.divider2)}></div>) || ""}
        </>
    )
}

export default ListMergeCalculations