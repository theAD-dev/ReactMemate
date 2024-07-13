import { useEffect } from "react";
import { initDaypilot } from "./utils";

const CALENDAR_ID = "calender";
function EventScheduler() {
  useEffect(() => {
    const daypilotScript = document.createElement("script");
    daypilotScript.src =
      "https://my.memate.com.au/static/js/daypilot-all.min.js";
    daypilotScript.id = "daypilot-script-ele";
    document.body.appendChild(daypilotScript);
    setTimeout(() => {
      initDaypilot(CALENDAR_ID);
    }, 0);
    return () => {
      document.body.removeChild(daypilotScript);
    };
  }, []);
  return <div id={CALENDAR_ID}></div>;
}

export default EventScheduler;
