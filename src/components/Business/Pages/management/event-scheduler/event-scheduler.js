import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { initDaypilot, reInitilizeData } from "./utils";
import { getManagement } from "../../../../../APIs/management-api";
import { ProjectStatusesList } from "../../../../../APIs/SettingsGeneral";
import { useTrialHeight } from "../../../../../app/providers/trial-height-provider";
import ProjectCardModel from "../project-card/project-card-model";
import CreateTask from "../task/create-task";
import ViewTask from "../task/view-task";


const CALENDAR_ID = "calender";
function EventScheduler() {
  const { trialHeight } = useTrialHeight();
  const [management, setManagement] = useState([]);
  const [show, setShow] = useState(false);
  const [view, setView] = useState(false);
  const [viewProjectModel, setViewProjectModel] = useState(false);
  const [isReinitilize, setIsReinitilize] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});


  // show project model from invoice 
  const url = window.location.href;
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const unique_id = params.get('unique_id');
  if (unique_id && !projectId) {
    setProjectId(unique_id);

    const reference = params.get('reference');
    const number = params.get('number');
    setProjectDetails({ number: number || "", reference, value: unique_id });
    setViewProjectModel(true);
  }


  function viewTaskDetails(id, isjob = false, projectDetails) {
    if (isjob) {
      setProjectId(id);
      setProjectDetails(projectDetails);
      setViewProjectModel(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  // This useEffect for open create model
  useEffect(() => {
    const handleClick = (e) => {
      if (!(e.target instanceof HTMLSelectElement)) {
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
        setManagement(response);
        initDaypilot(CALENDAR_ID, response, viewTaskDetails);
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


  const reInitilize = async () => {
    try {
      setIsReinitilize(true);
      const response = await getManagement();
      setManagement(response);
      reInitilizeData(response);
      setIsReinitilize(false);
    } catch (error) {
      console.error("Error initializing DayPilot:", error);
    }
  };

  const handleViewTask = () => {
    console.log('handleViewTask: ',);

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

  const timeoutRef = useRef(null);
  const handleSearch = (e) => {
    const search = e.target.value;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      let filteredResponse = management.filter((data) => {
        if (
          (data?.number?.toLowerCase()?.includes(search?.toLowerCase() || ""))
          ||
          (data?.reference?.toLowerCase()?.includes(search?.toLowerCase() || ""))
          ||
          (data?.client?.name.toLowerCase()?.includes(search?.toLowerCase() || ""))
        ) return true;
        else return false;
      });
      reInitilizeData(filteredResponse || []);
    }, 600);
  };

  return <React.Fragment>
    <div className="topbar bottom-border" style={{ padding: '0px 20px', position: 'relative' }}>
      <div className="searchBox" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
          </svg>
        </div>
        <input type="text" placeholder="Search" onChange={handleSearch} className="border search-resource" style={{ borderRadius: '4px', border: '1px solid #D0D5DD', width: '184px', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
      </div>
      <div className="featureName" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <h1 className="title mx-0">Management</h1>
      </div>
      <div className="filters">
        {/* <EventFilters /> */}
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


    <ViewTask view={view} setView={setView} taskId={taskId} setTaskId={setTaskId} reInitilize={reInitilize} />
    <CreateTask show={show} setShow={setShow} project={projectDetails} reInitilize={reInitilize} />

    <ProjectCardModel key={projectId} viewShow={viewProjectModel} setViewShow={setViewProjectModel} projectId={projectId} project={projectDetails} statusOptions={statusOptions} reInitilize={reInitilize} />

    {
      isReinitilize && <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    }
  </React.Fragment>;
}

export default EventScheduler;
