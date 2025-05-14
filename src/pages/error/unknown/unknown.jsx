import React from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useRouteError } from "react-router-dom";
import clsx from 'clsx';
import style from './unknown.module.scss';
import SearchIcon from "../../../assets/images/icon/searchIcon.png";
import Support from '../../../shared/ui/support/support';

const UnknownError = () => {
    const error = useRouteError();

    // Normalize error message
    const errorMessage = error instanceof Error
        ? error.message
        : typeof error === "string"
            ? error
            : "An unexpected error occurred.";

    const [visible, setVisible] = React.useState(false);
    const openSupportModal = () => {
        setVisible(true);
    };

    // Determine the fallback message
    const fallbackMessage = error ? "Sorry, something went wrong. Please try again later." : "Everything is running smoothly.";

    return (
        <div className={clsx(style.container)}>
            <div className='position-relative d-flex flex-column'>
                <svg width="228" height="228" viewBox="0 0 228 228" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="114" cy="114.227" r="113.455" fill="#EAECF0" />
                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                        fontSize="110" fontWeight={"bold"} fontFamily="Arial, sans-serif" fill="url(#gradient)">
                        500
                    </text>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="228" y2="228" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D0D5DD" />
                            <stop offset="0.35" stopColor="white" />
                        </linearGradient>
                    </defs>
                </svg>

                <img className={clsx(style.searchImg)} src={SearchIcon} alt='search' />
            </div>

            <h2 className={clsx(style.title)}>Unknown error</h2>

            {/* Display fallback or actual error message */}
            <p className={clsx(style.subTitle)}>
                {fallbackMessage}
            </p>

            {/* Show actual error message */}
            <div className='border rounded p-3 mb-4'>
                {error && (
                    <p className={clsx(style.errorMessage)}>
                        {errorMessage}
                    </p>
                )}
            </div>

            <Link to={"/"}>
                <Button className='outline-button' style={{ marginBottom: '32px' }}>
                    <ChevronLeft /> Go back
                </Button>
            </Link>

            <Link to={"#"} onClick={openSupportModal}>
                <span className={clsx(style.supportext)}>Support</span>
            </Link>

            <Support visible={visible} setVisible={setVisible} />
        </div>
    );
};

export default UnknownError;