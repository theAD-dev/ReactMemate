import React, { useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { Divider } from 'primereact/divider';
import styles from './message-list.module.scss';
import FileAttachment from '../file-attachment/file-attachment';

const MessageList = ({ messages = [], isTyping = false, currentUserId, participants }) => {
  const messagesEndRef = useRef(null);

  // Normalize messages for display
  const normalizedMessages = useMemo(() => {
    if (!Array.isArray(messages)) {
      console.warn('Messages is not an array:', messages);
      return [];
    }

    return messages.map((msg, index) => {
      const timestamp = Number(msg.sent_at);
      // Friday 2:20pm
      let sendingTime = 'Unknown Time';
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp * 1000);
        const weekday = date.toLocaleString('en-US', { weekday: 'long' });
        let hour = date.getHours();
        const minute = date.getMinutes().toString().padStart(2, '0');
        const ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        if (hour === 0) hour = 12;
        sendingTime = `${weekday} ${hour}:${minute}${ampm}`;
      }

      return {
        id: msg.id || `fallback-${index}`,
        text: msg.message || '',
        sender: msg.sender || 'Unknown',
        time: !isNaN(timestamp)
          ? new Date(timestamp * 1000).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
          : 'Unknown Time',
        sendingTime,
        isOwn: currentUserId && msg.sender === currentUserId,
        attachment: msg.file_url ? { url: msg.file_url, type: msg.file_type } : undefined,
      };
    }).reverse();
  }, [messages, currentUserId]);

  // Group messages by 'Today', 'Yesterday', or full date (e.g., 'Jun 2, 2025')
  const groupedMessages = useMemo(() => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    normalizedMessages.forEach((message) => {
      // message.time is like 'Jun 2, 2025, 2:20 PM'
      const parts = message.time.split(',');
      const dateStr = parts[0]?.trim();
      const yearStr = parts[1]?.trim();
      let label = dateStr;
      if (parts.length >= 2) {
        // Try to parse the date for Today/Yesterday logic
        const msgDate = new Date(`${dateStr}, ${yearStr}`);
        if (!isNaN(msgDate)) {
          if (
            msgDate.getDate() === today.getDate() &&
            msgDate.getMonth() === today.getMonth() &&
            msgDate.getFullYear() === today.getFullYear()
          ) {
            label = 'Today';
          } else if (
            msgDate.getDate() === yesterday.getDate() &&
            msgDate.getMonth() === yesterday.getMonth() &&
            msgDate.getFullYear() === yesterday.getFullYear()
          ) {
            label = 'Yesterday';
          } else {
            label = `${dateStr}, ${yearStr}`;
          }
        }
      }
      if (!groups[label]) groups[label] = [];
      groups[label].push(message);
    });
    return groups;
  }, [normalizedMessages]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedMessages).sort((a, b) => new Date(a) - new Date(b));
  }, [groupedMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, normalizedMessages, groupedMessages, sortedDates]);

  return (
    <div className={styles.messageList}>
      {sortedDates.map(date => (
        <div key={date} className={styles.messageGroup}>
          <div className={styles.dateHeader}>
            <Divider align="center">
              <span>{date}</span>
            </Divider>
          </div>

          {groupedMessages[date].map((message, index) => (
            <div
              key={message.id || `msg-${index}-${message.time}`}
              className={`${styles.message} ${message.isOwn ? styles.sent : styles.received}`}
            >
              <div className={clsx('w-100 d-flex align-items-center gap-2', { ['justify-content-between']: message.isOwn })}>
                {message.isOwn && (<span className={styles.messageSenderName}>You</span>)}
                {!message.isOwn && (
                  <div className='d-flex gap-2'>
                    <div
                      className={styles.userAvatar}
                      style={{ position: 'relative' }}
                    >
                      {participants?.[message?.sender] && participants?.[message?.sender]?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={styles.messageSenderName}>{participants?.[message?.sender] || ""}</span>
                  </div>
                )}
                <span className={clsx(styles.messageTime, { [styles.messageTimeSent]: !message.isOwn })}>
                  {message.sendingTime || ''}
                </span>
              </div>

              <div className={clsx(styles.messageContent, { [styles.messageContentSent]: !message.isOwn })}>
                <p className={styles.messageText}>{message.text}</p>
              </div>
              {message.attachment && (
                <div className={styles.messageAttachment}>
                  <FileAttachment file={message.attachment} />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {normalizedMessages.length === 0 && (
        <div className={styles.emptyMessages}>
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}

      {isTyping && (
        <div className={styles.typingIndicator}>
          <div className={styles.typingDot}></div>
          <div className={styles.typingDot}></div>
          <div className={styles.typingDot}></div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;