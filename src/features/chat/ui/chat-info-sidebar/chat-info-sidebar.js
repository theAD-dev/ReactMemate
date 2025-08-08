import React from 'react';
import { Plus, X } from 'react-bootstrap-icons';
import { is } from 'immutable';
import styles from './chat-info-sidebar.module.scss';

const ChatInfoSidebar = ({ userId, chatInfo, participants, closeSidebar }) => {
    const isGroup = chatInfo?.project_id || chatInfo?.job_number;
    const members = chatInfo?.participants?.map(participant => ({
        id: participant.id,
        name: participant.name,
        avatar: participant.avatar && participant.avatar !== 'no_photo.png' ? participant.avatar.startsWith('http')
            ? participant.avatar
            : `${process.env.REACT_APP_URL}/media/${participant.avatar}` : ""
    })) || [];

    const otherMember = members.find(member => member.id !== +userId);
    const groupAvatar = !isGroup ? otherMember?.avatar : "";
    const groupName = isGroup
        ? (chatInfo?.name || "Unknown Group")
        : (otherMember?.name || "Unknown User");



    return (
        <div className={styles.chatInfoSidebar}>
            <div className={styles.chatInfoHeader}>
                <button className={styles.closeButton} onClick={closeSidebar}>
                    <X size={32} />
                </button>
                <p className='font-16 mb-0'>{isGroup ? 'Group Info' : 'Contact Info'}</p>
            </div>
            <div className={styles.scrollContainer}>
                <div className={styles.chatInfoContent}>
                    <div className={styles.groupInfoAvatar}>
                        {groupAvatar ? (
                            <img src={groupAvatar} alt={groupName} />
                        ) : (
                            <div className={styles.groupAvatarPlaceholder}>
                                {groupName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                        )}
                    </div>
                    <p className='mb-0' style={{ fontSize: '20px' }}>{groupName}</p>
                    <p className='font-14 mb-0'>{isGroup ? chatInfo?.project_id || chatInfo?.job_number : ''}</p>
                </div>
                <div className={styles.participantsList}>
                    <h3 className='font-14' style={{ color: 'var(--Gray-600, #344952)' }}>{Object.keys(participants).length} members</h3>
                    <ul>
                        {isGroup && (
                            <button className={styles.addParticipantButton}>
                                <div className={styles.addParticipantAvatar}>
                                    <Plus size={20} color="#ffffff" />
                                </div>
                                <span className={styles.participantName}>Add member</span>
                            </button>
                        )}
                        {members.map(({ id, name, avatar }) => (
                            <li key={id} className={styles.participantItem}>
                                <div className={styles.participantAvatar}>
                                    {avatar ? (
                                        <img src={avatar} alt={name} />
                                    ) : (
                                        name.split(' ').map(n => n[0]).join('').slice(0, 2)
                                    )}
                                </div>
                                <span className={styles.participantName}>{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChatInfoSidebar;