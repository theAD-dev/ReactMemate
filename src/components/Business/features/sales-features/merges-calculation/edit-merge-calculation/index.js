import clsx from 'clsx';
import * as yup from 'yup';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Button, Col, InputGroup, ListGroup, Modal, Row, Spinner } from 'react-bootstrap';

import style from './edit-merge-calculation.module.scss';
import { createNewMergeQuote } from '../../../../../../APIs/CalApi';

// Validation schema
const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  })
  .required();

const EditMergeCalculation = ({ merge, alias, setMerges, refetch }) => {
  console.log('merge: ', merge);
  const [show, setShow] = useState(false);
  const romanNo = alias;
  const [defaultValues, setDefaultValues] = useState({
    title: merge?.title || "",
    description: merge?.description || ""
  })
  const { register, reset, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema), defaultValues
  });

  useEffect(() => { reset() }, [alias])

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
      alias: romanNo,
      calculators: merge?.calculators?.map((value) => ({
        calculator: "", id: value.id, label: value.label, total: value.total,
        description: value.description
      }))
    }
    setMerges((others) => ([...others, payload]));
    handleClose();
  }

  const deleteCalculator = (calculatorId) => {
    setMerges((prevState) => {
      const updatedState = prevState.map((item) => {
        if (item.alias === alias) {
          const updatedCalculators = item.calculators.filter(
            (calc) => calc.id !== calculatorId
          );
          return {
            ...item,
            calculators: updatedCalculators,
          };
        }
        return item;
      });

      return updatedState;
    });
  }

  useEffect(() => {
    if (merge?.calculators?.length < 2) {
      setMerges((merges) => {
        let updatedMerges = merges.filter((merge) => merge.alias !== alias);
        return updatedMerges;
      })
    }
  }, [merge])

  const deleteAndCancel = () => {
    setShow(false);
  }
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  return (
    <React.Fragment>
      <Button type='button' onClick={handleOpen} className={clsx(style.mergeButton, 'text-button')}>Edit</Button>
      <Modal
        size="lg"
        show={show}
        centered
        onHide={handleClose}
        className={clsx('task-form', 'mergeForm')}
      >
        <Modal.Header closeButton>
          <Modal.Title className='d-flex align-items-center' style={{ padding: '24px' }}>
            <div className='d-flex justify-content-center align-items-center' style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #EAECF0', background: '#F2F4F7', color: '#344054', fontSize: '14px', fontWeight: 600 }}>
              {romanNo}
            </div>
            <span className='modal-task-title'>Edit Merge Items</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='px-0'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='px-4' style={{ maxHeight: '450px', overflow: 'auto', }}>
              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <Form.Control
                  {...register("title")}
                  type="text"
                  placeholder="Merge items title"
                  className={`${errors.title ? 'border border-danger' : ''}`}
                />
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
              <ListGroup variant="flush border rounded mb-4" style={{ border: "1px solid var(--Gray-100, #F2F4F7)" }}>
                {
                  merge?.calculators?.map((value, index) =>
                    <ListGroup.Item key={`${index}-${value.id}`} className='d-flex justify-content-between'>
                      <Row className='w-100'>
                        <Col sm={4} className='text-start'>
                          <span style={{ color: '#101828', fontSize: '16px' }}>
                             {value?.label || ""}
                          </span>
                        </Col>
                        <Col sm={6}>
                          <span style={{ color: '#101828', fontSize: '16px' }}>
                            {value?.description || ""}
                          </span>
                        </Col>
                        <Col sm={2} className='text-end text-nowrap'>
                          <span style={{ color: '#101828', fontSize: '16px', textAlign: 'end' }}>
                            $ {parseFloat(value?.total).toFixed(2)}
                          </span>
                          <Trash onClick={() => deleteCalculator(value.id)} color='#98A2B3' size={16} className='ms-2' style={{ position: 'relative', left: '20px', cursor: 'pointer' }} />
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )
                }
              </ListGroup>
            </div>
            <Modal.Footer className='d-flex justify-content-between align-items-center'>
              <Button type='button' onClick={deleteAndCancel} className={style.deleteButton}>
                <Trash color='#B42318' size={18} />
              </Button>
              <div className='d-flex align-items-center gap-3'>
                <Button type='button' onClick={handleClose} className='outline-button' style={{ minWidth: '67px' }}>Cancel</Button>
                <Button type='submit' className='solid-button' style={{ minWidth: '67px' }}>Save</Button>
              </div>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default EditMergeCalculation