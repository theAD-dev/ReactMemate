import React from 'react';
import { Link } from 'react-router-dom';
import styles from './user-list.module.scss';

const UserList = ({ chatData, searchQuery, showArchived }) => {
  // Filter users based on search query
  const filteredUsers = Object.entries(chatData)
    .filter(([_, user]) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? true : !user.archived;
      return matchesSearch && matchesArchived;
    });

  return (
    <div className={styles.userList}>
      {filteredUsers.map(([id, user]) => (
        <Link to={`?id=${id}`} key={id} className={styles.userItem}>
          <div className={styles.userItemContent}>
            <div className={styles.userAvatarWrapper}>
              {user.status === 'online' && <div className={styles.onlineIndicator}></div>}
              <div className={styles.userAvatar}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <p className={styles.lastMessage}>
                {user.messages && user.messages.length > 0
                  ? `You: ${user.messages[user.messages.length - 1].text.substring(0, 30)}...`
                  : "No messages yet"}
              </p>
            </div>
            <span className={styles.lastMessageTime}>{user.lastMessageTime || '4min ago'}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserList;
