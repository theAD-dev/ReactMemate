import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import NewTaskAdd from "../../../assets/images/icon/newTaskAdd.svg";
import TaskDatePIcker from "../../Work/Pages/tasks/TaskDatePIcker";
import CustomSelect from "../../Work/Pages/tasks/CustomSelect";
import { fetchTasksNew, fetchTasksProject } from "../../../APIs/TasksApi";
import CustomProgram from "../../Work/Pages/tasks/customProgram";

const NewTaskModal = () => {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [customerCategory, setCustomerCategory] = useState("");
  const [projects, setProjects] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    selectedUser: "",
    from_date: dateRange.startDate,
    to_date: dateRange.endDate,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await fetchTasksProject();

        if (Array.isArray(projectsData)) {
          console.log("projectsData: ", projectsData);
          const projectsOptions = projectsData.map((project) => {
            return { value: project.id, label: project.reference };
          });

          setProjects(projectsOptions);
        } else {
          console.error("Unexpected projects data format:");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleChange = (programId) => {
    setCustomerCategory(programId);
  };

  const handleUserSelect = (userId) => {
    setFormData({
      ...formData,
      selectedUser: userId,
    });
  };

  const handleCreateTasks = async () => {
    // Validate form data
    const newErrors = {};
    if (!formData.taskTitle) newErrors.taskTitle = "Task title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!customerCategory)
      newErrors.customerCategory = "Project task is required";
    if (!formData.selectedUser) newErrors.selectedUser = "User is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const taskData = {
        title: formData.taskTitle,
        description: formData.description,
        project: customerCategory,
        user: formData.selectedUser,
        from_date: dateRange.startDate,
        to_date: dateRange.endDate,
      };
      const response = await fetchTasksNew(taskData);
      console.log("Task created:", response);
      // Close modal and reset form
      setShow(false);
      setFormData({
        taskTitle: "",
        description: "",
        selectedUser: "",
      });
      setCustomerCategory("");
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle error (e.g., show error message to user)
    }
  };


  return (
    <>
      <Button variant="newTaskBut" onClick={handleShow}>
        New
      </Button>
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact newtaskaddModal formgroupboxs "
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0" closeButton>
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <img src={NewTaskAdd} alt="NewTaskAdd" />
              New Task
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <div className="ContactModelIn">
              <Row className="text-left mt-0">
                <Col>
                  <div className="formgroup mb-2 mt-3">
                    <label>Task Title</label>
                    <div
                      className={`inputInfo ${
                        errors.taskTitle ? "error-border" : ""
                      }`}
                    >
                      <input
                        type="text"
                        name="taskTitle"
                        value={formData.taskTitle}
                        placeholder="Enter task title "
                        onChange={handleInputChange}
                      />
                      {errors.taskTitle && (
                        <img
                          className="ExclamationCircle"
                          src={exclamationCircle}
                          alt="Exclamation Circle"
                        />
                      )}
                    </div>
                    {errors.taskTitle && (
                      <p className="error-message">{errors.taskTitle}</p>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="formgroup mb-2 mt-2">
                    <label>Description</label>
                    <div
                      className={`inputInfo ${
                        errors.description ? "error-border" : ""
                      }`}
                    >
                      <textarea
                        type="text"
                        name="description"
                        value={formData.description}
                        placeholder="Enter a description..."
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    {errors.description && (
                        <p className="error-message">{errors.description}</p>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    className="formgroup mt-2"
                    style={{ position: "relative" }}
                  >
                    <label>Project Task</label>
                    <CustomProgram projects={projects} handleChange={handleChange} error={errors.customerCategory} />
                    {errors.customerCategory && (
                      <p className="error-message">{errors.customerCategory}</p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="footerTaskNewCol">
              <div className="leftTaskActionBtn">
                <div className="dropdown">
                  <CustomSelect onSelect={handleUserSelect} />
                </div>
                <TaskDatePIcker dateRange={dateRange} setDateRange={setDateRange} />
              </div>
            </div>
            <div className="popoverbottom taskBottonBar mt-0 pt-4">
              <div className="leftTaskActionBtn"></div>
              <Button className="savebox" onClick={handleCreateTasks}>
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
