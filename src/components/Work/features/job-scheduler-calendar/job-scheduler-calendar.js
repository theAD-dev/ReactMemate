import { fetchAPI } from "../../../../APIs/base-api";

let dp, DP, expandRow;

const getStatusLabel = (status) => {
  const statusMap = {
    "1": { label: "Open", className: "open", color: '#065b76', backColor: '#ecf7fd' },
    "2": { label: "Assign", className: "ASSIGN", color: '#520676', backColor: '#f6ecfd' },
    "3": { label: "Not Confirmed", className: "NotConfirmed", color: '#b42318', backColor: '#fef3f2' },
    "4": { label: "Confirmed", className: "CONFIRMED", color: '#067647', backColor: '#ecfdf3' },
    "5": { label: "Completed", className: "COMPLETED", color: '#067647', backColor: '#ecfdf3' },
    "6": { label: "Canceled", className: "MANAGER_DECLINED", color: '#b54708', backColor: '#fffaeb' },
    "a": { label: "Accepted", className: "Accepted", color: '#067611', backColor: '#f2fdec' },
    "d": { label: "Declined", className: "DECLINED", color: '#b42318', backColor: '#fef3f2' },
  };

  return statusMap[status] || { label: status, className: "defaultStatus" };
};

function parseTimestamp(timestampStr) {
  return new Date(new Date(timestampStr).getTime() - (new Date(timestampStr).getTimezoneOffset() * 60 * 1000));
}

function loadData(data) {
  const events = [];
  const resources = [
    {
      id: 0,
      html: `<div class="d-flex align-items-center open-jobs-box">
      <div class="d-flex justify-content-center align-items-center icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.14307 6.57171C6.82748 6.57171 6.57164 6.82754 6.57164 7.14314C6.57164 7.45873 6.82748 7.71457 7.14307 7.71457H12.8574C13.1729 7.71457 13.4288 7.45873 13.4288 7.14314C13.4288 6.82754 13.1729 6.57171 12.8574 6.57171H7.14307Z" fill="#475467"/>
          <path d="M7.14307 8.85742C6.82748 8.85742 6.57164 9.11326 6.57164 9.42885C6.57164 9.74444 6.82748 10.0003 7.14307 10.0003H10.5716C10.8872 10.0003 11.1431 9.74444 11.1431 9.42885C11.1431 9.11326 10.8872 8.85742 10.5716 8.85742H7.14307Z" fill="#475467"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 3.14314C11.2626 3.14314 12.2859 2.11979 12.2859 0.857422H15.1431C16.0898 0.857422 16.8574 1.62493 16.8574 2.57171V17.4289C16.8574 18.3756 16.0898 19.1431 15.1431 19.1431H4.85735C3.91058 19.1431 3.14307 18.3756 3.14307 17.4289V2.57171C3.14307 1.62493 3.91058 0.857422 4.85735 0.857422H7.7145C7.7145 2.11979 8.73784 3.14314 10.0002 3.14314ZM10.0002 4.28599C11.493 4.28599 12.763 3.33193 13.2337 2.00028H15.1431C15.4587 2.00028 15.7145 2.25612 15.7145 2.57171V17.4289C15.7145 17.7444 15.4587 18.0003 15.1431 18.0003H4.85735C4.54176 18.0003 4.28592 17.7444 4.28592 17.4289V2.57171C4.28592 2.25612 4.54176 2.00028 4.85735 2.00028H6.76673C7.2374 3.33193 8.50739 4.28599 10.0002 4.28599Z" fill="#475467"/>
        </svg>
      </div>
      Open Jobs
      </div>`,
      backColor: '#F9FAFB',
      minHeight: 56,
      expanded: true
    }
  ];
  data?.forEach((worker, index) => {
    const childResource = worker?.jobs?.map((job) => ({
      id: job.id,
      html: `<div class="job-resource-child d-flex">
         <div class="d-flex justify-content-center align-items-center icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.14307 6.57171C6.82748 6.57171 6.57164 6.82754 6.57164 7.14314C6.57164 7.45873 6.82748 7.71457 7.14307 7.71457H12.8574C13.1729 7.71457 13.4288 7.45873 13.4288 7.14314C13.4288 6.82754 13.1729 6.57171 12.8574 6.57171H7.14307Z" fill="#475467"/>
            <path d="M7.14307 8.85742C6.82748 8.85742 6.57164 9.11326 6.57164 9.42885C6.57164 9.74444 6.82748 10.0003 7.14307 10.0003H10.5716C10.8872 10.0003 11.1431 9.74444 11.1431 9.42885C11.1431 9.11326 10.8872 8.85742 10.5716 8.85742H7.14307Z" fill="#475467"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 3.14314C11.2626 3.14314 12.2859 2.11979 12.2859 0.857422H15.1431C16.0898 0.857422 16.8574 1.62493 16.8574 2.57171V17.4289C16.8574 18.3756 16.0898 19.1431 15.1431 19.1431H4.85735C3.91058 19.1431 3.14307 18.3756 3.14307 17.4289V2.57171C3.14307 1.62493 3.91058 0.857422 4.85735 0.857422H7.7145C7.7145 2.11979 8.73784 3.14314 10.0002 3.14314ZM10.0002 4.28599C11.493 4.28599 12.763 3.33193 13.2337 2.00028H15.1431C15.4587 2.00028 15.7145 2.25612 15.7145 2.57171V17.4289C15.7145 17.7444 15.4587 18.0003 15.1431 18.0003H4.85735C4.54176 18.0003 4.28592 17.7444 4.28592 17.4289V2.57171C4.28592 2.25612 4.54176 2.00028 4.85735 2.00028H6.76673C7.2374 3.33193 8.50739 4.28599 10.0002 4.28599Z" fill="#475467"/>
          </svg>
         </div>
         <div class="job-item-section">
          <div class="job-resource-child-text">
           <small class='d-block'>${job?.number}</small>
           <small class='d-block job-reference-ellipsis' title="${job?.reference}">${job?.reference}</small>
          </div>
          <div class="status ${getStatusLabel(job?.status).className}">
            ${getStatusLabel(job?.status).label}
          </div >
         </div >
      </div > `,
      minHeight: 45,
      backColor: '#FFFFFF',
    })) || [];

    childResource.push({
      id: worker.id + "-" + index,
      minHeight: 56,
      html: `<div class="d-flex align-items-center justify-content-end" style="width: 360px">
        <button class="createJobButton" workerId="${worker.id}">
          Create a Job
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5C10.3452 5 10.625 5.27982 10.625 5.625V9.375H14.375C14.7202 9.375 15 9.65482 15 10C15 10.3452 14.7202 10.625 14.375 10.625H10.625V14.375C10.625 14.7202 10.3452 15 10 15C9.65482 15 9.375 14.7202 9.375 14.375V10.625H5.625C5.27982 10.625 5 10.3452 5 10C5 9.65482 5.27982 9.375 5.625 9.375H9.375V5.625C9.375 5.27982 9.65482 5 10 5Z" fill="#475467"/>
          </svg>
        </button>
      </div>`,
      backColor: "#fff"
    });

    resources.push(
      {
        id: worker.id,
        cssClass: 'job-resource-head',
        html: `<div class="job-resource d-flex align-items-center justify-content-between" style="width: 320px">
        <div class="left-box">
          <div class="d-flex justify-content-center align-items-center avatar-text-box">AM</div>
          <div class="avatar-name" title="${worker.first_name} ${worker.last_name}">${worker.first_name} ${worker.last_name}</div>
        </div>
        <button class="job-resource-button">Working</button>
      </div>`,
        backColor: '#FFFFFF',
        minHeight: 56,
        expanded: true,
        children: childResource
      }
    );

    worker?.jobs?.forEach((job) => {
      if (job.start_date && job.end_date) {
        const event = {
          id: job.id,
          start: job?.time_type === 'T' ? parseTimestamp(1000 * job.start_date).toISOString() : parseTimestamp(1000 * job.end_date).toISOString(),
          end: job?.time_type === 'T' ? parseTimestamp(1000 * job.end_date).toISOString() : parseTimestamp(1000 * job.start_date).toISOString(),
          resource: job.id,
          text: job?.reference || 'No Reference',
          cssClass: `childEvent jobEvent ${getStatusLabel(job?.status).className}`,
          backColor: `${getStatusLabel(job?.status).backColor}`,
        };
        events.push(event);
      }
    });
  });

  dp.update({ resources, events });
  dp.onResourceExpand = function (args) {
    expandRow = args.resource.id;
  };
}

