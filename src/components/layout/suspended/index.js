import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import styles from './suspended.module.scss';
import suspendedImage from '../../../assets/suspended-mask.svg';

const Suspended = () => {
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const isSuspended = profileData?.is_suspended ? true : false;
    const isAdmin = (profileData?.type === "Admin") ? true : false;

    if (!isSuspended) return <Navigate to={"/"} replace />; //TODO: not
    return (
        <Row className='w-100 m-0 p-0'>
            <Col sm={6} className={styles.leftSection}>
                <div className="logohead"><img src="/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt="Loin Logo" /></div>
                <div style={{ width: '568px', maxWidth: "calc(100% - 0px)" }} className='d-flex flex-column align-items-center text-center m-auto'>
                    <div className={styles.topHeading}>
                        <h1 className={styles.heading}>
                            {
                                isAdmin ? "Authentication filed because your account has been suspended."
                                    : "It looks like the organization's account is suspended."
                            }

                        </h1>
                        <p className={styles.subHeading}>
                            {isAdmin ? "If you believe your account was suspended due to non-payment of the outstanding balance, you can pay now using the link below."
                                : "Please contact your company admin."}
                        </p>
                    </div>

                    <img src={suspendedImage} className='w-100' />

                    {isAdmin && <Link to={"/account-overdue"}><button className={styles.payButton}>Pay Outstanding Balance</button></Link>}
                </div>
                <div className="copywrite">© Memate {new Date().getFullYear()}</div>
            </Col>
            <Col sm={6} className={styles.rightSection}>
                <div className={styles.rightTextBox}>
                    <div className={styles.rightSectionContent}>
                        <div className={styles.rightTextBoxHeader}>
                            <svg width="492" height="209" viewBox="0 0 492 209" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="246" cy="104.5" r="80" fill="#FEE4E2" />
                                <circle cx="154" cy="36.5" r="8" fill="#F2F4F7" />
                                <circle cx="334" cy="166.5" r="6" fill="#F2F4F7" />
                                <circle cx="161" cy="162.5" r="10" fill="#F2F4F7" />
                                <circle cx="346" cy="70.5" r="10" fill="#F2F4F7" />
                                <circle cx="327" cy="35.5" r="7" fill="#F2F4F7" />
                                <g filter="url(#filter0_dd_10630_557690)">
                                    <rect x="163" y="46.5" width="166" height="104" rx="6" fill="url(#paint0_linear_10630_557690)" />
                                    <rect x="177.07" y="70.6855" width="29.0233" height="21.7674" rx="2" fill="#D0D5DD" />
                                    <circle cx="302.837" cy="77.9417" r="12.093" fill="#98A2B3" />
                                    <circle cx="288.325" cy="77.9417" r="12.093" fill="#D0D5DD" />
                                    <path d="M177.07 134.779C177.07 133.443 178.153 132.36 179.488 132.36H203.674C205.01 132.36 206.093 133.443 206.093 134.779C206.093 136.115 205.01 137.198 203.674 137.198H179.488C178.153 137.198 177.07 136.115 177.07 134.779Z" fill="#D0D5DD" />
                                    <path d="M213.349 134.779C213.349 133.443 214.432 132.36 215.767 132.36H239.954C241.289 132.36 242.372 133.443 242.372 134.779C242.372 136.115 241.289 137.198 239.954 137.198H215.767C214.432 137.198 213.349 136.115 213.349 134.779Z" fill="#D0D5DD" />
                                    <path d="M249.628 134.779C249.628 133.443 250.711 132.36 252.047 132.36H276.233C277.568 132.36 278.651 133.443 278.651 134.779C278.651 136.115 277.568 137.198 276.233 137.198H252.047C250.711 137.198 249.628 136.115 249.628 134.779Z" fill="#D0D5DD" />
                                    <path d="M285.907 134.779C285.907 133.443 286.99 132.36 288.326 132.36H312.512C313.847 132.36 314.93 133.443 314.93 134.779C314.93 136.115 313.847 137.198 312.512 137.198H288.326C286.99 137.198 285.907 136.115 285.907 134.779Z" fill="#D0D5DD" />
                                </g>
                                <g filter="url(#filter1_b_10630_557690)">
                                    <rect x="218" y="116.5" width="56" height="56" rx="28" fill="#FD3D30" fillOpacity="0.4" />
                                    <path d="M246 139.833V144.5M246 149.166H246.012M257.667 144.5C257.667 150.943 252.443 156.166 246 156.166C239.557 156.166 234.333 150.943 234.333 144.5C234.333 138.056 239.557 132.833 246 132.833C252.443 132.833 257.667 138.056 257.667 144.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <filter id="filter0_dd_10630_557690" x="143" y="46.5" width="206" height="144" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_10630_557690" />
                                        <feOffset dy="8" />
                                        <feGaussianBlur stdDeviation="4" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.03 0" />
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10630_557690" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_10630_557690" />
                                        <feOffset dy="20" />
                                        <feGaussianBlur stdDeviation="12" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.08 0" />
                                        <feBlend mode="normal" in2="effect1_dropShadow_10630_557690" result="effect2_dropShadow_10630_557690" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_10630_557690" result="shape" />
                                    </filter>
                                    <filter id="filter1_b_10630_557690" x="210" y="108.5" width="72" height="72" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
                                        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_10630_557690" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_10630_557690" result="shape" />
                                    </filter>
                                    <linearGradient id="paint0_linear_10630_557690" x1="168.781" y1="149.269" x2="165.758" y2="54.0842" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#E4E7EC" />
                                        <stop offset="1" stopColor="#F9FAFB" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className={styles.rightSectionTextContent}>
                            {isAdmin && <p className={styles.rightSectionText}>Your account will remain suspended for 30 days after the date of suspension. During this time, you can still access your account by paying the outstanding amount. After 30 days, the account will be deleted, and additional costs will apply to recover the data.</p>}
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default Suspended;