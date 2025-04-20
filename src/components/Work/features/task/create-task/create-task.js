import { useEffect, useRef, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import { Person, QuestionCircle } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dropdown } from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'sonner';
import { getProjectsList } from '../../../../../APIs/expenses-api';
import { createNewTask, getUserList, updateTask } from '../../../../../APIs/task-api';
import { fetchTasksDelete } from '../../../../../APIs/TasksApi';
import taskEditIcon from '../../../../../assets/images/icon/taskEditIcon.svg';
import newTaskImg from '../../../../../assets/images/new-task.svg';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';
import SelectDate from '../../../../Business/Pages/management/task/select-date';



const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return null;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(1000 * +dateInMiliSec);
    return date;
};

const CreateTask = ({ show, setShow, refetch, taskId, setTaskId, defaultValue }) => {
    const dropdownRef = useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [project, setProject] = useState("");
    const [user, setUser] = useState(null);
    const [date, setDate] = useState(null);
    const [errors, setErrors] = useState({
        taskTitle: false,
        description: false,
        project: false,
        user: false,
        date: false,
    });

    useEffect(() => {
        if (taskId && defaultValue) {
            setTaskTitle(defaultValue?.title);
            setDescription(defaultValue?.description);
            setProject(defaultValue?.project?.id);
            setUser(defaultValue?.user?.id);
            setDate({ startDate: dateFormat(defaultValue?.from_date), endDate: dateFormat(defaultValue?.to_date) });
        }
    }, [taskId, defaultValue]);

    const reset = () => {
        setTaskTitle("");
        setDescription("");
        setProject("");
        setUser(null);
        setDate(null);
        setSubmitted(false);
        setErrors({
            taskTitle: false,
            description: false,
            project: false,
            user: false,
            date: false
        });
    };
    const projectsList = useQuery({ queryKey: ['getProjectsList'], queryFn: getProjectsList });
    const usersList = useQuery({ queryKey: ['getUserList'], queryFn: getUserList });

    const mutation = useMutation({
        mutationFn: (data) => taskId ? updateTask(taskId, data) : createNewTask(data),
        onSuccess: () => {
            refetch();
            setShow(false);
            reset();
            if (taskId) setTaskId(null);
            toast.success(`Task ${taskId ? "updated" : "created"} successfully`);
        },
        onError: (error) => {
            console.error(`Error ${taskId ? "updating" : "creating"} task:`, error);
            toast.error(`Failed to ${taskId ? "update" : "create"} client. Please try again.`);
        }
    });
    useEffect(() => {
        if (submitted) {
            const newErrors = {
                taskTitle: !taskTitle,
                description: !description,
                project: !project,
                user: !user,
                date: !date
            };
            setErrors(newErrors);
        }
    }, [taskTitle, description, project, user, date, submitted]);

    const handleSubmit = () => {
        setSubmitted(true);
        const newErrors = {
            taskTitle: !taskTitle,
            description: !description,
            project: !project,
            user: !user,
            date: !date
        };
        setErrors(newErrors);

        if (!newErrors.taskTitle && !newErrors.description && !newErrors.user && !newErrors.date) {
            mutation.mutate({
                title: taskTitle,
                description: description,
                project: project,
                user: user,
                from_date: date.startDate,
                to_date: date.endDate,
            });
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (data) => fetchTasksDelete(taskId),
        onSuccess: () => {
            console.log('Delete success');
            setShow(false);
            refetch();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    const handleClose = () => setShow(false);
    return (
        <Modal show={show} centered onHide={handleClose} className='task-form'>
            <Modal.Header closeButton>
                <Modal.Title>
                    <img src={taskId ? taskEditIcon : newTaskImg} alt='task-details' style={{ width: '48px', height: '48px' }} />
                    <span className='modal-task-title'>{taskId ? "Edit" : "New"} Task</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: '#f9fafb' }}>
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
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Project Task</Form.Label>
                    <Dropdown
                        options={projectsList?.data?.map((project) => ({
                            value: project.id,
                            label: `${project.number}: ${project.reference}`
                        })) || []}
                        onChange={(e) => {
                            setProject(e.value);
                            console.log('e.value: ', e.value);
                        }}
                        className='w-100 outline-none'
                        style={{ height: '46px' }}
                        value={project}
                        loading={projectsList?.isFetching}
                        placeholder="Select project"
                        filter
                    />
                    {errors.project && <Form.Text className="text-danger">Project task is required</Form.Text>}
                </Form.Group>
            </Modal.Body>
            <div className='d-flex align-items-center border-top px-3 py-2'>
                <div className='d-flex align-items-center gap-4'>
                    {!user && <Person
                        color={dropdownRef.current?.panel?.element?.offsetParent ? "#1AB2FF" : "#475467"}
                        size={22} style={{ position: 'relative', left: '10px', zIndex: 1 }}
                        onClick={() => dropdownRef.current?.show()} className='me-3 cursor-pointer' />
                    }
                    <Dropdown
                        ref={dropdownRef}
                        options={usersList?.data?.map((user) => ({
                            value: user?.id,
                            label: user?.name || "-",
                            photo: user?.photo || "",
                            has_photo: user?.has_photo
                        })) || []}
                        onChange={(e) => {
                            setUser(e.value);
                        }}
                        valueTemplate={(option) => {
                            return <div className='d-flex gap-2 align-items-center'>
                                <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
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
                        placeholder="Select project"
                        filter
                    />
                </div>
                <SelectDate dateRange={date} setDateRange={setDate} />
            </div>
            {
                (errors.user || errors.date) && <div className='d-flex align-items-center' style={{ gap: '16px', padding: "0 30px 8px 30px" }}>
                    {errors.user && <Form.Text className="text-danger">User is required</Form.Text>}
                    {errors.date && <Form.Text className="text-danger">Date is required</Form.Text>}
                </div>
            }
            <Modal.Footer className='d-flex justify-content-between'>
                <Button type='button' className='delete-button' onClick={handleDelete}>{deleteMutation.isPending ? 'Loading...' : 'Delete Task'}</Button>
                <Button type='button' className='save-button' onClick={handleSubmit}>{mutation.isPending ? 'Loading...' : `${taskId ? "Update" : "Create"} Task`}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateTask;