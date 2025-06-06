import React, { useEffect, useState } from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import styles from './chat-header.module.scss';

const ChatHeader = ({ chat, userId, setParticipants }) => {
  const [menuRef, setMenuRef] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const status = 'offline';
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

  const isProject = chat.project_id || chat.task_id;
  const getChatGroupName = (group) => {
    const participant = group.participants.find((participant) => participant.id !== +userId);
    return participant?.name || group?.name || "Unknown User";
  };
  return (
    <div className={styles.chatHeader}>
      {isProject ? (
        <div className={styles.projectHeader}>
          <span className={styles.projectReference}>{chat.projectRef}</span>
          <span className={styles.projectNumber}>{chat.project_id}</span>
        </div>
      ) : (
        <>
          <div className={styles.userContainer}>
            <div
              className={styles.userAvatar}
              style={chat.avatar ? { backgroundImage: `url(${chat.avatar})` } : {}}
            >
              {getChatGroupName(chat).split(' ').map(n => n[0]).join('')}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{getChatGroupName(chat)}</h2>
              <div className={styles.statusContainer}>
                <span
                  className={styles.statusIndicator}
                  data-status={status}
                ></span>
                <span className={styles.statusText}>{status}</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.menuButton}
              onClick={() => setMenuVisible(!menuVisible)}
              ref={menuRef}
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
