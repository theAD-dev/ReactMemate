import { useState } from 'react';
import { X } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import AddNoteModeIcon from "../../../../../assets/images/icon/addNoteModeIcon.svg";

const NewTask = ({ submission, reInitialize }) => {
    const [viewShow, setViewShow] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [errors, setErrors] = useState({});

    const handleShow = () => setViewShow(true);
    const handleClose = () => {
        setViewShow(false);
        setTaskTitle('');
        setTaskDescription('');
        setErrors({});
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!taskTitle.trim()) {
            newErrors.title = 'Task title is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // TODO: Implement API call to create task
        console.log('Creating task for submission:', submission?.id, {
            title: taskTitle,
            description: taskDescription
        });
        
        handleClose();
        if (reInitialize) reInitialize();
    };

    return (
        <>
            <button disabled className="linkByttonStyle py-2 border-right pe-5" style={{ cursor: 'not-allowed' }} onClick={handleShow}>
                New Task
            </button>

            <Modal
                show={viewShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="taskModelProject"
                onHide={handleClose}
                animation={false}
                size="lg"
            >
                <Modal.Header className="mb-0 pb-0 border-0">
                    <div className="modelHeader d-flex justify-content-between align-items-start">
                        <span>
                            <img src={AddNoteModeIcon} alt="AddNoteModeIcon" />
                            New Task
                        </span>
                    </div>
                    <button className='CustonCloseModal' onClick={handleClose}>
                        <X size={24} color='#667085' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="ContactModel">
                        <Row>
                            <Col>
                                <div className="formgroup mb-2">
                                    <label htmlFor="task-title">Task Title <span className="required">*</span></label>
                                    <div className={`inputInfo ${errors.title ? 'error-border' : ''}`}>
                                        <input
                                            id="task-title"
                                            type="text"
                                            value={taskTitle}
                                            placeholder='Enter task title...'
                                            onChange={(e) => {
                                                setTaskTitle(e.target.value);
                                                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                                            }}
                                            className="w-100"
                                        />
                                    </div>
                                    {errors.title && <small className="error-message">{errors.title}</small>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="formgroup mb-2 mt-2">
                                    <label htmlFor="task-description">Description</label>
                                    <div className="inputInfo">
                                        <textarea
                                            id="task-description"
                                            value={taskDescription}
                                            placeholder='Enter task description...'
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            rows={6}
                                            className="w-100"
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer className='pt-0'>
                    <div className="popoverbottom w-100 border-0 mt-0 pt-0">
                        <Button
                            variant="outline-danger"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary save"
                            onClick={handleSubmit}
                        >
                            Create Task
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NewTask;
