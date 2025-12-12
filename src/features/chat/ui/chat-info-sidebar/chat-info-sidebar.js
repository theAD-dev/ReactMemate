import React, { useEffect } from 'react';
import { Plus, PlusCircle, Search, Trash, X } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './chat-info-sidebar.module.scss';
import ImageAvatar from '../../../../shared/ui/image-with-fallback/image-avatar';

const ChatInfoSidebar = ({ chatId, userId, chatInfo, participants, closeSidebar, users, socket, refetchGroupChats }) => {
    const navigate = useNavigate();
    const [showAddMember, setShowAddMember] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [filteredParticipants, setFilteredParticipants] = React.useState([]);
    const [contacts, setContacts] = React.useState([]);
    const [selectedParticipants, setSelectedParticipants] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const isGroup = chatInfo?.project_id || chatInfo?.job_number;
    const members = chatInfo?.participants?.map(participant => ({
        id: participant.id,
        name: participant.name,
        avatar: users[participant.id]?.photo || ''
    })) || [];

    const otherMember = members.find(member => member.id !== +userId);
    const groupAvatar = !isGroup ? otherMember?.avatar : "";
    const groupName = isGroup
        ? (chatInfo?.name || "Unknown Group")
        : (otherMember?.name || "Unknown User");


    const handleCancelMember = () => {
        setShowAddMember(false);
        setSelectedParticipants([]);
        setSearchText('');
        setContacts(filteredParticipants);
    };

    const handleAddMembers = () => {
        if (selectedParticipants.length === 0) {
            return;
        }
        setLoading(true);
        socket.emit('add_participant', {
            group_id: +chatId,
            user_id: +userId,
            participant_id: selectedParticipants[0]
        }, (res) => {
            if (res.status === 'success') {
                handleCancelMember();
                refetchGroupChats();
                toast.success('Member added successfully');
            } else {
                toast.error('Failed to add member');
            }
            setLoading(false);
        });

    };

    const archiveGroup = () => {
        setDeleting(true);
        socket.emit('archive_chat_group', { group_id: chatId, user_id: userId }, (res) => {
            if (res.status === 'success') {
                closeSidebar();
                refetchGroupChats();
                navigate('/chat');
                toast.success('Group archived successfully');
            } else {
                toast.error('Failed to archive group');
            }
            setDeleting(false);
        });
    };

    const HeaderElement = () => (
        <div className="d-flex align-items-center gap-2">
            <div className={styles.circledesignstyle}>
                <div className={styles.out}>
                    <PlusCircle size={24} color="#17B26A" />
                </div>
            </div>
            <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>Add Member</span>
        </div>
    );

    const FooterElement = () => (
        <div className='d-flex justify-content-end gap-3 pt-3'>
            <Button label="Cancel" className='outline-button' disabled={loading} onClick={handleCancelMember} />
            <Button label="Add" loading={loading} disabled={loading || selectedParticipants.length === 0} className='solid-button' onClick={handleAddMembers} />
        </div>
    );

    useEffect(() => {
        setSelectedParticipants([]);
        setSearchText('');

        // Reset filtered participants when chatId changes
        const participantIds = Object.keys(participants);
        const filtered = Object.values(users).filter(user => !participantIds.includes(String(user.id)));
        setContacts(filtered || []);
        setFilteredParticipants(filtered || []);
    }, [chatId, participants, users]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setContacts(filteredParticipants);
            return;
        }
        const lowerSearchText = searchText.toLowerCase();
        const filtered = filteredParticipants.filter(filteredParticipant =>
            filteredParticipant.first_name.toLowerCase().includes(lowerSearchText) ||
            filteredParticipant.last_name.toLowerCase().includes(lowerSearchText) ||
            filteredParticipant.email.toLowerCase().includes(lowerSearchText)
        );
        setContacts(filtered);
    }, [searchText, filteredParticipants]);

    return (
        <>
            <div className={styles.chatInfoSidebar}>
                <div className={styles.chatInfoHeader}>
                    <p className='font-18 mb-0' style={{ fontWeight: 600, color: '#344054' }}>{isGroup ? 'Group Info' : 'Contact Info'}</p>
                    <button className={styles.closeButton} onClick={closeSidebar}>
                        <X size={32} />
                    </button>
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
                        <h3 className='font-14 ms-2 mb-2' style={{ color: 'var(--Gray-600, #344952)' }}>{Object.keys(participants).length} members</h3>
                        <ul className='w-100 mb-3'>
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
                            {isGroup && (
                                <button className={styles.addParticipantButton} onClick={() => setShowAddMember(true)}>
                                    <div className={styles.addParticipantAvatar}>
                                        <Plus size={20} color="#1AB2FF" />
                                    </div>
                                    <span className={styles.participantName}>Add Member</span>
                                </button>
                            )}
                        </ul>
                    </div>
                </div>
                <div className={styles.participantsFooter}>
                    <button className={"danger-text-button"} disabled={deleting} onClick={archiveGroup}>
                        <Trash color='#b42318' size={16} className='me-1' /> Delete Group
                        {deleting && <ProgressSpinner style={{ width: '16px', height: '16px' }} className='ms-2' />}
                    </button>
                </div>
            </div>
            <Dialog header={HeaderElement} footer={FooterElement} modal className={`${styles.modal} custom-modal`} visible={showAddMember} onHide={handleCancelMember}>
                <div className="search-header w-100">
                    <div className='searchGroupFilter d-flex align-items-center' style={{ gap: '10px', minWidth: '100%', maxWidth: '100%' }}>
                        <Search color="#98A2B3" size={20} />
                        <input
                            id="search-box"
                            placeholder='Search'
                            value={searchText}
                            className='pl-2'
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.userContainer}>
                    {
                        contacts.map(contact => (
                            <div key={contact.id} className={clsx('d-flex align-items-center justify-content-start gap-2', styles.contactItem)}>
                                <Checkbox inputId={`checkbox-${contact.id}`}
                                    disabled={selectedParticipants.length}
                                    checked={selectedParticipants.includes(contact.id)}
                                    onChange={() => setSelectedParticipants(prev => {
                                        if (prev.includes(contact.id)) {
                                            return prev.filter(id => id !== contact.id);
                                        }
                                        return [...prev, contact.id];
                                    })}
                                />
                                <label htmlFor={`checkbox-${contact.id}`} className={'d-flex align-items-center gap-1 cursor-pointer'}>
                                    <ImageAvatar has_photo={contact.has_photo} photo={contact.photo} is_business={false} />
                                    <div className='d-flex flex-column'>
                                        <span className={'font-14'}>{contact.first_name} {contact.last_name}</span>
                                        <span className={'font-12 text-muted'}>{contact.email}</span>
                                    </div>
                                </label>
                            </div>
                        ))
                    }
                </div>
            </Dialog>
        </>
    );
};

export default ChatInfoSidebar;