import React from 'react';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import clsx from 'clsx';
import style from './unknown.module.scss';
import SearchIcon from "../../../assets/images/icon/searchIcon.png";

const UnknownError = (props) => {
    const routeError = useRouteError();
    const boundaryError = props?.error;
    const reset = props?.resetErrorBoundary;

    // Prioritize error from props (ErrorBoundary), fallback to route error
    const error = boundaryError || routeError;

    // Normalize the error
    let errorMessage = "An unexpected error occurred.";
    let status = 500;
    let statusText = "Internal Server Error";

    if (isRouteErrorResponse(error)) {
        status = error.status;
        statusText = error.statusText;
        console.log('Route error: ', statusText);
        errorMessage = error.data?.message || error.statusText || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;

        // Auto-refresh on Chunk Load Error
        if (error.name === 'ChunkLoadError' || error.message?.includes('Loading chunk')) {
            console.warn("Detected Chunk Load Error. Reloading...");
            window.location.reload();
        }
    } else if (typeof error === "string") {
        errorMessage = error;
    }

    return (
        <div className={clsx(style.container)}>
            <div className='position-relative d-flex flex-column'>
                <svg width="228" height="228" viewBox="0 0 228 228" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="114" cy="114.227" r="113.455" fill="#EAECF0" />
                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                        fontSize="110" fontWeight={"bold"} fontFamily="Arial, sans-serif" fill="url(#gradient)">
                        {status}
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
            <div className='border rounded p-2 mb-4 w-50 text-center' style={{ overflow: 'auto', maxHeight: '200px' }}>
                <p className={clsx(style.errorMessage)}>
                    {errorMessage}
                </p>
            </div>

            {reset ? (
                <Button className='outline-button mb-4' onClick={reset}>
                    <ChevronLeft /> Go back
                </Button>
            ) : (
                <Link to={"/"}>
                    <Button className='outline-button' style={{ marginBottom: '32px' }}>
                        <ChevronLeft /> Go back
                    </Button>
                </Link>
            )}
        </div>
    );
};

export default UnknownError;