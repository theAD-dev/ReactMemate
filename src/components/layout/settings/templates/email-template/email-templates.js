import React, { useState } from 'react';
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { PlusLg, InfoCircle } from "react-bootstrap-icons";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Tooltip as PrimeTooltip } from 'primereact/tooltip'; // Renamed to avoid conflict
import { getEmailTemplates } from '../../../../../APIs/email-template';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import Sidebar from '../../Sidebar';
import style from '../job-template.module.scss';

const EmailTemplates = () => {
    const { trialHeight } = useTrialHeight();
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const has_work_subscription = !!profileData?.has_work_subscription;
    const has_twilio = !!profileData?.has_twilio;
    const [activeTab, setActiveTab] = useState('job-templates');

    const emailTemplateQuery = useQuery({
        queryKey: ["emailTemplate"],
        queryFn: getEmailTemplates,
    });

    return (
        <div className='settings-wrap'>
            <Helmet>
                <title>MeMate - Email Templates</title>
            </Helmet>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky' style={{ position: 'relative' }}>
                        <h1>Templates</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li className='menuActive'><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
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
                    <div className={`content_wrap_main mt-0`} style={{ height: `calc(100vh - 230px - ${trialHeight}px)` }}>
                        <div className='content_wrapper'>
                            <div className='listwrapper'>
                                <div className="topHeadStyle mb-4 align-items-center">
                                    <h2 className='mb-0'>Email Templates</h2>
                                    <Link className='mb-0' to={'/settings/templates/email-templates/new'}>
                                        Create New Template <PlusLg color='#344054' size={20} />
                                    </Link>
                                </div>
                                {emailTemplateQuery?.data?.map((email, index) => (
                                    <div key={email.id} className={clsx(style.listbox, { [style.notCustomBox]: email.type !== 'Custom' }, 'mb-2')}>
                                        <PrimeTooltip position='top' className={style.customTooltip} target={`.info-${index}`} />
                                        <h2 className={clsx(style.heading)}>
                                            {email?.name}
                                            {email.type !== 'Custom' && (
                                                <InfoCircle
                                                    color='#667085'
                                                    className={`ms-2 info-${index}`}
                                                    data-pr-tooltip="This is a default email template."
                                                />
                                            )}
                                        </h2>
                                        <Link to={`/settings/templates/email-templates/${email.id}?isCustom=${email.type === 'Custom'}`}>
                                            <Button className={clsx(style.editPencil, 'text-button p-0')} style={{ color: '#1AB2FF', visibility: 'hidden' }}>
                                                edit
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {emailTemplateQuery.isLoading && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                background: 'white',
                                width: '60px',
                                height: '60px',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10,
                            }}
                            className="shadow-lg"
                        >
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailTemplates;