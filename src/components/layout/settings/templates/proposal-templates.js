import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { PlusLg } from "react-bootstrap-icons";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { getProposalsTemplates } from '../../../../APIs/email-template';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Sidebar from '../Sidebar';
import style from './job-template.module.scss';





const ProposalTemplates = () => {
    const { trialHeight } = useTrialHeight();
    const [activeTab, setActiveTab] = useState('job-templates');
    const proposalTemplateQuery = useQuery({
        queryKey: ["proposalTemplates"],
        queryFn: getProposalsTemplates,
    });

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky' style={{ position: 'relative' }}>
                        <h1>Templates</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li><Link to="/settings/templates/job-templates">Job Templates</Link></li>
                                <li><Link to="/settings/templates/email-templates">Email Templates</Link></li>
                                <li><Link to="/settings/templates/email-signatures">Email Signatures</Link></li>
                                <li className='menuActive'><Link to="/settings/templates/proposal-templates">Proposal Templates</Link></li>
                            </ul>
                        </div>
                        <Link to={'/settings/templates/proposal-templates/new'}>
                            <Button className='outline-button' style={{ position: 'absolute', right: 0, bottom: '16px' }}>Create New Template <PlusLg color='#344054' size={20} /></Button>
                        </Link>
                    </div>
                    <div className={`content_wrap_main mt-0`} style={{ paddingBottom: `${trialHeight}px` }}>
                        <div className='content_wrapper'>
                            <div className='listwrapper' style={{ height: 'calc(100vh - 229px)' }}>
                                {
                                    proposalTemplateQuery?.data?.map((proposal, index) =>
                                        <div key={proposal.id} className={clsx(style.listbox, 'mb-2')}>
                                            <h2 className={clsx(style.heading)}>{proposal?.name}</h2>
                                            <Link to={`/settings/templates/proposal-templates/${proposal?.id}`}>
                                                <Button className={clsx(style.editPencil, 'text-button p-0')} style={{ color: '#1AB2FF', visibility: 'hidden' }}>edit</Button>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {
                        proposalTemplateQuery.isLoading &&
                        <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProposalTemplates;
