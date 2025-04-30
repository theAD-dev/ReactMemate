import { useRef, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import { ChevronDown, Person, QuestionCircle } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dropdown } from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import SelectDate from './select-date';
import { getMobileUserList, getUserList } from '../../../../../APIs/task-api';
import { fetchTasksDelete, fetchTasksUpdate } from '../../../../../APIs/TasksApi';
import taskEditIcon from '../../../../../assets/images/icon/taskEditIcon.svg';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';

const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return "-";
    const date = new Date(1000 * +dateInMiliSec);
    return date;
};

const EditTask = ({ show, setShow, data, reInitialize }) => {
    const dropdownRef = useRef(null);
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
            reInitialize();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => fetchTasksDelete(taskId),
        onSuccess: () => {
            console.log('Delete success');
            setShow(false);
            reInitialize();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate();
    };

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
            });
        }
    };
    const handleClose = () => setShow(false);
    const usersList = useQuery({ queryKey: ['getUserList'], queryFn: getUserList });
    const mobileUsersList = useQuery({ queryKey: ['getMobileUserList'], queryFn: getMobileUserList });

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
                        gap: '20px', borderTop: '1px solid #eaecf0',
                        padding: "12px 30px 8px 20px"
                    }}>
                        {!user && <Person
                            color={dropdownRef.current?.panel?.element?.offsetParent ? "#1AB2FF" : "#475467"}
                            size={22} style={{ position: 'relative', left: '10px', zIndex: 1 }}
                            onClick={() => dropdownRef.current?.show()} className='me-3 cursor-pointer' />
                        }
                        <Dropdown
                            ref={dropdownRef}
                            options={[
                                {
                                    label: 'Desktop User',
                                    items: usersList?.data?.users?.filter((user) => user?.is_active)?.map((user) => ({
                                        value: user?.id,
                                        label: `${user?.first_name} ${user?.last_name}` || user?.first_name || "-",
                                        photo: user?.photo || "",
                                        has_photo: user?.has_photo
                                    })) || []
                                },
                                {
                                    label: 'Mobile User',
                                    items: mobileUsersList?.data?.users?.filter((user) => user?.status !== 'disconnected')?.map((user) => ({
                                        value: user?.id,
                                        label: `${user?.first_name} ${user?.last_name}` || user?.first_name || "-",
                                        photo: user?.photo || "",
                                        has_photo: user?.has_photo
                                    })) || []
                                }
                            ]}
                            onChange={(e) => {
                                setUser(e.value);
                            }}
                            valueTemplate={(option) => {
                                return <div className='d-flex gap-2 align-items-center'>
                                    <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '0px solid #dedede' }}>
                                        <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={false} size={17} />
                                    </div>
                                    {option?.label}
                                </div>;
                            }}
                            itemTemplate={(option) => {
                                return (
                                    <div className='d-flex gap-2 align-items-center'>
                                        <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                                            <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={false} size={17} />
                                        </div>
                                        {option?.label}
                                    </div>
                                );
                            }}
                            className='outline-none border-0 p-0'
                            style={{
                                width: !user ? '0px' : 'fit-content',
                                height: !user ? '0px' : '46px',
                                zIndex: !user ? '0' : '1',
                                position: 'relative',
                                left: !user ? '-60px' : '0px',
                                top: !user ? '-15px' : '0px',
                            }}
                            value={user}
                            dropdownIcon={<></>}
                            collapseIcon={<></>}
                            placeholder="Select project"
                            filter
                            optionGroupLabel="label"
                            optionGroupChildren="items"
                        />
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
    );
};

export default EditTask;