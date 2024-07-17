import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { fetchTasksRead } from '../../../../APIs/TasksApi';
import infoTaskCircle from '../../../../assets/images/icon/infoTaskCircle.svg';
import {ArrowRight,CheckCircleFill} from "react-bootstrap-icons";
import taskEditIcon from '../../../../assets/images/icon/taskEditIcon.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CustomSelect from './CustomSelect';
import TextField from '@mui/material/TextField';
import TaskDatePicker from './TaskDatePIcker';
import { fetchTasksProject } from "../../../../APIs/TasksApi";
const ViewTaskModal = ({ taskId }) => {
  const [viewShow, setViewShow] = useState(false);
  const [taskRead, setTaskRead] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [customerCategory, setCustomerCategory] = useState();
//const  [editPopup,setEditPopUp]  = useState(show);
  const [errors, setErrors] = useState({});
  const [show,setShow] = useState();
  const handleClose = () => {
    setViewShow(false);
  };
  const handleShow = () => {
    setViewShow(true);
    fetchData(); // Call fetchData when showing the modal
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
// Formate Date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
  const year = date.getFullYear();
  return `${day} ${monthAbbreviation} ${year}`;
};
  // Define fetchData function outside of useEffect
  const fetchData = async () => {
    console.log('-------------taskId----------------'+taskId);
    try {
      const data = await fetchTasksRead(taskId);
      setTaskRead(data); // Assuming data is already parsed
      //console.log('---------------------23164897---------------------------'+JSON.stringify(taskRead));
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
    const handleDataFromChild = ()=>{
      setViewShow(false);
    }


   
    const [projects, setProjects] = useState([]);
     
      useEffect(() => {
       const fetchProjects = async () => {
         try {
           const projectsData = await fetchTasksProject();
           if (Array.isArray(projectsData)) {
             setProjects(projectsData);
           } else {
             console.error('Unexpected projects data format:');
           }
         } catch (error) {
           console.error('Error fetching projects:', error);
         }
       };
       fetchProjects();
      }, []);
   
     const handleEditClose = () => setShow(false);
   
     const handleChange = (e) => {
       const { name, value } = e.target;
       setTaskRead({
         ...taskRead,
         [name]: value,
       });
     };
   
     const [searchQuery, setSearchQuery] = useState('');
     // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );
     const handleSave = () => {
       // Logic to save the updated task data
       console.log('Updated task data:', taskRead);
       handleClose();
     };

     const handleEditShow = ()=>{
      setViewShow(false);
      setShow(true);
     }
     const handleUserSelect = () => {};
  return (
    <>
    {/* View modal */}
      <div className="linkByttonStyle" onClick={handleShow}>
        Open
      </div>
      
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact newtaskaddModal viewtaskaddModal formgroupboxs"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0" closeButton>
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <img src={infoTaskCircle} alt="NewTaskAdd" />
              Task Details
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          {taskRead && (
            <div className="ContactModel">
              <div className="ContactModelIn">
                <Row className="text-left mt-3">
                  <Col>
                    <h2>{taskRead.title.length > 0 ? taskRead.title : 'Title is too long'}</h2>
                    <p> {taskRead.description.length > 0 ? taskRead.description : 'description is too long'}</p>
                  </Col>
                </Row>
                <Row className="text-left mt-0">
                  <Col>
                    <ul>
                      <li>
                        <span>Project Task</span>
                        {taskRead.project && taskRead.project.reference ? (
                          <span>{taskRead.project.reference}</span>
                        ) : (
                         <span>-</span>
                        )}
                      </li>
                      <li>
                        <span>ID</span>
                        <span>{taskRead.number} </span>
                      </li>
                      <li>
                        <span>Assigned</span>
                        <span className='taskUserPic'> <div className='taskUserImage'>
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
                            </div>{taskRead.user.full_name.length > 0 ? taskRead.user.full_name : 'user.full_name is too long'}</span>
                      </li>
                      <li>
                        <span>Date</span>
                        <span className='viewTaskDate'> {formatDate(taskRead.from_date).length > 0 ? formatDate(taskRead.from_date) : 'Date is too long'} <ArrowRight size={24} color="#475467" /> {formatDate(taskRead.to_date).length > 0 ? formatDate(taskRead.to_date) : 'Date is too long'}</span>
                      
                      </li>
                      
                    </ul>
                  </Col>
                </Row>
              </div>
              <div className="popoverbottom taskBottonBar mt-0 pt-4">
                <div className="leftTaskActionBtn"></div>
                <div className='viewFooterModalBox'>
                {/* <EditTaskModal  className="editBut" taskRead={taskRead}  sendDataToParent={handleDataFromChild} /> */}
                <div className='editBut' onClick={handleEditShow}>
                  Edit Task
                </div>
                <Button onClick={toggleDropdown} className={`statusBut ${taskRead.finished}`}>
                {taskRead.finished ? (
                             <>
                               Incomplete <CheckCircleFill size={20} color="#B42318" />
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

      
      {/* editmodal */}

      {/* <div className='editBut' onClick={handleShow}>
        Edit Task
      </div> */}
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact newtaskaddModal viewtaskaddModal EditaskaddModal formgroupboxs"
         onHide={handleEditClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0" closeButton>
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <img src={taskEditIcon} alt="NewTaskAdd" />
              Edit Task
            </span>
          </div> 
        </Modal.Header>
        <Modal.Body>
           <div className="ContactModel">
            <div className="ContactModelIn">
              <Row>
                <Col>
                  <div className="formgroup mt-2">
                    <label>Project Task</label>
                    
                    <div className={`inputInfo ${errors.customerCategory ? 'error-border' : ''}`}>
                      {/* <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                        <Select
                          value={customerCategory}
                          onChange={handleChange}
                          
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          <MenuItem value="">
                            Select project
                          </MenuItem>
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id} data-value={project.id}>
                              {project.reference}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                        <Select
                           value={customerCategory}
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={KeyboardArrowDownIcon}
                          renderValue={selected => selected ? selected : 'Select project'}
                        >
                          <MenuItem disabled value="">
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
                        value={(taskRead)? taskRead.title:''}
                        onChange={handleChange}
                      />
                      {/* {errors.taskRead && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />} */}
                    </div>
                    {/* {errors.taskRead && <p className="error-message">{errors.taskRead}</p>} */}
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
                        value={(taskRead)?taskRead.description:''}
                        onChange={handleChange}
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
                  <div className="formgroup mb-2 mt-2">
                    <CustomSelect onSelect={handleUserSelect} />
                    {taskRead?
                    <>
                      <span className='viewTaskDate'>
                        {formatDate(taskRead.from_date).length > 0 ? formatDate(taskRead.from_date) : 'Date is too long'}
                        <ArrowRight size={24} color="#475467" />
                        {formatDate(taskRead.to_date).length > 0 ? formatDate(taskRead.to_date) : 'Date is too long'}
                      </span>
                    </>

                      :''}
                  </div>
                </Col>
               
              </Row>
            </div>
            <div className="popoverbottom taskBottonBar mt-0 pt-4">
              <Button variant="secondary delete" onClick={handleClose}>
                Delete Task
              </Button>
              <Button variant="primary save" onClick={handleSave}>
                Save Task
              </Button>
            </div>
          </div> 
        </Modal.Body>
      </Modal>




      

      








    </>
  );
};

export default ViewTaskModal;
