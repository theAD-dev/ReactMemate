import React, { useEffect, useState } from "react";
import { initDaypilot, reInitilizeData } from "./utils";
import { getManagement } from "../../../../../../APIs/management-api";
import { Spinner } from "react-bootstrap";
import ViewTask from "../task/view-task";
import CreateTask from "../task/create-task";
import ProjectCardModel from "../../ProjectCardModel";
import EventFilters from "./event-filters";

const CALENDAR_ID = "calender";
function EventScheduler() {
  const [show, setShow] = useState(false);
  const [view, setView] = useState(false);
  const [viewProjectModel, setViewProjectModel] = useState(false);
  const [isReinitilize, setIsReinitilize] = useState(false);

  const [taskId, setTaskId] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});
  function viewTaskDetails(id) {
    setTaskId(id);
    setView(true);
  }

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
      "https://my.memate.com.au/static/js/daypilot-all.min.js";
    daypilotScript.id = "daypilot-script-ele";

    const handleError = () => {
      console.error("Failed to load DayPilot script.");
    };

    const handleLoad = async () => {
      try {
        const response = await getManagement();
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
      reInitilizeData(response);
      setIsReinitilize(false);
    } catch (error) {
      console.error("Error initializing DayPilot:", error);
    }
  }

  const handleViewTask = () => {
    console.log('handleViewTask: ',);

  }

  useEffect(() => {
    const taskList = document.querySelector(".task-list");
    if (taskList) {
      let taskId = taskList.getAttribute('task-id')
      console.log('taskId: ', taskId);
      taskList.addEventListener("click", handleViewTask());
    }

    return () => {
      if (taskList) {
        let taskId = taskList.getAttribute('task-id')
        console.log('taskId: ', taskId);
        taskList.removeEventListener("click", handleViewTask);
      }
    };
  }, []);

  return <React.Fragment>
    <div className="topbar">
      <div className="searchBox"></div>
      <div className="featureName">
        <h1 className="title">Management</h1>
      </div>
      <div className="filters">
        <EventFilters/>
      </div>
    </div>

    <div id={CALENDAR_ID}>
      <Spinner animation="border" role="status" style={{ marginTop: '30px' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>

    <ViewTask view={view} setView={setView} taskId={taskId} setTaskId={setTaskId} reInitilize={reInitilize}/>
    <CreateTask show={show} setShow={setShow} project={projectDetails} reInitilize={reInitilize} />

    <ProjectCardModel viewShow={viewProjectModel} project={projectDetails} reInitilize={reInitilize} setViewShow={setViewProjectModel} />
    {
      isReinitilize && <div style={{ position: 'absolute', top: '50%', left: '50%', width: '30px', height: '40px' }}>
        <Spinner animation="border" role="status" style={{ marginTop: '30px' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    }
  </React.Fragment>
}

export default EventScheduler;
