import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import throttle from "lodash.throttle";
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './chat-area.module.scss';
import ChatAttachmentPopover, { formatFileSize } from './chat-attachment-popover';
import ChatEmojiPicker from './chat-emoji-picker';
import EmptyChatArea from './empty-chat-area';
import ChatHeader from '../chat-header/chat-header';
import ChatInfoSidebar from '../chat-info-sidebar/chat-info-sidebar';
import MessageList from '../message-list/message-list';

const ChatArea = ({ currentChat, socket, userId, chatId, onlineUsers = [], setChatData, users, updatePrivateGroupChatId, refetchGroupChats }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState({});
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollHeightRef = useRef(0);
  const inputRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const updateMessages = useCallback((newMessages, totalPages, currentPage) => {
    setMessages((prev) => {
      const filteredMessages = newMessages.filter((msg) => !prev.some((m) => m.id === msg.id));
      return currentPage === 1 ? filteredMessages : [...filteredMessages, ...prev];
    });
    setHasMore(currentPage < (totalPages || 1));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!chatId || !userId || !socket || chatId?.startsWith("private_group")) return;
    setLoading(true);

    if (messagesContainerRef.current && page > 1) {
      scrollHeightRef.current = messagesContainerRef.current.scrollHeight;
    }

    socket.emit('get_group_messages', { user_id: userId, group_id: chatId, page, page_size: pageSize }, (res) => {
      if (res && res.status === 'success' && res.messages) {
        updateMessages(res.messages, res.total_pages, page);
      }
    });
  }, [chatId, userId, socket, page, pageSize, updateMessages]);

  useEffect(() => {
    if (!socket || loading || !currentChat || !userId || Number(chatId)) return;

    if (currentChat?.participants?.length && chatId?.startsWith("private_group")) {
      const participants = currentChat.participants.map((p) => p.id).filter((id) => id !== userId);
      const group_name = `Private Chat`;

      socket.emit('create_chat_group', { name: group_name, user_id: userId, participants, project_id: null, job_id: null }, (res) => {
        if (res.status === 'success' && res.chat_group_id) {
          setLoading(true);
          updatePrivateGroupChatId(chatId, res.chat_group_id);
        } else {
          setLoading(false);
          console.log("Error during creation chat group: ", res);
          toast.error("Could not start chat. Please try again.");
        }
      });
    }
  }, [chatId, userId, socket, currentChat, navigate, loading]);

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

      setChatData((prev) => {
        const updatedChat = { ...prev[msg?.sent_message?.chat_group], last_message: msg?.sent_message };
        return { ...prev, [msg?.sent_message?.chat_group]: updatedChat };
      });
    }
  };

  useEffect(() => {
    if (!socket || !chatId || chatId?.startsWith("private_group")) return;

    const handleNewMessage = (msg) => {
      if (msg.chat_group == chatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id == msg.id)) return prev;
          return [msg, ...prev];
        });
      }
      setChatData((prev) => {
        const updatedChat = { ...prev[msg.chat_group], last_message: msg, unread_count: (prev[msg.chat_group]?.unread_count || 0) + 1 };
        return { ...prev, [msg.chat_group]: updatedChat };
      });
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing', (data) => {
      if (data?.group_id === chatId) {
        setIsTyping({ isTyping: true, user: users[data.user_id] });
      }
    });
    socket.on('stop_typing', (data) => {
      if (data?.group_id === chatId) {
        setIsTyping({});
      }
    });

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (!socket || !chatId || chatId?.startsWith("private_group")) return;

    socket.emit('join_group', { group_id: chatId }, (res) => {
      if (res.status === 'success') {
        console.log('Joined group successfully');
      } else {
        console.log('Failed to join group: ', res);
      }
    });

    return () => {
      socket.emit("leave_group", { group_id: chatId });
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

  const handleSendMessage = (file_url, file_type) => {
    if ((message.trim() || file_url) && currentChat && socket && userId && !isSending) {
      const msgPayload = {
        user_id: userId,
        chat_group_id: chatId,
        message: message.trim(),
        file_url,
        file_type
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
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage();
    }
  };

  const typingDelay = 2000; // 2s of inactivity = stop_typing
  let stopTypingTimeout;
  const emitTyping = useMemo(() =>
    throttle((chatId, userId) => {
      if (socket && chatId && userId) {
        socket.emit("typing", { group_id: chatId, user_id: userId });
      }
    }, 2000), [socket]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    emitTyping(chatId, userId);

    // reset stop_typing timer
    clearTimeout(stopTypingTimeout);
    stopTypingTimeout = setTimeout(() => {
      if (socket && chatId && userId) {
        socket.emit("stop_typing", { group_id: chatId, user_id: userId });
      }
    }, typingDelay);
  };

  const uploadToS3 = async (file, url, extension, size) => {
    return axios.put(url, file, {
      headers: {
        "Content-Type": "",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setAttachmentFile((prev) => ({ ...prev, progress }));
      }
    }).then(() => {
      setAttachmentFile((prev) => ({ ...prev, progress: 100, success: true }));
      const fileURL = url.split("?")[0] || "";
      const type = `${extension}-${size}`;
      handleSendMessage(fileURL, type);
    }).catch((err) => {
      console.log('Error uploading to S3: ', err);
      setAttachmentFile((prev) => ({ ...prev, progress: 0, error: true }));
    });
  };

  const fileUploadBySignedURL = async (file) => {
    if (!file || !chatId) return;

    try {
      const name = file?.name?.split(".")[0];
      const fileExtension = file?.name?.split(".")?.pop();
      const fileName = `${name}-${Date.now()}.${fileExtension}`;
      const size = formatFileSize(file.size);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/chat/upload/${chatId}/`,
        { filename: fileName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { url } = response.data;
      if (!url) {
        setAttachmentFile((prev) => ({ ...prev, progress: 0, error: true }));
        toast.error("Failed to get upload URL. Please try again.");
        return;
      }
      await uploadToS3(file, url, fileExtension, size);
    } catch (error) {
      setAttachmentFile((prev) => ({ ...prev, progress: 0, error: true }));
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  // Allowed file extensions and MIME types for security
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv'
  ];

  // Restricted extensions (security threat)
  const RESTRICTED_EXTENSIONS = ['exe', 'bat', 'cmd', 'com', 'scr', 'vbs', 'js', 'jar', 'zip', 'rar', '7z', 'tar', 'gz', 'iso', 'dmg', 'app', 'msi', 'dll', 'sys', 'mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm', 'm4v'];

  const isFileTypeAllowed = (fileName, mimeType) => {
    const fileExtension = fileName?.split('.')?.pop()?.toLowerCase();
    
    // Check if file extension is in restricted list
    if (RESTRICTED_EXTENSIONS.includes(fileExtension)) {
      return {
        allowed: false,
        reason: `File type (.${fileExtension}) is not allowed for security reasons. Videos, archives, and executable files cannot be uploaded.`
      };
    }

    // Check if file extension is in allowed list
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return {
        allowed: false,
        reason: `File type (.${fileExtension}) is not supported. Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }

    // Check MIME type
    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        allowed: false,
        reason: `File MIME type (${mimeType}) is not allowed for security reasons.`
      };
    }

    return { allowed: true };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB in bytes

    if (file) {
      // Check file type security
      const fileTypeCheck = isFileTypeAllowed(file.name, file.type);
      if (!fileTypeCheck.allowed) {
        toast.error(fileTypeCheck.reason);
        setAttachmentFile(null);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File size exceeds 15 MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
        setAttachmentFile(null);
        return;
      }

      setAttachmentFile({
        file,
        chatId,
        error: false,
        progress: 0,
      });
      fileUploadBySignedURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only hide drag overlay if we're leaving the input area completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB in bytes

    if (files && files.length > 0) {
      const file = files[0];

      // Check file type security
      const fileTypeCheck = isFileTypeAllowed(file.name, file.type);
      if (!fileTypeCheck.allowed) {
        toast.error(fileTypeCheck.reason);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File size exceeds 15 MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
        return;
      }

      setAttachmentFile({
        file,
        chatId,
        error: false,
        progress: 0,
      });
      fileUploadBySignedURL(file);
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
    <div className='d-flex w-100 h-100'>
      <div className={styles.chatArea}>
        {currentChat ? (
          <div className={styles.chatContent} style={{ position: 'relative' }}>
            <ChatHeader
              chat={currentChat}
              userId={userId}
              setParticipants={setParticipants}
              onlineUsers={onlineUsers}
              setShowSidebar={setShowSidebar}
            />
            <div
              className={`${styles.chatBodyArea}  ${isDragOver ? styles.dragOver : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div
                className={`${styles.messagesContainer}`}
                ref={messagesContainerRef}
              >
                {loading && (
                  <div className={styles.loadingContainer}>
                    <ProgressSpinner style={{ width: '16px', height: '16px' }} />
                  </div>
                )}
                <MessageList
                  messages={messages}
                  isTyping={isTyping}
                  loading={loading}
                  currentUserId={userId}
                  chatId={chatId}
                  participants={participants}
                  attachmentFile={attachmentFile}
                  setAttachmentFile={setAttachmentFile}
                />
                <div ref={messagesEndRef} />
              </div>

              <div className={`${styles.messageInputContainer}`}>
                <div className="position-relative w-100">
                  <InputTextarea
                    placeholder="Send a message..."
                    value={message}
                    onChange={handleChange}
                    autoFocus
                    ref={inputRef}
                    disabled={isSending || chatId?.startsWith("private_group")}
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
                    <Button
                      className={styles.sendButton}
                      onClick={() => handleSendMessage()}
                      disabled={!message.trim() || isSending}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyChatArea />
        )}
      </div>
      <div style={showSidebar ? { position: 'absolute', right: '16px' } : { display: 'none' }} className={styles.chatSidebar}>
        {/* Sidebar content can be added here, e.g., participants list, chat settings, etc. */}
        <ChatInfoSidebar
          chatId={chatId}
          userId={userId}
          chatInfo={currentChat}
          closeSidebar={() => setShowSidebar(false)}
          participants={participants}
          users={users}
          socket={socket}
          refetchGroupChats={refetchGroupChats}
        />
      </div>
    </div>
  );
};

export default ChatArea;
