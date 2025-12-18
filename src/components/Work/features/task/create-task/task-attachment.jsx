import React, { useRef } from 'react';
import styles from './create-task.module.scss';

const TaskAttachment = () => {
    const buttonRef = useRef();
    return (
        <>
            <button
                className={styles.attachButton}
                type="button"
                aria-label="Attach file"
                ref={buttonRef}
                style={{ padding: '4px' }}
            >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.0833 8.33333L9.16667 17.25C8.17221 18.2444 6.82407 18.8042 5.41667 18.8042C4.00926 18.8042 2.66112 18.2444 1.66667 17.25C0.672214 16.2556 0.112446 14.9074 0.112446 13.5C0.112446 12.0926 0.672214 10.7444 1.66667 9.75L10.5833 0.833329C11.2486 0.167998 12.1514 -0.149151 13.0833 0.0666624C14.0153 0.282476 14.8056 0.947998 15.25 1.83333C15.6944 2.71866 15.7361 3.75 15.3333 4.66666C14.9306 5.58333 14.1389 6.29166 13.1667 6.5L5.08333 14.5833C4.75 14.9167 4.31944 15.0833 3.83333 15.0833C3.34722 15.0833 2.91667 14.9167 2.58333 14.5833C2.25 14.25 2.08333 13.8194 2.08333 13.3333C2.08333 12.8472 2.25 12.4167 2.58333 12.0833L9.16667 5.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </>
    );
};

export default TaskAttachment;