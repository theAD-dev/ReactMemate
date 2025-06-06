import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './chat-layout.module.scss';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Loader from '../../../../shared/ui/loader/loader';
import ChatArea from '../chat-area/chat-area';
import ChatSidebar from '../chat-sidebar/chat-sidebar';

const ChatLayout = () => {
  const { session } = useAuth();
  const user_id = session?.desktop_user_id;
  const { trialHeight } = useTrialHeight();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [archivedVisible, setArchivedVisible] = useState(false);
  const [chatData, setChatData] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket.io server
    const socket = io(process.env.REACT_APP_CHAT_API_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    if (!user_id) return;

    socket.emit('register_user', { user_id }, (res) => {
      if (res.status === 'success') {
        console.log('User registered successfully');
      } else {
        console.error('Failed to register user:', res.error);
      }
    });

    // Fetch chat groups for user
    socket.emit('get_user_chat_groups', { user_id }, (res) => {
      if (res.status === 'success' && res.chat_groups) {
        // Convert array to object keyed by group id for easier access
        const chatGroups = {};
        res.chat_groups.forEach(group => {
          chatGroups[group.id] = group;
        });
        setChatData(chatGroups);
        setIsLoading(false);
      }
    });

    // Listen for chat group updates
    socket.on('get_user_chat_groups_response', (payload) => {
      if (payload.status === 'success' && payload.chat_groups) {
        const chatGroups = {};
        payload.chat_groups.forEach(group => {
          chatGroups[group.id] = group;
        });
        setChatData(chatGroups);
      }
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatId && chatData[chatId]) {
      setCurrentChat(chatData[chatId]);
    } else {
      setCurrentChat(null);
    }
  }, [chatId, chatData]);

  return (
    <div className="container-fluid px-0">
      <div className={styles.chatContainer} style={{ height: `calc(100vh - 130px - ${trialHeight}px)` }}>
        <ChatSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          archivedVisible={archivedVisible}
          setArchivedVisible={setArchivedVisible}
          chatData={chatData}
          userId={user_id}
        />
        <ChatArea
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          socket={socketRef.current}
          userId={user_id}
          chatId={chatId}
        />
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ChatLayout;
