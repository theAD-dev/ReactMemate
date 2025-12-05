import { fetchAPI } from "../../../../APIs/base-api";

let dp, DP, expandRow;

const getStatusLabel = (status, actionStatus, published) => {
  if (!published) {
    return { label: "Draft", className: "DRAFT", color: '#344054', backColor: '#f9fafb', borderColor: '#eaecf0' };
  }

  if (status === 'a' && actionStatus) {
    return { label: "In Progress", className: "IN_PROGRESS", color: '#3D5AFE', backColor: '#EEF1FF', borderColor: '#C3CCFF' };
  }

  const statusMap = {
    "1": { label: "Open", className: "OPEN", color: '#065b76', backColor: '#ecf7fd', borderColor: '#a9d6ef' },
    "2": { label: "Assigned", className: "ASSIGNED", color: '#520676', backColor: '#f6ecfd', borderColor: '#dda9ef' },
    "3": { label: "Submitted", className: "SUBMITTED", color: '#344054', backColor: '#f9fafb', borderColor: '#eaecf0' },
    "4": { label: "Finished", className: "FINISHED", color: '#29B27C', backColor: '#BBFFE4', borderColor: '#BBFFE4' },
    "6": { label: "Declined", className: "DECLINED", color: '#b42318', backColor: '#fef3f2', borderColor: '#fecdca' },
    'a': { label: "Confirmed", className: "CONFIRMED", color: '#067647', backColor: '#ecfdf3', borderColor: '#a9efc5' },
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
      html: `<div class="d-flex align-items-center open-jobs-box" style="width: 300px">
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
      html: `<div class="job-resource-child d-flex cursor-pointer" job-id="${job.id}">
         <div class="d-flex justify-content-center align-items-center icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.14307 6.57171C6.82748 6.57171 6.57164 6.82754 6.57164 7.14314C6.57164 7.45873 6.82748 7.71457 7.14307 7.71457H12.8574C13.1729 7.71457 13.4288 7.45873 13.4288 7.14314C13.4288 6.82754 13.1729 6.57171 12.8574 6.57171H7.14307Z" fill="#475467"/>
            <path d="M7.14307 8.85742C6.82748 8.85742 6.57164 9.11326 6.57164 9.42885C6.57164 9.74444 6.82748 10.0003 7.14307 10.0003H10.5716C10.8872 10.0003 11.1431 9.74444 11.1431 9.42885C11.1431 9.11326 10.8872 8.85742 10.5716 8.85742H7.14307Z" fill="#475467"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 3.14314C11.2626 3.14314 12.2859 2.11979 12.2859 0.857422H15.1431C16.0898 0.857422 16.8574 1.62493 16.8574 2.57171V17.4289C16.8574 18.3756 16.0898 19.1431 15.1431 19.1431H4.85735C3.91058 19.1431 3.14307 18.3756 3.14307 17.4289V2.57171C3.14307 1.62493 3.91058 0.857422 4.85735 0.857422H7.7145C7.7145 2.11979 8.73784 3.14314 10.0002 3.14314ZM10.0002 4.28599C11.493 4.28599 12.763 3.33193 13.2337 2.00028H15.1431C15.4587 2.00028 15.7145 2.25612 15.7145 2.57171V17.4289C15.7145 17.7444 15.4587 18.0003 15.1431 18.0003H4.85735C4.54176 18.0003 4.28592 17.7444 4.28592 17.4289V2.57171C4.28592 2.25612 4.54176 2.00028 4.85735 2.00028H6.76673C7.2374 3.33193 8.50739 4.28599 10.0002 4.28599Z" fill="#475467"/>
          </svg>
         </div>
         <div class="project-item-section">
          <div class="job-resource-child-text">
           <small class='d-block'>${job?.number}</small>
           <small class='d-block job-reference-ellipsis' title="${job?.reference}">${job?.reference}</small>
          </div>
          <div class="status ${getStatusLabel(job?.status, job?.action_status, job?.published).className}">
            ${getStatusLabel(job?.status, job?.action_status, job?.published).label}
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

    if (worker?.first_name !== "Open" && worker?.last_name !== "Jobs") {
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
    } else {
      resources.filter((resource) => resource.id === 0)[0].children = childResource;
    }

    worker?.jobs?.forEach((job) => {
      if (job.start_date && job.end_date) {
        const event = {
          id: job.id,
          start: parseTimestamp(1000 * job.start_date).toISOString(),
          end: parseTimestamp(1000 * job.end_date).toISOString(),
          resource: job.id,
          text: job?.reference || 'No Reference',
          tag: { jobId: job.id },
          cssClass: `childEvent jobEvent ${getStatusLabel(job?.status, job?.action_status, job?.published).className}`,
          backColor: `${getStatusLabel(job?.status, job?.action_status, job?.published).backColor}`,
        };
        events.push(event);
      }
    });

    // Add worker unavailability events
    // type: 1 = On leave, 2 = Sick leave, 3 = Vacation
    if (worker?.unavailabilities && Array.isArray(worker.unavailabilities)) {
      worker.unavailabilities.forEach((unavailability) => {
        if (unavailability.date_from && unavailability.date_to) {
          const typeConfig = {
            1: {
              label: 'On leave',
              cssClass: 'on-leave',
              backColor: '#F2F4F7',
              borderColor: '#F2F4F7',
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0C8.27614 0 8.5 0.223858 8.5 0.5V1.01358C12.625 1.23809 16 4.22087 16 8C16 8 16 8.5 15.5 8.5C15.3512 8.5 15.1478 8.35491 15.1478 8.35491L15.1436 8.35084C15.1389 8.34643 15.1307 8.33869 15.119 8.32808C15.0955 8.30685 15.0581 8.27432 15.008 8.23418C14.9073 8.15368 14.7569 8.04409 14.5644 7.93412C14.1775 7.713 13.6381 7.5 13 7.5C12.3619 7.5 11.8225 7.713 11.4356 7.93412C11.2431 8.04409 11.0927 8.15368 10.992 8.23418C10.9419 8.27432 10.9045 8.30685 10.881 8.32808C10.8693 8.33869 10.8611 8.34643 10.8564 8.35084L10.8527 8.35441C10.8527 8.35441 10.649 8.5 10.5 8.5C10.3512 8.5 10.1478 8.35491 10.1478 8.35491L10.1436 8.35084C10.1389 8.34643 10.1307 8.33869 10.119 8.32808C10.0955 8.30685 10.0581 8.27432 10.008 8.23418C9.90733 8.15368 9.75688 8.04409 9.56443 7.93412C9.28323 7.77344 8.92156 7.61704 8.5 7.54355V13.5H8C8.5 13.5 8.5 13.5 8.5 13.5L8.5 13.5011L8.5 13.5023L8.49998 13.5054L8.49987 13.5138L8.49923 13.5391C8.49855 13.5597 8.49726 13.5875 8.49482 13.6216C8.48997 13.6895 8.4805 13.7834 8.46195 13.8947C8.42524 14.1149 8.35089 14.4162 8.19721 14.7236C8.04256 15.0329 7.80272 15.3574 7.4336 15.6035C7.06135 15.8517 6.58749 16 6 16C5.41251 16 4.93865 15.8517 4.5664 15.6035C4.19728 15.3574 3.95744 15.0329 3.80279 14.7236C3.64911 14.4162 3.57476 14.1149 3.53805 13.8947C3.5195 13.7834 3.51003 13.6895 3.50518 13.6216C3.50274 13.5875 3.50145 13.5597 3.50077 13.5391L3.50013 13.5138L3.50002 13.5054L3.5 13.5023L3.5 13.5011C3.5 13.5011 3.5 13.5 4 13.5H3.5V13C3.5 12.7239 3.72386 12.5 4 12.5C4.27614 12.5 4.5 12.7239 4.5 13V13.4978L4.50021 13.5058C4.5005 13.5146 4.50116 13.5297 4.50264 13.5503C4.50559 13.5917 4.51175 13.6541 4.52445 13.7303C4.55024 13.8851 4.60089 14.0838 4.69721 14.2764C4.79256 14.4671 4.92772 14.6426 5.1211 14.7715C5.31135 14.8983 5.58749 15 6 15C6.41251 15 6.68865 14.8983 6.8789 14.7715C7.07228 14.6426 7.20744 14.4671 7.30279 14.2764C7.39911 14.0838 7.44976 13.8851 7.47555 13.7303C7.48825 13.6541 7.49441 13.5917 7.49736 13.5503C7.49884 13.5297 7.4995 13.5146 7.49979 13.5058L7.5 13.4978V7.54355C7.07844 7.61704 6.71677 7.77344 6.43557 7.93412C6.24313 8.04409 6.09267 8.15368 5.99203 8.23418C5.94187 8.27432 5.90454 8.30685 5.88104 8.32808C5.8693 8.33869 5.86106 8.34643 5.85642 8.35084L5.85233 8.35478C5.85233 8.35478 5.64882 8.5 5.5 8.5C5.35125 8.5 5.14781 8.35491 5.14781 8.35491L5.14358 8.35084C5.13894 8.34643 5.1307 8.33869 5.11896 8.32808C5.09546 8.30685 5.05813 8.27432 5.00797 8.23418C4.90733 8.15368 4.75687 8.04409 4.56443 7.93412C4.17746 7.713 3.63811 7.5 3 7.5C2.36189 7.5 1.82254 7.713 1.43557 7.93412C1.24313 8.04409 1.09267 8.15368 0.992035 8.23418C0.94187 8.27432 0.904544 8.30685 0.881042 8.32808C0.869303 8.33869 0.861057 8.34643 0.856424 8.35084L0.852333 8.35477C0.852333 8.35477 0.648825 8.5 0.5 8.5C0 8.5 0 8 0 8C0 4.22087 3.37501 1.23809 7.5 1.01358V0.5C7.5 0.223858 7.72386 0 8 0ZM6.57706 2.12318C3.74427 2.62214 1.58734 4.58125 1.10256 6.97701C1.58029 6.72922 2.22975 6.5 3 6.5C3.80568 6.5 4.4792 6.75079 4.96226 7.01129C4.97764 6.3126 5.07314 5.486 5.30595 4.65293C5.5484 3.78538 5.94656 2.88829 6.57706 2.12318ZM5.96159 7.0533C6.44886 6.77844 7.15107 6.5 8 6.5C8.84893 6.5 9.55114 6.77844 10.0384 7.0533C10.0261 6.42888 9.94203 5.67738 9.73095 4.92207C9.43383 3.85887 8.89784 2.83043 8 2.11801C7.10216 2.83043 6.56617 3.85887 6.26905 4.92207C6.05797 5.67738 5.97388 6.42888 5.96159 7.0533ZM9.42294 2.12318C10.0534 2.88829 10.4516 3.78538 10.694 4.65293C10.9269 5.486 11.0224 6.31261 11.0377 7.0113C11.5208 6.75079 12.1943 6.5 13 6.5C13.7703 6.5 14.4197 6.72922 14.8974 6.97701C14.4127 4.58125 12.2557 2.62214 9.42294 2.12318Z" fill="#667085"/>
              </svg>`
            },
            2: {
              label: 'Sick leave',
              cssClass: 'sick-leave',
              backColor: '#F2F4F7',
              borderColor: '#F2F4F7',
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2.74805L7.28325 2.01133C5.5989 0.280067 2.51415 0.877695 1.40036 3.05284C0.91777 3.9953 0.779811 5.32279 1.50826 7H0.430243C-1.69803 1.30285 4.5945 -1.82979 7.82432 1.14308C7.88395 1.19797 7.94253 1.25493 8 1.314C8.05747 1.25494 8.11605 1.19797 8.17567 1.14309C11.4055 -1.8298 17.698 1.30285 15.5698 7H14.4917C15.2202 5.32279 15.0822 3.9953 14.5996 3.05284C13.4859 0.877695 10.4011 0.280067 8.71675 2.01133L8 2.74805Z" fill="#667085"/>
                <path d="M2.21206 10H3.52693C4.59306 11.1833 6.05133 12.4579 8 13.7946C9.94868 12.4579 11.4069 11.1833 12.4731 10H13.7879C12.5227 11.5665 10.6483 13.2501 8 15C5.35168 13.2501 3.47735 11.5665 2.21206 10Z" fill="#667085"/>
                <path d="M10.4642 3.3143C10.3848 3.11579 10.188 2.98973 9.97446 3.00065C9.76093 3.01157 9.57798 3.15706 9.51924 3.36264L7.92104 8.95632L6.46424 5.3143C6.39528 5.14191 6.23646 5.02192 6.05178 5.00269C5.8671 4.98346 5.68697 5.06816 5.58397 5.22265L3.73241 8H0.5C0.223858 8 0 8.22386 0 8.5C0 8.77614 0.223858 9 0.5 9H4C4.16718 9 4.32329 8.91645 4.41603 8.77735L5.88877 6.56823L7.53576 10.6857C7.61517 10.8842 7.81201 11.0103 8.02554 10.9993C8.23907 10.9884 8.42202 10.8429 8.48076 10.6374L10.079 5.04368L11.5358 8.6857C11.6117 8.87552 11.7955 9 12 9H15.5C15.7761 9 16 8.77614 16 8.5C16 8.22386 15.7761 8 15.5 8H12.3385L10.4642 3.3143Z" fill="#667085"/>
              </svg>`
            },
            3: {
              label: 'Vacation',
              cssClass: 'vacation',
              backColor: '#F2F4F7',
              borderColor: '#F2F4F7',
              icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0C8.27614 0 8.5 0.223858 8.5 0.5V1.01358C12.625 1.23809 16 4.22087 16 8C16 8 16 8.5 15.5 8.5C15.3512 8.5 15.1478 8.35491 15.1478 8.35491L15.1436 8.35084C15.1389 8.34643 15.1307 8.33869 15.119 8.32808C15.0955 8.30685 15.0581 8.27432 15.008 8.23418C14.9073 8.15368 14.7569 8.04409 14.5644 7.93412C14.1775 7.713 13.6381 7.5 13 7.5C12.3619 7.5 11.8225 7.713 11.4356 7.93412C11.2431 8.04409 11.0927 8.15368 10.992 8.23418C10.9419 8.27432 10.9045 8.30685 10.881 8.32808C10.8693 8.33869 10.8611 8.34643 10.8564 8.35084L10.8527 8.35441C10.8527 8.35441 10.649 8.5 10.5 8.5C10.3512 8.5 10.1478 8.35491 10.1478 8.35491L10.1436 8.35084C10.1389 8.34643 10.1307 8.33869 10.119 8.32808C10.0955 8.30685 10.0581 8.27432 10.008 8.23418C9.90733 8.15368 9.75688 8.04409 9.56443 7.93412C9.28323 7.77344 8.92156 7.61704 8.5 7.54355V13.5H8C8.5 13.5 8.5 13.5 8.5 13.5L8.5 13.5011L8.5 13.5023L8.49998 13.5054L8.49987 13.5138L8.49923 13.5391C8.49855 13.5597 8.49726 13.5875 8.49482 13.6216C8.48997 13.6895 8.4805 13.7834 8.46195 13.8947C8.42524 14.1149 8.35089 14.4162 8.19721 14.7236C8.04256 15.0329 7.80272 15.3574 7.4336 15.6035C7.06135 15.8517 6.58749 16 6 16C5.41251 16 4.93865 15.8517 4.5664 15.6035C4.19728 15.3574 3.95744 15.0329 3.80279 14.7236C3.64911 14.4162 3.57476 14.1149 3.53805 13.8947C3.5195 13.7834 3.51003 13.6895 3.50518 13.6216C3.50274 13.5875 3.50145 13.5597 3.50077 13.5391L3.50013 13.5138L3.50002 13.5054L3.5 13.5023L3.5 13.5011C3.5 13.5011 3.5 13.5 4 13.5H3.5V13C3.5 12.7239 3.72386 12.5 4 12.5C4.27614 12.5 4.5 12.7239 4.5 13V13.4978L4.50021 13.5058C4.5005 13.5146 4.50116 13.5297 4.50264 13.5503C4.50559 13.5917 4.51175 13.6541 4.52445 13.7303C4.55024 13.8851 4.60089 14.0838 4.69721 14.2764C4.79256 14.4671 4.92772 14.6426 5.1211 14.7715C5.31135 14.8983 5.58749 15 6 15C6.41251 15 6.68865 14.8983 6.8789 14.7715C7.07228 14.6426 7.20744 14.4671 7.30279 14.2764C7.39911 14.0838 7.44976 13.8851 7.47555 13.7303C7.48825 13.6541 7.49441 13.5917 7.49736 13.5503C7.49884 13.5297 7.4995 13.5146 7.49979 13.5058L7.5 13.4978V7.54355C7.07844 7.61704 6.71677 7.77344 6.43557 7.93412C6.24313 8.04409 6.09267 8.15368 5.99203 8.23418C5.94187 8.27432 5.90454 8.30685 5.88104 8.32808C5.8693 8.33869 5.86106 8.34643 5.85642 8.35084L5.85233 8.35478C5.85233 8.35478 5.64882 8.5 5.5 8.5C5.35125 8.5 5.14781 8.35491 5.14781 8.35491L5.14358 8.35084C5.13894 8.34643 5.1307 8.33869 5.11896 8.32808C5.09546 8.30685 5.05813 8.27432 5.00797 8.23418C4.90733 8.15368 4.75687 8.04409 4.56443 7.93412C4.17746 7.713 3.63811 7.5 3 7.5C2.36189 7.5 1.82254 7.713 1.43557 7.93412C1.24313 8.04409 1.09267 8.15368 0.992035 8.23418C0.94187 8.27432 0.904544 8.30685 0.881042 8.32808C0.869303 8.33869 0.861057 8.34643 0.856424 8.35084L0.852333 8.35477C0.852333 8.35477 0.648825 8.5 0.5 8.5C0 8.5 0 8 0 8C0 4.22087 3.37501 1.23809 7.5 1.01358V0.5C7.5 0.223858 7.72386 0 8 0ZM6.57706 2.12318C3.74427 2.62214 1.58734 4.58125 1.10256 6.97701C1.58029 6.72922 2.22975 6.5 3 6.5C3.80568 6.5 4.4792 6.75079 4.96226 7.01129C4.97764 6.3126 5.07314 5.486 5.30595 4.65293C5.5484 3.78538 5.94656 2.88829 6.57706 2.12318ZM5.96159 7.0533C6.44886 6.77844 7.15107 6.5 8 6.5C8.84893 6.5 9.55114 6.77844 10.0384 7.0533C10.0261 6.42888 9.94203 5.67738 9.73095 4.92207C9.43383 3.85887 8.89784 2.83043 8 2.11801C7.10216 2.83043 6.56617 3.85887 6.26905 4.92207C6.05797 5.67738 5.97388 6.42888 5.96159 7.0533ZM9.42294 2.12318C10.0534 2.88829 10.4516 3.78538 10.694 4.65293C10.9269 5.486 11.0224 6.31261 11.0377 7.0113C11.5208 6.75079 12.1943 6.5 13 6.5C13.7703 6.5 14.4197 6.72922 14.8974 6.97701C14.4127 4.58125 12.2557 2.62214 9.42294 2.12318Z" fill="#667085"/>
              </svg>`
            }
          };

          const config = typeConfig[unavailability.type] || typeConfig[1]; // Default to 'On leave' if type not found

          const unavailabilityEvent = {
            id: `unavailability-${worker.id}-${unavailability.id}`,
            start: parseTimestamp(unavailability.date_from * 1000).toISOString(),
            end: parseTimestamp(unavailability.date_to * 1000).toISOString(),
            resource: worker.id,
            text: config.label,
            tag: {
              workerId: worker.id,
              unavailabilityId: unavailability.id,
              type: unavailability.type,
              comment: unavailability.comment
            },
            cssClass: `workerEvent ${config.cssClass}`,
            backColor: config.backColor,
            borderColor: config.borderColor,
            html: `
              <div class="worker-availability-event font-14" style="color: #101828; padding-top: 3px">
                ${config.icon}
                <span class="ms-1" style="color: #101828;">${config.label}</span>
              </div>
            `
          };
          events.push(unavailabilityEvent);
        }
      });
    }
  });

  dp.update({ resources, events });
  dp.onResourceExpand = function (args) {
    expandRow = args.resource.id;
  };
}

function initDayPilot(elementId, data, setShow, holidays) {
  const isDayPilotLoaded = typeof window !== undefined && Boolean(window.DayPilot);
  if (!isDayPilotLoaded) return;

  DP = window.DayPilot;

  dp = new DP.Scheduler(elementId, {
    days: 365,
    scale: "Day",
    separators: [{ color: "#48C1FF", width: 4 }],
    treeImage: "img/nochildren.png",
    rowMinHeight: 130,
    cellWidth: 73,
    eventEndSpec: "Date",
    durationBarVisible: false,
    eventArrangement: "Cascade",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
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
              start: parseTimestamp(1000 * job.start_date).toISOString(),
              end: parseTimestamp(1000 * job.end_date).toISOString(),
              resource: job.id,
              text: job?.reference || 'No Reference',
              tag: { jobId: job.id },
              cssClass: `childEvent jobEvent ${getStatusLabel(job?.status, job?.action_status, job?.published).className}`,
              backColor: `${getStatusLabel(job?.status, job?.action_status, job?.published).backColor}`,
            };

            eventsArray.push(event);
          }
        });
      });

      args.events = eventsArray;

      args.loaded();
    },
  });

  dp.init();

  const holidaysList = holidays?.map(holiday => {
    const date = new Date(+holiday.date * 1000);
    const sydneyDate = new Date(date.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    return sydneyDate.toISOString().split("T")[0];
  }) || [];

  const holidayMap = holidays?.reduce((map, holiday) => {
    const date = new Date(+holiday.date * 1000);
    const sydneyDate = new Date(date.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const dateStr = sydneyDate.toISOString().split("T")[0];
    map[dateStr] = holiday.title;
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
              <span class="tooltip-text">${holidayMap[australiaSydneyDate]}</span>
            </div>
            ${args.header.html}
          </div>
        `;
      } else if (args.header.start.getDayOfWeek() === 6 || args.header.start.getDayOfWeek() === 0) {
        args.header.cssClass = "weekendHeader";
        args.header.backColor = "#F9FAFB";
      }
    }
  };

  dp.onBeforeCellRender = function (args) {
    if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
      args.cell.backColor = "#F9FAFB";
    }

    const australiaSydneyDate = args.cell.start.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }).split("T")[0];
    if (args.cell.start && holidaysList.includes(australiaSydneyDate)) {
      args.cell.backColor = "#F2FAFF";
    }
  };

  dp.onEventClicked = function (args) {
    const jobId = args.e.tag().jobId;
    if (!jobId) return;
    setShow({ visible: true, jobId: jobId });
  };

  loadData(data);
}

export function initJobScheduler(elementId, data, setShow, holidays) {
  try {
    initDayPilot(elementId, data, setShow, holidays);
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