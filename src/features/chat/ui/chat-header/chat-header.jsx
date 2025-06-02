import React from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import styles from './chat-header.module.scss';

const ChatHeader = ({ chat, onMenuToggle, menuRef }) => {
  const status = 'offline';
  const isProject = chat.projectRef && chat.projectName;
  return (
    <div className={styles.chatHeader}>
      {isProject ? (
        <div className={styles.projectHeader}>
          <span className={styles.projectReference}>{chat.projectRef}</span>
          <span className={styles.projectNumber}>{chat.projectName}</span>
        </div>
      ) : (
        <>
          <div className={styles.userContainer}>
            <div
              className={styles.userAvatar}
              style={chat.avatar ? { backgroundImage: `url(${chat.avatar})` } : {}}
            >
              {chat.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{chat.name}</h2>
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
              onClick={onMenuToggle}
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
