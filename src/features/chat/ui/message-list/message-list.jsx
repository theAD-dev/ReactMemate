import React, { useEffect, useRef, useMemo } from 'react';
import styles from './message-list.module.scss';
import FileAttachment from '../file-attachment/file-attachment';

const MessageList = ({ messages = [], isTyping = false, currentUserId }) => {
  const messagesEndRef = useRef(null);

  // Normalize messages for display
  const normalizedMessages = useMemo(() => {
    if (!Array.isArray(messages)) {
      console.warn('Messages is not an array:', messages);
      return [];
    }

    return messages.map((msg, index) => {
      const timestamp = Number(msg.sent_at);
      return {
        id: msg.id || `fallback-${index}`,
        text: msg.message || '',
        sender: msg.sender || 'Unknown',
        time: !isNaN(timestamp)
          ? new Date(timestamp * 1000).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
          : 'Unknown Time',
        isOwn: currentUserId && msg.sender === currentUserId,
        attachment: msg.file_url ? { url: msg.file_url, type: msg.file_type } : undefined,
      };
    }).reverse();
  }, [messages, currentUserId]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return normalizedMessages.reduce((groups, message) => {
      const date = message.time.split(',')[0] || 'Unknown Date';
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    }, {});
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
            <span>{date}</span>
          </div>

          {groupedMessages[date].map((message, index) => (
            <div
              key={message.id || `msg-${index}-${message.time}`}
              className={`${styles.message} ${message.isOwn ? styles.sent : styles.received}`}
            >
              <span className={styles.messageTime}>
                {message.time.split(',')[2] || ''}
              </span>
              <div className={styles.messageContent}>
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