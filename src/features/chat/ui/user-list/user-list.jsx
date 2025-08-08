import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './user-list.module.scss';

const UserList = ({ chatData, searchQuery, showArchived, userId }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("id");

  // Filter users based on search query
  const filteredUsers = Object.entries(chatData)
    .filter(([, group]) => !group.project_id && !group.job_number)
    .filter(([, group]) => {
      const participant = group.participants.find((participant) => participant.id !== +userId);
      const groupName = participant?.name || group?.name || "Unknown User";
      const matchesSearch = groupName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? true : !group.archived;
      return matchesSearch && matchesArchived;
    });

  // Helper to get last message and unread count
  const getLastMessage = (group) => {
    return group?.last_message || null;
  };

  const getUnreadCount = (group) => {
    return group?.unread_count || 0;
  };

  const getChatGroupName = (group) => {
    const participant = group.participants.find((participant) => participant.id !== +userId);
    return participant?.name || group?.name || "Unknown User";
  };

  const getSenderName = (group) => {
    const lastMessageDetails = group?.last_message;
    if (!lastMessageDetails) return '';
    const sender = group.participants.find((participant) => participant.id === lastMessageDetails.sender);
    if (sender?.id === userId) return 'You: ';
    return sender?.name ? `${sender?.name}: ` : "";
  };

  const timeAgo = (unixTimestamp) => {
    if (!unixTimestamp) return '';
    const now = Date.now(); // Current time in milliseconds
    const then = unixTimestamp * 1000; // Convert seconds to milliseconds
    const diff = now - then;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className={styles.userList}>
      {filteredUsers.map(([id, group]) => {
        const lastMessage = getLastMessage(group);
         const lastMessageTimeAgo = timeAgo(group?.last_message?.sent_at);
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
                  {lastMessage?.message
                    ? `${sender} ${lastMessage?.message ? lastMessage?.message?.substring(0, 30) : ''}`
                    : 'No messages yet'}
                </p>
              </div>
              <span className={styles.lastMessageTime}>
                {lastMessageTimeAgo
                  ? lastMessageTimeAgo
                  : ''}
              </span>
              {unreadCount > 0 && (
                <span className={styles.unreadCount}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UserList;
