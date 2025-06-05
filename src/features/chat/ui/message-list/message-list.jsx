import React, { useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { Divider } from 'primereact/divider';
import styles from './message-list.module.scss';
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

const MessageList = ({ messages = [], isTyping = false, currentUserId, participants }) => {
  const messagesEndRef = useRef(null);

  const normalizedMessages = useMemo(() => {
    if (!Array.isArray(messages)) {
      console.warn('Messages is not an array:', messages);
      return [];
    }

    return messages
      .filter(msg => msg?.sent_at)
      .map((msg, index) => {
        const timestamp = Number(msg.sent_at);
        const date = new Date(timestamp * 1000);

        return {
          id: msg.id || `msg-${index}`,
          text: msg.message || '',
          sender: msg.sender || 'Unknown',
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
  }, [normalizedMessages]);

  return (
    <>
      {sortedGroupKeys.map((date) => (
        <div key={date} className={styles.messageGroup}>
          <div className={styles.dateHeader}>
            <Divider align="center"><span>{date}</span></Divider>
          </div>

          {groupedMessages[date].map((msg) => (
            <div
              key={msg.id}
              className={clsx(styles.message, msg.isOwn ? styles.sent : styles.received)}
            >
              <div className={clsx('w-100 d-flex align-items-center gap-2', {
                'justify-content-between': msg.isOwn
              })}>
                {msg.isOwn ? (
                  <span className={styles.messageSenderName}>You</span>
                ) : (
                  <div className="d-flex gap-2">
                    <div className={styles.userAvatar}>
                      {participants?.[msg.sender]
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
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

              <div className={clsx(styles.messageContent, {
                [styles.messageContentSent]: !msg.isOwn
              })}>
                <p className={styles.messageText}>{msg.text}</p>
              </div>

              {msg.attachment && (
                <div className={styles.messageAttachment}>
                  <FileAttachment file={msg.attachment} />
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
    </>
  );
};

export default MessageList;
