import { useEffect, useRef, useState } from 'react';
import { Person, PlusCircle, Send, X } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import styles from './create-task.module.scss';
import TaskAttachment from './task-attachment';
import { getProjectsList } from '../../../../../APIs/expenses-api';
import { createNewTask, createTaskComment, getMobileUserList, getUserList, updateTask } from '../../../../../APIs/task-api';
import { fetchTasksDelete } from '../../../../../APIs/TasksApi';
import { useAuth } from '../../../../../app/providers/auth-provider';
import ChatEmojiPicker from '../../../../../features/chat/ui/chat-area/chat-emoji-picker';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';
import SelectDate from '../../../../Business/Pages/management/task/select-date';
import TaskComments from '../task-comments/task-comments';

export const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return null;

    const date = new Date(1000 * +dateInMiliSec);
    return date;
};

const CreateTask = ({ show, setShow, refetch, taskId, setTaskId, defaultValue, projectId }) => {
    const dropdownRef = useRef(null);
    const textareaRef = useRef(null);
    const commentsRef = useRef(null);
    const commentInputRef = useRef(null);
    const commentsScrollRef = useRef(null);
    const { session } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [project, setProject] = useState("");
    const [user, setUser] = useState(null);
    const [date, setDate] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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
        setNewComment('');
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

        if (!newErrors.taskTitle && !newErrors.description && !newErrors.user && !newErrors.date && !newErrors.project) {
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
        mutationFn: () => fetchTasksDelete(taskId),
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

    // Handle adding a new comment
    const addCommentMutation = useMutation({
        mutationFn: (payload) => createTaskComment(taskId, payload),
        onSuccess: () => {
            setNewComment('');
            commentsRef.current?.refetchComments();

            // Scroll to bottom after new comment
            setTimeout(() => {
                if (commentsScrollRef.current) {
                    commentsScrollRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                    });
                }
            }, 1000);
        },
        onError: (error) => {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment. Please try again.');
        },
        onSettled: () => {
            setIsSubmittingComment(false);
            setTimeout(() => {
                commentInputRef.current?.focus();
            }, 0);
        },
    });

    const handleAddComment = () => {
        if (!newComment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        if (!taskId) {
            toast.error('Please save the task first before adding comments');
            return;
        }

        setIsSubmittingComment(true);

        addCommentMutation.mutate({
            comment: newComment,
            attachment_url: null,
            attachment_type: null,
            created_by: {
                role: session?.user?.role,
            },
        });
    };


    useEffect(() => {
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
            }
        }, 200);
    }, [description, taskId]);

    useEffect(() => {
        if (projectId) {
            setProject(+projectId);
        }
    }, [projectId]);

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
                    <div className='modal-body' style={{ padding: '24px 24px', height: 'calc(100vh - 72px - 122px - 100px)', overflow: 'auto' }}>
                        <Form.Control
                            type="text"
                            name='taskTitle'
                            id='taskTitle'
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
                                        left: !user ? '-60px' : '-4px',
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
                                    style={{ height: '46px', maxWidth: '100%', width: 'fit-content' }}
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
                                    name='taskDescription'
                                    id='taskDescription'
                                    as="textarea"
                                    placeholder='Enter a description...'
                                    value={description}
                                    rows={2}
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

                        {/* Comments Section */}
                        {taskId && (
                            <div className='border-top pt-2 mt-3'>
                                <Form.Label className={styles.formLabel}>Comments</Form.Label>
                                <div ref={commentsScrollRef}>
                                    <TaskComments taskId={taskId} ref={commentsRef} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='modal-footer d-flex flex-column' style={{ borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
                        <div className='d-flex w-100' style={{ padding: '16px 24px' }}>
                            <div className='d-flex align-items-start gap-3 w-100'>
                                <div className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #EAECF0', flexShrink: 0 }}>
                                    <FallbackImage
                                        photo={session?.user?.photo}
                                        has_photo={session?.user?.has_photo}
                                        is_business={false}
                                        size={23}
                                    />
                                </div>
                                <div className='flex-grow-1'>
                                    <InputTextarea
                                        ref={commentInputRef}
                                        id='comment-input'
                                        as="textarea"
                                        placeholder="Add a comment..."
                                        rows={2}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddComment();
                                            }
                                        }}
                                        disabled={isSubmittingComment || !taskId}
                                        style={{
                                            width: '100%',
                                            border: '1px solid #D0D5DD',
                                            borderRadius: '8px',
                                            padding: '10px 14px',
                                            fontSize: '14px',
                                            resize: 'none',
                                            minHeight: '44px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                    <div className={styles.messageInputIcons}>
                                        <TaskAttachment />
                                        <ChatEmojiPicker
                                            show={showEmojiPicker}
                                            setShow={setShowEmojiPicker}
                                            setMessage={setNewComment}
                                        />
                                        <Button onClick={handleAddComment} className={clsx("font-12", styles.commentButton)}>
                                            {
                                                isSubmittingComment
                                                    ? <ProgressSpinner style={{ width: '10px', height: '10px' }} />
                                                    : <Send size={10} color='#fff' />
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-100 d-flex align-items-center justify-content-between gap-3' style={{ borderTop: "1px solid var(--Gray-200, #EAECF0)", padding: '12px 14px 6px 14px' }}>
                            <div>
                                {taskId && (
                                    <Button className='danger-text-button gap-2' onClick={handleDelete}>
                                        Delete
                                        {deleteMutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }} />}
                                    </Button>
                                )}
                            </div>
                            <div className='d-flex align-items-center gap-3'>
                                <Button type='button' onClick={handleClose} className='outline-button'>Cancel</Button>
                                <Button type='button' onClick={handleSubmit} className='solid-button' style={{ minWidth: '70px' }} disabled={mutation.isPending}>{taskId ? "Update Task" : "Create Task"} {mutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }} />}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};

export default CreateTask;