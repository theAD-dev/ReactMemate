import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './chat-area.module.scss';
import ChatAttachmentPopover from './chat-attachment-popover';
import ChatEmojiPicker from './chat-emoji-picker';
import EmptyChatArea from './empty-chat-area';
import ChatHeader from '../chat-header/chat-header';
import MessageList from '../message-list/message-list';

const ChatArea = ({ currentChat, socket, userId, chatId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollHeightRef = useRef(0);
  const inputRef = useRef(null);

  const updateMessages = useCallback((newMessages, totalPages, currentPage) => {
    setMessages((prev) => {
      const filteredMessages = newMessages.filter((msg) => !prev.some((m) => m.id === msg.id));
      return currentPage === 1 ? filteredMessages : [...filteredMessages, ...prev];
    });
    setHasMore(currentPage < (totalPages || 1));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!chatId || !userId || !socket) return;
    setLoading(true);

    if (messagesContainerRef.current && page > 1) {
      scrollHeightRef.current = messagesContainerRef.current.scrollHeight;
    }

    socket.emit(
      'get_group_messages',
      {
        user_id: userId,
        group_id: chatId,
        page,
        page_size: pageSize,
      },
      (res) => {
        if (res && res.status === 'success' && res.messages) {
          updateMessages(res.messages, res.total_pages, page);
        }
      }
    );
  }, [chatId, userId, socket, page, pageSize, updateMessages]);

  const handleSendMessageResponse = (msg) => {
    if (msg?.sent_message?.chat_group == chatId) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.message_id)) return prev;
        return [msg.sent_message, ...prev];
      });
      setIsSending(false);
      setMessage('');
      scrollHeightRef.current = 0;
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 500);
    }
  };



  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (msg) => {
      console.log('msg: ', msg);
      if (msg.chat_group == chatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id == msg.id)) return prev;
          return [msg, ...prev];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, chatId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (page === 1 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      scrollHeightRef.current = 0;
    } else if (page > 1 && scrollHeightRef.current) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - scrollHeightRef.current;
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
      socket.emit('send_message', msgPayload, (res) => {
        if (res.status === 'success') {
          handleSendMessageResponse(res);
        } else {
          setIsSending(false);
          toast.error('Failed to send message:');
        }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentFile(file);
      // TODO: handle file upload/send logic here
    }
  };

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current.scrollTop === 0 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll, messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    scrollHeightRef.current = 0;
    setPage(1);
    setMessages([]);
    setHasMore(true);
    setLoading(false);
  }, [chatId]);

  return (
    <div className={styles.chatArea}>
      {currentChat ? (
        <div className={styles.chatContent}>
          <ChatHeader
            chat={currentChat}
            userId={userId}
            setParticipants={setParticipants}
          />

          <div
            className={styles.messagesContainer}
            ref={messagesContainerRef}
          >
            {loading && (
              <div className={styles.loadingContainer}>
                <ProgressSpinner style={{ width: '16px', height: '16px' }} />
              </div>
            )}
            <MessageList messages={messages} isTyping={isTyping} loading={loading} currentUserId={userId} participants={participants} />
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
                autoFocus
                ref={inputRef}
                disabled={isSending}
                onKeyUp={handleKeyPress}
                className={styles.messageInput}
              />
              <div className={styles.messageInputIcons}>
                {isSending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                <div className={styles.attachWrapper} style={{ position: 'relative', display: 'inline-block' }}>
                  <ChatAttachmentPopover
                    onFileChange={handleFileChange}
                    styles={styles}
                    file={attachmentFile}
                    onRemoveFile={() => setAttachmentFile(null)}
                  />
                </div>
                {/* Emoji Picker Button and Picker moved to ChatEmojiPicker */}
                <ChatEmojiPicker
                  show={showEmojiPicker}
                  setShow={setShowEmojiPicker}
                  setMessage={setMessage}
                />
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
        <EmptyChatArea />
      )}
    </div>
  );
};

export default ChatArea;
