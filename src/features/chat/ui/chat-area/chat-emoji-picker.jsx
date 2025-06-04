import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import styles from './chat-area.module.scss';

const ChatEmojiPicker = ({ show, setShow, setMessage }) => {
  return (
    <>
      <button
        type="button"
        className={styles.emojiButton}
        onClick={() => setShow((v) => !v)}
        tabIndex={-1}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.66669 11.6667C6.66669 11.6667 7.91669 13.3333 10 13.3333C12.0834 13.3333 13.3334 11.6667 13.3334 11.6667" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 7.5H7.50833" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.5 7.5H12.5083" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {show && (
        <div style={{ position: 'absolute', bottom: '40px', right: 0, zIndex: 10 }}>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessage((prev) => prev + (emojiData.emoji || ''));
              setShow(false);
            }}
            theme="light"
          />
        </div>
      )}
    </>
  );
};

export default ChatEmojiPicker;