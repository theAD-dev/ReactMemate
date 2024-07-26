/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

function startDaypilot(elementId, responses) {
  console.log('response: ', responses);
  const isDaypilotLoaded = typeof window !== undefined && Boolean(window.DayPilot);
  if (!isDaypilotLoaded) return;

  const DP = window.DayPilot;

  const dp = new DP.Scheduler(elementId, {
    separators: [{ color: "#48C1FF", location: new DayPilot.Date(), width: 5 }],
    treeImage: "img/nochildren.png",
    days: 365,
    scale: "Day",
    cellDuration: 1440,
    cellWidthSpec: 'Auto',
    cellWidthMin: 56,
    // eventHeight:40,
    rowMinHeight: 130,
    eventEndSpec: "Date",
    durationBarVisible: false,
    eventArrangement: "Cascade",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    timeRangeSelectedHandling: "Disabled",
    treeImageNoChildren: false,
    rowHeaderWidth: 324,
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Cell", format: "d" }
    ],

    treeEnabled: true,
    progressiveRowRendering: true,
  });

  dp.onBeforeRowHeaderRender = function (args) {
    args.row.cssClass = "resourcesRow";
  };

  dp.init();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  dp.scrollTo(formattedDate);

  const app = {
    init() {
      this.loadData();
    },

    loadData() {
      const events = [
        {
          start: "2024-07-25",
          end: "2024-08-25T12:00:00",
          id: DP.guid(),
          cssClass: "childEvent",
          resource: "R0.0",
          backColor: "#F2F4F7",
          borderColor: "#F2F4F7",
          text: "Set up Monitoring and Controlling",
          bubbleHtml: "<div style='font-weight:bold'>Event Details</div><div>Scheduler Event 1</div>"
        },
        {
          start: "2024-08-25",
          end: "2024-09-30T12:00:00",
          id: DP.guid(),
          cssClass: "my-event1",
          resource: "R0",
          backColor: "#FFE599",
          borderColor: "#F1C232",
          text: `<ul class="eventStyleCal">
          <li>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                <g clip-path="url(#clip0_5874_56063)">
                  <path d="M4.07171 2.28592C4.07171 2.04923 4.26359 1.85735 4.50028 1.85735H5.35742C5.59412 1.85735 5.78599 2.04923 5.78599 2.28592V3.14307C5.78599 3.37976 5.59412 3.57164 5.35742 3.57164H4.50028C4.26359 3.57164 4.07171 3.37976 4.07171 3.14307V2.28592Z" fill="#667085"/>
                  <path d="M6.64314 2.28592C6.64314 2.04923 6.83501 1.85735 7.07171 1.85735H7.92885C8.16554 1.85735 8.35742 2.04923 8.35742 2.28592V3.14307C8.35742 3.37976 8.16554 3.57164 7.92885 3.57164H7.07171C6.83501 3.57164 6.64314 3.37976 6.64314 3.14307V2.28592Z" fill="#667085"/>
                  <path d="M9.64314 1.85735C9.40644 1.85735 9.21457 2.04923 9.21457 2.28592V3.14307C9.21457 3.37976 9.40644 3.57164 9.64314 3.57164H10.5003C10.737 3.57164 10.9289 3.37976 10.9289 3.14307V2.28592C10.9289 2.04923 10.737 1.85735 10.5003 1.85735H9.64314Z" fill="#667085"/>
                  <path d="M4.07171 4.85735C4.07171 4.62066 4.26359 4.42878 4.50028 4.42878H5.35742C5.59412 4.42878 5.78599 4.62066 5.78599 4.85735V5.7145C5.78599 5.95119 5.59412 6.14307 5.35742 6.14307H4.50028C4.26359 6.14307 4.07171 5.95119 4.07171 5.7145V4.85735Z" fill="#667085"/>
                  <path d="M7.07171 4.42878C6.83501 4.42878 6.64314 4.62066 6.64314 4.85735V5.7145C6.64314 5.95119 6.83501 6.14307 7.07171 6.14307H7.92885C8.16554 6.14307 8.35742 5.95119 8.35742 5.7145V4.85735C8.35742 4.62066 8.16554 4.42878 7.92885 4.42878H7.07171Z" fill="#667085"/>
                  <path d="M9.21457 4.85735C9.21457 4.62066 9.40644 4.42878 9.64314 4.42878H10.5003C10.737 4.42878 10.9289 4.62066 10.9289 4.85735V5.7145C10.9289 5.95119 10.737 6.14307 10.5003 6.14307H9.64314C9.40644 6.14307 9.21457 5.95119 9.21457 5.7145V4.85735Z" fill="#667085"/>
                  <path d="M4.50028 7.00021C4.26359 7.00021 4.07171 7.19209 4.07171 7.42878V8.28592C4.07171 8.52262 4.26359 8.7145 4.50028 8.7145H5.35742C5.59412 8.7145 5.78599 8.52262 5.78599 8.28592V7.42878C5.78599 7.19209 5.59412 7.00021 5.35742 7.00021H4.50028Z" fill="#667085"/>
                  <path d="M6.64314 7.42878C6.64314 7.19209 6.83501 7.00021 7.07171 7.00021H7.92885C8.16554 7.00021 8.35742 7.19209 8.35742 7.42878V8.28592C8.35742 8.52262 8.16554 8.7145 7.92885 8.7145H7.07171C6.83501 8.7145 6.64314 8.52262 6.64314 8.28592V7.42878Z" fill="#667085"/>
                  <path d="M9.64314 7.00021C9.40644 7.00021 9.21457 7.19209 9.21457 7.42878V8.28592C9.21457 8.52262 9.40644 8.7145 9.64314 8.7145H10.5003C10.737 8.7145 10.9289 8.52262 10.9289 8.28592V7.42878C10.9289 7.19209 10.737 7.00021 10.5003 7.00021H9.64314Z" fill="#667085"/>
                  <path d="M2.35742 1.00021C2.35742 0.526823 2.74118 0.143066 3.21456 0.143066H11.786C12.2594 0.143066 12.6431 0.526822 12.6431 1.00021V13.0002C12.6431 13.4736 12.2594 13.8574 11.786 13.8574H3.21456C2.74118 13.8574 2.35742 13.4736 2.35742 13.0002V1.00021ZM11.786 1.00021L3.21456 1.00021V13.0002H5.78599V10.8574C5.78599 10.6207 5.97787 10.4288 6.21457 10.4288H8.78599C9.02269 10.4288 9.21457 10.6207 9.21457 10.8574V13.0002H11.786V1.00021Z" fill="#667085"/>
                </g>
                <defs>
                  <clipPath id="clip0_5874_56063">
                    <rect width="13.7143" height="13.7143" fill="white" transform="translate(0.643066 0.143066)"/>
                  </clipPath>
                </defs>
              </svg>
            </span>
            <strong>Company Trip to Bangkok
          </li>
          <li><span>BS</span></li>
          </ul>` ,
          bubbleHtml: "<div style='font-weight:bold'>Hold design workshops</div><div>Hold engaging design workshops that foster creativity and collaboration. These hands-on sessions help teams brainstorm, prototype, and refine ideas, ensuring innovative solutions and a user-focused approach to product development.</div>"
        },
      ];
      const resources = responses?.map((data) => {
        const formattedTitle = data?.status?.title ? `<em>${data.status.title}</em>` : '';
        return {
          id: data.unique_id,
          name: `<div class="resourceList">
            <ul class="resourceMan">
              <li>${data.number}</li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5 4C4.72386 4 4.5 4.22386 4.5 4.5C4.5 4.77614 4.72386 5 5 5H11C11.2761 5 11.5 4.77614 11.5 4.5C11.5 4.22386 11.2761 4 11 4H5Z" fill="#17B26A"/>
                    <path d="M4.5 6.5C4.5 6.22386 4.72386 6 5 6H11C11.2761 6 11.5 6.22386 11.5 6.5C11.5 6.77614 11.2761 7 11 7H5C4.72386 7 4.5 6.77614 4.5 6.5Z" fill="#17B26A"/>
                    <path d="M5 8C4.72386 8 4.5 8.22386 4.5 8.5C4.5 8.77614 4.72386 9 5 9H11C11.2761 9 11.5 8.77614 11.5 8.5C11.5 8.22386 11.2761 8 11 8H5Z" fill="#17B26A"/>
                    <path d="M5 10C4.72386 10 4.5 10.2239 4.5 10.5C4.5 10.7761 4.72386 11 5 11H8C8.27614 11 8.5 10.7761 8.5 10.5C8.5 10.2239 8.27614 10 8 10H5Z" fill="#17B26A"/>
                    <path d="M2 2C2 0.89543 2.89543 0 4 0H12C13.1046 0 14 0.89543 14 2V14C14 15.1046 13.1046 16 12 16H4C2.89543 16 2 15.1046 2 14V2ZM12 1H4C3.44772 1 3 1.44772 3 2V14C3 14.5523 3.44772 15 4 15H12C12.5523 15 13 14.5523 13 14V2C13 1.44772 12.5523 1 12 1Z" fill="#17B26A"/>
                  </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11 7.5C11 7.22386 11.2239 7 11.5 7H12.5C12.7761 7 13 7.22386 13 7.5V8.5C13 8.77614 12.7761 9 12.5 9H11.5C11.2239 9 11 8.77614 11 8.5V7.5Z" fill="#98A2B3"/>
                  <path d="M3.5 0C3.77614 0 4 0.223858 4 0.5V1H12V0.5C12 0.223858 12.2239 0 12.5 0C12.7761 0 13 0.223858 13 0.5V1H14C15.1046 1 16 1.89543 16 3V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V3C0 1.89543 0.895431 1 2 1H3V0.5C3 0.223858 3.22386 0 3.5 0ZM2 2C1.44772 2 1 2.44772 1 3V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V3C15 2.44772 14.5523 2 14 2H2Z" fill="#98A2B3"/>
                  <path d="M2.5 4C2.5 3.72386 2.72386 3.5 3 3.5H13C13.2761 3.5 13.5 3.72386 13.5 4V5C13.5 5.27614 13.2761 5.5 13 5.5H3C2.72386 5.5 2.5 5.27614 2.5 5V4Z" fill="#98A2B3"/>
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 10.7813C4.14782 12.4484 5.51294 13.6306 7.59107 13.7837V15H8.63448V13.7837C10.9039 13.6051 12.3125 12.3463 12.3125 10.4836C12.3125 8.89307 11.3647 7.97448 9.35617 7.45565L8.63448 7.26853V3.46659C9.75615 3.57716 10.5126 4.18104 10.7039 5.08262H12.1734C12.0082 3.4836 10.6343 2.33536 8.63448 2.20778V1H7.59107V2.23329C5.65207 2.46294 4.32172 3.70474 4.32172 5.38882C4.32172 6.84326 5.28687 7.87242 6.98241 8.3062L7.59107 8.4678V12.4994C6.44332 12.3293 5.65207 11.6999 5.46077 10.7813H4ZM7.39108 6.94532C6.34767 6.68165 5.79119 6.12029 5.79119 5.32928C5.79119 4.38518 6.49549 3.68773 7.59107 3.50061V6.99635L7.39108 6.94532ZM8.98228 8.81652C10.2692 9.13973 10.8343 9.67558 10.8343 10.5857C10.8343 11.6829 10.0083 12.4143 8.63448 12.5249V8.73147L8.98228 8.81652Z" fill="#F04438"/>
                </svg>
              </li>
              <li>
                <span>${data.jobs_done}/${data.jobs_count}</span>
              </li>
            </ul>
            <span class="small">AsP Holdings</span>
            <h2>${data.reference}</h2>
            ${formattedTitle}
          </div>`,
          children: data.tasks.map((task) => {
            events.push(
              {
                start: "2024-07-26T12:00:00",
                end: "2024-08-25T12:00:00",
                id: task.id,
                cssClass: "childEvent",
                resource: task.id,
                backColor: "#F2F4F7",
                borderColor: "#F2F4F7",
                text: task.title,
                bubbleHtml: "<div style='font-weight:bold'>Event Details</div><div>Scheduler Event 1</div>"
              },
            )
            const statusIMG = task.finished ?
            `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" rx="10" fill="#DCFAE6"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#085D3A"/>
            </svg>`
            :
            `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" rx="10" fill="#F2F4F7"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#475467"/>
            </svg>`

            return {
              id: task.id,
              name: `<div class="task-list">
                <div class="flex">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_5999_560822)">
                    <rect width="16" height="16" rx="8" fill="url(#paint0_linear_5999_560822)"/>
                    <g opacity="0.08">
                    <rect x="0.375" y="0.375" width="15.25" height="15.25" rx="7.625" stroke="#101828" stroke-width="0.75"/>
                    </g>
                    <path d="M6.57129 6.28585C6.41349 6.28585 6.28557 6.41377 6.28557 6.57157C6.28557 6.72936 6.41349 6.85728 6.57129 6.85728H9.42843C9.58623 6.85728 9.71415 6.72936 9.71415 6.57157C9.71415 6.41377 9.58623 6.28585 9.42843 6.28585H6.57129Z" fill="#475467"/>
                    <path d="M6.57129 7.42871C6.41349 7.42871 6.28557 7.55663 6.28557 7.71443C6.28557 7.87222 6.41349 8.00014 6.57129 8.00014H8.28557C8.44337 8.00014 8.57129 7.87222 8.57129 7.71443C8.57129 7.55663 8.44337 7.42871 8.28557 7.42871H6.57129Z" fill="#475467"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99986 4.57157C8.63104 4.57157 9.14272 4.05989 9.14272 3.42871H10.5713C11.0447 3.42871 11.4284 3.81247 11.4284 4.28585V11.7144C11.4284 12.1878 11.0447 12.5716 10.5713 12.5716H5.42843C4.95505 12.5716 4.57129 12.1878 4.57129 11.7144V4.28585C4.57129 3.81247 4.95505 3.42871 5.42843 3.42871H6.857C6.857 4.05989 7.36868 4.57157 7.99986 4.57157ZM7.99986 5.143C8.74627 5.143 9.38127 4.66596 9.6166 4.00014H10.5713C10.7291 4.00014 10.857 4.12806 10.857 4.28585V11.7144C10.857 11.8722 10.7291 12.0001 10.5713 12.0001H5.42843C5.27064 12.0001 5.14272 11.8722 5.14272 11.7144V4.28585C5.14272 4.12806 5.27064 4.00014 5.42843 4.00014H6.38312C6.61846 4.66596 7.25345 5.143 7.99986 5.143Z" fill="#475467"/>
                    </g>
                    <defs>
                    <linearGradient id="paint0_linear_5999_560822" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F9FAFB"/>
                    <stop offset="1" stop-color="#EDF0F3"/>
                    </linearGradient>
                    <clipPath id="clip0_5999_560822">
                    <rect width="16" height="16" rx="8" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
                  <div class="title-description-section">
                    <span class="task-assigner">${task.title}</span>
                    <span class="task-title">${task.title}</span>
                  </div> 
                </div>
                <div class="completion-status">${statusIMG}</div>
              </div>`,
              minHeight: 40,
              marginBottom: 4
            }
          })
        }
      })
      dp.update({ resources, events });
    }
  };
  dp.onBeforeEventRender = function (args) {
    args.data.areas = [
      {
        top: 0,
        left: 0,
        right: 0,
        width: 1,
        cssClass: "childEventborder",
        text: args.data.text,
        backColor: args.data.borderColor,
        fontColor: "#ffffff",
        horizontalAlignment: "center",
        style: "border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #0000007f; color: #ffffff; padding: 4px;height: 41px;",
      }
    ];

    args.data.text = "Event details";
  };

  // Event rendering customization (optional)
  dp.onBeforeCellRender = function (args) {
    if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
      args.cell.backColor = "#F9FAFB"; // Highlight weekends
    }
  };
  app.init();
}

export function initDaypilot(elementId, response) {
  try {
    startDaypilot(elementId, response);
  } catch (error) {
    console.log(error);
  }
}