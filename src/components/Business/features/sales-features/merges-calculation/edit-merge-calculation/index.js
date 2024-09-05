import clsx from 'clsx';
import * as yup from 'yup';
import { toast } from 'sonner';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { QuestionCircle } from 'react-bootstrap-icons';
import { Button, InputGroup, ListGroup, Modal } from 'react-bootstrap';

import style from './create-merge-calculation.module.scss';
import mergeItemsImg from "../../../../../../assets/images/img/merge-items.svg";
import { createNewMergeQuote } from '../../../../../../APIs/CalApi';
import { romanize } from '../../../../shared/utils/helper';

// Validation schema
const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  })
  .required();

const EditMergeCalculation = ({ unique_id, selectItem, setSelectItem, merges, setMerges, setPayload, setPreExistMerges, refetch }) => {
  const [show, setShow] = useState(false);
  const romanNo = romanize((merges?.length || 0) + 1);
  const [defaultValues, setDefaultValues] = useState({
    title: '',
    description: ''
  })
  const { register, reset, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema), defaultValues
  });

  const mutation = useMutation({
    mutationFn: (data) => createNewMergeQuote(data),
    onSuccess: (response) => {
      refetch();
      handleClose();
      toast.success(`New merge items created successfully.`);
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error(`Failed to create new merge items. Please try again.`);
    }
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      calculations: Object.values(selectItem).reduce((acc, value, index) => {
        acc.push({ calculator: value.calculator });
        return acc;
      }, [])
    }

    if (unique_id) {
      payload.unique_id = unique_id;
      mutation.mutate(payload);
    }
    else {
      setPreExistMerges((others) => ([...others, payload]))
      setPayload((others) => ({
        ...others,
        merges: others.merges ? [...others.merges, payload] : [payload]
      }));
    }
  }

  const deleteAndCancel = () => setShow(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  return (
    <React.Fragment>
      <button onClick={handleOpen} className='btn text-button p-0 mt-1'>Edit</button>
      <Modal
        show={show}
        centered
        onHide={handleClose}
        className='task-form'
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={mergeItemsImg}
              alt='merge-img'
              style={{ width: '48px', height: '48px' }}
            />
            <span className='modal-task-title'>Merge Items</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='px-0'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='px-4' style={{ maxHeight: '450px', overflow: 'auto', }}>
              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <InputGroup >
                  <Form.Control
                    {...register("title")}
                    type="text"
                    placeholder="Merge items title"
                    className={`${errors.title ? 'border border-danger' : ''}`}
                  />
                  <InputGroup.Text className={`${errors.title ? 'border border-danger' : ''}`}>
                    <QuestionCircle />
                  </InputGroup.Text>
                </InputGroup>
                {errors.title && <Form.Text className="text-danger">{errors.title.message}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Describe merging items</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder='Enter a description...'
                  {...register("description")}
                  style={{ height: '80px', outline: 'none', boxShadow: 'none' }}
                  className={`${errors.description ? 'border border-danger' : ''}`}
                />
                {errors.description && <Form.Text className="text-danger">{errors.description.message}</Form.Text>}
              </Form.Group>

              <ListGroup variant="flush border mb-1">
                <ListGroup.Item>
                  <div className='d-flex justify-content-center align-items-center' style={{ width: '20px', height: '20px', borderRadius: '24px', background: '#F2F4F7', border: '1px solid #EAECF0', color: '#344054', fontSize: '10px' }}>
                    {romanNo}
                  </div>
                </ListGroup.Item>
                {
                  Object.entries(selectItem)?.map(([key, value]) =>
                    <ListGroup.Item key={key} className='d-flex justify-content-between'>
                      <span style={{ color: '#101828', fontSize: '16px' }}>{value?.label}</span>
                      <span style={{ color: '#101828', fontSize: '16px' }}>$ {value?.total}</span>
                    </ListGroup.Item>
                  )
                }
              </ListGroup>
            </div>
            <Modal.Footer className='d-flex justify-content-between align-items-center'>
              <Button type='button' onClick={handleClose} className={clsx(style.cancelButton)}>Cancel</Button>
              <div className='d-flex align-items-center gap-3'>
                <Button type='button' onClick={deleteAndCancel} className='delete-button'>Delete</Button>
                <Button type='submit' className='save-button'>Save</Button>
              </div>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default EditMergeCalculation