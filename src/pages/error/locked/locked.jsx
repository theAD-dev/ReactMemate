import React from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from './locked.module.scss';

const LockedError = () => {
    return (
        <div className={clsx(style.container)}>
            <div className='position-relative d-flex flex-column'>
                <svg width="332" height="259" viewBox="0 0 332 259" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="166" cy="114.227" r="113.455" fill="#EAECF0" />
                    <g filter="url(#filter0_dd_7395_278473)">
                        <rect x="39.4546" y="26.9545" width="250.909" height="157.091" rx="13.0909" fill="url(#paint0_linear_7395_278473)" />
                        <rect x="61.2725" y="57.5" width="43.6364" height="32.7273" rx="4.36364" fill="#D0D5DD" />
                        <circle cx="250.364" cy="71.3184" r="18.1818" fill="#98A2B3" />
                        <circle cx="228.546" cy="71.3182" r="18.1818" fill="#D0D5DD" />
                        <path d="M61.2725 161.5C61.2725 159.492 62.9005 157.864 64.9088 157.864H101.272C103.281 157.864 104.909 159.492 104.909 161.5C104.909 163.508 103.281 165.136 101.272 165.136H64.9088C62.9005 165.136 61.2725 163.508 61.2725 161.5Z" fill="#D0D5DD" />
                        <path d="M115.818 161.5C115.818 159.492 117.446 157.864 119.454 157.864H155.818C157.826 157.864 159.454 159.492 159.454 161.5C159.454 163.508 157.826 165.136 155.818 165.136H119.454C117.446 165.136 115.818 163.508 115.818 161.5Z" fill="#D0D5DD" />
                        <path d="M170.363 161.5C170.363 159.492 171.991 157.864 174 157.864H210.363C212.372 157.864 214 159.492 214 161.5C214 163.508 212.372 165.136 210.363 165.136H174C171.991 165.136 170.363 163.508 170.363 161.5Z" fill="#D0D5DD" />
                        <path d="M224.909 161.5C224.909 159.492 226.537 157.864 228.545 157.864H264.909C266.917 157.864 268.545 159.492 268.545 161.5C268.545 163.508 266.917 165.136 264.909 165.136H228.545C226.537 165.136 224.909 163.508 224.909 161.5Z" fill="#D0D5DD" />
                    </g>
                    <circle cx="45.9999" cy="11.6818" r="10.9091" fill="#F2F4F7" />
                    <circle cx="39.4544" cy="238.591" r="15.2727" fill="#F2F4F7" />
                    <circle cx="316.545" cy="77.1364" r="15.2727" fill="#F2F4F7" />
                    <circle cx="292.545" cy="18.2273" r="8.72727" fill="#F2F4F7" />
                    <rect x="113.636" y="153.5" width="104.727" height="104.727" rx="52.3636" fill="#344054" fillOpacity="0.4" />
                    <path d="M166 205.864C173.23 205.864 179.091 200.003 179.091 192.773C179.091 185.543 173.23 179.682 166 179.682C158.77 179.682 152.909 185.543 152.909 192.773C152.909 200.003 158.77 205.864 166 205.864ZM174.727 192.773C174.727 197.593 170.82 201.5 166 201.5C161.18 201.5 157.272 197.593 157.272 192.773C157.272 187.953 161.18 184.045 166 184.045C170.82 184.045 174.727 187.953 174.727 192.773Z" fill="white" />
                    <path d="M192.182 227.682C192.182 232.045 187.818 232.045 187.818 232.045H144.182C144.182 232.045 139.818 232.045 139.818 227.682C139.818 223.318 144.182 210.227 166 210.227C187.818 210.227 192.182 223.318 192.182 227.682ZM187.818 227.667C187.812 226.59 187.147 223.364 184.187 220.404C181.341 217.558 175.988 214.591 166 214.591C156.011 214.591 150.659 217.558 147.812 220.404C144.852 223.364 144.188 226.59 144.182 227.667H187.818Z" fill="white" />
                    <defs>
                        <filter id="filter0_dd_7395_278473" x="3.09095" y="26.9545" width="323.636" height="229.818" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feMorphology radius="7.27273" operator="erode" in="SourceAlpha" result="effect1_dropShadow_7395_278473" />
                            <feOffset dy="14.5455" />
                            <feGaussianBlur stdDeviation="7.27273" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.04 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7395_278473" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feMorphology radius="7.27273" operator="erode" in="SourceAlpha" result="effect2_dropShadow_7395_278473" />
                            <feOffset dy="36.3636" />
                            <feGaussianBlur stdDeviation="21.8182" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0" />
                            <feBlend mode="normal" in2="effect1_dropShadow_7395_278473" result="effect2_dropShadow_7395_278473" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_7395_278473" result="shape" />
                        </filter>
                        <linearGradient id="paint0_linear_7395_278473" x1="48.1925" y1="182.186" x2="43.6294" y2="38.4103" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#E4E7EC" />
                            <stop offset="1" stopColor="#F9FAFB" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <h2 className={clsx(style.title)}>This feature is not activated.</h2>
            <p className={clsx(style.subTitle)}>
                You can activate this feature in your Profile Settings under the Subscriptions tab.
            </p>
            <Button className='outline-button' style={{ marginBottom: '32px' }}> <ChevronLeft /> Go back</Button>
            <Link to={"#"}><span className={clsx(style.supportext)}>Support</span></Link>
        </div>
    );
};

export default LockedError;