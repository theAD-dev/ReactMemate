import React from 'react';
import { Link } from 'react-router-dom';
import styles from './project-list.module.scss';

const ProjectList = ({ chatData, searchQuery, showArchived }) => {
  // Filter and transform data to project-based view
  const projectData = Object.entries(chatData)
    .filter(([_, user]) => user.project_id && user.task_id) // Only include entries with project info
    .map(([id, user]) => ({
      id,
      projectRef: user.projectRef,
      projectName: user.projectName,
      lastMessage: user.messages && user.messages.length > 0
        ? user.messages[user.messages.length - 1].text
        : "No messages yet",
      lastMessageTime: user.messages && user.messages.length > 0
        ? user.messages[user.messages.length - 1].time
        : "",
      avatar: user.avatar,
      name: user.name,
      archived: user.archived || false
    }))
    .filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? true : !project.archived;
      return matchesSearch && matchesArchived;
    });

  return (
    <div className={styles.projectList}>
      {projectData.map((project) => (
        <Link to={`?id=${project.id}`} key={project.id} className={styles.projectItem}>
          <div className={styles.projectHeader}>
            <div className={styles.projectInfo}>
              <div className={styles.projectTitleRow}>
                <span className={styles.projectName}>{project.projectName}</span>
              </div>
              <span className={styles.projectRef}>{project.projectRef}</span>
            </div>
            <div className='d-flex flex-column gap-1'>
              <span className={styles.lastMessageTime}>{project.lastMessageTime}</span>
              {project.archived && <span className={styles.archivedBadge}>Archived</span>}
            </div>
          </div>

          <div className={styles.messagePreviewContainer}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{project.name.split(' ').map(n => n[0]).join('')}</span>
              <span className={styles.userFullName}>{project.name}</span>
            </div>
            <p className={styles.lastMessage}>
              You: {project.lastMessage}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;
