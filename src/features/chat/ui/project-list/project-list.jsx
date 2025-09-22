import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import styles from './project-list.module.scss';

const ProjectList = ({ chatData, searchQuery, showArchived, userId }) => {
  console.log('chatData: ', chatData);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get("id");

  // Filter and transform data to project-based view
  const projectData = Object.entries(chatData).filter(([, group]) => group.project_id || group.job_number)
    .sort((a, b) => {
      const lastMessageA = a[1].last_message?.sent_at || 0;
      const lastMessageB = b[1].last_message?.sent_at || 0;
      return lastMessageB - lastMessageA; // Sort by last message time, most recent
    })
    .filter(([, group]) => {
      const groupName = group?.name || "Unknown Group";
      const matchesSearch = groupName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived || !(group.archived_by?.length > 0);
      return matchesSearch && matchesArchived;
    });

  // Helper to get last message and unread count
  const getLastMessage = (group) => {
    return group?.last_message?.message || null;
  };

  const getUnreadCount = (group) => {
    return group?.unread_count || 0;
  };

  const getSenderName = (group) => {
    const lastMessageDetails = group?.last_message;
    if (!lastMessageDetails) return '';
    const sender = group.participants.find((participant) => participant.id === lastMessageDetails.sender);
    if (sender.id === userId) return 'You: ';
    return `${sender?.name}: ` || "Unknown Sender: `";
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
    <div className={styles.projectList}>
      {projectData.map(([id, group]) => {
        const lastMessage = getLastMessage(group);
        const lastMessageTimeAgo = timeAgo(group?.last_message?.sent_at);
        const unreadCount = getUnreadCount(group);
        const sender = getSenderName(group);
        const reference = group?.name;
        const number = group?.job_number || group?.project_id;
        const members = group?.participants?.map(participant => ({
          id: participant.id,
          name: participant.name,
          avatar: participant.photo && participant.photo !== 'no_photo.png' ? participant.photo.startsWith('http')
          ? participant.photo
          : `${process.env.REACT_APP_URL}${participant.photo}` : ""
        })) || [];
        console.log('members: ', group?.participants, members);
        return (
          <Link to={`?id=${id}`} key={id} className={clsx(styles.projectItem, { [styles.active]: chatId == id })}>
            <div className={styles.projectHeader}>
              <div className={styles.projectInfo}>
                <div className={styles.projectTitleRow}>
                  <span className={styles.projectName}>{reference}</span>
                </div>
                <span className={styles.projectRef}>{number}</span>
              </div>
              <div className='d-flex flex-column gap-2'>
                <span className={styles.lastMessageTime}>{lastMessageTimeAgo}</span>
                <div className='d-flex align-items-center justify-content-end gap-2'>
                  {group.archived_by?.length ? <span className={styles.archivedBadge}>Archived</span> : null}
                  {unreadCount > 0 && <span className={styles.unreadCount}>{unreadCount}</span>}
                </div>
              </div>
            </div>

            <div className={styles.messagePreviewContainer}>
              <div className={styles.userInfo}>
                {/* <span className={styles.userName}>{project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span> */}
                {/* <span className={styles.userFullName}>{project.name}</span> */}
                <AvatarGroup>
                  {members.map((member) => (
                    <Avatar key={member.id} image={member.avatar} size="small" shape="circle" />
                  ))}
                </AvatarGroup>
              </div>
              <p className={clsx(styles.lastMessage, 'text-start')}>
                {lastMessage
                  ? `${sender} ${lastMessage ? lastMessage.substring(0, 30) : ''}`
                  : 'No messages yet'}
              </p>
            </div>
          </Link>
        );
      }
      )}
    </div>
  );
};

export default ProjectList;
