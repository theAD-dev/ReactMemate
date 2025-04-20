import React from 'react';
import { Helmet } from 'react-helmet-async';
import JobSchedulerCalendarModule from "../features/job-scheduler-calendar";

const WorkDashboard = () => {
  return (
    <>
      <Helmet>
        <title>MeMate - Work Dashboard</title>
      </Helmet>
      <JobSchedulerCalendarModule />
    </>
  );
};

export default WorkDashboard;