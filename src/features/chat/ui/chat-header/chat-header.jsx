import React, { useEffect, useState } from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import styles from './chat-header.module.scss';

const ChatHeader = ({ chat, userId, setParticipants, onlineUsers, setShowSidebar }) => {
  const idWithName = React.useMemo(() => {
    const participants = chat?.participants || [];
    return participants?.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});
  }, [chat?.participants]);

  useEffect(() => {
    setParticipants(idWithName);
  }, [idWithName, setParticipants]);

  const isProject = chat.project_id || chat.job_number;
  const getChatGroupName = (group) => {
    const participant = group.participants.find((participant) => participant.id !== +userId);
    if (!participant) return { name: "Unknown User", avatar: '', id: null, status: 'offline' };
    return {
      name: participant?.name || "Unknown User",
      avatar: participant?.avatar && participant?.avatar !== 'no_photo.png' ? participant.avatar.startsWith('http')
        ? participant.avatar
        : `${process.env.REACT_APP_URL}/media/${participant.avatar}` : "",
      id: participant.id,
      status: onlineUsers.includes(participant.id) ? 'online' : 'offline'
    };
  };
  return (
    <div className={styles.chatHeader}>
      {isProject ? (
        <div className='d-flex w-100 justify-content-between align-items-center'>
          <div className={styles.projectHeader}>
            <span className={styles.projectReference}>{chat?.name || "Unknown"}</span>
            <span className={styles.projectNumber}>{chat?.project_id || chat.job_number || "Unknown"}</span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.menuButton}
              onClick={() => setShowSidebar(prev => !prev)}
            >
              <ThreeDotsVertical size={20} color="#667085" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.userContainer}>
            <div
              className={styles.userAvatar}
            >
              {getChatGroupName(chat)?.avatar ? <img src={getChatGroupName(chat)?.avatar} alt={'avatar'} /> : getChatGroupName(chat)?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{getChatGroupName(chat)?.name}</h2>
              <div className={styles.statusContainer}>
                <span
                  className={styles.statusIndicator}
                  data-status={getChatGroupName(chat).status}
                ></span>
                <span className={styles.statusText}>{getChatGroupName(chat).status}</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.menuButton}
              onClick={() => setShowSidebar(prev => !prev)}
            >
              <ThreeDotsVertical size={20} color="#667085" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;
