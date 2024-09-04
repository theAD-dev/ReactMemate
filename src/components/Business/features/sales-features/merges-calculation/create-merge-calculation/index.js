import clsx from 'clsx'
import React from 'react'
import { Button } from 'react-bootstrap'
import style from './create-merge-calculation.module.scss';

const CreateMergeCalculation = ({ unique_id, selectItem, setMerges }) => {
  const handleOpen = () => {

  }
  return (
    <React.Fragment>
      <Button type='button' disabled={Object.keys(selectItem)?.length < 2} onClick={handleOpen} className={clsx(style.mergeButton, 'text-button', { [style.disabled]: Object.keys(selectItem)?.length < 2 })}>Merge Items</Button>
    </React.Fragment>
  )
}

export default CreateMergeCalculation