import { updateProjectScheduleById } from "../../../../../APIs/management-api";
import { updateTask } from "../../../../../APIs/task-api";

let dp;
let DP;
let expandRow;

function parseTimestamp(timestampStr) {
  return new Date(new Date(timestampStr).getTime() - (new Date(timestampStr).getTimezoneOffset() * 60 * 1000));
}

function loadData(responses, hasWorkSubscription) {
  const events = [];
  const resources = responses?.map((data) => {
    let color = data?.custom_status?.color || "rgb(192, 192, 192)";
    let background = data?.custom_status?.background;
    let font = data?.custom_status?.font;

    const status = data?.custom_status?.title
      ? `<div style='color:${font}; background:${background}; border: 1px solid ${color}; width: fit-content; max-width: 85px; border-radius: 20px; padding: 0px 6px; font-weight: 500; margin-left: auto; display: flex; align-items: center; height: 22px;' title="${data.custom_status.title}">
          <div style='max-width: 80px; overflow: hidden; text-overflow: ellipsis; display: inline-block; position: relative; top: 0px; white-space: nowrap; font-size: 12px;'>${data.custom_status.title}</div>
        </div>`
      : `<div style='font-size: 12px;color: #344054; background: #F2F4F7; border: 1px solid rgba(0, 0, 0, 0.498); width: fit-content; border-radius: 20px; padding: 0px 6px; font-weight: 500; margin-left: auto; display: flex; align-items: center; height: 22px'>No status</div>`;

    let jobsStatus = "not-started";
    if (data.jobs_count === 0 && data.jobs_count === 0)
      jobsStatus = "not-started";
    else if (data.jobs_done === data.jobs_count) jobsStatus = "done";
    else if (data.jobs_done === 0) jobsStatus = "not-done";
    else if (data.jobs_done) jobsStatus = "pending";

    const projectEndDate = new Date(parseInt(data.booking_end) * 1000);
    projectEndDate.setHours(23, 59, 59, 999);
    let isJobOverdue = projectEndDate < new Date();
    let overdueIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="12" fill="#FEE4E2" />
            <path d="M12.515 5.01896C12.344 5.00635 12.1722 5 12 5V4C12.1968 4 12.3931 4.00726 12.5885 4.02167L12.515 5.01896ZM14.5193 5.46905C14.1985 5.34533 13.8691 5.2454 13.5337 5.17008L13.7528 4.19438C14.1361 4.28046 14.5126 4.39467 14.8792 4.53605L14.5193 5.46905ZM15.889 6.17971C15.7458 6.08402 15.5994 5.99388 15.4503 5.90939L15.9432 5.0393C16.1136 5.13586 16.2809 5.23888 16.4446 5.34824C16.6082 5.4576 16.7674 5.5727 16.9219 5.69322L16.3066 6.48158C16.1715 6.37612 16.0322 6.27541 15.889 6.17971ZM17.7231 7.96934C17.5252 7.68829 17.3068 7.42218 17.0697 7.17321L17.794 6.48368C18.0649 6.76821 18.3145 7.07233 18.5407 7.39353L17.7231 7.96934ZM18.4672 9.32122C18.4012 9.16208 18.3296 9.00583 18.2526 8.85271L19.1458 8.40311C19.2339 8.5781 19.3157 8.75667 19.391 8.93853C19.4664 9.12039 19.5348 9.30453 19.5962 9.49054L18.6467 9.80423C18.5929 9.64147 18.5331 9.48035 18.4672 9.32122ZM18.9979 11.8282C18.9895 11.4846 18.9557 11.142 18.8969 10.8033L19.8822 10.6323C19.9494 11.0194 19.988 11.4109 19.9976 11.8037L18.9979 11.8282ZM18.8655 13.3656C18.8991 13.1967 18.9264 13.027 18.9474 12.8569L19.9398 12.9793C19.9159 13.1737 19.8847 13.3677 19.8463 13.5607C19.8079 13.7538 19.7625 13.9449 19.7102 14.1337L18.7464 13.867C18.7922 13.7018 18.8319 13.5346 18.8655 13.3656ZM17.914 15.745C18.0979 15.4546 18.2602 15.151 18.3995 14.8367L19.3137 15.2419C19.1545 15.6011 18.969 15.9481 18.7588 16.28L17.914 15.745ZM16.9497 16.9497C17.0715 16.828 17.1885 16.702 17.3005 16.5722L18.0577 17.2254C17.9297 17.3737 17.796 17.5177 17.6569 17.6569L16.9497 16.9497Z" fill="#F04438" />
            <path d="M12 5C10.8488 5 9.71545 5.2839 8.70022 5.82655C7.68499 6.3692 6.81926 7.15386 6.17971 8.11101C5.54017 9.06816 5.14654 10.1683 5.03371 11.3139C4.92088 12.4595 5.09232 13.6153 5.53285 14.6788C5.97337 15.7423 6.66939 16.6808 7.55925 17.4111C8.44911 18.1414 9.50533 18.6409 10.6344 18.8655C11.7634 19.0901 12.9304 19.0327 14.032 18.6986C15.1336 18.3644 16.1358 17.7637 16.9497 16.9497L17.6569 17.6569C16.7266 18.5871 15.5812 19.2736 14.3223 19.6555C13.0633 20.0374 11.7296 20.1029 10.4393 19.8463C9.14895 19.5896 7.94183 19.0187 6.92486 18.1841C5.90788 17.3495 5.11243 16.2769 4.60897 15.0615C4.1055 13.846 3.90957 12.5251 4.03852 11.2159C4.16748 9.90659 4.61733 8.64933 5.34825 7.55544C6.07916 6.46155 7.06857 5.5648 8.22883 4.94463C9.38909 4.32446 10.6844 4 12 4V5Z" fill="#F04438" />
            <path d="M11.5 7C11.7761 7 12 7.22386 12 7.5V12.7098L15.2481 14.5659C15.4878 14.7029 15.5711 15.0083 15.4341 15.2481C15.2971 15.4878 14.9917 15.5711 14.7519 15.4341L11.2519 13.4341C11.0961 13.3451 11 13.1794 11 13V7.5C11 7.22386 11.2239 7 11.5 7Z" fill="#F04438" />
          </svg>`;


    // add project event
    events.push({
      start: parseTimestamp(1000 * +data.booking_start),
      end: parseTimestamp(1000 * +data.booking_end),
      id: data.unique_id,
      cssClass: 'project-item',
      resource: data.unique_id,
      backColor: background,
      borderColor: color,
      tag: { number: data.number, reference: data.reference, value: data.id, type: 'project' },
      text: `<ul class="eventStyleCal">
        <li>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6815_57879)"><rect width="24" height="24" rx="4" fill="url(#paint0_linear_6815_57879)"/><g opacity="0.08"><rect x="0.375" y="0.375" width="23.25" height="23.25" rx="3.625" stroke="#101828" stroke-width="0.75"/></g><g clip-path="url(#clip1_6815_57879)">
            <path d="M8.57171 7.28592C8.57171 7.04923 8.76359 6.85735 9.00028 6.85735H9.85742C10.0941 6.85735 10.286 7.04923 10.286 7.28592V8.14307C10.286 8.37976 10.0941 8.57164 9.85742 8.57164H9.00028C8.76359 8.57164 8.57171 8.37976 8.57171 8.14307V7.28592Z" fill="#667085"/>
            <path d="M11.1431 7.28592C11.1431 7.04923 11.335 6.85735 11.5717 6.85735H12.4289C12.6655 6.85735 12.8574 7.04923 12.8574 7.28592V8.14307C12.8574 8.37976 12.6655 8.57164 12.4289 8.57164H11.5717C11.335 8.57164 11.1431 8.37976 11.1431 8.14307V7.28592Z" fill="#667085"/>
            <path d="M14.1431 6.85735C13.9064 6.85735 13.7146 7.04923 13.7146 7.28592V8.14307C13.7146 8.37976 13.9064 8.57164 14.1431 8.57164H15.0003C15.237 8.57164 15.4289 8.37976 15.4289 8.14307V7.28592C15.4289 7.04923 15.237 6.85735 15.0003 6.85735H14.1431Z" fill="#667085"/>
            <path d="M8.57171 9.85735C8.57171 9.62066 8.76359 9.42878 9.00028 9.42878H9.85742C10.0941 9.42878 10.286 9.62066 10.286 9.85735V10.7145C10.286 10.9512 10.0941 11.1431 9.85742 11.1431H9.00028C8.76359 11.1431 8.57171 10.9512 8.57171 10.7145V9.85735Z" fill="#667085"/>
            <path d="M11.5717 9.42878C11.335 9.42878 11.1431 9.62066 11.1431 9.85735V10.7145C11.1431 10.9512 11.335 11.1431 11.5717 11.1431H12.4289C12.6655 11.1431 12.8574 10.9512 12.8574 10.7145V9.85735C12.8574 9.62066 12.6655 9.42878 12.4289 9.42878H11.5717Z" fill="#667085"/>
            <path d="M13.7146 9.85735C13.7146 9.62066 13.9064 9.42878 14.1431 9.42878H15.0003C15.237 9.42878 15.4289 9.62066 15.4289 9.85735V10.7145C15.4289 10.9512 15.237 11.1431 15.0003 11.1431H14.1431C13.9064 11.1431 13.7146 10.9512 13.7146 10.7145V9.85735Z" fill="#667085"/>
            <path d="M9.00028 12.0002C8.76359 12.0002 8.57171 12.1921 8.57171 12.4288V13.2859C8.57171 13.5226 8.76359 13.7145 9.00028 13.7145H9.85742C10.0941 13.7145 10.286 13.5226 10.286 13.2859V12.4288C10.286 12.1921 10.0941 12.0002 9.85742 12.0002H9.00028Z" fill="#667085"/>
            <path d="M11.1431 12.4288C11.1431 12.1921 11.335 12.0002 11.5717 12.0002H12.4289C12.6655 12.0002 12.8574 12.1921 12.8574 12.4288V13.2859C12.8574 13.5226 12.6655 13.7145 12.4289 13.7145H11.5717C11.335 13.7145 11.1431 13.5226 11.1431 13.2859V12.4288Z" fill="#667085"/>
            <path d="M14.1431 12.0002C13.9064 12.0002 13.7146 12.1921 13.7146 12.4288V13.2859C13.7146 13.5226 13.9064 13.7145 14.1431 13.7145H15.0003C15.237 13.7145 15.4289 13.5226 15.4289 13.2859V12.4288C15.4289 12.1921 15.237 12.0002 15.0003 12.0002H14.1431Z" fill="#667085"/>
            <path d="M6.85742 6.00021C6.85742 5.52682 7.24118 5.14307 7.71456 5.14307H16.286C16.7594 5.14307 17.1431 5.52682 17.1431 6.00021V18.0002C17.1431 18.4736 16.7594 18.8574 16.286 18.8574H7.71456C7.24118 18.8574 6.85742 18.4736 6.85742 18.0002V6.00021ZM16.286 6.00021L7.71456 6.00021V18.0002H10.286V15.8574C10.286 15.6207 10.4779 15.4288 10.7146 15.4288H13.286C13.5227 15.4288 13.7146 15.6207 13.7146 15.8574V18.0002H16.286V6.00021Z" fill="#667085"/></g></g><defs><linearGradient id="paint0_linear_6815_57879" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#F9FAFB"/><stop offset="1" stop-color="#EDF0F3"/></linearGradient><clipPath id="clip0_6815_57879"><rect width="24" height="24" rx="4" fill="white"/></clipPath><clipPath id="clip1_6815_57879"><rect width="13.7143" height="13.7143" fill="white" transform="translate(5.14307 5.14307)"/></clipPath></defs>
          </svg>
          &nbsp;
          <strong style="color: ${font}; font-weight: 400">${data.reference}</strong>
        </li>
      </ul>`,
    });

    const unfinishedTasks = data.tasks.filter(task => !task.finished)?.length || 0;
    const totalTasks = data.tasks.length;
    const childResource = [];

    childResource.push({
      id: data.number,
      name: `<div class="d-flex flex-column rowResourceEvent">
            <div class="d-flex gap-1 task-heading rowResourceEvent" style="--main-color: ${color}; height: 34px">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M10.875 2.25C11.0821 2.25 11.25 2.41789 11.25 2.625V9.375C11.25 9.58211 11.0821 9.75 10.875 9.75H1.125C0.917893 9.75 0.75 9.58211 0.75 9.375V2.625C0.75 2.41789 0.917893 2.25 1.125 2.25H10.875ZM1.125 1.5C0.50368 1.5 0 2.00368 0 2.625V9.375C0 9.99632 0.50368 10.5 1.125 10.5H10.875C11.4963 10.5 12 9.99632 12 9.375V2.625C12 2.00368 11.4963 1.5 10.875 1.5H1.125Z" fill="#475467"/>
                <path d="M5.25 4.125C5.25 3.91789 5.41789 3.75 5.625 3.75H9.375C9.58211 3.75 9.75 3.91789 9.75 4.125C9.75 4.33211 9.58211 4.5 9.375 4.5H5.625C5.41789 4.5 5.25 4.33211 5.25 4.125Z" fill="#475467"/>
                <path d="M4.12767 3.48484C4.27411 3.63128 4.27411 3.86872 4.12767 4.01516L3.00267 5.14016C2.85622 5.28661 2.61878 5.28661 2.47234 5.14016L2.09734 4.76516C1.95089 4.61872 1.95089 4.38128 2.09734 4.23484C2.24378 4.08839 2.48122 4.08839 2.62767 4.23484L2.7375 4.34467L3.59734 3.48484C3.74378 3.33839 3.98122 3.33839 4.12767 3.48484Z" fill="#475467"/>
                <path d="M5.25 7.125C5.25 6.91789 5.41789 6.75 5.625 6.75H9.375C9.58211 6.75 9.75 6.91789 9.75 7.125C9.75 7.33211 9.58211 7.5 9.375 7.5H5.625C5.41789 7.5 5.25 7.33211 5.25 7.125Z" fill="#475467"/>
                <path d="M4.12767 6.48484C4.27411 6.63128 4.27411 6.86872 4.12767 7.01516L3.00267 8.14017C2.85622 8.28661 2.61878 8.28661 2.47234 8.14017L2.09734 7.76517C1.95089 7.61872 1.95089 7.38128 2.09734 7.23484C2.24378 7.08839 2.48122 7.08839 2.62767 7.23484L2.7375 7.34467L3.59734 6.48484C3.74378 6.33839 3.98122 6.33839 4.12767 6.48484Z" fill="#475467"/>
              </svg>
              <span class="font-14">Tasks</span>
            </div>
           </div>`,
      minHeight: 40,
      marginBottom: 4,
    });

    // Task child resource
    data?.tasks?.forEach((task) => {
      events.push({
        start: parseTimestamp(1000 * +task.from_date),
        end: parseTimestamp(1000 * +task.to_date),
        id: task.id,
        cssClass: "childEvent task-item",
        resource: task.id,
        backColor: task.finished ? "#DCFAE6" : "#F2F4F7",
        borderColor: task.finished ? "#DCFAE6" : "#F2F4F7",
        text: task.title,
        tag: { type: "task", task: task },
      });

      const statusIMG = task.finished
        ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="#DCFAE6"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#085D3A"/>
            </svg>`
        : `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="#F2F4F7"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#475467"/>
            </svg>`;

      childResource.push({
        id: task.id,
        name: `<div class="d-flex flex-column">
            <div task-id="${task.id}" class="task-list rowResourceEvent" style="--main-color: ${color}" task-id="${task.id}">
              <div class="flex">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5999_560822)"><rect width="16" height="16" rx="8" fill="url(#paint0_linear_5999_560822)"/><g opacity="0.08"><rect x="0.375" y="0.375" width="15.25" height="15.25" rx="7.625" stroke="#101828" stroke-width="0.75"/></g>
                  <path d="M6.57129 6.28585C6.41349 6.28585 6.28557 6.41377 6.28557 6.57157C6.28557 6.72936 6.41349 6.85728 6.57129 6.85728H9.42843C9.58623 6.85728 9.71415 6.72936 9.71415 6.57157C9.71415 6.41377 9.58623 6.28585 9.42843 6.28585H6.57129Z" fill="#475467"/>
                  <path d="M6.57129 7.42871C6.41349 7.42871 6.28557 7.55663 6.28557 7.71443C6.28557 7.87222 6.41349 8.00014 6.57129 8.00014H8.28557C8.44337 8.00014 8.57129 7.87222 8.57129 7.71443C8.57129 7.55663 8.44337 7.42871 8.28557 7.42871H6.57129Z" fill="#475467"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99986 4.57157C8.63104 4.57157 9.14272 4.05989 9.14272 3.42871H10.5713C11.0447 3.42871 11.4284 3.81247 11.4284 4.28585V11.7144C11.4284 12.1878 11.0447 12.5716 10.5713 12.5716H5.42843C4.95505 12.5716 4.57129 12.1878 4.57129 11.7144V4.28585C4.57129 3.81247 4.95505 3.42871 5.42843 3.42871H6.857C6.857 4.05989 7.36868 4.57157 7.99986 4.57157ZM7.99986 5.143C8.74627 5.143 9.38127 4.66596 9.6166 4.00014H10.5713C10.7291 4.00014 10.857 4.12806 10.857 4.28585V11.7144C10.857 11.8722 10.7291 12.0001 10.5713 12.0001H5.42843C5.27064 12.0001 5.14272 11.8722 5.14272 11.7144V4.28585C5.14272 4.12806 5.27064 4.00014 5.42843 4.00014H6.38312C6.61846 4.66596 7.25345 5.143 7.99986 5.143Z" fill="#475467"/></g><defs><linearGradient id="paint0_linear_5999_560822" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop stop-color="#F9FAFB"/><stop offset="1" stop-color="#EDF0F3"/></linearGradient><clipPath id="clip0_5999_560822"><rect width="16" height="16" rx="8" fill="white"/></clipPath></defs>
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
          </div>`,
        minHeight: 40,
        marginBottom: 4,
      });
    });

    childResource.push({
      id: data.number,
      name: `<div class="create-task-div rowResourceEvent" style="--main-color: ${color}; height: ${data.tasks?.length ? '45px' : '40px'}">
              <button class="create-task-button" project-id="${data.id}" number="${data?.number}" reference="${data?.reference}" style="margin-bottom: ${data.tasks?.length ? '16px' : '6px'}">Create Task
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5C10.3452 5 10.625 5.27982 10.625 5.625V9.375H14.375C14.7202 9.375 15 9.65482 15 10C15 10.3452 14.7202 10.625 14.375 10.625H10.625V14.375C10.625 14.7202 10.3452 15 10 15C9.65482 15 9.375 14.7202 9.375 14.375V10.625H5.625C5.27982 10.625 5 10.3452 5 10C5 9.65482 5.27982 9.375 5.625 9.375H9.375V5.625C9.375 5.27982 9.65482 5 10 5Z" fill="#106B99"/>
                </svg>
              </button> 
            </div>`,
      minHeight: 40,
      marginBottom: 0,
    });

    let unfinishedJobs = 0;
    let totalJobs = 0;
    if (hasWorkSubscription) {
      unfinishedJobs = data?.jobs?.filter(job => !job.finished)?.length || 0;
      totalJobs = data?.jobs?.length || 0;

      childResource.push({
        id: data.number,
        name: `<div class="d-flex flex-column rowResourceEvent">
            <div class="d-flex gap-1 task-heading rowResourceEvent" style="--main-color: ${color}; height: 34px">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M4.875 0.75C4.2538 0.75 3.75 1.25338 3.75 1.87482V2.25H1.125C0.50368 2.25 0 2.75368 0 3.375V9.375C0 9.99632 0.50368 10.5 1.125 10.5H10.875C11.4963 10.5 12 9.99632 12 9.375V3.375C12 2.75368 11.4963 2.25 10.875 2.25H8.25V1.87482C8.25 1.25338 7.7462 0.75 7.125 0.75H4.875ZM4.875 1.5H7.125C7.33223 1.5 7.5 1.66847 7.5 1.87546V2.25H4.5V1.87482C4.5 1.66783 4.66777 1.5 4.875 1.5ZM6.28987 6.68581L11.25 5.3631V9.375C11.25 9.58211 11.0821 9.75 10.875 9.75H1.125C0.917893 9.75 0.75 9.58211 0.75 9.375V5.3631L5.71013 6.68581C5.90006 6.73645 6.09994 6.73645 6.28987 6.68581ZM1.125 3H10.875C11.0821 3 11.25 3.16789 11.25 3.375V4.5869L6.09662 5.96113C6.03331 5.97801 5.96669 5.97801 5.90338 5.96113L0.75 4.5869V3.375C0.75 3.16789 0.917893 3 1.125 3Z" fill="#475467"/>
              </svg>
              <span class="font-14">Jobs</span>
            </div>
           </div>`,
        minHeight: 40,
        marginBottom: 4,
      });

      // Job child resource
      data?.jobs?.forEach((job, index) => {
        events.push({
          start: parseTimestamp(1000 * +job.start_date),
          end: parseTimestamp(1000 * +job.end_date),
          id: `job_${job.id}_${index}`,
          cssClass: "childEvent job-item",
          resource: job.id,
          backColor: job.finished ? "#DCFAE6" : "#F2F4F7",
          borderColor: job.finished ? "#DCFAE6" : "#F2F4F7",
          text: job.short_description,
          tag: { type: "job", job: job },
          resizeDisabled: true
        });

        const statusIMG = job.status === '5'
          ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="#DCFAE6"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#085D3A"/>
            </svg>`
          : `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="#F2F4F7"/>
              <path d="M13.5524 6.97725C13.7692 6.75758 14.1206 6.75758 14.3374 6.97725C14.5515 7.19423 14.5542 7.54436 14.3453 7.7646L9.91018 13.0073C9.90592 13.0127 9.90136 13.0179 9.89654 13.0227C9.67975 13.2424 9.32828 13.2424 9.11149 13.0227L6.41259 10.2879C6.1958 10.0682 6.1958 9.71209 6.41259 9.49242C6.62937 9.27275 6.98085 9.27275 7.19763 9.49242L9.48729 11.8126L13.5376 6.99408C13.5422 6.98818 13.5471 6.98256 13.5524 6.97725Z" fill="#475467"/>
            </svg>`;

        const alias = job?.worker?.alias || '';
        const jobImg = job?.worker?.has_photo
          ? `<img src="${job?.worker?.photo}" style="width: 20px; height: 20px; border-radius: 50%;" onerror="this.outerHTML='<div class=\\'job-alias\\'>${alias}</div>'" />`
          : `<div class="job-alias">${alias}</div>`;

        childResource.push({
          id: job.id,
          name: `<div class="d-flex flex-column job-resource-child" job-id="${job.id}">
            <div class="task-list rowResourceEvent" style="--main-color: ${color}">
              <div class="flex">
                <div class="job-icon">
                 ${jobImg}
                </div>
                <div class="title-description-section">
                  <span class="task-assigner">${job?.worker?.full_name}</span>
                  <span class="task-title">${job.short_description}</span>
                </div> 
              </div>
              <div class="completion-status ${statusIMG === 'completed' ? 'completed-class' : 'incomplete-class'}">
                ${statusIMG}
              </div>
            </div>
          </div>`,
          minHeight: 40,
          marginBottom: 4,
        });
      });

      childResource.push({
        id: data.number,
        name: `<div class="create-task-div rowResourceEvent" style="--main-color: ${color}; height: ${data.tasks?.length ? '45px' : '40px'}">
              <button class="createJobButton" project-id="${data.id}" style="margin-bottom: ${data.tasks?.length ? '16px' : '6px'}">
                Create Job
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5C10.3452 5 10.625 5.27982 10.625 5.625V9.375H14.375C14.7202 9.375 15 9.65482 15 10C15 10.3452 14.7202 10.625 14.375 10.625H10.625V14.375C10.625 14.7202 10.3452 15 10 15C9.65482 15 9.375 14.7202 9.375 14.375V10.625H5.625C5.27982 10.625 5 10.3452 5 10C5 9.65482 5.27982 9.375 5.625 9.375H9.375V5.625C9.375 5.27982 9.65482 5 10 5Z" fill="#106B99"/>
                </svg>
              </button> 
            </div>`,
        minHeight: 40,
        marginBottom: 0,
      });
    }

    const unfinished = unfinishedTasks + unfinishedJobs;
    const total = totalTasks + totalJobs;

    return {
      id: data.unique_id,
      expanded: expandRow === data.unique_id,
      name: `<div class="resourceList rowResourceEvent" style="--main-color: ${color};">
        <ul class="resourceMan me-2">
          <li title="${data.number}">
            <div style="width: 70px; overflow: hidden; text-overflow: ellipsis; display: inline-block; position: relative; top: 2px; white-space: nowrap;" class="">${data.number}</div>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 4C4.72386 4 4.5 4.22386 4.5 4.5C4.5 4.77614 4.72386 5 5 5H11C11.2761 5 11.5 4.77614 11.5 4.5C11.5 4.22386 11.2761 4 11 4H5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"}"/>
              <path d="M4.5 6.5C4.5 6.22386 4.72386 6 5 6H11C11.2761 6 11.5 6.22386 11.5 6.5C11.5 6.77614 11.2761 7 11 7H5C4.72386 7 4.5 6.77614 4.5 6.5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"}"/>
              <path d="M5 8C4.72386 8 4.5 8.22386 4.5 8.5C4.5 8.77614 4.72386 9 5 9H11C11.2761 9 11.5 8.77614 11.5 8.5C11.5 8.22386 11.2761 8 11 8H5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"}"/>
              <path d="M5 10C4.72386 10 4.5 10.2239 4.5 10.5C4.5 10.7761 4.72386 11 5 11H8C8.27614 11 8.5 10.7761 8.5 10.5C8.5 10.2239 8.27614 10 8 10H5Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"}"/>
              <path d="M2 2C2 0.89543 2.89543 0 4 0H12C13.1046 0 14 0.89543 14 2V14C14 15.1046 13.1046 16 12 16H4C2.89543 16 2 15.1046 2 14V2ZM12 1H4C3.44772 1 3 1.44772 3 2V14C3 14.5523 3.44772 15 4 15H12C12.5523 15 13 14.5523 13 14V2C13 1.44772 12.5523 1 12 1Z" fill="${data.is_invoice_created ? "#17B26A" : "#98A2B3"}"/>
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11 7.5C11 7.22386 11.2239 7 11.5 7H12.5C12.7761 7 13 7.22386 13 7.5V8.5C13 8.77614 12.7761 9 12.5 9H11.5C11.2239 9 11 8.77614 11 8.5V7.5Z" fill="${data.booking_start ? "#1AB2FF" : "#98A2B3"}"/>
              <path d="M3.5 0C3.77614 0 4 0.223858 4 0.5V1H12V0.5C12 0.223858 12.2239 0 12.5 0C12.7761 0 13 0.223858 13 0.5V1H14C15.1046 1 16 1.89543 16 3V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V3C0 1.89543 0.895431 1 2 1H3V0.5C3 0.223858 3.22386 0 3.5 0ZM2 2C1.44772 2 1 2.44772 1 3V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V3C15 2.44772 14.5523 2 14 2H2Z" fill="${data.booking_start ? "#1AB2FF" : "#98A2B3"}"/>
              <path d="M2.5 4C2.5 3.72386 2.72386 3.5 3 3.5H13C13.2761 3.5 13.5 3.72386 13.5 4V5C13.5 5.27614 13.2761 5.5 13 5.5H3C2.72386 5.5 2.5 5.27614 2.5 5V4Z" fill="${data.booking_start ? "#1AB2FF" : "#98A2B3"}"/>
            </svg>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 10.7813C4.14782 12.4484 5.51294 13.6306 7.59107 13.7837V15H8.63448V13.7837C10.9039 13.6051 12.3125 12.3463 12.3125 10.4836C12.3125 8.89307 11.3647 7.97448 9.35617 7.45565L8.63448 7.26853V3.46659C9.75615 3.57716 10.5126 4.18104 10.7039 5.08262H12.1734C12.0082 3.4836 10.6343 2.33536 8.63448 2.20778V1H7.59107V2.23329C5.65207 2.46294 4.32172 3.70474 4.32172 5.38882C4.32172 6.84326 5.28687 7.87242 6.98241 8.3062L7.59107 8.4678V12.4994C6.44332 12.3293 5.65207 11.6999 5.46077 10.7813H4ZM7.39108 6.94532C6.34767 6.68165 5.79119 6.12029 5.79119 5.32928C5.79119 4.38518 6.49549 3.68773 7.59107 3.50061V6.99635L7.39108 6.94532ZM8.98228 8.81652C10.2692 9.13973 10.8343 9.67558 10.8343 10.5857C10.8343 11.6829 10.0083 12.4143 8.63448 12.5249V8.73147L8.98228 8.81652Z" fill="${!data.is_invoice_created ? '#667085' : data.paid === "PAID" ? "#17B26A" : data.paid === "NOT PAID" ? "#F04438" : data.paid === "PARTIAL PAYMENT" ? "#fedf89" : "#F79009"}"/>
            </svg>
          </li>
          <li>
            <span class='${jobsStatus}'>${data.jobs_done}/${data.jobs_count}</span>
          </li>
          <li>
            ${isJobOverdue ? overdueIcon : ''}
          </li>
          <li class="text-end float-end me-2" style="width: 100px; flex: 1">
            ${status}
          </li>
          <li class="me-3" style="position: relative;">
            ${unfinished !== 0 ? `<div class="taskUnreadCount">${unfinished}</div>` : ''}
            <div class="taskCount">${total || 0}</div>
          </li>
        </ul>
        <div class="project-content" unique-id="${data.unique_id}" project-id="${data.id}" number="${data?.number}" reference="${data?.reference}">
          <span class="small project-content-name" unique-id="${data.unique_id}">${data?.client?.name}</span>
          <h2 class="project-content-name" unique-id="${data.unique_id}">${data.reference}</h2>
        </div>
      </div>`,
      children: childResource,
      minHeight: 95,
    };
  });

  dp.update({ resources, events });
  dp.onResourceExpand = function (args) {
    expandRow = args.resource.id;
  };
}

function startDaypilot(elementId, responses, viewTaskDetails, reInitialize, hasWorkSubscription, holidays) {
  const isDaypilotLoaded = typeof window !== undefined && Boolean(window.DayPilot);
  if (!isDaypilotLoaded) return;

  DP = window.DayPilot;

  dp = new DP.Scheduler(elementId, {
    days: 365,
    scale: "Day",
    separators: [{ color: "#48C1FF", width: 4 }],
    treeImage: "img/nochildren.png",
    rowMinHeight: 110,
    cellWidth: 73,
    eventEndSpec: "Date",
    durationBarVisible: false,
    eventArrangement: "Cascade",
    eventMoveHandling: "Disabled",
    eventResizingStartEndEnabled: true,
    timeRangeSelectedHandling: "Disabled",
    treeImageNoChildren: false,
    rowHeaderWidth: 380,
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "d" }
    ],
    treeEnabled: true,
    progressiveRowRendering: true,
    treePreventParentUsage: false,
    scrollDelayEvents: 0,
    infiniteScrollingEnabled: true,
    infiniteScrollingStepDays: 100,
  });

  dp.onBeforeRowHeaderRender = function (args) {
    args.row.cssClass = "resourcesRow";
  };

  const holidaysList = holidays?.map(holiday => {
    const date = new Date(+holiday.date * 1000);
    // Convert to Sydney timezone and get date string
    const sydneyDate = new Date(date.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    return sydneyDate.toISOString().split("T")[0];
  }) || [];

  const holidayMap = holidays?.reduce((map, holiday) => {
    const date = new Date(+holiday.date * 1000);
    // Convert to Sydney timezone and get date string
    const sydneyDate = new Date(date.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const dateStr = sydneyDate.toISOString().split("T")[0];
    map[dateStr] = {
      title: holiday.title,
      type: holiday.type || 'Public Holiday'
    };
    return map;
  }, {}) || {};

  dp.onBeforeTimeHeaderRender = function (args) {
    args.header.text = "";
    args.header.toolTip = "";
    if (args.header.level === 1) {
      const australiaSydneyDate = args.header.start.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }).split("T")[0];
      if (args.header.start && holidaysList.includes(australiaSydneyDate)) {
        args.header.backColor = "#F2FAFF";
        args.header.cssClass = "holidayHeader";

        if (holidayMap[australiaSydneyDate]?.type === 'Public Holiday') {
          args.header.html = `
          <div style="color: #1AB2FF; position: relative; width: 84px;">
            <div style="position: absolute; top: -25px; left: 0px; z-index: 1;" class="tooltip-container">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="#EBF8FF"/>
                <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#BAE8FF"/>
                <path d="M16.1402 14.1098C16.2866 14.2563 16.2866 14.4937 16.1402 14.6402L13.8902 16.8902C13.8198 16.9605 13.7245 17 13.625 17C13.5255 17 13.4302 16.9605 13.3598 16.8902L12.2348 15.7652C12.0884 15.6187 12.0884 15.3813 12.2348 15.2348C12.3813 15.0884 12.6187 15.0884 12.7652 15.2348L13.625 16.0947L15.6098 14.1098C15.7563 13.9634 15.9937 13.9634 16.1402 14.1098Z" fill="#158ECC"/>
                <path d="M10.625 8C10.8321 8 11 8.16789 11 8.375V8.75H17V8.375C17 8.16789 17.1679 8 17.375 8C17.5821 8 17.75 8.16789 17.75 8.375V8.75H18.5C19.3284 8.75 20 9.42157 20 10.25V18.5C20 19.3284 19.3284 20 18.5 20H9.5C8.67157 20 8 19.3284 8 18.5V10.25C8 9.42157 8.67157 8.75 9.5 8.75H10.25V8.375C10.25 8.16789 10.4179 8 10.625 8ZM9.5 9.5C9.08579 9.5 8.75 9.83579 8.75 10.25V18.5C8.75 18.9142 9.08579 19.25 9.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V10.25C19.25 9.83579 18.9142 9.5 18.5 9.5H9.5Z" fill="#158ECC"/>
                <path d="M9.875 11C9.875 10.7929 10.0429 10.625 10.25 10.625H17.75C17.9571 10.625 18.125 10.7929 18.125 11V11.75C18.125 11.9571 17.9571 12.125 17.75 12.125H10.25C10.0429 12.125 9.875 11.9571 9.875 11.75V11Z" fill="#158ECC"/>
              </svg>
              <span class="tooltip-text">${holidayMap[australiaSydneyDate]?.title}</span>
            </div>
            ${args.header.html}
          </div>`;
        } else {
          args.header.html = `
          <div style="color: #FFB800; position: relative; width: 84px;">
            <div style="position: absolute; top: -25px; left: 0px; z-index: 1;" class="tooltip-container">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="#FFF8E1"/>
                <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#FFECB3"/>
                <path d="M14 8L20.5263 18.5H7.47372L14 8Z" fill="#FFB800" stroke="#FFB800" stroke-width="1.5"/>
                <path d="M14 12V15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
                <circle cx="14" cy="17.5" r="1" fill="#FFFFFF"/>
              </svg>
              <span class="tooltip-text">${holidayMap[australiaSydneyDate]?.title}</span>
            </div>
            ${args.header.html}
          </div>`;
        }

      } else if (args.header.start.getDayOfWeek() === 6 || args.header.start.getDayOfWeek() === 0) {
        args.header.cssClass = "weekendHeader";
        args.header.backColor = "#F9FAFB";
      }
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
        style: "border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #0000007f; color: #ffffff; padding: 2px;height: 36px;",
      },
    ];

    args.data.text = "Event details";
  };

  dp.onEventClicked = function (args) {
    const taskId = args.e.id();
    if (args.div.className.includes("task-item") && taskId) {
      viewTaskDetails(taskId, false);
    } else if (args.div.className.includes("project-item") && taskId) {
      const projectDetails = args.e.tag();
      viewTaskDetails(taskId, true, projectDetails);
    } else if (args.div.className.includes("job-item") && taskId) {
      const jobDetails = args.e.tag();
      viewTaskDetails(taskId, true, jobDetails);
    }
  };

  dp.onBeforeCellRender = function (args) {
    if (
      args.cell.start.getDayOfWeek() === 6 ||
      args.cell.start.getDayOfWeek() === 0
    ) {
      args.cell.backColor = "#F9FAFB"; // Highlight weekends
    }

    const australiaSydneyDate = args.cell.start.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }).split("T")[0];
    if (args.cell.start && holidaysList.includes(australiaSydneyDate)) {
      args.cell.backColor = "#F2FAFF"; // Highlight holidays
    }
  };

  dp.onEventResize = async function (args) {
    const taskId = args.e.id();
    const startDate = new Date(args.newStart).toISOString();
    const endDate = new Date(args.newEnd).toISOString();
    console.log('args.e.tag().type: ', args.e.tag().type);

    if (args.e.tag().type === "task") {
      const task = args.e.tag().task;
      try {
        await updateTask(taskId, {
          title: task.title,
          description: task.description,
          user: task.assigned_to.id,
          from_date: startDate,
          to_date: endDate,
        });
        dp.message("The task has been successfully updated.", { cssClass: "success_message" });
      } catch (error) {
        console.log(error);
        dp.message("An error occurred while updating the task. Please try again.");
      }
    }

    if (args.e.tag().type === "project") {
      try {
        await updateProjectScheduleById(taskId, {
          booking_start: startDate,
          booking_end: endDate,
        });
        dp.message("The project schedule has been successfully updated.", { cssClass: "success_message" });
        reInitialize();
      } catch (error) {
        console.log(error);
        dp.message("An error occurred while updating the project schedule. Please try again.");
      }
    }
  };

  dp.init();

  loadData(responses, hasWorkSubscription);
}

export function reInitializeData(responses, hasWorkSubscription) {
  try {
    if (dp) loadData(responses, hasWorkSubscription);
  } catch (error) {
    console.log(error);
  }
}

export function initDaypilot(elementId, response, viewTaskDetails, reInitialize, hasWorkSubscription, holidays) {
  try {
    startDaypilot(elementId, response, viewTaskDetails, reInitialize, hasWorkSubscription, holidays);
  } catch (error) {
    console.log(error);
  }
}