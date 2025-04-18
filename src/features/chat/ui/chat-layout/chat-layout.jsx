import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ChatSidebar from '../chat-sidebar/chat-sidebar';
import ChatArea from '../chat-area/chat-area';
import styles from './chat-layout.module.scss';

const ChatLayout = () => {
  const { trialHeight } = useTrialHeight();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("id");

  const [activeTab, setActiveTab] = useState('users');
  const [archivedVisible, setArchivedVisible] = useState(false);

  // Mock data for demonstration
  const mockChatData = {
    1: {
      name: "Andi Lane",
      messages: [
        { sender: "You", text: "Awesome! Thanks. I'll look at this today.", time: "Friday 2:20pm" },
        { sender: "Andi Lane", text: "No rush though — we still have to wait for Lana's designs.", time: "Friday 2:20pm" },
        {
          sender: "Andi Lane",
          text: "Hey Olivia, can you please review the latest design when you can?",
          time: "Today",
          attachment: {
            name: "Latest design screenshot.jpg",
            size: "1.2 MB",
            type: "jpg"
          }
        },
        { sender: "You", text: "Sure thing, I'll have a look today. They're looking great!", time: "Friday 2:20pm" },
      ],
      avatar: "https://via.placeholder.com/40",
      status: "online"
    },
    2: {
      name: "Jane Cooper",
      status: "offline",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "You", text: "Sure thing, I'll have a look today. They're looking great!", time: "43min ago" }
      ],
      projectRef: "JC123",
      projectName: "Holiday 'Giving Back Together' Social Ads",
      archived: false
    },
    3: {
      name: "Marvin McKinney",
      status: "offline",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "You", text: "Sure thing, I'll have a look today. They're looking great!", time: "32min ago" }
      ],
      projectRef: "MM456",
      projectName: "Summer Product Launch",
      archived: true
    },
    4: {
      name: "Phoenix Baker",
      status: "online",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "You", text: "Sure thing, I'll have a look today. They're looking great!", time: "12min ago" }
      ],
      projectRef: "PB789",
      projectName: "Spring Evergreen Campaign",
      archived: false
    },
    5: {
      name: "John Doe",
      status: "offline",
      avatar: "https://via.placeholder.com/40",
      messages: [
        { sender: "You", text: "Sure thing, I'll have a look today. They're looking great!", time: "22min ago" }
      ],
      projectRef: "JD456",
      projectName: "Annual Fall Promotion Ads Project",
      archived: true
    },
  };

  const currentChat = chatId ? mockChatData[chatId] : null;

  return (
    <div className="container-fluid px-0">
      <div className={styles.chatContainer} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
        <ChatSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          archivedVisible={archivedVisible}
          setArchivedVisible={setArchivedVisible}
          chatData={mockChatData}
        />

        <ChatArea
          currentChat={currentChat}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
