import React, { useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import clsx from 'clsx';
import UserList from '../user-list/user-list';
import ProjectList from '../project-list/project-list';
import styles from './chat-sidebar.module.scss';

const ChatSidebar = ({ 
  activeTab, 
  setActiveTab, 
  archivedVisible, 
  setArchivedVisible,
  chatData
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.headerFirstRow}>
          <div className="d-flex align-items-center gap-2">
            <h1 className={styles.sidebarTitle}>Messages</h1>
            <div className={styles.unreadCount}>
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                <circle cx="4" cy="4.5" r="3" fill="#17B26A" />
              </svg>
              <span>40</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <InputSwitch 
              checked={archivedVisible}
              onChange={(e) => setArchivedVisible(e.value)}
            />
            <h1 className={styles.archivedLabel}>Archived</h1>
          </div>
        </div>
        
        <div className={styles.headerSecondRow}>
          <IconField iconPosition="left" className="border w-100 rounded text-start">
            <InputIcon style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
              </svg>
            </InputIcon>
            <InputText 
              placeholder="Search" 
              style={{ padding: '10px 10px 10px 20px' }} 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </IconField>
        </div>
        
        <div className={styles.headerThirdRow}>
          <div 
            className={clsx(styles.tabButton, { [styles.active]: activeTab === 'users' })}
            onClick={() => setActiveTab('users')}
          >
            <span>Users</span>
            <div>12</div>
          </div>
          <div 
            className={clsx(styles.tabButton, { [styles.active]: activeTab === 'projects' })}
            onClick={() => setActiveTab('projects')}
          >
            <span>Projects</span>
            <div>4</div>
          </div>
        </div>
      </div>
      
      <div className={styles.listContainer}>
        {activeTab === 'users' ? (
          <UserList 
            chatData={chatData} 
            searchQuery={searchQuery}
            showArchived={archivedVisible}
          />
        ) : (
          <ProjectList 
            chatData={chatData} 
            searchQuery={searchQuery}
            showArchived={archivedVisible}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
