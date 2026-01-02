import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, CheckCircle, Person, PlusCircle, X } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Skeleton } from 'primereact/skeleton';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import { CommentEditor } from './comment-editor';
import styles from './create-task.module.scss';
import { getProjectsList } from '../../../../../APIs/expenses-api';
import { createNewTask, getMobileUserList, getUserList, updateTask } from '../../../../../APIs/task-api';
import { fetchTasksDelete, TaskCompleteJob } from '../../../../../APIs/TasksApi';
import { useAuth } from '../../../../../app/providers/auth-provider';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';
import SelectDate from '../../../../Business/Pages/management/task/select-date';
import TaskComments from '../task-comments/task-comments';

export const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return null;

    const date = new Date(1000 * +dateInMiliSec);
    return date;
};

const CreateTask = ({ show, setShow, refetch, taskId, setTaskId, defaultValue, projectId, refetchTask = undefined, isFetching = false }) => {
    const dropdownRef = useRef(null);
    const textareaRef = useRef(null);
    const commentsRef = useRef(null);
    const commentsScrollRef = useRef(null);
    const { session } = useAuth();
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
    const [createdTaskId, setCreatedTaskId] = useState(null); // Track auto-created task

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

    // Get the effective task ID (either passed in or auto-created)
    const effectiveTaskId = taskId || createdTaskId;

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
        refetch();
        setTaskTitle("");
        setDescription("");
        setProject("");
        setUser(null);
        setDate(null);
        setSaveStatus('idle');
        setCreatedTaskId(null);
        previousValuesRef.current = null;
        isInitialLoadRef.current = true;
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

    // Create a user map for quick lookup by ID (used for assignee display and comment avatars)
    const usersMap = React.useMemo(() => {
        const map = new Map();
        
        // Add desktop users
        usersList?.data?.users?.forEach((u) => {
            map.set(u.id, {
                id: u.id,
                label: `${u.first_name} ${u.last_name}`.trim() || u.first_name || "-",
                photo: u.photo || "",
                has_photo: u.has_photo,
            });
        });
        
        // Add mobile users
        mobileUsersList?.data?.users?.forEach((u) => {
            if (!map.has(u.id)) {
                map.set(u.id, {
                    id: u.id,
                    label: `${u.first_name} ${u.last_name}`.trim() || u.first_name || "-",
                    photo: u.photo || "",
                    has_photo: u.has_photo,
                });
            }
        });
        
        return map;
    }, [usersList?.data?.users, mobileUsersList?.data?.users]);

    useEffect(() => {
        if (!show) reset();
    }, [show]);

    // Create task mutation (for new tasks)
    const createMutation = useMutation({
        mutationFn: (data) => createNewTask(data),
        onSuccess: (response) => {
            setCreatedTaskId(response?.id);
            setSaveStatus('saved');
            // refetch();
            toast.success('Task created');
            setTimeout(() => setSaveStatus('idle'), 2000);
        },
        onError: (error) => {
            console.error('Error creating task:', error);
            setSaveStatus('error');
            toast.error('Failed to create task');
        }
    });

    // Update task mutation (for existing tasks)
    const updateMutation = useMutation({
        mutationFn: (data) => updateTask(effectiveTaskId, data),
        onSuccess: () => {
            setSaveStatus('saved');
            // refetch();
            setTimeout(() => setSaveStatus('idle'), 2000);
        },
        onError: (error) => {
            console.error('Error updating task:', error);
            setSaveStatus('error');
            toast.error('Failed to save changes');
        }
    });

    // Track previous values for comparison to avoid unnecessary API calls
    const previousValuesRef = useRef(null);
    const isInitialLoadRef = useRef(true);

    // Auto-save function ref to avoid stale closures
    const autoSaveRef = useRef(null);

    // Update ref when dependencies change
    useEffect(() => {
        autoSaveRef.current = () => {
            // Only require title to create/save task
            if (!taskTitle?.trim()) {
                return;
            }

            const taskData = {
                title: taskTitle,
                description: description || '',
                ...(project && { project }),
                ...(user && { user }),
                ...(date?.startDate && { from_date: date.startDate }),
                ...(date?.endDate && { to_date: date.endDate }),
            };

            // Create a comparable string of current values
            const currentValues = JSON.stringify({
                title: taskTitle,
                description: description || '',
                project: project || null,
                user: user || null,
                fromDate: date?.startDate?.toString() || null,
                toDate: date?.endDate?.toString() || null,
            });

            // Skip if values haven't changed
            if (previousValuesRef.current === currentValues) {
                return;
            }

            // Skip initial load when editing existing task
            if (isInitialLoadRef.current && effectiveTaskId) {
                isInitialLoadRef.current = false;
                previousValuesRef.current = currentValues;
                return;
            }

            // Update previous values
            previousValuesRef.current = currentValues;
            isInitialLoadRef.current = false;

            setSaveStatus('saving');

            if (effectiveTaskId) {
                updateMutation.mutate(taskData);
            } else {
                createMutation.mutate(taskData);
            }
        };
    }, [taskTitle, description, project, user, date, effectiveTaskId, updateMutation, createMutation]);

    // Debounced auto-save (1.5 seconds after last change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedAutoSave = useCallback(
        debounce(() => {
            autoSaveRef.current?.();
        }, 1500),
        []
    );

    // Trigger auto-save when form fields change
    useEffect(() => {
        if (show && taskTitle?.trim()) {
            debouncedAutoSave();
        }
        return () => {
            debouncedAutoSave.cancel?.();
        };
    }, [taskTitle, description, project, user, date, show, debouncedAutoSave]);

    const deleteMutation = useMutation({
        mutationFn: () => fetchTasksDelete(effectiveTaskId),
        onSuccess: () => {
            console.log('Delete success');
            setShow(false);
            refetch();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    // Mark Complete mutation
    const markCompleteMutation = useMutation({
        mutationFn: (finished) => TaskCompleteJob(effectiveTaskId, finished),
        onSuccess: (_, finished) => {
            toast.success(finished ? 'Task marked as complete' : 'Task marked as incomplete');
            refetchTask?.();
        },
        onError: (error) => {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task status');
        }
    });

    const handleMarkComplete = () => {
        const isCurrentlyComplete = defaultValue?.finished;
        markCompleteMutation.mutate(!isCurrentlyComplete);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    // Handle comment added callback
    const handleCommentAdded = () => {
        commentsRef.current?.refetchComments();
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
        <Sidebar visible={show} position="right" onHide={() => { setShow(false); if (taskId) setTaskId(null); reset(); }} modal={false} dismissable={false} style={{ width: '591px', height: '97vh', borderRadius: '10px', marginRight: '10px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.circleDesignStyle}>
                                <div className={styles.out}>
                                    <PlusCircle size={24} color="#17B26A" />
                                </div>
                            </div>
                            <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>{effectiveTaskId ? "Edit" : "Create New"} Task</span>
                            {/* Save Status Indicator */}
                            <div className={styles.saveStatusWrapper}>
                                {saveStatus === 'saving' && (
                                    <div className={styles.saveStatus}>
                                        <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="3" />
                                        <span>Saving...</span>
                                    </div>
                                )}
                                {saveStatus === 'saved' && (
                                    <div className={clsx(styles.saveStatus, styles.saved)}>
                                        <Check size={14} />
                                        <span>Saved</span>
                                    </div>
                                )}
                                {saveStatus === 'error' && (
                                    <div className={clsx(styles.saveStatus, styles.error)}>
                                        <span>Save failed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>
                    <div className='modal-body' style={{ height: 'calc(100vh - 72px - 200px)', overflow: 'auto' }}>
                        {/* Skeleton Loading State */}
                        {isFetching && taskId ? (
                            <div className='task-content' style={{ padding: '24px' }}>
                                {/* Title Skeleton */}
                                <Skeleton width="70%" height="28px" className="mb-3" />
                                
                                {/* Assignee Row Skeleton */}
                                <Row className="mt-3">
                                    <Col sm={4} className='d-flex flex-column justify-content-center pt-2'>
                                        <Skeleton width="80px" height="22px" />
                                    </Col>
                                    <Col sm={8} className='d-flex align-items-center'>
                                        <Skeleton shape="circle" size="24px" className="me-2" />
                                        <Skeleton width="120px" height="22px" style={{ marginLeft: '8px' }} />
                                    </Col>
                                </Row>

                                {/* Due Date Row Skeleton */}
                                <Row className="mt-3">
                                    <Col sm={4} className='d-flex flex-column justify-content-center'>
                                        <Skeleton width="80px" height="22px" />
                                    </Col>
                                    <Col sm={8}>
                                        <Skeleton width="180px" height="22px" />
                                    </Col>
                                </Row>

                                {/* Project Row Skeleton */}
                                <Row className="mt-3">
                                    <Col sm={4} className='d-flex flex-column justify-content-center pt-3'>
                                        <Skeleton width="100px" height="22px" />
                                    </Col>
                                    <Col sm={8}>
                                        <Skeleton width="200px" height="46px" borderRadius="8px" />
                                    </Col>
                                </Row>

                                {/* Description Skeleton */}
                                <Row className="mt-3">
                                    <Col sm={4}>
                                        <Skeleton width="90px" height="22px" />
                                    </Col>
                                    <Col sm={12} className="mt-2">
                                        <Skeleton width="100%" height="120px" borderRadius="8px" />
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                        <div className='task-content' style={{ padding: '24px' }}>
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
                                            // When using grouped options, option might be the raw value (ID) not the object
                                            // We use usersMap to get the correct user data
                                            const userId = typeof option === 'object' ? option?.value : option;
                                            const userData = usersMap.get(userId);
                                            
                                            if (!userData) return null;

                                            return <div className='d-flex gap-2 align-items-center' style={{ position: 'relative', left: '-10px' }}>
                                                <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                                                    <FallbackImage photo={userData?.photo} has_photo={userData?.has_photo} is_business={false} size={17} />
                                                </div>
                                                {userData?.label}
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
                                        panelStyle={{ maxHeight: '400px', width: '591px' }}
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
                        </div>
                        )}
                        {/* Comments Section */}
                        {effectiveTaskId && (
                            <div className='border-top' style={{ background: '#F2F3F4', padding: '12px 24px' }}>
                                <Form.Label className={styles.formLabel}>Comments</Form.Label>
                                <div ref={commentsScrollRef}>
                                    <TaskComments taskId={effectiveTaskId} ref={commentsRef} usersMap={usersMap} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.sidebarFooter}>
                        {/* Enhanced Comment Editor */}
                        <CommentEditor
                            taskId={effectiveTaskId}
                            session={session}
                            onCommentAdded={handleCommentAdded}
                            disabled={!effectiveTaskId}
                            commentsScrollRef={commentsScrollRef}
                        />

                        {/* Footer with Mark Complete and Delete buttons */}
                        <div className={styles.taskFooter}>
                            <Button
                                disabled={!effectiveTaskId || markCompleteMutation.isPending}
                                className={defaultValue?.finished ? 'outline-in-complete-button' : 'outline-complete-button'}
                                onClick={handleMarkComplete}
                            >
                                {defaultValue?.finished ? 'Completed' : 'Mark Complete'}
                                <CheckCircle size={16} color='#079455' />

                                {markCompleteMutation.isPending && (
                                    <ProgressSpinner style={{ width: '16px', height: '16px' }} strokeWidth="3" />
                                )}
                            </Button>
                            <div className={styles.footerRight}>
                                <span className={styles.footerHint}>
                                    {saveStatus === 'saving' && 'Saving...'}
                                    {saveStatus === 'saved' && 'Changes saved'}
                                    {saveStatus === 'idle' && 'Auto-save enabled'}
                                </span>
                                <Button className='danger-text-button' onClick={handleDelete} disabled={!effectiveTaskId}>
                                    Delete
                                    {deleteMutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }} />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};

export default CreateTask;