function initDayPilot(elementId, data) {
  const isDayPilotLoaded = typeof window !== undefined && Boolean(window.DayPilot);
  if (!isDayPilotLoaded) return;

  DP = window.DayPilot;

  dp = new DP.Scheduler(elementId, {
    days: 365,
    scale: "Day",
    separators: [{ color: "#48C1FF", width: 4 }],
    treeImage: "img/nochildren.png",
    rowMinHeight: 130,
    eventEndSpec: "Date",
    durationBarVisible: false,
    eventArrangement: "Cascade",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Update",
    timeRangeSelectedHandling: "Disabled",
    treeImageNoChildren: false,
    rowHeaderWidth: 384,
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "d" }
    ],
    treeEnabled: true,
    progressiveRowRendering: true,
    treePreventParentUsage: true,
    scrollDelayEvents: 0,
    infiniteScrollingEnabled: true,
    infiniteScrollingStepDays: 100,
    heightSpec: "Parent100Pct",
    dynamicLoading: true,
    onScroll: async (args) => {
      args.async = true;
      const start = args.viewport.start.value;
      const end = args.viewport.end.value;

      const response = await fetchAPI(`${process.env.REACT_APP_BACKEND_API_URL}/dashboard/${start}/${end}/`, {
        method: 'GET',
      });

      let eventsArray = [];
      response?.forEach((worker) => {
        worker?.jobs?.forEach((job) => {
          if (job.start_date && job.end_date) {
            const event = {
              id: job.id,
              start: job?.time_type === 'T' ? parseTimestamp(1000 * job.start_date).toISOString() : parseTimestamp(1000 * job.end_date).toISOString(),
              end: job?.time_type === 'T' ? parseTimestamp(1000 * job.end_date).toISOString() : parseTimestamp(1000 * job.start_date).toISOString(),
              resource: job.id,
              text: job?.reference || 'No Reference',
              cssClass: `childEvent jobEvent ${getStatusLabel(job?.status).className}`,
              backColor: `${getStatusLabel(job?.status).backColor}`,
            };

            eventsArray.push(event);
          }
        });
      });

      args.events = eventsArray;
      console.log('eventsArray: ', eventsArray);

      args.loaded();
    },
  });

  dp.init();

  dp.onBeforeTimeHeaderRender = (args) => {
    if (args.header.level === 1 && (args.header.start.getDayOfWeek() === 6 || args.header.start.getDayOfWeek() === 0))
      args.header.backColor = "#F9FAFB";
  };

  dp.onBeforeCellRender = function (args) {
    if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
      args.cell.backColor = "#F9FAFB";
    }
  };

  loadData(data);
}

export function initJobScheduler(elementId, data) {
  try {
    initDayPilot(elementId, data);
  } catch (error) {
    console.log(error);
  }
}

export function reInitializeJobScheduler(responses) {
  try {
    loadData(responses);
  } catch (error) {
    console.log(error);
  }
}