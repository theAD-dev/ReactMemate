import React from 'react';
import { Link } from 'react-router-dom';
import styles from './user-list.module.scss';

const UserList = ({ chatData, searchQuery, showArchived, userId }) => {
  // Filter users based on search query
  const filteredUsers = Object.entries(chatData)
    .filter(([, group]) => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? true : !group.archived;
      return matchesSearch && matchesArchived;
    });

  // Helper to get last message and unread count
  const getLastMessage = (group) => {
    return group.last_message.message || null;
  };

  const getUnreadCount = (group) => {
    if (!group.messages || !userId) return 0;
    // Assume each message has a seen_by: [userId] array
    return group.messages.filter(msg => !msg.seen_by || !msg.seen_by.includes(userId)).length;
  };

  return (
    <div className={styles.userList}>
      {filteredUsers.map(([id, group]) => {
        const lastMessage = getLastMessage(group);
        const unreadCount = getUnreadCount(group);
        return (
          <Link to={`?id=${id}`} key={id} className={styles.userItem}>
            <div className={styles.userItemContent}>
              <div className={styles.userAvatarWrapper}>
                {/* Optionally show online indicator if available */}
                <div className={styles.userAvatar}>
                  {group.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{group.name}</span>
                <p className={styles.lastMessage}>
                  {lastMessage
                    ? `${lastMessage.sender_name || ''}: ${lastMessage ? lastMessage.substring(0, 30) : ''}`
                    : 'No messages yet'}
                </p>
              </div>
              <span className={styles.lastMessageTime}>
                {lastMessage && lastMessage.sent_at
                  ? new Date(Number(lastMessage.sent_at) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </span>
              {unreadCount > 0 && (
                <span className={styles.unreadCount}>{unreadCount}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UserList;
