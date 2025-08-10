import { useEffect, useRef, useState } from 'react';
import { Person, PlusCircle, X } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import styles from './create-task.module.scss';
import { getProjectsList } from '../../../../../APIs/expenses-api';
import { createNewTask, getMobileUserList, getUserList, updateTask } from '../../../../../APIs/task-api';
import { fetchTasksDelete } from '../../../../../APIs/TasksApi';
import { useAuth } from '../../../../../app/providers/auth-provider';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';
import SelectDate from '../../../../Business/Pages/management/task/select-date';

export const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return null;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(1000 * +dateInMiliSec);
    return date;
};

const CreateTask = ({ show, setShow, refetch, taskId, setTaskId, defaultValue }) => {
    const dropdownRef = useRef(null);
    const textareaRef = useRef(null);
    const { session } = useAuth();
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
    const mobileUsersList = useQuery({ queryKey: ['getMobileUserList'], queryFn: getMobileUserList });

    useEffect(() => {
        if (!show) reset();
    }, [show]);

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

    const handleClose = () => {
        setShow(false);
        reset();
    };

    useEffect(() => {
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
            }
        }, 200);
    }, [description, taskId]);

    return (
        <Sidebar visible={show} position="right" onHide={() => { setShow(false); }} modal={false} dismissable={false} style={{ width: '591px', height: '97vh', borderRadius: '10px', marginRight: '10px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.circleDesignStyle}>
                                <div className={styles.out}>
                                    <PlusCircle size={24} color="#17B26A" />
                                </div>
                            </div>
                            <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>{taskId ? "Update" : "Create New"} Task</span>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>
                    <div className='modal-body' style={{ padding: '24px 24px', height: 'calc(97vh - 98px - 80px)', overflow: 'auto' }}>
                        <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className={styles.taskTitleInput}
                        />
                        {errors.taskTitle && <Form.Text className="error-message">Task title is required</Form.Text>}

                        <Row className={"mt-3"}>
                            <Col sm={4} className='d-flex flex-column justify-content-center pt-2'>
                                <Form.Label className={styles.formLabel}>Assignee</Form.Label>
                            </Col>
                            <Col sm={8} className='d-flex flex-column justify-content-center'>
                                {!user && <div className='d-flex align-items-center justify-content-center' onClick={() => dropdownRef.current?.show()} style={{ border: '1px dashed #98A2B3', width: '24px', height: '24px', borderRadius: '50%' }}><Person
                                    color={dropdownRef.current?.panel?.element?.offsetParent ? "#1AB2FF" : "#475467"}
                                    size={18}
                                    className='cursor-pointer' />
                                </div>}
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
                                        ...(session?.has_work_subscription
                                            ? [
                                                {
                                                    label: 'Mobile User',
                                                    items:
                                                        mobileUsersList?.data?.users
                                                            ?.filter((user) => user?.status !== 'disconnected')
                                                            ?.map((user) => ({
                                                                value: user?.id,
                                                                label: `${user?.first_name} ${user?.last_name}` || user?.first_name || "-",
                                                                photo: user?.photo || "",
                                                                has_photo: user?.has_photo,
                                                            })) || [],
                                                },
                                            ]
                                            : []),
                                    ]}
                                    onChange={(e) => {
                                        setUser(e.value);
                                    }}
                                    valueTemplate={(option) => {
                                        if (!option) return null;

                                        return <div className='d-flex gap-2 align-items-center' style={{ position: 'relative', left: '-10px' }}>
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
                                    collapseIcon={<></>}
                                    placeholder="Select project"
                                    filter
                                    filterInputAutoFocus={true}
                                    optionGroupLabel="label"
                                    optionGroupChildren="items"
                                    scrollHeight="400px"
                                />
                            </Col>
                        </Row>
                        {errors.user && <Form.Text className="error-message">User is required</Form.Text>}

                        <Row className={"mt-3"}>
                            <Col sm={4} className='d-flex flex-column justify-content-center'>
                                <Form.Label className={styles.formLabel}>Due Date</Form.Label>
                            </Col>
                            <Col sm={8} className='d-flex flex-column justify-content-center'>
                                <SelectDate dateRange={date} setDateRange={setDate} />
                            </Col>
                        </Row>
                        {errors.date && <Form.Text className="error-message">Date is required</Form.Text>}

                        <Row className={"mt-3"}>
                            <Col sm={4} className='d-flex flex-column justify-content-center pt-3'>
                                <Form.Label className={styles.formLabel}>Link to Project</Form.Label>
                            </Col>
                            <Col sm={8} className='d-flex flex-column justify-content-center'>
                                <Dropdown
                                    options={projectsList?.data?.map((project) => ({
                                        value: project.id,
                                        label: `${project.number}: ${project.reference}`
                                    })) || []}
                                    onChange={(e) => {
                                        setProject(e.value);
                                    }}
                                    className={clsx('outline-none', styles.projectDropdown)}
                                    style={{ height: '46px', width: 'fit-content' }}
                                    value={project}
                                    loading={projectsList?.isFetching}
                                    placeholder="Select project"
                                    filter
                                    filterInputAutoFocus={true}
                                />
                            </Col>
                        </Row>
                        {errors.project && <Form.Text className="error-message">Project task is required</Form.Text>}

                        <Row className={"mt-3"}>
                            <Col sm={4}>
                                <Form.Label className={styles.formLabel}>Description</Form.Label>
                            </Col>
                            <Col sm={12}>
                                <Form.Control
                                    as="textarea"
                                    placeholder='Enter a description...'
                                    value={description}
                                    rows={6}
                                    ref={textareaRef}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    className={styles.taskDescriptionInput}
                                    onInput={(e) => {
                                        e.target.style.height = "auto"; // reset
                                        e.target.style.height = e.target.scrollHeight + "px"; // grow
                                    }}
                                    onFocus={() => {
                                        if (textareaRef.current) {
                                            textareaRef.current.style.height = "auto";
                                            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        {errors.description && <Form.Text className="error-message">Description is required</Form.Text>}

                    </div>
                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '80px' }}>
                        <Button type='button' onClick={handleClose} className='outline-button'>Cancel</Button>
                        <Button type='button' onClick={handleSubmit} className='solid-button' style={{ minWidth: '70px' }} disabled={mutation.isPending}>{ taskId ? "Update Task" : "Create Task" } {mutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }} />}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};

export default CreateTask;

{/* <Modal show={show} centered onHide={handleClose} className='task-form'>
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
                    {errors.taskTitle && <Form.Text className="error-message">Task title is required</Form.Text>}
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
                    {errors.description && <Form.Text className="error-message">Description is required</Form.Text>}
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
                        filterInputAutoFocus={true}
                    />
                    {errors.project && <Form.Text className="error-message">Project task is required</Form.Text>}
                </Form.Group>
            </Modal.Body>
            <div className='d-flex align-items-center border-top px-3 py-2 gap-2'>
                <div className='d-flex align-items-center gap-4' style={{ minWidth: '200px' }}>
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
                            ...(session?.has_work_subscription
                                ? [
                                    {
                                        label: 'Mobile User',
                                        items:
                                            mobileUsersList?.data?.users
                                                ?.filter((user) => user?.status !== 'disconnected')
                                                ?.map((user) => ({
                                                    value: user?.id,
                                                    label: `${user?.first_name} ${user?.last_name}` || user?.first_name || "-",
                                                    photo: user?.photo || "",
                                                    has_photo: user?.has_photo,
                                                })) || [],
                                    },
                                ]
                                : []),
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
                        filterInputAutoFocus={true}
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                    />
                </div>
                <SelectDate dateRange={date} setDateRange={setDate} />
            </div>
            {
                (errors.user || errors.date) && <div className='d-flex align-items-center gap-2' style={{ gap: '16px', padding: "5px 15px" }}>
                    <div style={{ minWidth: '200px' }}>
                        {errors.user && <Form.Text className="error-message">User is required</Form.Text>}
                    </div>
                    {errors.date && <Form.Text className="error-message">Date is required</Form.Text>}
                </div>
            }
            <Modal.Footer className='d-flex justify-content-between'>
                <Button type='button' className='delete-button' onClick={handleDelete}>{deleteMutation.isPending ? 'Loading...' : 'Delete Task'}</Button>
                <Button type='button' className='save-button' onClick={handleSubmit}>{mutation.isPending ? 'Loading...' : `${taskId ? "Update" : "Create"} Task`}</Button>
            </Modal.Footer>
        </Modal> */}