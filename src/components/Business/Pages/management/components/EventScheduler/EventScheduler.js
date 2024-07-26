import { useEffect } from "react";
import { initDaypilot } from "./utils";
import { getManagement } from "../../../../../../APIs/management-api";
import { Spinner } from "react-bootstrap";

const CALENDAR_ID = "calender";
function EventScheduler() {
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
        initDaypilot(CALENDAR_ID, response);
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

  return <div id={CALENDAR_ID}>
    <Spinner animation="border" role="status" style={{ marginTop: '30px' }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>;
}

export default EventScheduler;
