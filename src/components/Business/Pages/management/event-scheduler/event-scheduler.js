import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Spinner } from "react-bootstrap";
import { CalendarWeek, Filter, SortDown } from "react-bootstrap-icons";
import clsx from "clsx";
import { MultiSelect } from "primereact/multiselect";
import { initDaypilot, reInitializeData } from "./utils";
import { getManagement } from "../../../../../APIs/management-api";
import { getHolidaysList, ProjectStatusesList } from "../../../../../APIs/SettingsGeneral";
import { useAuth } from "../../../../../app/providers/auth-provider";
import { useTrialHeight } from "../../../../../app/providers/trial-height-provider";
import CreateJob from "../../../../Work/features/create-job/create-job";
import ViewJob from "../../../../Work/features/view-job/view-job";
import ProjectCardModel from "../project-card/project-card-model";
import { colorMapping } from "../project-card/select-status";
import CreateTaskFeature from "../task/create-task";
import ViewTask from "../task/view-task";


const CALENDAR_ID = "calender";
function EventScheduler() {
  const { session } = useAuth();
  const hasWorkSubscription = session?.has_work_subscription || false;
  const timeoutRef = useRef(null);
  const { trialHeight } = useTrialHeight();
  const [search, setSearch] = useState("");
  const [management, setManagement] = useState([]);
  const [show, setShow] = useState(false);
  const [view, setView] = useState(false);
  const [viewProjectModel, setViewProjectModel] = useState(false);
  const [isReinitialize, setIsReinitialize] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [statusBy, seStatusBy] = useState("");
  const [visible, setVisible] = useState(false);
  const [jobProjectId, setJobProjectId] = useState(null);
  const [viewJob, setViewJob] = useState({ visible: false, jobId: null });
  const [editMode, setEditMode] = useState(false);
  const [holidays, setHolidays] = useState([]);

  // show project model from invoice
  const url = window.location.href;
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const unique_id = params.get('unique_id');
  if (unique_id && !projectId) {
    setProjectId(unique_id);

    const reference = params.get('reference');
    const number = params.get('number');
    const value = params.get('value');
    setProjectDetails({ number: number || "", reference, value: value });
    setViewProjectModel(true);
  }


  function viewTaskDetails(id, isJob = false, projectDetails) {
    if (isJob) {
      const type = projectDetails.type;
      if (type === 'job') {
        setViewJob({ visible: true, jobId: projectDetails.job.id });
      } else {
        setProjectId(id);
        setProjectDetails(projectDetails);
        setViewProjectModel(true);
      }
    } else {
      setTaskId(id);
      setView(true);
    }
  }

  const fetchData = async () => {
    try {
      const data = await ProjectStatusesList();
      setStatusOptions([...data]);
    } catch (error) {
      console.error("Error fetching project status data:", error);
    }
  };

  const getHolidays = async () => {
    try {
      const response = await getHolidaysList();
      setHolidays(response);
      return response;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // This useEffect for open create model
  useEffect(() => {
    const handleClick = (e) => {
      if (!(e.target instanceof HTMLSelectElement)) {
        if (e.target.closest('.createJobButton')) {
          const projectId = e.target.getAttribute('project-id');
          setJobProjectId(projectId);
          setVisible(true);
        }

        if (e.target.closest('.job-resource-child')) {
          const jobId = e.target.closest('.job-resource-child').getAttribute('job-id');
          setViewJob({ visible: true, jobId: jobId });
        }

        if (e.target.closest('.create-task-button')) {
          const number = e.target.getAttribute('number');
          const reference = e.target.getAttribute('reference');
          const projectId = e.target.getAttribute('project-id');

          setProjectDetails({ number, reference, value: projectId });
          setShow(true);
        } else if (e.target.closest('.task-list')) {
          const taskId = e.target.closest('.task-list').getAttribute('task-id');
          console.log('task-list: ....', taskId);
          if (taskId) viewTaskDetails(taskId);
        } else if (e.target.closest(".project-content")) {
          const uniqueId = e.target.closest('.project-content').getAttribute('unique-id');
          const number = e.target.closest('.project-content').getAttribute('number');
          const reference = e.target.closest('.project-content').getAttribute('reference');
          const projectId = e.target.closest('.project-content').getAttribute('project-id');

          console.log('uniqueId: ....', uniqueId);
          setProjectId(uniqueId);
          setProjectDetails({ number, reference, value: projectId });
          setViewProjectModel(true);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const reInitialize = async () => {
    try {
      setIsReinitialize(true);
      const response = await getManagement();
      setManagement(response);
      if (search) searchData(search, response);
      else reInitializeData(response, hasWorkSubscription);
      setIsReinitialize(false);
    } catch (error) {
      console.error("Error initializing DayPilot:", error);
    }
  };

  useEffect(() => {
    const daypilotScript = document.createElement("script");
    daypilotScript.src =
      "/daypilot-all.min.js";
    daypilotScript.id = "daypilot-script-ele";

    const handleError = () => {
      console.error("Failed to load DayPilot script.");
    };

    const handleLoad = async () => {
      try {
        const response = await getManagement();
        const holidays = await getHolidays();
        setManagement(response);
        initDaypilot(CALENDAR_ID, response, viewTaskDetails, reInitialize, hasWorkSubscription, holidays);
      } catch (error) {
        console.error("Error initializing DayPilot:", error);
      }
    };

    daypilotScript.addEventListener('error', handleError);
    daypilotScript.addEventListener('load', handleLoad);

    document.body.appendChild(daypilotScript);

    return () => {
      daypilotScript.removeEventListener('error', handleError);
      daypilotScript.removeEventListener('load', handleLoad);
      if (document.body.contains(daypilotScript)) {
        document.body.removeChild(daypilotScript);
      }
    };
  }, []);

  const handleViewTask = () => {
    console.log('handleViewTask: ');
  };

  useEffect(() => {
    const taskList = document.querySelector(".task-list");
    if (taskList) {
      let taskId = taskList.getAttribute('task-id');
      console.log('taskId: ', taskId);
      taskList.addEventListener("click", handleViewTask());
    }

    return () => {
      if (taskList) {
        let taskId = taskList.getAttribute('task-id');
        console.log('taskId: ', taskId);
        taskList.removeEventListener("click", handleViewTask);
      }
    };
  }, []);

  const searchData = (search, newData) => {
    const managementData = newData || management;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      let filteredResponse = managementData.filter((data) => {
        if (
          (data?.number?.toLowerCase()?.includes(search?.toLowerCase() || ""))
          ||
          (data?.reference?.toLowerCase()?.includes(search?.toLowerCase() || ""))
          ||
          (data?.client?.name.toLowerCase()?.includes(search?.toLowerCase() || ""))
        ) return true;
        else return false;
      });
      reInitializeData(filteredResponse || [], hasWorkSubscription);
    }, 600);
  };

  const applyFiltersAndSort = useCallback(() => {
    let filteredData = [...management];

    // Apply filters
    if (filterBy === "Not Invoiced") {
      filteredData = filteredData.filter((item) => !item.is_invoice_created);
    } else if (filterBy === "Not Booked") {
      filteredData = filteredData.filter((item) => !item.booking_start);
    } else if (filterBy === "Not Paid") {
      filteredData = filteredData.filter((item) => item.paid !== "PAID");
    }

    // Apply sorting
    if (sortBy === "Date Due") {
      filteredData.sort((a, b) => new Date(a.booking_end * 1000) - new Date(b.booking_end * 1000));
    } else if (sortBy === "Date Accepted") {
      filteredData.sort((a, b) => new Date(a.booking_start * 1000) - new Date(b.booking_start * 1000));
    } else if (sortBy === "Job Number") {
      filteredData.sort((a, b) => a.number.localeCompare(b.number));
    } else if (sortBy === "Order Status") {
      filteredData.sort((a, b) => (a?.custom_status?.title || "").localeCompare(b?.custom_status?.title || ""));
    }

    // Apply status filter
    if (statusBy?.length > 0) {
      const status = statusBy.map((option) => option.id);
      filteredData = filteredData.filter((item) => status.includes(item?.custom_status?.id));
    }

    // Apply search
    if (search) {
      filteredData = filteredData.filter((data) => {
        if (
          (data?.number?.toLowerCase()?.includes(search?.toLowerCase() || ""))
          ||
          (data?.reference?.toLowerCase()?.includes(search?.toLowerCase() || ""))
          ||
          (data?.client?.name.toLowerCase()?.includes(search?.toLowerCase() || ""))
        ) return true;
        else return false;
      });
    }

    reInitializeData(filteredData, hasWorkSubscription);
  }, [management, filterBy, sortBy, search, hasWorkSubscription, statusBy]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filterBy, sortBy, search, applyFiltersAndSort, statusBy]);

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    setSearch(search);
  };

  return <React.Fragment>
    <div className="topbar bottom-border" style={{ padding: '0px 20px', position: 'relative' }}>
      <div className='left-side d-flex align-items-center' style={{ gap: '12px' }}>
        <div className="searchBox" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
            </svg>
          </div>
          <input type="text" placeholder="Search" onChange={handleSearch} className="border search-resource" style={{ borderRadius: '4px', border: '1px solid #D0D5DD', width: '184px', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
        </div>

        <div className="d-flex gap-1 justify-content-end align-items-center" style={{ position: 'absolute', left: '4px', top: '56px', zIndex: 1000 }}>
          <Dropdown>
            <Dropdown.Toggle as={Button} className={clsx("outline-button mx-auto")} style={{ padding: "6px 16px", position: "relative" }}>
              <span className="font-14 d-flex align-items-center">
                <SortDown size={16} color="#667085" className="me-1" />
                <div className="ellipsis-width" style={{ maxWidth: '55px', color: '#424242', fontWeight: 400 }} title={sortBy}>{sortBy || <span style={{ color: '#667085' }}>Sort By</span>}</div>
              </span>
              {sortBy && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSortChange("");
                  }}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#F2F4F7",
                    marginLeft: "8px"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item key={"Date Due"} eventKey={"Date Due"} active={sortBy === "Date Due"} onClick={() => handleSortChange("Date Due")}>
                Date Due
              </Dropdown.Item>
              <Dropdown.Item key={"Date Accepted"} eventKey={"Date Accepted"} active={sortBy === "Date Accepted"} onClick={() => handleSortChange("Date Accepted")}>
                Date Accepted
              </Dropdown.Item>
              <Dropdown.Item key={"Job Number"} eventKey={"Job Number"} active={sortBy === "Job Number"} onClick={() => handleSortChange("Job Number")}>
                Job Number
              </Dropdown.Item>
              <Dropdown.Item key={"Order Status"} eventKey={"Order Status"} active={sortBy === "Order Status"} onClick={() => handleSortChange("Order Status")}>
                Order Status
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle as={Button} className={clsx("outline-button mx-auto")} style={{ padding: "6px 16px", position: "relative" }}>
              <span className="font-14 d-flex align-items-center">
                <CalendarWeek size={16} color="#667085" className="me-1" />
                <div className="ellipsis-width" style={{ maxWidth: '55px', color: '#424242', fontWeight: 400 }} title={filterBy}>{filterBy || <span style={{ color: '#667085' }}>Filter By</span>}</div>
              </span>
              {filterBy && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterChange("");
                  }}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#F2F4F7",
                    marginLeft: "8px"
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item key={"Not Invoiced"} eventKey={"Not Invoiced"} active={filterBy === "Not Invoiced"} onClick={() => handleFilterChange("Not Invoiced")}>
                Not Invoiced
              </Dropdown.Item>
              <Dropdown.Item key={"Not Booked"} eventKey={"Not Booked"} active={filterBy === "Not Booked"} onClick={() => handleFilterChange("Not Booked")}>
                Not Booked
              </Dropdown.Item>
              <Dropdown.Item key={"Not Paid"} eventKey={"Not Paid"} active={filterBy === "Not Paid"} onClick={() => handleFilterChange("Not Paid")}>
                Not Paid
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <div style={{ position: 'relative', maxWidth: '113px' }}>
            <div style={{ position: 'absolute', top: '3px', left: '12px', zIndex: 1 }}>
              <Filter size={20} color="#667085" />
            </div>
            <MultiSelect
              value={statusBy}
              options={statusOptions}
              onChange={(e) => seStatusBy(e.value)}
              optionLabel="title"
              placeholder="Status"
              maxSelectedLabels={0}
              itemTemplate={(item) => {
                return (<div className="d-flex align-items-center gap-2" style={{ width: '250px' }}>
                  <div className="w-100 p-2 rounded" style={{ background: `${colorMapping[item?.color]?.bg}`, borderLeft: `4px solid ${colorMapping[item?.color]?.border}`, color: `${colorMapping[item?.color]?.color}` }}>
                    <span className="ellipsis-width" style={{ maxWidth: '250px' }}>{item.title}</span>
                  </div>
                </div>);
              }}
              filter
              scrollHeight="400px"
              display="chip"
              showClear={true}
              className="w-100 custom-multiselect management-multiselect"
              style={{ width: '184px', borderRadius: '40px', padding: '2px 8px', paddingLeft: '34px' }}
            />
          </div>
        </div>

      </div>

      <div className="featureName" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <h1 className="title mx-0">Project Management</h1>
      </div>
      <div className="right-side d-flex align-items-center">

      </div>
    </div>

    <div className={trialHeight && 'trial-height-added'}>
      <div id={CALENDAR_ID}>
        <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    </div>

    <ViewTask view={view} setView={setView} taskId={taskId} setTaskId={setTaskId} reInitialize={reInitialize} />
    <CreateTaskFeature show={show} setShow={setShow} project={projectDetails} reInitialize={reInitialize} />

    <ProjectCardModel key={projectId} viewShow={viewProjectModel} setViewShow={setViewProjectModel} projectId={projectId} project={projectDetails} statusOptions={statusOptions} reInitialize={reInitialize} />
    <CreateJob visible={visible} setVisible={setVisible} setRefetch={reInitialize} jobProjectId={jobProjectId} />
    <ViewJob visible={viewJob?.visible} jobId={viewJob?.jobId} setVisible={(bool) => setViewJob((others) => ({ ...others, visible: bool }))} setRefetch={reInitialize} editMode={editMode} setEditMode={setEditMode} />

    {
      isReinitialize && <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    }
  </React.Fragment>;
}

export default EventScheduler;
