import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { initJobScheduler, reInitializeJobScheduler } from './job-scheduler-calendar';
import './job-scheduler-calendar.scss';
import style from './job-scheduler-calendar.scss';
import { getJobDashboardData } from '../../../../APIs/jobs-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import CreateJob from '../create-job/create-job';

const CALENDAR_ID = "job-scheduler";
const JobSchedulerCalendarModule = () => {
    const { trialHeight } = useTrialHeight();
    const [visible, setVisible] = useState(false);
    const [workerId, setWorkerId] = useState("");

    useEffect(() => {
        const daypilotScript = document.createElement("script");
        daypilotScript.src =
            "/daypilot-all.min.js";
        daypilotScript.id = "daypilot-script-ele";

        const handleError = () => {
            console.error("Failed to load DayPilot script.");
        };

        const handleLoad = async () => {
            try {
                const data = await getJobDashboardData();
                initJobScheduler(CALENDAR_ID, data);
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

    const refetchAndReInit = async () => {
        try {
            const data = await getJobDashboardData();
            reInitializeJobScheduler(data);
            setWorkerId("");
        } catch (error) {
            console.error("Error initializing DayPilot:", error);
        }
    };

    useEffect(() => {
        const handleClick = (e) => {
            if (!(e.target instanceof HTMLSelectElement)) {
                if (e.target.closest('.createJobButton')) {
                    const workerId = e.target.getAttribute('workerId');
                    setVisible(true);
                    setWorkerId(workerId);
                }
            }
        };
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);
    return (
        <React.Fragment>
            <div className="topbar" style={{ padding: '0px 20px', position: 'relative', borderBottom: '1px solid #f2f2f2' }}>
                <div className="searchBox" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '5px', left: '8px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                        </svg>
                    </div>
                    <input type="text" placeholder="Search" onChange={() => { }} className="border search-resource" style={{ borderRadius: '4px', border: '1px solid #D0D5DD', paddingLeft: '36px', fontSize: '16px', height: '36px' }} />
                </div>
                <div className="featureName" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <h1 className="title">Dashboard</h1>
                </div>
                <div className="filters">

                </div>
            </div>

            <div className={trialHeight && 'trial-height-added'}>
                <div id={CALENDAR_ID} className={style.jobScheduler}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </div>
            </div>

            <CreateJob visible={visible} setVisible={setVisible} setRefetch={refetchAndReInit} workerId={workerId} />
        </React.Fragment>
    );
};

export default JobSchedulerCalendarModule;