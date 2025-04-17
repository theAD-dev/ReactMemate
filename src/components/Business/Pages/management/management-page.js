import React from 'react';
import { Helmet } from 'react-helmet-async';
import { EventScheduler } from "./event-scheduler";

const Management = () => {
    return (
        <>
            <Helmet>
                <title>MeMate - Management</title>
            </Helmet>
            <EventScheduler />
        </>
    );
};
export default Management;