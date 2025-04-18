import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChatLayout } from '../../../features/chat';

const Chat = () => {
    return (
        <>
            <Helmet>
                <title>MeMate - Chat</title>
            </Helmet>
            <ChatLayout />
        </>
    );
};

export default Chat;