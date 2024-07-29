/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
var userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log('userTimeZone: ', userTimeZone);

function adjustColor(color, amount) {
  if (!color) return;
  let usePound = false;

  if (color[0] == "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  return (
    (usePound ? "#" : "") +
    (r > 255 ? 255 : r < 0 ? 0 : r).toString(16).padStart(2, "0") +
    (g > 255 ? 255 : g < 0 ? 0 : g).toString(16).padStart(2, "0") +
    (b > 255 ? 255 : b < 0 ? 0 : b).toString(16).padStart(2, "0")
  );
}

function startDaypilot(elementId, responses, viewTaskDetails) {
  console.log("response: ", responses);
  const isDaypilotLoaded =
    typeof window !== undefined && Boolean(window.DayPilot);
  if (!isDaypilotLoaded) return;

  const DP = window.DayPilot;

  const dp = new DP.Scheduler(elementId, {
    separators: [{ color: "#48C1FF", location: new DayPilot.Date(), width: 5 }],
    treeImage: "img/nochildren.png",
    days: 365,
    scale: "Day",
    cellDuration: 1440,
    cellWidthSpec: "Auto",
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
      { groupBy: "Cell", format: "d" },
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
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  dp.scrollTo(formattedDate);

  const app = {
    init() {
      this.loadData();
    },

    loadData() {
      const events = [];
      const colorMapping = {
        "#b54708": { borderColor: "#FEDF89", backgroundColor: "#FFFAEB" },
        "#b42318": { borderColor: "#FECDCA", backgroundColor: "#FEF3F2" },
        "#067647": { borderColor: "#ABEFC6", backgroundColor: "#ECFDF3" },
        "#344054": { borderColor: "#EAECF0", backgroundColor: "#F9FAFB" },
        "#6941c6": { borderColor: "#E9D7FE", backgroundColor: "#F9FAFB" },
      };

      const resources = responses?.map((data) => {
        const originalColor = data?.status?.color;
        var borderColor = adjustColor(originalColor, 0);
        var backgroundColor = adjustColor(originalColor, 120);

        if (colorMapping[originalColor]) {
          borderColor = colorMapping[originalColor]["borderColor"];
          backgroundColor = colorMapping[originalColor]["backgroundColor"];
        }

        const formattedTitle = data?.status?.title
          ? `<em style='color:${originalColor}; background:${backgroundColor}; border: 1px solid ${borderColor}'>${data.status.title}</em>`
          : "";

        let jobsStatus = "not-started";
        if (data.jobs_count === 0 && data.jobs_count === 0)
          jobsStatus = "not-started";
        else if (data.jobs_done === data.jobs_count) jobsStatus = "done";
        else if (data.jobs_done === 0) jobsStatus = "not-done";
        else if (data.jobs_done) jobsStatus = "pending";

        // add job-event
        events.push({
          start: new Date(1000 * +data.booking_start),
          end: new Date(1000 * +data.booking_end),
          id: DP.guid(),
          cssClass: 'job-item',
          resource: data.unique_id,
          backColor: "#FFE599",
          borderColor: "#F1C232",
          text: `<ul class="eventStyleCal">
            <li>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_6815_57879)">
                <rect width="24" height="24" rx="4" fill="url(#paint0_linear_6815_57879)"/>
                <g opacity="0.08">
                <rect x="0.375" y="0.375" width="23.25" height="23.25" rx="3.625" stroke="#101828" stroke-width="0.75"/>
                </g>
                <g clip-path="url(#clip1_6815_57879)">
                <path d="M8.57171 7.28592C8.57171 7.04923 8.76359 6.85735 9.00028 6.85735H9.85742C10.0941 6.85735 10.286 7.04923 10.286 7.28592V8.14307C10.286 8.37976 10.0941 8.57164 9.85742 8.57164H9.00028C8.76359 8.57164 8.57171 8.37976 8.57171 8.14307V7.28592Z" fill="#667085"/>
                <path d="M11.1431 7.28592C11.1431 7.04923 11.335 6.85735 11.5717 6.85735H12.4289C12.6655 6.85735 12.8574 7.04923 12.8574 7.28592V8.14307C12.8574 8.37976 12.6655 8.57164 12.4289 8.57164H11.5717C11.335 8.57164 11.1431 8.37976 11.1431 8.14307V7.28592Z" fill="#667085"/>
                <path d="M14.1431 6.85735C13.9064 6.85735 13.7146 7.04923 13.7146 7.28592V8.14307C13.7146 8.37976 13.9064 8.57164 14.1431 8.57164H15.0003C15.237 8.57164 15.4289 8.37976 15.4289 8.14307V7.28592C15.4289 7.04923 15.237 6.85735 15.0003 6.85735H14.1431Z" fill="#667085"/>
                <path d="M8.57171 9.85735C8.57171 9.62066 8.76359 9.42878 9.00028 9.42878H9.85742C10.0941 9.42878 10.286 9.62066 10.286 9.85735V10.7145C10.286 10.9512 10.0941 11.1431 9.85742 11.1431H9.00028C8.76359 11.1431 8.57171 10.9512 8.57171 10.7145V9.85735Z" fill="#667085"/>
                <path d="M11.5717 9.42878C11.335 9.42878 11.1431 9.62066 11.1431 9.85735V10.7145C11.1431 10.9512 11.335 11.1431 11.5717 11.1431H12.4289C12.6655 11.1431 12.8574 10.9512 12.8574 10.7145V9.85735C12.8574 9.62066 12.6655 9.42878 12.4289 9.42878H11.5717Z" fill="#667085"/>
                <path d="M13.7146 9.85735C13.7146 9.62066 13.9064 9.42878 14.1431 9.42878H15.0003C15.237 9.42878 15.4289 9.62066 15.4289 9.85735V10.7145C15.4289 10.9512 15.237 11.1431 15.0003 11.1431H14.1431C13.9064 11.1431 13.7146 10.9512 13.7146 10.7145V9.85735Z" fill="#667085"/>
                <path d="M9.00028 12.0002C8.76359 12.0002 8.57171 12.1921 8.57171 12.4288V13.2859C8.57171 13.5226 8.76359 13.7145 9.00028 13.7145H9.85742C10.0941 13.7145 10.286 13.5226 10.286 13.2859V12.4288C10.286 12.1921 10.0941 12.0002 9.85742 12.0002H9.00028Z" fill="#667085"/>
                <path d="M11.1431 12.4288C11.1431 12.1921 11.335 12.0002 11.5717 12.0002H12.4289C12.6655 12.0002 12.8574 12.1921 12.8574 12.4288V13.2859C12.8574 13.5226 12.6655 13.7145 12.4289 13.7145H11.5717C11.335 13.7145 11.1431 13.5226 11.1431 13.2859V12.4288Z" fill="#667085"/>
                <path d="M14.1431 12.0002C13.9064 12.0002 13.7146 12.1921 13.7146 12.4288V13.2859C13.7146 13.5226 13.9064 13.7145 14.1431 13.7145H15.0003C15.237 13.7145 15.4289 13.5226 15.4289 13.2859V12.4288C15.4289 12.1921 15.237 12.0002 15.0003 12.0002H14.1431Z" fill="#667085"/>
                <path d="M6.85742 6.00021C6.85742 5.52682 7.24118 5.14307 7.71456 5.14307H16.286C16.7594 5.14307 17.1431 5.52682 17.1431 6.00021V18.0002C17.1431 18.4736 16.7594 18.8574 16.286 18.8574H7.71456C7.24118 18.8574 6.85742 18.4736 6.85742 18.0002V6.00021ZM16.286 6.00021L7.71456 6.00021V18.0002H10.286V15.8574C10.286 15.6207 10.4779 15.4288 10.7146 15.4288H13.286C13.5227 15.4288 13.7146 15.6207 13.7146 15.8574V18.0002H16.286V6.00021Z" fill="#667085"/>
                </g>
                </g>
                <defs>
                <linearGradient id="paint0_linear_6815_57879" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                <stop stop-color="#F9FAFB"/>
                <stop offset="1" stop-color="#EDF0F3"/>
                </linearGradient>
                <clipPath id="clip0_6815_57879">
                <rect width="24" height="24" rx="4" fill="white"/>
                </clipPath>
                <clipPath id="clip1_6815_57879">
                <rect width="13.7143" height="13.7143" fill="white" transform="translate(5.14307 5.14307)"/>
                </clipPath>
                </defs>
              </svg>
              &nbsp;
              <strong>${data.reference}</strong>
            </li>
            <li>
              <span>${data?.contact_person?.firstname?.charAt(
            0
          )}${data?.contact_person?.lastname?.charAt(0)}</span>
            </li>
          </ul>`,
        });

        return {
          id: data.unique_id,
          name: `<div class="resourceList" style="--main-color: ${originalColor}">
            <ul class="resourceMan">
              <li>${data.number}</li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5 4C4.72386 4 4.5 4.22386 4.5 4.5C4.5 4.77614 4.72386 5 5 5H11C11.2761 5 11.5 4.77614 11.5 4.5C11.5 4.22386 11.2761 4 11 4H5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"
            }"/>
                    <path d="M4.5 6.5C4.5 6.22386 4.72386 6 5 6H11C11.2761 6 11.5 6.22386 11.5 6.5C11.5 6.77614 11.2761 7 11 7H5C4.72386 7 4.5 6.77614 4.5 6.5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"
            }"/>
                    <path d="M5 8C4.72386 8 4.5 8.22386 4.5 8.5C4.5 8.77614 4.72386 9 5 9H11C11.2761 9 11.5 8.77614 11.5 8.5C11.5 8.22386 11.2761 8 11 8H5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"
            }"/>
                    <path d="M5 10C4.72386 10 4.5 10.2239 4.5 10.5C4.5 10.7761 4.72386 11 5 11H8C8.27614 11 8.5 10.7761 8.5 10.5C8.5 10.2239 8.27614 10 8 10H5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"
            }"/>
                    <path d="M2 2C2 0.89543 2.89543 0 4 0H12C13.1046 0 14 0.89543 14 2V14C14 15.1046 13.1046 16 12 16H4C2.89543 16 2 15.1046 2 14V2ZM12 1H4C3.44772 1 3 1.44772 3 2V14C3 14.5523 3.44772 15 4 15H12C12.5523 15 13 14.5523 13 14V2C13 1.44772 12.5523 1 12 1Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"
            }"/>
                  </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11 7.5C11 7.22386 11.2239 7 11.5 7H12.5C12.7761 7 13 7.22386 13 7.5V8.5C13 8.77614 12.7761 9 12.5 9H11.5C11.2239 9 11 8.77614 11 8.5V7.5Z" fill="${data.booking_start ? "#1AB2FF" : "#98A2B3"
            }"/>
                  <path d="M3.5 0C3.77614 0 4 0.223858 4 0.5V1H12V0.5C12 0.223858 12.2239 0 12.5 0C12.7761 0 13 0.223858 13 0.5V1H14C15.1046 1 16 1.89543 16 3V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V3C0 1.89543 0.895431 1 2 1H3V0.5C3 0.223858 3.22386 0 3.5 0ZM2 2C1.44772 2 1 2.44772 1 3V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V3C15 2.44772 14.5523 2 14 2H2Z" fill="${data.booking_start ? "#1AB2FF" : "#98A2B3"
            }"/>
                  <path d="M2.5 4C2.5 3.72386 2.72386 3.5 3 3.5H13C13.2761 3.5 13.5 3.72386 13.5 4V5C13.5 5.27614 13.2761 5.5 13 5.5H3C2.72386 5.5 2.5 5.27614 2.5 5V4Z" fill="${data.booking_start ? "#1AB2FF" : "#98A2B3"
            }"/>
                </svg>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 10.7813C4.14782 12.4484 5.51294 13.6306 7.59107 13.7837V15H8.63448V13.7837C10.9039 13.6051 12.3125 12.3463 12.3125 10.4836C12.3125 8.89307 11.3647 7.97448 9.35617 7.45565L8.63448 7.26853V3.46659C9.75615 3.57716 10.5126 4.18104 10.7039 5.08262H12.1734C12.0082 3.4836 10.6343 2.33536 8.63448 2.20778V1H7.59107V2.23329C5.65207 2.46294 4.32172 3.70474 4.32172 5.38882C4.32172 6.84326 5.28687 7.87242 6.98241 8.3062L7.59107 8.4678V12.4994C6.44332 12.3293 5.65207 11.6999 5.46077 10.7813H4ZM7.39108 6.94532C6.34767 6.68165 5.79119 6.12029 5.79119 5.32928C5.79119 4.38518 6.49549 3.68773 7.59107 3.50061V6.99635L7.39108 6.94532ZM8.98228 8.81652C10.2692 9.13973 10.8343 9.67558 10.8343 10.5857C10.8343 11.6829 10.0083 12.4143 8.63448 12.5249V8.73147L8.98228 8.81652Z" fill="${data.paid === "PAID"
              ? "#17B26A"
              : data.paid === "NOT PAID"
                ? "#F04438"
                : "#F79009"
            }"/>
                </svg>
              </li>
              <li>
                <span class='${jobsStatus}'>${data.jobs_done}/${data.jobs_count
            }</span>
              </li>
            </ul>
            <span class="small">${data?.client?.name}</span>
            <h2>${data.reference}</h2>
            ${formattedTitle}
          </div>`,
          children: [...data.tasks, { title: 'create-task', id: data.number }].map((task, index) => {

            // for create-task only
            if (task.title === 'create-task') {
              return {
                id: task.id,
                name: `<div class="create-task-div">
                  <button>Create Task
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5C10.3452 5 10.625 5.27982 10.625 5.625V9.375H14.375C14.7202 9.375 15 9.65482 15 10C15 10.3452 14.7202 10.625 14.375 10.625H10.625V14.375C10.625 14.7202 10.3452 15 10 15C9.65482 15 9.375 14.7202 9.375 14.375V10.625H5.625C5.27982 10.625 5 10.3452 5 10C5 9.65482 5.27982 9.375 5.625 9.375H9.375V5.625C9.375 5.27982 9.65482 5 10 5Z" fill="#106B99"/>
                  </svg>
                  </button> 
                </div>`,
                minHeight: 75,
                marginBottom: 10,
              }
            }


            // add task event
            events.push({
              start: new Date(1000 * +task.from_date),
              end: new Date(1000 * +task.to_date),
              id: task.id,
              cssClass: "childEvent task-item",
              resource: task.id,
              backColor: "#F2F4F7",
              borderColor: "#F2F4F7",
              text: task.title
            });


            const statusIMG = task.finished
              ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" rx="10" fill="#DCFAE6"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#085D3A"/>
            </svg>`
              : `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" rx="10" fill="#F2F4F7"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#475467"/>
            </svg>`;

            return {
              id: task.id,
              name: `<div class="task-list" task-id="${task.id}">
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
                    <span class="task-assigner">${task?.assigned_to?.name}</span>
                    <span class="task-title">${task.title}</span>
                  </div> 
                </div>
                <div class="completion-status ${statusIMG === 'completed' ? 'completed-class' : 'incomplete-class'}">
  ${statusIMG}
</div>
              </div>
              `,
              minHeight: 40,
              marginBottom: 4,
            };
          }),
        };
      });

      dp.onEventClicked = function(args) {
        const taskId = args.e.id();
        console.log('args: ', args.div.className.includes("task-item"));
        if (args.div.className.includes("task-item") && taskId) {
          viewTaskDetails(taskId);
        } 
      };


      dp.update({ resources, events });
    },
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
        style:
          "border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #0000007f; color: #ffffff; padding: 4px;height: 41px;",
      },
    ];

    args.data.text = "Event details";
  };

  // Event rendering customization (optional)
  dp.onBeforeCellRender = function (args) {
    if (
      args.cell.start.getDayOfWeek() === 6 ||
      args.cell.start.getDayOfWeek() === 0
    ) {
      args.cell.backColor = "#F9FAFB"; // Highlight weekends
    }
  };
  app.init();
}

export function initDaypilot(elementId, response, viewTaskDetails) {
  try {
    startDaypilot(elementId, response, viewTaskDetails);
  } catch (error) {
    console.log(error);
  }
}