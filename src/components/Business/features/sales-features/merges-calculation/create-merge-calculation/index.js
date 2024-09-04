import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import style from './create-merge-calculation.module.scss';
import mergeItemsImg from "../../../../../../assets/images/img/merge-items.svg";

// Validation schema
const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  })
  .required();

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