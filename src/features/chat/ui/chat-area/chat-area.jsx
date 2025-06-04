import { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './chat-area.module.scss';
import ChatHeader from '../chat-header/chat-header';
import MessageList from '../message-list/message-list';

const ChatArea = ({ currentChat, socket, userId, chatId }) => {
  const [message, setMessage] = useState('');
  const [menuRef, setMenuRef] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Fetch messages when chatId, userId, or page changes
  useEffect(() => {
    if (!chatId || !userId || !socket) return;
    setLoading(true);
    socket.emit(
      'get_group_messages',
      {
        user_id: userId,
        group_id: chatId,
        page,
        page_size: pageSize,
      },
      (res) => {
        setLoading(false);
        if (res && res.messages) {
          if (page === 1) {
            setMessages(res.messages);
          } else {
            setMessages((prev) => [...res.messages, ...prev]);
          }
          setHasMore(page < (res.total_pages || 1));
        }
      }
    );
    // Listen for async response as well
    const handler = (payload) => {
      if (payload.group_id === chatId) {
        if (page === 1) {
          setMessages(payload.messages);
        } else {
          setMessages((prev) => [...payload.messages, ...prev]);
        }
        setHasMore(page < (payload.total_pages || 1));
        setLoading(false);
      }
    };
    socket.on('get_group_messages_response', handler);
    return () => socket.off('get_group_messages_response', handler);
  }, [chatId, userId, socket, page, pageSize]);

  // Listen for new messages and send_message_response
  useEffect(() => {
    if (!socket || !chatId) return;

    // Handler for new incoming messages
    const handleNewMessage = (msg) => {
      if (msg.chat_group == chatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id == msg.id)) return prev;
          return [msg, ...prev];
        });
      }
    };

    // Handler for send_message_response (for sender confirmation)
    const handleSendMessageResponse = (msg) => {
      if (msg?.sent_message?.chat_group == chatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.message_id)) return prev;
          return [msg.sent_message, ...prev];
        });
        setIsSending(false);
        setMessage('');
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('send_message_response', handleSendMessageResponse);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('send_message_response', handleSendMessageResponse);
    };
  }, [socket, chatId, messages]);

  // Infinite scroll handler
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !loading) {
        // setPage((p) => p + 1);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  // Scroll to bottom on new messages (only on first load or when sending)
  useEffect(() => {
    if (page === 1 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, page]);

  const handleSendMessage = () => {
    if (message.trim() && currentChat && socket && userId && !isSending) {
      const msgPayload = {
        user_id: userId,
        chat_group_id: chatId,
        message: message.trim(),
      };
      setIsSending(true);
      socket.emit('send_message', msgPayload);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const menuItems = [
    {
      label: 'View Job Details',
      command: () => {
        console.log('View Job Details');
        setMenuVisible(false);
      }
    },
    {
      label: 'View Project Details',
      command: () => {
        console.log('View Project Details');
        setMenuVisible(false);
      }
    }
  ];

  const toggleMenu = (e) => {
    setMenuVisible(prev => !prev);
    e.stopPropagation();
  };

  return (
    <div className={styles.chatArea}>
      {currentChat ? (
        <div className={styles.chatContent}>
          <ChatHeader
            chat={currentChat}
            onMenuToggle={toggleMenu}
            menuRef={setMenuRef}
            userId={userId}
          />

          <Menu
            model={menuItems}
            popup
            ref={menuRef}
            visible={menuVisible}
            onHide={() => setMenuVisible(false)}
            className={styles.chatMenu}
          />

          <div
            className={styles.messagesContainer}
            ref={messagesContainerRef}
            style={{ overflowY: 'auto', height: '100%' }}
          >
            <MessageList messages={messages} isTyping={isTyping} loading={loading} currentUserId={userId} />
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.messageInputContainer}>
            <div className="position-relative w-100">
              <InputText
                placeholder="Send a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyUp={handleKeyPress}
                className={styles.messageInput}
              />
              <div className={styles.messageInputIcons}>
                {isSending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                <button className={styles.attachButton}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.0833 8.33333L9.16667 17.25C8.17221 18.2444 6.82407 18.8042 5.41667 18.8042C4.00926 18.8042 2.66112 18.2444 1.66667 17.25C0.672214 16.2556 0.112446 14.9074 0.112446 13.5C0.112446 12.0926 0.672214 10.7444 1.66667 9.75L10.5833 0.833329C11.2486 0.167998 12.1514 -0.149151 13.0833 0.0666624C14.0153 0.282476 14.8056 0.947998 15.25 1.83333C15.6944 2.71866 15.7361 3.75 15.3333 4.66666C14.9306 5.58333 14.1389 6.29166 13.1667 6.5L5.08333 14.5833C4.75 14.9167 4.31944 15.0833 3.83333 15.0833C3.34722 15.0833 2.91667 14.9167 2.58333 14.5833C2.25 14.25 2.08333 13.8194 2.08333 13.3333C2.08333 12.8472 2.25 12.4167 2.58333 12.0833L9.16667 5.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className={styles.emojiButton} onClick={() => setShowEmojiPicker((v) => !v)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.66669 11.6667C6.66669 11.6667 7.91669 13.3333 10 13.3333C12.0834 13.3333 13.3334 11.6667 13.3334 11.6667" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.5 7.5H7.50833" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.5 7.5H12.5083" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {showEmojiPicker && (
                  <div className={styles.emojiPickerWrapper} style={{ position: 'absolute', bottom: '40px', right: 0, zIndex: 10 }}>
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setMessage((prev) => prev + (emojiData.emoji || ''));
                        setShowEmojiPicker(false);
                      }}
                      theme="light"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyChat}>
          <div className={styles.emptyChatIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="171" viewBox="0 0 220 171" fill="none">
              <circle cx="110" cy="80" r="80" fill="#EAECF0" />
              <circle cx="18" cy="12" r="8" fill="#F2F4F7" />
              <circle cx="198" cy="142" r="6" fill="#F2F4F7" />
              <circle cx="25" cy="138" r="10" fill="#F2F4F7" />
              <circle cx="210" cy="46" r="10" fill="#F2F4F7" />
              <circle cx="191" cy="11" r="7" fill="#F2F4F7" />
              <path opacity="0.7" d="M140.356 4H75.0524C72.3887 4.00774 69.8364 5.06932 67.9528 6.95284C66.0693 8.83635 65.0077 11.3887 65 14.0524V20.7589C65.0077 23.4226 66.0693 25.975 67.9528 27.8585C69.8364 29.742 72.3887 30.8036 75.0524 30.8113H140.356L150.409 36.7694V14.0231C150.391 11.3651 149.326 8.82132 147.444 6.94454C145.561 5.06776 143.014 4.00961 140.356 4Z" fill="#667085" />
              <path d="M138.537 13.605H76.8355V15.2779H138.537V13.605Z" fill="white" />
              <path d="M138.537 19.5339H88.7074V21.2069H138.537V19.5339Z" fill="white" />
              <path opacity="0.15" d="M75.0156 48.6416H140.32C142.983 48.6493 145.536 49.7109 147.419 51.5944C149.303 53.478 150.364 56.0303 150.372 58.694V65.3932C150.364 68.0569 149.303 70.6092 147.419 72.4928C145.536 74.3763 142.983 75.4378 140.32 75.4456H75.0156L64.9631 81.4037V58.6573C64.9786 55.9994 66.0438 53.4553 67.9267 51.5793C69.8096 49.7033 72.3576 48.6474 75.0156 48.6416Z" fill="#667085" />
              <path opacity="0.5" d="M138.537 58.239H76.8355V59.912H138.537V58.239Z" fill="#667085" />
              <path opacity="0.5" d="M105.452 64.175H76.8355V65.848H105.452V64.175Z" fill="#667085" />
              <path opacity="0.5" d="M121.558 64.175H109.92V65.848H121.558V64.175Z" fill="#667085" />
              <path opacity="0.7" d="M140.356 93.2759H75.0524C72.3887 93.2836 69.8364 94.3452 67.9528 96.2287C66.0693 98.1123 65.0077 100.665 65 103.328V110.027C65.0058 112.692 66.0668 115.245 67.9507 117.129C69.8346 119.013 72.3881 120.074 75.0524 120.08H140.356L150.409 126.038V103.292C150.39 100.635 149.323 98.093 147.441 96.2178C145.559 94.3426 143.013 93.2855 140.356 93.2759Z" fill="#667085" />
              <path d="M138.537 102.873H76.8355V104.546H138.537V102.873Z" fill="white" />
              <path d="M138.537 108.809H88.7074V110.482H138.537V108.809Z" fill="white" />
              <path opacity="0.15" d="M75.0156 137.91H100.425C103.089 137.92 105.64 138.982 107.523 140.865C109.406 142.748 110.468 145.299 110.478 147.963V154.669C110.468 157.332 109.406 159.883 107.523 161.767C105.64 163.65 103.089 164.712 100.425 164.721H75.0156L64.9631 170.672V147.963C64.9709 145.299 66.0325 142.747 67.916 140.863C69.7995 138.979 72.3519 137.918 75.0156 137.91Z" fill="#667085" />
              <path opacity="0.5" d="M80.1079 151.316C80.1079 151.896 79.9357 152.464 79.6132 152.946C79.2907 153.429 78.8324 153.805 78.2961 154.027C77.7598 154.249 77.1696 154.308 76.6003 154.194C76.0309 154.081 75.508 153.801 75.0975 153.391C74.687 152.981 74.4075 152.458 74.2942 151.888C74.181 151.319 74.2391 150.729 74.4613 150.192C74.6834 149.656 75.0596 149.198 75.5423 148.875C76.0249 148.553 76.5924 148.381 77.1729 148.381C77.9483 148.39 78.6893 148.702 79.2377 149.251C79.7861 149.799 80.0984 150.54 80.1079 151.316Z" fill="#667085" />
              <path opacity="0.5" d="M86.0441 151.91C87.6853 151.91 89.0157 150.579 89.0157 148.938C89.0157 147.297 87.6853 145.967 86.0441 145.967C84.4028 145.967 83.0724 147.297 83.0724 148.938C83.0724 150.579 84.4028 151.91 86.0441 151.91Z" fill="#667085" />
              <path opacity="0.5" d="M97.9162 154.874C97.9162 155.455 97.744 156.022 97.4215 156.505C97.099 156.988 96.6406 157.364 96.1043 157.586C95.568 157.808 94.9779 157.866 94.4086 157.753C93.8392 157.64 93.3163 157.36 92.9058 156.95C92.4953 156.539 92.2158 156.016 92.1025 155.447C91.9893 154.878 92.0474 154.288 92.2696 153.751C92.4917 153.215 92.8679 152.757 93.3506 152.434C93.8332 152.112 94.4007 151.939 94.9812 151.939C95.7596 151.939 96.5061 152.249 97.0565 152.799C97.6069 153.35 97.9162 154.096 97.9162 154.874Z" fill="#667085" />
            </svg>
          </div>
          <p className={styles.emptyChatText}>
            You Are Starting New Conversation
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
