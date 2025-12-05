import React from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import styles from './help.module.scss';
import joshImage from '../../assets/images/Avatar.png';
import RequestHelp from '../../features/dashboard/request-help/request-help';
import Support from '../../features/help/support/support';

const Help = () => {
    const [showRequestCall, setShowRequestCall] = React.useState(false);
    const [showSupport, setShowSupport] = React.useState(false);
    return (
        <>
            <div className='homeDashboardPage d-flex flex-column align-items-center' style={{ height: '100vh', padding: '32px' }}>
                <h1 className={styles.helpTitle}>How can we help?</h1>
                <div className={styles.helpContent}>
                    <div className='d-flex flex-column gap-3'>
                        <div className={styles.helpItem} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            <span className={styles.helpItemText}>Suggestions</span>
                            <Button className='text-button'><ArrowRight color='#1AB2FF' size={16} /></Button>
                        </div>
                        <div className={styles.helpItem}>
                            <div className='d-flex flex-start gap-2 cursor-pointer' onClick={() => setShowRequestCall(true)}>
                                <div className='outline-button p-0' style={{ width: '46px', height: '46px', overflow: 'hidden', borderRadius: '50%' }}>
                                    <img src={joshImage} alt='Josh' className='w-100 h-100' />
                                </div>
                                <div className='d-flex flex-column justify-content-center mt-1'>
                                    <span className='font-14 text-left text-nowrap'>Need help with this?</span>
                                    <Link to={"#"} style={{ color: '#158ECC', fontSize: '14px' }}>Book a call with Josh <ArrowRight size={16} color="#158ECC" className='ms-2' /></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex flex-column gap-3'>
                        <div className={clsx(styles.helpItem, 'cursor-pointer')} onClick={() => setShowSupport(true)}>
                            <span className={styles.helpItemText}>Support </span>
                            <Button className='text-button'><ArrowRight color='#1AB2FF' size={16} /></Button>
                        </div>
                        <div className={styles.helpItem} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            <span className={styles.helpItemText}>Knowledge Base</span>
                            <Button className='text-button'><ArrowRight color='#1AB2FF' size={16} /></Button>
                        </div>
                    </div>
                </div>
            </div>
            <RequestHelp visible={showRequestCall} setVisible={setShowRequestCall} />
            <Support visible={showSupport} setVisible={setShowSupport} />
        </>

    );
};

export default Help;