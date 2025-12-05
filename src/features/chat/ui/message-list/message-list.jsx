import { useEffect, useRef, useMemo } from 'react';
import { CheckCircleFill, ExclamationCircleFill, Trash, X } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Divider } from 'primereact/divider';
import styles from './message-list.module.scss';
import { getFileIcon } from '../../../../components/Work/features/create-job/create-job';
import { CircularProgressBar } from '../../../../shared/ui/circular-progressbar';
import { FallbackImageWithInitials, InitialsAvatar } from '../../../../ui/image-with-fallback/image-avatar';
import { formatFileSize } from '../chat-area/chat-attachment-popover';
import FileAttachment from '../file-attachment/file-attachment';

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const weekday = date.toLocaleString('en-US', { weekday: 'long' });
  let hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12 || 12;
  return `${weekday} ${hour}:${minute}${ampm}`;
};

const isSameDate = (date1, date2) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const MessageList = ({ messages = [], isTyping = {}, loading = true, currentUserId, participants, chatId, attachmentFile, setAttachmentFile }) => {
  const messagesEndRef = useRef(null);

  const normalizedMessages = useMemo(() => {
    if (!Array.isArray(messages)) {
      console.warn('Messages is not an array:', messages);
      return [];
    }
    if (attachmentFile?.file) {
      setAttachmentFile(null);
    }

    return messages
      .filter(msg => msg?.sent_at)
      .map((msg, index) => {
        const timestamp = Number(msg.sent_at);
        const date = new Date(timestamp * 1000);
        const photo = msg.sender_photo && msg.sender_photo !== '/media/no_photo.png' ? msg.sender_photo.startsWith('http')
          ? msg.sender_photo
          : `${process.env.REACT_APP_URL}${msg.sender_photo}` : "";

        return {
          id: msg.id || `msg-${index}`,
          text: msg.message || '',
          sender: msg.sender || 'Unknown',
          photo,
          timestamp,
          sendingTime: formatTime(timestamp),
          isOwn: currentUserId === msg.sender,
          attachment: msg.file_url ? { url: msg.file_url, type: msg.file_type } : undefined,
          displayDate: date,
          fullDate: date.toLocaleDateString('en-US', { dateStyle: 'medium' }),
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp); // ensure messages are chronologically sorted
  }, [messages, currentUserId]);

  const groupedMessages = useMemo(() => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    normalizedMessages.forEach((msg) => {
      let label = msg.fullDate;
      if (isSameDate(msg.displayDate, today)) {
        label = 'Today';
      } else if (isSameDate(msg.displayDate, yesterday)) {
        label = 'Yesterday';
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(msg);
    });

    return groups;
  }, [normalizedMessages]);

  const sortedGroupKeys = useMemo(() => {
    return Object.entries(groupedMessages)
      .sort(([, msgsA], [, msgsB]) => msgsA[0].timestamp - msgsB[0].timestamp)
      .map(([key]) => key);
  }, [groupedMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [normalizedMessages, attachmentFile]);

  return (
    <>
      {sortedGroupKeys.map((date) => (
        <div key={date} className={styles.messageGroup}>
          <div className={clsx(styles.dateHeader, 'dividerContainer')}>
            <Divider><span>{date}</span></Divider>
          </div>

          {groupedMessages[date].map((msg) => (
            <div
              key={msg.id}
              className={clsx(styles.message, msg.isOwn ? styles.sent : styles.received)}
            >
              <div className={clsx('w-100 d-flex align-items-center gap-2 justify-content-between')}>
                {msg.isOwn ? (
                  <span className={styles.messageSenderName}>You</span>
                ) : (
                  <div className="d-flex gap-2">
                    <div className={styles.userAvatar}>
                      <FallbackImageWithInitials has_photo={msg.photo} photo={msg.photo} name={participants?.[msg.sender] || 'Unknown'} />
                    </div>
                    <span className={styles.messageSenderName}>
                      {participants?.[msg.sender] || 'Unknown'}
                    </span>
                  </div>
                )}
                <span className={clsx(styles.messageTime, {
                  [styles.messageTimeSent]: !msg.isOwn
                })}>
                  {msg.sendingTime}
                </span>
              </div>

              {msg.attachment ? (
                <div className={clsx(styles.messageAttachment, { [styles.messageContentSent]: !msg.isOwn })}>
                  <FileAttachment file={msg.attachment} />
                </div>
              ) : (
                <div className={clsx(styles.messageContent, { [styles.messageContentSent]: !msg.isOwn })}>
                  <p className={styles.messageText}>{msg.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {normalizedMessages.length === 0 && !loading && (
        <div className={styles.emptyMessages}>
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}

      {attachmentFile?.file && attachmentFile?.chatId === chatId && (
        <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 0, gap: 12, border: '1px solid #EAECF0', width: '508px', marginLeft: 'auto', position: 'relative' }}>
          {getFileIcon(attachmentFile.file.name.split(".").pop())}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 600, color: '#101828', fontSize: 16, marginBottom: 2 }}>{attachmentFile.file.name}</div>
            <div style={{ color: '#667085', fontSize: 14 }}>{formatFileSize(attachmentFile.file.size)}</div>
          </div>
          {
            attachmentFile?.error ? (
              <ExclamationCircleFill color='#F04438' size={20} />
            ) : attachmentFile?.progress == 100 ? (
              <CheckCircleFill color='#12B76A' size={20} />
            ) : (
              <CircularProgressBar percentage={parseInt(attachmentFile?.progress) || 0} size={30} color="#158ECC" />
            )
          }
          <div className='d-flex justify-content-center align-items-center' style={{ position: 'absolute', right: '-6px', top: '-8px', background: '#d4d5d7ff', borderRadius: '50%', padding: '2px', cursor: 'pointer' }} onClick={() => setAttachmentFile({})}>
            <X size={18} color='#667085' />
          </div>
        </div>
      )}

      {isTyping.isTyping && (
        <div className={clsx(styles.message, styles.received)}>
          <div className={clsx('w-100 d-flex align-items-center gap-2 justify-content-between')}>
            <div className="d-flex gap-2">
              <div className={styles.userAvatar}>
                {isTyping?.user?.has_photo ? <FallbackImageWithInitials has_photo={isTyping?.user?.has_photo} photo={isTyping?.user?.photo} name={`${isTyping?.user?.first_name} ${isTyping?.user?.last_name}`} />
                  : <InitialsAvatar name={`${isTyping?.user?.first_name} ${isTyping?.user?.last_name}`} />}
              </div>
              <span className={styles.messageSenderName}>
                {isTyping?.user?.first_name} {isTyping?.user?.last_name}
              </span>
            </div>
          </div>
          <div className={styles.typingIndicator}>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
            <div className={styles.typingDot}></div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
