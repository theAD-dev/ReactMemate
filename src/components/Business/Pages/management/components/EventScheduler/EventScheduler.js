import React, { useEffect, useState } from "react";
import { initDaypilot } from "./utils";
import { getManagement } from "../../../../../../APIs/management-api";
import { Spinner } from "react-bootstrap";
import ViewTask from "../task/view-task";
import CreateTask from "../task/create-task";
import EditTask from "../task/edit-task";

const CALENDAR_ID = "calender";
function EventScheduler() {
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskId, setTaskId] = useState(null);
  function viewTaskDetails (id) {
    setTaskId(id);
  }

  function handleEdit (id, data) {
    console.log('id: ', id);
    setShowEditModal(id);
  } 

  function createTask(reference) {
    console.log('reference: ', reference);

  }

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
        initDaypilot(CALENDAR_ID, response, viewTaskDetails, createTask);
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
    <div id={CALENDAR_ID}>
      <Spinner animation="border" role="status" style={{ marginTop: '30px' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
    
    <ViewTask taskId={taskId} setTaskId={setTaskId} handleEdit={handleEdit} />
    <CreateTask show={show} setShow={setShow} />
    <EditTask show={showEditModal} setShow={setShowEditModal} />
  </React.Fragment>
}

export default EventScheduler;
