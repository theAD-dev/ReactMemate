import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { fetchTasksRead, fetchTasksProject, fetchTasksUpdate,fetchTasksDelete,TaskCompleteJob } from '../../../../APIs/TasksApi';
import TaskDetailsIcon from "../../../../assets/images/icon/TaskDetailsIcon.svg";
import { ArrowRight, CheckCircleFill ,X} from "react-bootstrap-icons";
import taskbinImage from '../../../../assets/images/icon/taskbinImage.png';
import taskEditIcon from '../../../../assets/images/icon/taskEditIcon.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import CustomSelect from './CustomSelect';
import TaskDatePicker from './TaskDatePIcker';
import { format, parseISO } from 'date-fns';

const ViewTaskModal = ({ taskId }) => {
  const [viewShow, setViewShow] = useState(false);
  const [taskRead, setTaskRead] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [customerCategory, setCustomerCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updateDis, setUpdateDis] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [user, setUser] = useState(null);
  const [updateUser, setUpdateUser] = useState('');
  const [deleteShow, setDeleteShow] = useState(false);

  const handleClose = () => {
    setViewShow(false);
    setDeleteShow(false);
    setShow(false);
   
  };

  const handleShow = () => {
    setViewShow(true);
    fetchData(); // Call fetchData when showing the modal
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const handleToggleComplete = async () => {
    const isComplete = !taskRead.finished; // Toggle the current status
    try {
      await TaskCompleteJob(taskId, isComplete); // Pass the new status to the function
      setTaskRead({ ...taskRead, finished: isComplete }); // Update local state
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };


  // Format Date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
  };

  const options = { month: 'short', day: 'numeric' };
  const formattedFromDate = "2019-08-24T14:15:22Z";
  const formattedToDate = "2024-08-24T14:15:22Z";
  const start = new Date(formattedFromDate).toLocaleDateString('en-US', options);
  const end = new Date(formattedToDate).toLocaleDateString('en-US', options);

  const dateS = parseISO(formattedFromDate); // Parse ISO string to Date object
  const dateE = parseISO(formattedToDate); // Parse ISO string to Date object

  const formattedDateS = format(dateS, 'MMMM dd, yyyy HH:mm:ss'); 
  const formattedDateE = format(dateE, 'MMMM dd, yyyy HH:mm:ss'); 

  

  // Fetch task data
  const fetchData = async () => {
    try {
      const data = await fetchTasksRead(taskId);
      setTaskRead(data); // Assuming data is already parsed
      setUpdateTitle(data.title); // Initialize updateTitle with fetched task data
      setUpdateDis(data.description); // Initialize updateDis with fetched task data
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching task information:', error);
    }
  };

  useEffect(() => {
    // Fetch data when taskId changes or when modal is shown
    if (viewShow) {
      fetchData();
    }
  }, [taskId, viewShow]);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await fetchTasksProject();
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
        } else {
          console.error('Unexpected projects data format:', projectsData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Handle close of edit modal
  const handleEditClose = () => {
    setShow(false);
  };

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setUpdateTitle(value);
    } else if (name === 'description') {
      setUpdateDis(value);
    } else if (name === 'project') {
      setTaskRead({
        ...taskRead,
        project: {
          ...taskRead.project,
          reference: value,
        },
      });
    } else {
      setTaskRead({
        ...taskRead,
        [name]: value,
      });
    }
  };
  const handleDelete = () => {
    //console.log('handleDelete')
    setShow(false);
    setDeleteShow(true);
    
  };
 // Handle delete task
 const handleDeleteTask = async () => {
  if (!taskId) {
    console.error('No task ID provided for deletion');
    return;
  }
  try {
    await fetchTasksDelete(taskId);
    //console.log('Task deleted successfully');
    setDeleteShow(false);
    handleClose(); // Close the modal and perform any additional actions needed
    //fetchData();

  } catch (error) {
    console.error('Error deleting task:', error);
    // Optionally, show an error message to the user
  }
};

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    // Ensure project is an ID, not a reference
    const projectId = projects.find(project => project.reference === taskRead.project.reference)?.id;
  
    const mainData = {
      title: updateTitle,
      description: updateDis,
      from_date: "2019-08-24T14:15:22Z", // Ensure this is in the correct ISO 8601 format
      to_date: "2024-08-24T14:15:22Z",     // Ensure this is in the correct ISO 8601 format
      project: projectId,            // Ensure this is the project ID, not reference
      user: updateUser               // Ensure this is the correct user ID
    };
  
    try {
      const updatedTask = await fetchTasksUpdate(mainData, taskId);
      console.log('Updated task data:', updatedTask);
      handleClose(); // Close modal after successful update
      setShow(false);
    } catch (error) {
      console.error('Error updating task:', error);
      // Handle errors or display a message to the user
    }
  };
  
  const MenuProps = {
    PaperProps: {
      className: 'my-custom-class',
    },
  };
  // Handle opening edit modal
  const handleEditShow = () => {
    setViewShow(false);
    setShow(true);
  };

  // Placeholder for user selection handling
  const handleUserSelect = (userId) => {
    setUpdateUser(userId);
  };
  const cancelPopupModal = ()=>{
    setDeleteShow(false);
  }
  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle" onClick={handleShow}>
        Open
      </div>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact newtaskaddModal viewtaskaddModal formgroupboxs"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
            <img src={TaskDetailsIcon} alt="NewTaskAdd" />
              Task Details
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
      </button>
        </Modal.Header>
        <Modal.Body>
          {taskRead && (
            <div className="ContactModel">
              <div className="ContactModelIn">
                <Row className="text-left mt-3">
                  <Col>
                    <h2>{taskRead.title}</h2>
                    <p className='taskViewScroll'>{taskRead.description}</p>
                  </Col>
                </Row>
                <Row className="text-left mt-0">
                  <Col>
                    <ul>
                      <li>
                        <span>Project Task</span>
                        <span>{taskRead.project && taskRead.project.reference ? taskRead.project.reference : '-'}</span>
                      </li>
                      <li>
                        <span>ID</span>
                        <span>{taskRead.number}</span>
                      </li>
                      <li>
                        <span>Assigned</span>
                        <span className='taskUserPic'>
                          <div className='taskUserImage'>
                          {taskRead.user.has_photo ? (
                              <img
                                src={taskRead.user.photo}
                                alt="User"
                                style={{ marginRight: '5px' }}
                              />
                            ) : (
                              <img
                              src={taskRead.user.photo}
                                alt="Placeholder"
                                style={{ marginRight: '5px' }}
                              />
                            )}
                          </div>
                          {taskRead.user.full_name}
                        </span>
                      </li>
                      <li>
                        <span>Date</span>
                        <span className='viewTaskDate'>
                          {formatDate(taskRead.from_date)} <ArrowRight size={24} color="#475467" /> {formatDate(taskRead.to_date)}
                        </span>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              <div className="popoverbottom taskBottonBar mt-0 pt-4">
                <div className="leftTaskActionBtn"></div>
                <div className='viewFooterModalBox'>
                  <div className='editBut' onClick={handleEditShow}>
                    Edit Task
                  </div>
                  <Button onClick={handleToggleComplete} className={`statusBut ${taskRead.finished}`}>
                    {taskRead.finished ? (
                      <>
                     Incomplete <CheckCircleFill size={20} color="#F04438" />
                    </>
                  ) : (
                    <>
                      Complete <CheckCircleFill size={20} color="#17B26A" />
                      
                    </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit modal */}
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact newtaskaddModal viewtaskaddModal EditaskaddModal formgroupboxs"
        onHide={handleEditClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0" >
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
            <img src={taskEditIcon} alt="NewTaskAdd" />
            
              Edit Task
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
      </button>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <div className="ContactModelIn">
              <Row>
                <Col>
                  <div className="formgroup  mt-2">
                    <label>Project Task</label>
                    <div className={`inputInfo ${errors.customerCategory ? 'error-border' : ''}`}>
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                        <Select
                         MenuProps={MenuProps}
                          value={taskRead?.project?.reference || ''}
                          onChange={(e) => handleChange({ target: { name: 'project', value: e.target.value } })}
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          <MenuItem value="">
                            Select project
                          </MenuItem>
                          <MenuItem>
                            <TextField
                              autoFocus
                              placeholder="Search..."
                              fullWidth
                              onChange={(e) => setSearchQuery(e.target.value)}
                              value={searchQuery}
                            />
                          </MenuItem>
                          {filteredProjects.map((project) => (
                            <MenuItem key={project.id} value={project.reference}>
                              {project.reference}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    {errors.customerCategory && <p className="error-message">{errors.customerCategory}</p>}
                  </div>
                </Col>
              </Row>
              <Row className="text-left mt-2">
                <Col>
                  <div className="formgroup mb-2 mt-0">
                    <label>Task Title</label>
                    <div className={`inputInfo ${errors.taskRead ? 'error-border' : ''}`}>
                      <input
                        type="text"
                        name="title"
                        value={updateTitle}
                        onChange={(e) => {
                          setUpdateTitle(e.target.value);
                          handleChange(e);
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
             
                <Col>
                  <div className="formgroup mb-2 mt-2">
                    <label>Description</label>
                    <div className={`inputInfo ${errors.description ? 'error-border' : ''}`}>
                      <textarea
                        type="text"
                        name="description"
                        value={updateDis}
                        onChange={(e) => {
                          setUpdateDis(e.target.value);
                          handleChange(e);
                        }}
                      />
                      {errors.description && <p className="error-message">{errors.description}</p>}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className='footerDateBox'>
              <Row>
                <Col>
                  <div className="dropdown formgroup mb-2 mt-2">
                    <CustomSelect onSelect={handleUserSelect} assigneduser={user}/>
                    <span className='viewTaskDate'>
                      {start} - {end}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="popoverbottom taskBottonBar mt-0 pt-4">
              <Button onClick={handleDelete} variant="outline-danger">
                Delete Task
              </Button>
              <Button variant="primary save" onClick={handleSave}>
                Save Task
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

 {/* Delete modal */}
 <Modal
       show={deleteShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact newtaskaddModal viewtaskaddModal EditaskaddModal delaskaddModal formgroupboxs"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0" closeButton>
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
            Are you sure you want to delete task?
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
          <div className="ContactModelIn">
          <img src={taskbinImage} alt="taskbinImage" />
          </div>
          {taskRead && (
          <div className="deltaskText">
                  
                    <h2>{taskRead.title}</h2>
                    <p className='taskViewScroll'>{taskRead.description}</p>
                 
                </div>
          )}
            <div className="popoverbottom taskBottonBar mt-0 pt-4">
              <Button onClick={handleDeleteTask} variant="outline-danger">
                Delete Task
              </Button>
              <Button variant="outline-secondary" onClick={cancelPopupModal}>
               Cancel
              </Button>
           
            </div>
          </div>
        </Modal.Body>
      </Modal>

      
    </>
  );
};

export default ViewTaskModal;
