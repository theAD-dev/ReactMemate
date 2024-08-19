import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { ChevronDown, QuestionCircle } from 'react-bootstrap-icons';
import SelectUser from './select-user';
import SelectDate from './select-date';
import newTask from '../../../../../assets/images/new-task.svg';

import './task.css';
import { useMutation } from '@tanstack/react-query';
import { fetchTasksNew } from '../../../../../APIs/TasksApi';

const CreateTask = ({ show, setShow, project, reInitilize }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [user, setUser] = useState(null);
    const [date, setDate] = useState(null);
    const [errors, setErrors] = useState({
        taskTitle: false,
        description: false,
        user: false,
        date: false
    });

    const reset = () => {
        setTaskTitle("");
        setDescription("");
        setUser(null);
        setDate(null);
        setErrors({
            taskTitle: false,
            description: false,
            user: false,
            date: false
        })
    }
    const mutation = useMutation({
        mutationFn: (data) => fetchTasksNew(data),
        onSuccess: () => {
            setShow(false);
            reset();
            reInitilize();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const handleSubmit = () => {
        const newErrors = {
            taskTitle: !taskTitle,
            description: !description,
            user: !user,
            date: !date
        };
        setErrors(newErrors);

        if (!newErrors.taskTitle && !newErrors.description && !newErrors.user && !newErrors.date) {
            mutation.mutate({
                title: taskTitle,
                description: description,
                project: project.value,
                user: user,
                from_date: date.startDate,
                to_date: date.endDate,
            })
            console.log('Form submitted with:', { taskTitle, description, user, date });
        }
    };

    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} centered onHide={handleClose} className='task-form'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <img src={newTask} alt='task-details' style={{ width: '48px', height: '48px' }} />
                        <span className='modal-task-title'>New Task</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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

                    <Form.Group className="mb-2">
                        <Form.Label>Project Task</Form.Label>
                        <InputGroup>
                            <Form.Select disabled>
                                <option value={project.value}>{project.reference} ({project.number})</option>
                            </Form.Select>
                            <InputGroup.Text>
                                <ChevronDown />
                            </InputGroup.Text>
                        </InputGroup>
                        {!project && <Form.Text className="text-danger">Project task is required</Form.Text>}
                    </Form.Group>
                </Modal.Body>
                <div className='d-flex align-items-center' style={{
                    gap: '16px', borderTop: '1px solid #eaecf0',
                    padding: "12px 30px 8px 30px"
                }}>
                    <SelectUser onSelect={setUser} />
                    <SelectDate dateRange={date} setDateRange={setDate} />
                </div>
                <div className='d-flex align-items-center' style={{ gap: '16px', padding: "0 30px 8px 30px" }}>
                    {errors.user && <Form.Text className="text-danger">User is required</Form.Text>}
                    {errors.date && <Form.Text className="text-danger">Date is required</Form.Text>}
                </div>
                <Modal.Footer>
                    <Button type='button' className='save-button' onClick={handleSubmit}>{mutation.isPending ? 'Loading...' : 'Create Task'}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateTask;
