import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './user-list.module.scss';

const UserList = ({ chatData, searchQuery, showArchived, userId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("id");

  // Filter users based on search query
  const filteredUsers = Object.entries(chatData)
    .filter(([, group]) => {
      const participant = group.participants.find((participant) => participant.id !== +userId);
      const groupName = participant?.name || group?.name || "Unknown User";
      const matchesSearch = groupName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? true : !group.archived;
      return matchesSearch && matchesArchived;
    });

  // Helper to get last message and unread count
  const getLastMessage = (group) => {
    return group?.last_message?.message || null;
  };

  const getUnreadCount = (group) => {
    if (!group.messages || !userId) return 0;
    return group.messages.filter(msg => !msg.seen_by || !msg.seen_by.includes(userId)).length;
  };

  const getChatGroupName = (group) => {
    const participant = group.participants.find((participant) => participant.id !== +userId);
    return participant?.name || group?.name || "Unknown User";
  };

  const getSenderName = (group) => {
    const lastMessageDetails = group?.last_message;
    if (!lastMessageDetails) return '';
    const sender = group.participants.find((participant) => participant.id === lastMessageDetails.sender);
    if (sender.id === userId) return 'You: ';
    return `${sender?.name}: ` || "Unknown Sender: `";
  };

  return (
    <div className={styles.userList}>
      {filteredUsers.map(([id, group]) => {
        const lastMessage = getLastMessage(group);
        const unreadCount = getUnreadCount(group);
        const sender = getSenderName(group);
        const groupName = getChatGroupName(group);
        return (
          <Link to={`?id=${id}`} key={id} className={clsx(styles.userItem, { [styles.active]: chatId == id })}>
            <div className={styles.userItemContent}>
              <div className={styles.userAvatarWrapper}>
                {/* Optionally show online indicator if available */}
                <div className={styles.userAvatar}>
                  {groupName?.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{groupName}</span>
                <p className={styles.lastMessage}>
                  {lastMessage
                    ? `${sender} ${lastMessage ? lastMessage.substring(0, 30) : ''}`
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
