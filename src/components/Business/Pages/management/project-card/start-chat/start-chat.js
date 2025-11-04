import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ProgressSpinner } from 'primereact/progressspinner';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import style from './start-chat.module.scss';
import { useAuth } from '../../../../../../app/providers/auth-provider';

const StartChat = ({ projectId, project }) => {
    const socketRef = useRef(null);
    const { session } = useAuth();
    const navigate = useNavigate();
    const user_id = session?.desktop_user_id;
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Connect to socket.io server
        const socket = io(process.env.REACT_APP_CHAT_API_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });
        socketRef.current = socket;

        if (!user_id) return;

        socket.emit('register_user', { user_id, org_id: session?.organization?.id }, (res) => {
            if (res.status === 'success') {
                setIsConnected(true);
                console.log('User registered successfully');
            } else {
                toast.error('Failed to connect to chat server');
            }
        });
    }, [user_id, session]);

    const handleStartChat = () => {
        if (!user_id) return;
        if (!socketRef.current) return toast.error('Failed to start chat');

        if (socketRef.current) {
            setLoading(true);
            socketRef.current.emit('create_chat_group', {
                user_id: user_id,
                name: project?.reference,
                participants: [],
                project_id: projectId,
                job_id: null
            },
                (res) => {
                    console.log('res: ', res);
                    if (res.status === 'success' && res.chat_group_id) {
                        setLoading(false);
                        navigate(`/chat?id=${res.chat_group_id}`);
                    } else {
                        setLoading(false);
                        console.log("Error during creation chat group: ", res);
                        toast.error("Failed to create chat group");
                    }
                }
            );
        }
    };

    return (
        <Button className={clsx(style.chatButton, 'text-nowrap')} disabled={loading || !socketRef.current || !isConnected} onClick={handleStartChat}>
            {loading && <ProgressSpinner style={{ width: '20px', height: '20px', marginRight: '8px' }} />}
            Start Chat
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <g opacity="0.4">
                    <path d="M1.66663 11.3082V6.32484C1.66663 4.02484 3.53329 2.1665 5.83329 2.1665H14.1666C16.4666 2.1665 18.3333 4.02484 18.3333 6.32484V12.1415C18.3333 14.4332 16.4666 16.2915 14.1666 16.2915H12.9166C12.6583 16.2915 12.4083 16.4165 12.25 16.6248L11 18.2832C10.45 19.0165 9.54996 19.0165 8.99996 18.2832L7.74996 16.6248C7.61663 16.4415 7.31663 16.2915 7.08329 16.2915H5.83329C3.53329 16.2915 1.66663 14.4332 1.66663 12.1415V11.3082Z" fill="#1D2939" />
                    <path d="M1.66663 11.3082V6.32484C1.66663 4.02484 3.53329 2.1665 5.83329 2.1665H14.1666C16.4666 2.1665 18.3333 4.02484 18.3333 6.32484V12.1415C18.3333 14.4332 16.4666 16.2915 14.1666 16.2915H12.9166C12.6583 16.2915 12.4083 16.4165 12.25 16.6248L11 18.2832C10.45 19.0165 9.54996 19.0165 8.99996 18.2832L7.74996 16.6248C7.61663 16.4415 7.31663 16.2915 7.08329 16.2915H5.83329C3.53329 16.2915 1.66663 14.4332 1.66663 12.1415V11.3082Z" fill="url(#paint0_linear_16871_70907)" />
                </g>
                <path d="M14.1667 7.7915H5.83337C5.49171 7.7915 5.20837 7.50817 5.20837 7.1665C5.20837 6.82484 5.49171 6.5415 5.83337 6.5415H14.1667C14.5084 6.5415 14.7917 6.82484 14.7917 7.1665C14.7917 7.50817 14.5084 7.7915 14.1667 7.7915Z" fill="#292D32" />
                <path d="M14.1667 7.7915H5.83337C5.49171 7.7915 5.20837 7.50817 5.20837 7.1665C5.20837 6.82484 5.49171 6.5415 5.83337 6.5415H14.1667C14.5084 6.5415 14.7917 6.82484 14.7917 7.1665C14.7917 7.50817 14.5084 7.7915 14.1667 7.7915Z" fill="url(#paint1_linear_16871_70907)" />
                <path d="M10.8334 11.9585H5.83337C5.49171 11.9585 5.20837 11.6752 5.20837 11.3335C5.20837 10.9918 5.49171 10.7085 5.83337 10.7085H10.8334C11.175 10.7085 11.4584 10.9918 11.4584 11.3335C11.4584 11.6752 11.175 11.9585 10.8334 11.9585Z" fill="#292D32" />
                <path d="M10.8334 11.9585H5.83337C5.49171 11.9585 5.20837 11.6752 5.20837 11.3335C5.20837 10.9918 5.49171 10.7085 5.83337 10.7085H10.8334C11.175 10.7085 11.4584 10.9918 11.4584 11.3335C11.4584 11.6752 11.175 11.9585 10.8334 11.9585Z" fill="url(#paint2_linear_16871_70907)" />
                <defs>
                    <linearGradient id="paint0_linear_16871_70907" x1="1.66663" y1="2.1665" x2="18.3333" y2="18.8332" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#89F7FE" />
                        <stop offset="1" stopColor="#66A6FF" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_16871_70907" x1="5.20837" y1="6.5415" x2="5.52901" y2="8.99968" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#89F7FE" />
                        <stop offset="1" stopColor="#66A6FF" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_16871_70907" x1="5.20837" y1="10.7085" x2="5.68914" y2="13.1123" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#89F7FE" />
                        <stop offset="1" stopColor="#66A6FF" />
                    </linearGradient>
                </defs>
            </svg>
        </Button>
    );
};

export default StartChat;