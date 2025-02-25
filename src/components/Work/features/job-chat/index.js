import React, { useRef } from 'react';
import { Chat } from 'react-bootstrap-icons';
import style from './job-chat.module.scss';

const JobChat = () => {
    const op = useRef(null);

    return (
        <>
            <button className={`${style.floatButton} border-0`}>
                <Chat color='#344054' onClick={(e) => {}}/>
            </button>
            
        </>

    );
};

export default JobChat;