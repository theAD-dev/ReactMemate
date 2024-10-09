import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';

import './task.css';
import taskEditIcon from '../../../../../assets/images/icon/taskEditIcon.svg';
import { ChevronDown, QuestionCircle } from 'react-bootstrap-icons';
import SelectUser from './select-user';
import SelectDate from './select-date';
import { useMutation } from '@tanstack/react-query';
import { fetchTasksDelete, fetchTasksUpdate } from '../../../../../APIs/TasksApi';

const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return "-";

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(1000 * +dateInMiliSec);
    return date;
}

const EditTask = ({ show, setShow, data, reInitilize }) => {
    const taskId = data?.id;
    const project = { value: data?.project?.id, reference: data?.project?.reference, number: data?.project?.number };
    const [taskTitle, setTaskTitle] = useState(data.title || "");
    const [description, setDescription] = useState(data.description || "");
    const [user, setUser] = useState(data?.user?.id || null);
    const [date, setDate] = useState({ startDate: dateFormat(data.from_date), endDate: dateFormat(data.to_date) });
    const [errors, setErrors] = useState({
        taskTitle: false,
        description: false,
        user: false,
        date: false
    });

    const mutation = useMutation({
        mutationFn: (data) => fetchTasksUpdate(data, taskId),
        onSuccess: () => {
            setShow(false);
            reInitilize();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (data) => fetchTasksDelete(taskId),
        onSuccess: () => {
            console.log('Delete success');
            setShow(false);
            reInitilize();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate();
    }

    const handleSubmit = () => {
        const newErrors = {
            taskTitle: !taskTitle,
            description: !description,
            // user: !user,
            date: !date
        };
        setErrors(newErrors);

        if (!newErrors.taskTitle && !newErrors.description && !newErrors.user && !newErrors.date) {
            console.log('Form submitted with:', { taskTitle, description, project, user, date });
            mutation.mutate({
                title: taskTitle,
                description: description,
                project: project.value,
                from_date: date.startDate,
                to_date: date.endDate,
                ...(user && { user: user }),
            })
        }
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Modal show={show} centered onHide={handleClose} className='task-form'>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <img src={taskEditIcon} alt='task-details' style={{ width: '48px', height: '48px' }} />
                            <span className='modal-task-title'>Edit Task</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group className="mb-2">
                            <Form.Label>Project Task</Form.Label>
                            <InputGroup>
                                <Form.Select disabled>
                                    <option value={project?.value}>{project?.reference} ({project?.number})</option>
                                </Form.Select>
                                <InputGroup.Text>
                                    <ChevronDown />
                                </InputGroup.Text>
                            </InputGroup>
                            {!project && <Form.Text className="text-danger">Project task is required</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter task title"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                />
                                <InputGroup.Text>
                                    <QuestionCircle />
                                </InputGroup.Text>
                            </InputGroup>
                            {errors.taskTitle && <Form.Text className="text-danger">Task title is required</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder='Enter a description...'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            {errors.description && <Form.Text className="text-danger">Description is required</Form.Text>}
                        </Form.Group>

                    </Modal.Body>
                    <div className='d-flex align-items-center' style={{
                        gap: '16px', borderTop: '1px solid #eaecf0',
                        padding: "12px 30px 8px 30px"
                    }}>
                        <SelectUser onSelect={setUser} assignedUser={data?.user}/>
                        <SelectDate dateRange={date} setDateRange={setDate} />
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: '16px', padding: "0 30px 8px 30px" }}>
                        {errors.user && <Form.Text className="text-danger">User is required</Form.Text>}
                        {errors.date && <Form.Text className="text-danger">Date is required</Form.Text>}
                    </div>
                    <Modal.Footer className='d-flex justify-content-between'>
                        <Button type='button' className='delete-button' onClick={handleDelete}>{deleteMutation.isPending ? 'Loading...' : 'Delete Task'}</Button>
                        <Button type='button' className='save-button' onClick={handleSubmit}>{mutation.isPending ? 'Loading...' : 'Save Task'}</Button>
                    </Modal.Footer>
                </Modal>
            </Form>
        </>
    )
}

export default EditTask;