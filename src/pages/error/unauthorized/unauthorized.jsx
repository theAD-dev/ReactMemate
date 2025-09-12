import React from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from './unauthorized.module.scss';

const UnauthorizedError = () => {
    return (
        <div className={clsx(style.container)}>
            <div className='position-relative d-flex flex-column'>
                <svg width="332" height="266" viewBox="0 0 332 266" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="166" cy="117.227" r="113.455" fill="#EAECF0" />
                    <g filter="url(#filter0_dd_7395_278213)">
                        <path d="M169.491 38.6818C145.987 38.6818 125.195 50.2963 112.543 68.0991C108.411 67.1247 104.102 66.6091 99.6729 66.6091C68.8253 66.6091 43.8184 91.616 43.8184 122.464C43.8184 153.311 68.8253 178.318 99.6729 178.318L239.309 178.318C266.301 178.318 288.182 156.437 288.182 129.445C288.182 102.454 266.301 80.5727 239.309 80.5727C237.392 80.5727 235.501 80.6831 233.641 80.8979C222.942 56.0659 198.247 38.6818 169.491 38.6818Z" fill="#F9FAFB" />
                        <ellipse cx="99.6729" cy="122.464" rx="55.8545" ry="55.8545" fill="url(#paint0_linear_7395_278213)" />
                        <circle cx="169.491" cy="108.5" r="69.8182" fill="url(#paint1_linear_7395_278213)" />
                        <ellipse cx="239.309" cy="129.445" rx="48.8727" ry="48.8727" fill="url(#paint2_linear_7395_278213)" />
                    </g>
                    <circle cx="46.0002" cy="45.2273" r="10.9091" fill="#F2F4F7" />
                    <circle cx="39.4546" cy="241.591" r="15.2727" fill="#F2F4F7" />
                    <circle cx="316.545" cy="80.1364" r="15.2727" fill="#F2F4F7" />
                    <circle cx="292.546" cy="21.2273" r="8.72727" fill="#F2F4F7" />
                    <rect x="113.636" y="139.045" width="104.727" height="104.727" rx="52.3636" fill="#344054" fillOpacity="0.4" />
                    <path d="M166 191.409C173.23 191.409 179.091 185.548 179.091 178.318C179.091 171.088 173.23 165.227 166 165.227C158.77 165.227 152.909 171.088 152.909 178.318C152.909 185.548 158.77 191.409 166 191.409ZM174.727 178.318C174.727 183.138 170.82 187.045 166 187.045C161.18 187.045 157.273 183.138 157.273 178.318C157.273 173.498 161.18 169.591 166 169.591C170.82 169.591 174.727 173.498 174.727 178.318Z" fill="white" />
                    <path d="M192.182 213.227C192.182 217.591 187.818 217.591 187.818 217.591H144.182C144.182 217.591 139.818 217.591 139.818 213.227C139.818 208.864 144.182 195.773 166 195.773C187.818 195.773 192.182 208.864 192.182 213.227ZM187.818 213.212C187.812 212.135 187.147 208.909 184.187 205.949C181.341 203.103 175.989 200.136 166 200.136C156.011 200.136 150.659 203.103 147.813 205.949C144.853 208.909 144.188 212.135 144.182 213.212H187.818Z" fill="white" />
                    <defs>
                        <filter id="filter0_dd_7395_278213" x="0.181993" y="38.6818" width="331.637" height="226.909" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feMorphology radius="8.72727" operator="erode" in="SourceAlpha" result="effect1_dropShadow_7395_278213" />
                            <feOffset dy="17.4545" />
                            <feGaussianBlur stdDeviation="8.72727" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.03 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7395_278213" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feMorphology radius="8.72727" operator="erode" in="SourceAlpha" result="effect2_dropShadow_7395_278213" />
                            <feOffset dy="43.6364" />
                            <feGaussianBlur stdDeviation="26.1818" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.08 0" />
                            <feBlend mode="normal" in2="effect1_dropShadow_7395_278213" result="effect2_dropShadow_7395_278213" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_7395_278213" result="shape" />
                        </filter>
                        <linearGradient id="paint0_linear_7395_278213" x1="56.7846" y1="85.5598" x2="155.527" y2="178.318" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D0D5DD" />
                            <stop offset="0.350715" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_7395_278213" x1="115.881" y1="62.3701" x2="239.309" y2="178.318" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D0D5DD" />
                            <stop offset="0.350715" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="paint2_linear_7395_278213" x1="201.782" y1="97.1545" x2="288.182" y2="178.318" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D0D5DD" />
                            <stop offset="0.350715" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <h2 className={clsx(style.title)}>User does not have permissions</h2>
            <p className={clsx(style.subTitle)}>
                You lack the necessary permissions to access this feature.
            </p>
            <Link to={"/"}><Button className='outline-button' style={{ marginBottom: '32px' }}> <ChevronLeft /> Go back</Button></Link>
            <Link to={"#"}><span className={clsx(style.supportext)}>Support</span></Link>
        </div>
    );
};

export default UnauthorizedError;