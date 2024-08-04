import React, { useState } from 'react';
import { Button, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import mergeItemsImg from "../../../../../../assets/images/img/merge-items.svg";

// Validation schema
const schema = yup
    .object({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
    })
    .required();

const MergeItems = ({ selectItems, setSelectItems, mergeItems, setMergeItems, setMapMergeItemWithNo }) => {
    const romanNo = romanize((Object.keys(mergeItems)?.length || 0) + 1);
    const [show, setShow] = useState(false);
    const [defaultValues, setDefaultValues] = useState({
        title: '',
        description: ''
    })
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema), defaultValues
    });

    // Submit handler
    const onSubmit = (data) => {
        console.log('data: ', data);
        let key = Object.keys(selectItems)?.join("-")

        const total = Object.values(selectItems)
            .map(item => item.total)
            .reduce((acc, current) => acc + current, 0);

        setMergeItems((oldMergeItems) => {
            const updatedItems = { ...oldMergeItems };
            
            Object.keys(updatedItems).forEach((itemKey, index) => {
                updatedItems[itemKey] = {
                    ...updatedItems[itemKey],
                    romanNo: romanize(index + 1),
                };
            });
            updatedItems[key] = { title: data.title, description: data.description, total, romanNo, keys: Object.keys(selectItems) };
            return updatedItems;
        });

        setSelectItems({});
        setShow(false);
        reset();
    };
    const handleOpen = () => {
        if(Object.keys(selectItems)?.length > 1) setShow(true);
    }
    const handleClose = () => setShow(false);

    return (
        <>
            <p onClick={handleOpen} className='mb-0' style={{ fontSize: '14px', fontWeight: '600', color: '#475467', cursor: 'pointer' }}>Merge Items</p>
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
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
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
                                Object.entries(selectItems)?.map(([key, value]) =>
                                    <ListGroup.Item key={key} className='d-flex justify-content-between'>
                                        <span style={{ color: '#101828', fontSize: '16px' }}>{value?.label}</span>
                                        <span style={{ color: '#101828', fontSize: '16px' }}>$ {value?.total}</span>
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>

                        <Modal.Footer>
                            <Button type='button' className='delete-button'>Delete</Button>
                            <Button type='submit' className='save-button'>Save</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};


function romanize(num) {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

export default MergeItems;
