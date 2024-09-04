import React from 'react'
import style from './list-merge-calculation.module.scss';
import clsx from 'clsx';
import { Trash } from 'react-bootstrap-icons';

const ListMergeCalculations = ({ merges }) => {
    return (
        <>
            <div className={clsx('w-100', style.divider)} style={{}}></div>

            {(merges?.length && <p className='mb-0' style={{ fontSize: '14px', fontWeight: '500', color: '#475467' }}>Merged Items</p>) || ''}

            {
                merges.map((merge, index) => (
                    <div key={merge.id} className={clsx('d-flex align-items-center gap-3', style.mergeListItem)}>
                        <div className={clsx('d-flex justify-content-center align-items-center', style.mergeListSrBox)}>
                            {merge?.alias}
                        </div>
                        <div className='d-flex align-items-center gap-3' style={{ width: '500px' }}>
                            <button type="button" className="btn p-0 ellipsis-width" style={{ maxWidth: '450px' }}>{merge.title}</button>
                            <button onClick={() => { }} className='btn text-button p-0 mt-1'>Edit</button>
                        </div>
                        <Trash onClick={() => { }} color="#98A2B3" size={16} className='cursor-pointer' />
                    </div>
                ))
            }

            {(merges?.length && <div className={clsx('w-100', style.divider2)}></div>) || ""}
        </>
    )
}

export default ListMergeCalculations