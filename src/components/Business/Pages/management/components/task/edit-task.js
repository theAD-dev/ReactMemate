import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';

import './task.css';
import taskEditIcon from '../../../../../../assets/images/icon/taskEditIcon.svg';

const EditTask = ({ show, setShow }) => {

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }


    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Form onSubmit={handleSubmit} className='task-form'>
                <Modal show={show} centered onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <img src={taskEditIcon} alt='task-details' style={{ width: '48px', height: '48px' }} />
                            <span className='modal-task-title'>Edit Task</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form.Group as={Col} sm="12">
                                <Form.Label>Task Title</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter task title"
                                />
                                <Form.Text className="text-danger">Task title is required</Form.Text>
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' className='save-button' onClick={() => { }}>Save Task</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
}

export default EditTask;