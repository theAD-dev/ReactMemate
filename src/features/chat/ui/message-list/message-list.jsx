import React, { useEffect, useRef } from 'react';
import FileAttachment from '../file-attachment/file-attachment';
import styles from './message-list.module.scss';

const MessageList = ({ messages, isTyping = false }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.time.includes('Today') ? 'Today' : message.time.split(' ')[0]; // Extract date part
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className={styles.messageList}>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className={styles.messageGroup}>
          <div className={styles.dateHeader}>
            <span>{date}</span>
          </div>

          {dateMessages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${message.sender === 'You' ? styles.sent : styles.received}`}
            >
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.text}</p>
                {message.attachment && (
                  <div className={styles.messageAttachment}>
                    <FileAttachment file={message.attachment} />
                  </div>
                )}
                <span className={styles.messageTime}>
                  {message.time.includes('Today') ? message.time.replace('Today', '') : message.time.split(' ')[1]}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}

      {messages.length === 0 && (
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
