import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ComingSoon from '../../../../shared/ui/coming-soon';
import Sidebar from '../Sidebar';

const EmailSignatures = () => {
    const { trialHeight } = useTrialHeight();
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const has_work_subscription = !!profileData?.has_work_subscription;
    const has_twilio = !!profileData?.has_twilio;
    const [activeTab, setActiveTab] = useState('job-templates');

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Templates</h1>
                            <div className='contentMenuTab'>
                                <ul>
                                    <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                    <li className='menuActive'><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                    <li><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                                    {!has_work_subscription ? (
                                        <OverlayTrigger
                                            key="top"
                                            placement="top"
                                            overlay={
                                                <Tooltip className='TooltipOverlay width-300' id="tooltip-job-templates">
                                                    Work environment is not available for this subscription type
                                                </Tooltip>
                                            }
                                        >
                                            <li style={{ opacity: '.5', cursor: 'not-allowed' }}><Link to="#">Job Templates</Link></li>
                                        </OverlayTrigger>
                                    ) : (
                                        <li><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                                    )}
                                    {!has_twilio ? (
                                        <OverlayTrigger
                                            key="top"
                                            placement="top"
                                            overlay={
                                                <Tooltip className='TooltipOverlay width-300' id="tooltip-job-templates">
                                                    Your Twilio account has not been set up yet.
                                                </Tooltip>
                                            }
                                        >
                                            <li style={{ opacity: '.5', cursor: 'not-allowed' }}><Link to="#">SMS Templates</Link></li>
                                        </OverlayTrigger>
                                    ) : (
                                        <li><Link to="/settings/templates/sms-templates">SMS Templates</Link></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className={`content_wrap_main d-flex align-items-center w-100`} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
                            <ComingSoon />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmailSignatures;
