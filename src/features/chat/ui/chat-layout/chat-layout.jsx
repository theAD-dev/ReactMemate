import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import styles from './chat-layout.module.scss';
import { getTeamDesktopUser, getTeamMobileUser } from '../../../../APIs/team-api';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import Loader from '../../../../shared/ui/loader/loader';
import ChatArea from '../chat-area/chat-area';
import ChatSidebar from '../chat-sidebar/chat-sidebar';

const ChatLayout = () => {
  const { session } = useAuth();
  const user_id = session?.desktop_user_id;
  const organization_id = session?.organization?.id;
  const { trialHeight } = useTrialHeight();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("id");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [archivedVisible, setArchivedVisible] = useState(false);
  const [chatData, setChatData] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [users, setUsers] = useState({});
  const socketRef = useRef(null);

  const formatPrivateGroup = (users) => {
    const chatGroups = {};
    let counter = 1;
    users.forEach(group => {
      let modifiedGroup = {
        id: group?.group_id,
        archived_by: [],
        unread_count: group?.unread_count || 0,
        participants: [
          {
            id: group.id,
            name: `${group.full_name}`,
            avatar: group.avatar || '',
          },
          {
            id: user_id,
            name: session?.full_name || 'You',
            avatar: session?.has_photo ? session?.photo : ''
          }
        ],
        last_message: group?.last_message
      };
      if (modifiedGroup.id) chatGroups[modifiedGroup.id] = modifiedGroup;
      else {
        chatGroups[`private_group_${counter++}`] = modifiedGroup;
      }
    });
    return chatGroups;
  };

  const updatePrivateGroupChatId = (oldKey, newKey) => {
    setChatData((prevChatData) => {
      const updatedChatData = { ...prevChatData };
      if (oldKey && newKey && updatedChatData[oldKey]) {
        updatedChatData[newKey] = updatedChatData[oldKey]; // copy value to new key
        delete updatedChatData[oldKey]; // remove old key
      }
      return updatedChatData;
    });
    navigate(`/chat?id=${newKey}`, { replace: true });
  };

  const refetchGroupChats = () => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    socket.emit('get_user_chat_groups', { user_id }, (res) => {
      if (res.status === 'success' && res.chat_groups) {
        const chatGroups = {};
        res.chat_groups.forEach(group => {
          chatGroups[group.id] = group;
        });
        console.log('groups chat groups : ', chatGroups);
        setChatData(prevChatData => ({ ...prevChatData, ...chatGroups }));
      }
    });
  };

  useEffect(() => {
    // Connect to socket.io server
    const socket = io(process.env.REACT_APP_CHAT_API_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    if (!user_id) return toast.error('User ID is not available');
    if (!organization_id) return toast.error('Organization ID is not available');

    socket.emit('register_user', { user_id, org_id: organization_id }, (res) => {
      if (res.status === 'success') {
        console.log('User registered successfully');
      } else {
        toast.error('Failed to connect to chat server');
      }
    });

    // Fetch chat groups for user
    socket.emit('get_user_chat_groups', { user_id }, (res) => {
      if (res.status === 'success' && res.chat_groups) {
        const chatGroups = {};
        res.chat_groups.forEach(group => {
          chatGroups[group.id] = group;
        });
        console.log('groups chat groups : ', chatGroups);
        setChatData(prevChatData => ({ ...prevChatData, ...chatGroups }));
        setIsLoading(false);
      }
    });

    // Fetch private chat groups
    socket.emit('get_organization_users', { user_id, organization_id: organization_id }, (res) => {
      if (res.status === 'success' && res?.users?.length) {
        const chatGroups = formatPrivateGroup(res.users);
        console.log('private chatGroups: ', chatGroups);
        setChatData((prevChatData) => ({ ...prevChatData, ...chatGroups }));
      }
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [user_id, organization_id, session]);

  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
    socket.on('presence_list', (res) => {
      if (res.online) setOnlineUsers(res.online);
    });

    socket.on('presence_update', (res) => {
      if (res.user_id && res.status === 'offline') {
        setOnlineUsers((prev) => {
          return prev.filter(user => user !== res.user_id);
        });
      } else if (res.user_id && res.status === 'online') {
        setOnlineUsers((prev) => {
          return [...new Set([...prev, res.user_id])];
        });
      }
    });

    return () => {
      socket.off('presence_list');
      socket.off('presence_update');
    };
  }, [socketRef]);

  useEffect(() => {
    if (chatId && chatData[chatId]) {
      const isProject = chatData[chatId].project_id || chatData[chatId].job_number;
      if (isProject) setActiveTab('projects');
      else setActiveTab('users');
      setCurrentChat(chatData[chatId]);
    } else {
      setCurrentChat(null);
    }
  }, [chatId, chatData]);

  useEffect(() => {
    const getDesktopUser = async () => {
      try {
        const desktop_users = await getTeamDesktopUser();
        let activeUsers = desktop_users?.users?.filter((user) => user.is_active);
        const userMap = {};
        activeUsers.forEach(user => {
          userMap[user.id] = user;
        });
        setUsers(prevUsers => ({ ...prevUsers, ...userMap }));
      } catch (err) {
        console.log(err);
      }
    };

    const getMobileUser = async () => {
      try {
        const mobile_users = await getTeamMobileUser();
        const activeUsers = mobile_users?.users.filter((user) => user.status !== 'disconnected');
        const userMap = {};
        activeUsers.forEach(user => {
          userMap[user.id] = user;
        });
        setUsers(prevUsers => ({ ...prevUsers, ...userMap }));
      } catch (err) {
        console.log(err);
      }
    };

    getDesktopUser();
    getMobileUser();
  }, []);

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
          onlineUsers={onlineUsers}
        />
        <ChatArea
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          socket={socketRef.current}
          userId={user_id}
          chatId={chatId}
          onlineUsers={onlineUsers}
          setChatData={setChatData}
          users={users}
          updatePrivateGroupChatId={updatePrivateGroupChatId}
          refetchGroupChats={refetchGroupChats}
        />
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ChatLayout;
