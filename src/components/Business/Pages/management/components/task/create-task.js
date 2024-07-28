import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './task.css';
import newTask from '../../../../../../assets/images/new-task.svg';
import { Col, Row } from 'react-bootstrap';

const CreateTask = ({ show, setShow }) => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal show={show} centered onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <img src={newTask} alt='task-details' style={{ width: '48px', height: '48px' }} />
                            <span className='modal-task-title'>New Task</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form.Group as={Col} sm="12" controlId="validationCustom01">
                                <Form.Label>Task Title</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter task title"
                                    defaultValue=""
                                />
                                <Form.Control.Feedback type="invalid">Task title is required</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' className='save-button' onClick={() => { }}>Create Task</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
}

export default CreateTask