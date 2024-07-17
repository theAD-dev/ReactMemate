import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormControl from '@mui/material/FormControl';
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import NewTaskAdd from "../../../assets/images/icon/newTaskAdd.svg";
import TaskDatePIcker from '../../Work/Pages/tasks/TaskDatePIcker';
import CustomSelect from '../../Work/Pages/tasks/CustomSelect';
import { Person } from "react-bootstrap-icons";
import { fetchTasksNew, fetchTasksProject } from "../../../APIs/TasksApi";
import { format, parseISO } from 'date-fns';

const NewTaskModal = (dateRange) => {
  const [className, setClassName] = React.useState("foo");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [customerCategory, setCustomerCategory] = useState('');
  const [projects, setProjects] = useState([]);
 
  const startDate = dateRange.startDate ? dateRange.startDate.toISOString().split('T')[0] : '';
  const endDate = dateRange.endDate ? dateRange.endDate.toISOString().split('T')[0] : '';
  

  const handleClose = () => {
    setShow(false);
  };
 
  const handleShow = () => setShow(true);
  const [formData, setFormData] = useState({
    taskTitle: '',
    description: '',
    selectedUser: '',
    from_date:  startDate,
    to_date:  endDate
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,  
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCustomerCategory(event.target.value);
  };


  const handleUserSelect = (userId) => {
    setFormData({
      ...formData,
      selectedUser: userId
    });
  };

  const handleCreateTasks = async () => {
    // Validate form data
    const newErrors = {};
    if (!formData.taskTitle) newErrors.taskTitle = 'Task title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!customerCategory) newErrors.customerCategory = 'Project task is required';
    if (!formData.selectedUser) newErrors.selectedUser = 'User is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const formattedFromDate = formData.from_date;
    const formattedToDate = formData.to_date;
    const dateS = parseISO(formattedFromDate); // Parse ISO string to Date object
    const dateE = parseISO(formattedToDate); // Parse ISO string to Date object
    const formattedDateS = format(dateS, 'MMMM dd, yyyy HH:mm:ss'); 
    const formattedDateE = format(dateE, 'MMMM dd, yyyy HH:mm:ss'); 

   // Format dates to ISO string with time component
  //  const formattedFromDate = formData.from_date instanceof Date ? formData.from_date.toISOString() : '';
  //  const formattedToDate = formData.to_date instanceof Date ? formData.to_date.toISOString() : '';
 
    try {
      const taskData = {
        title: formData.taskTitle,
        description: formData.description,
        project: customerCategory,
        user: formData.selectedUser,
        // from_date: formattedFromDate,
        // to_date: formattedToDate
        from_date: formattedDateS,
        to_date: formattedDateE,
      };
      const response = await fetchTasksNew(taskData);
      console.log('Task created:', response);
      // Close modal and reset form
      setShow(false);
      setFormData({
        taskTitle: '',
        description: '',
         selectedUser: '',
         
      });
      setCustomerCategory('');
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };



  
  return (
   <>
     <Button variant="newTaskBut" onClick={handleShow}>
     New
     </Button>
     <Modal show={show} aria-labelledby="contained-modal-title-vcenter"
      centered className='SalesContact newtaskaddModal formgroupboxs ' onHide={handleClose} animation={false}>
        <Modal.Header className='mb-0 pb-0 border-0' closeButton>
          <div className='modelHeader d-flex justify-content-between align-items-start'>
            <span>
              <img src={NewTaskAdd} alt="NewTaskAdd" />
              New Task
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='ContactModel'>
            <div className='ContactModelIn'>
            <Row className='text-left mt-0'>
            <Col>
                <div className="formgroup mb-2 mt-0">
                  <label>Task Title</label>
                  <div className={`inputInfo ${errors.taskTitle ? 'error-border' : ''}`}>
                    <input
                      type="text"
                      name="taskTitle"
                      value={formData.taskTitle}
                      placeholder='Enter task title '
                      onChange={handleInputChange}
                    />
                    {errors.taskTitle && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                  </div>
                  {errors.taskTitle && <p className="error-message">{errors.taskTitle}</p>}
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
                        value={formData.description}
                        placeholder='Enter a description...'
                        onChange={handleInputChange}
                      />
                     
                      </div>
                       {errors.description && <p className="error-message">{errors.description}</p>}
                    </div>
                    </Col>
                    </Row>
                    <Row>
                    <Col >
                    <div className="formgroup mt-2">
                      <label>Project Task</label>
                      <div className={`inputInfo ${errors.customerCategory ? 'error-border' : ''}`}>
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                        <Select
                        MenuProps={{
                          className: 'customScroll',
                        }}
                          value={customerCategory}
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={KeyboardArrowDownIcon}>
                          <MenuItem value="">
                          Select project
                          </MenuItem>
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id} data-value={project.id}>
                              <p>{project.reference}</p>
                              <span>{project.number.substring(4) }</span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      </div>
                      {errors.customerCategory && <p className="error-message">{errors.customerCategory}</p>}
                    </div>
                    </Col>
                  </Row>
            </div>
            <div className='popoverbottom taskBottonBar mt-0 pt-4'>
              <div className='leftTaskActionBtn'>
                <div className="dropdown">
                  <Button onClick={toggleDropdown} className="dropdown-toggle" >
                    {isOpen ? <span className='iconStyleCircle'><Person color="#475467" size={18} /></span> : <span className='iconStyleCircle'><Person color="#475467" size={18} /></span>}
                  </Button>
                  {isOpen && (
                    <div className="dropdown-menu">
                      <h3>Assign team member</h3>
                       <CustomSelect onSelect={handleUserSelect} />
                    </div>
                  )}
                </div>
                <TaskDatePIcker dateRange={dateRange} />
              </div>
              <Button className='savebox' onClick={handleCreateTasks}>
                Create Task
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
   </>
  );
};

export default NewTaskModal;
