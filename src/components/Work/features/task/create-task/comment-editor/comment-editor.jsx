import React, { useRef, useState, useCallback, useEffect } from 'react';
import { EmojiSmile, FileEarmark, Image as ImageIcon, Paperclip, X } from 'react-bootstrap-icons';
import axios from 'axios';
import clsx from 'clsx';
import EmojiPicker from 'emoji-picker-react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import { toast } from 'sonner';
import styles from './comment-editor.module.scss';
import { createTaskComment, getCommentPresignedUrl } from '../../../../../../APIs/task-api';
import { FallbackImage } from '../../../../../../shared/ui/image-with-fallback/image-avatar';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CommentEditor = ({
    taskId,
    session,
    onCommentAdded,
    disabled = false,
    commentsScrollRef
}) => {
    const [comment, setComment] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    // Handle emoji selection
    const handleEmojiSelect = (emojiData) => {
        setComment(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        editorRef.current?.focus();
    };

    // Upload file to S3 using presigned URL - matching create-job.js pattern
    const uploadToS3 = async (file, url, fileId) => {
        try {
            const response = await axios.put(url, file, {
                headers: {
                    "Content-Type": "", // Empty content type like create-job.js
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setUploadingFiles(prev =>
                        prev.map(f => f.id === fileId ? { ...f, progress, url } : f)
                    );
                },
            });

            // Mark as successfully uploaded
            setUploadingFiles(prev =>
                prev.map(f => f.id === fileId ? { ...f, progress: 100, uploaded: true } : f)
            );

            return response;
        } catch (err) {
            // Handle specific error types
            let errorMessage = "Upload failed";

            if (err.response) {
                if (err.response.status === 403) {
                    errorMessage = "Permission denied (403 Forbidden)";
                } else {
                    errorMessage = `Server error: ${err.response.status}`;
                }
            } else if (err.request) {
                errorMessage = "No response from server";
            } else {
                errorMessage = err.message;
            }

            console.error(`Error uploading ${file.name}:`, errorMessage);

            // Update file with error status
            setUploadingFiles(prev =>
                prev.map(f => f.id === fileId ? {
                    ...f,
                    progress: 0,
                    error: true,
                    errorMessage,
                    uploadFailed: true
                } : f)
            );

            return { error: true, message: errorMessage };
        }
    };

    // Handle file upload
    const handleFileUpload = async (files) => {
        if (!taskId) {
            toast.error('Save the task first before adding attachments');
            return;
        }

        const validFiles = Array.from(files).filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`${file.name} is too large. Max size is 10MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newUploading = validFiles.map((file, index) => ({
            id: `upload-${Date.now()}-${index}`,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            file,
        }));

        setUploadingFiles(prev => [...prev, ...newUploading]);

        for (const uploadFile of newUploading) {
            try {
                // Get presigned URL
                const response = await getCommentPresignedUrl(taskId, uploadFile.name, uploadFile.type);
                const { url } = response;

                if (!url) {
                    console.error(`No URL returned for file: ${uploadFile.name}`);
                    setUploadingFiles(prev =>
                        prev.map(f => f.id === uploadFile.id ? { ...f, error: true, errorMessage: 'No URL returned' } : f)
                    );
                    continue;
                }

                // Upload to S3 using the signed URL
                const result = await uploadToS3(uploadFile.file, url, uploadFile.id);

                // Check if upload was successful
                if (result && !result.error) {
                    const fileUrl = url.split('?')[0];
                    setAttachments(prev => [...prev, {
                        id: uploadFile.id,
                        name: uploadFile.name,
                        url: fileUrl,
                        type: uploadFile.type,
                        size: uploadFile.size,
                    }]);
                    setUploadingFiles(prev => prev.filter(f => f.id !== uploadFile.id));
                }
            } catch (error) {
                console.error('Error uploading file:', uploadFile.name, error);
                setUploadingFiles(prev =>
                    prev.map(f => f.id === uploadFile.id ? {
                        ...f,
                        progress: 0,
                        error: true,
                        errorMessage: error.message || 'Failed to get upload URL',
                        uploadFailed: true
                    } : f)
                );
            }
        }
    };

    // Drag and drop handlers
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dropZoneRef.current?.contains(e.relatedTarget)) {
            setIsDragOver(false);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    // Paste handler for images
    const handlePaste = useCallback((e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const files = [];
        for (const item of items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }

        if (files.length > 0) {
            e.preventDefault();
            handleFileUpload(files);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    // Remove attachment
    const removeAttachment = (id) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    // Remove uploading file
    const removeUploadingFile = (id) => {
        setUploadingFiles(prev => prev.filter(f => f.id !== id));
    };

    // Submit comment
    const handleSubmit = async () => {
        if (!comment.trim() && attachments.length === 0) {
            return;
        }

        if (!taskId) {
            toast.error('Save the task first');
            return;
        }

        setIsSubmitting(true);

        try {
            // Support multiple attachments - store as JSON string
            let attachmentUrls = null;
            let attachmentTypes = null;

            if (attachments.length > 0) {
                if (attachments.length === 1) {
                    // Single attachment - keep backward compatibility
                    attachmentUrls = attachments[0].url;
                    attachmentTypes = attachments[0].type;
                } else {
                    // Multiple attachments - store as JSON array string
                    attachmentUrls = JSON.stringify(attachments.map(a => a.url));
                    attachmentTypes = JSON.stringify(attachments.map(a => a.type));
                }
            }

            await createTaskComment(taskId, {
                comment: comment.trim(),
                attachment_url: attachmentUrls,
                attachment_type: attachmentTypes,
                created_by: { role: session?.user?.role },
            });

            setComment('');
            setAttachments([]);
            onCommentAdded?.();

            // Scroll to bottom
            setTimeout(() => {
                if (commentsScrollRef?.current) {
                    commentsScrollRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                    });
                }
            }, 500);
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
            editorRef.current?.focus();
        }
    };

    // Handle key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Get file icon based on type
    const getFileIcon = (type) => {
        if (type?.startsWith('image/')) {
            return <ImageIcon size={16} />;
        }
        return <FileEarmark size={16} />;
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Check if file is an image
    const isImage = (type) => type?.startsWith('image/');

    const hasContent = comment.trim() || attachments.length > 0;

    return (
        <div className={styles.asanaEditorWrapper}>
            {/* User Avatar */}
            <div className={styles.avatarWrapper}>
                <FallbackImage
                    photo={session?.photo}
                    has_photo={session?.has_photo}
                    is_business={false}
                    size={20}
                />
            </div>

            {/* Attachments Preview - Shows when there are attachments */}
            {(attachments.length > 0 || uploadingFiles.length > 0) && (
                <div className={styles.attachmentsPreview}>
                    {/* Uploading Files */}
                    {uploadingFiles.map(file => (
                        isImage(file.type) ? (
                            <div key={file.id} className={styles.imagePreviewChip}>
                                <img src={URL.createObjectURL(file.file)} alt={file.name} />
                                <button
                                    className={styles.removeImageBtn}
                                    onClick={() => removeUploadingFile(file.id)}
                                    type="button"
                                >
                                    <X size={12} />
                                </button>
                                {!file.uploaded && !file.error && (
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${file.progress}%` }} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div key={file.id} className={clsx(styles.attachmentChip, file.error && styles.error)}>
                                <div className={styles.fileIcon}>
                                    {getFileIcon(file.type)}
                                </div>
                                <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>{file.name}</span>
                                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                                </div>
                                <span className={clsx(styles.fileStatus, file.error && styles.error)}>
                                    {file.error ? 'Failed' : `${file.progress}%`}
                                </span>
                                <button
                                    className={styles.removeChip}
                                    onClick={() => removeUploadingFile(file.id)}
                                    type="button"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )
                    ))}

                    {/* Uploaded Attachments */}
                    {attachments.map(attachment => (
                        isImage(attachment.type) ? (
                            <div key={attachment.id} className={styles.imagePreviewChip}>
                                <img src={attachment.url} alt={attachment.name} />
                                <button
                                    className={styles.removeImageBtn}
                                    onClick={() => removeAttachment(attachment.id)}
                                    type="button"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <div key={attachment.id} className={styles.attachmentChip}>
                                <div className={styles.fileIcon}>
                                    {getFileIcon(attachment.type)}
                                </div>
                                <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>{attachment.name}</span>
                                    <span className={styles.fileSize}>{formatFileSize(attachment.size)}</span>
                                </div>
                                <button
                                    className={styles.removeChip}
                                    onClick={() => removeAttachment(attachment.id)}
                                    type="button"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Editor Container - Asana Style */}
            <div
                className={clsx(
                    styles.editorContainer,
                    isFocused && styles.focused,
                    isDragOver && styles.dragOver,
                    disabled && styles.disabled
                )}
                ref={dropZoneRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {/* Text Input Area */}
                <div className={styles.inputArea}>
                    <input
                        ref={editorRef}
                        type="text"
                        className={styles.textInput}
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled || isSubmitting || !taskId}
                    />
                </div>

                {/* Bottom Toolbar - Simplified */}
                <div className={styles.toolbar}>
                    <div className={styles.toolbarLeft}>
                        {/* Emoji picker */}
                        <div className={styles.emojiWrapper} ref={emojiPickerRef}>
                            <button
                                className={styles.toolbarIcon}
                                type="button"
                                title="Add emoji"
                                disabled={disabled || !taskId}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <EmojiSmile size={18} />
                            </button>
                            {showEmojiPicker && (
                                <div className={styles.emojiPickerDropdown}>
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiSelect}
                                        theme="light"
                                        width={300}
                                        height={350}
                                        searchPlaceHolder="Search emoji..."
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Attach file */}
                        <button
                            className={styles.toolbarIcon}
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            title="Attach file"
                            disabled={disabled || !taskId}
                        >
                            <Paperclip size={18} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files)}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className={styles.toolbarRight}>
                        {/* Comment Button */}
                        <Button
                            onClick={handleSubmit}
                            className={clsx(styles.commentBtn, hasContent && styles.active)}
                            disabled={disabled || isSubmitting || !taskId || !hasContent}
                        >
                            {isSubmitting ? (
                                <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="3" />
                            ) : (
                                'Comment'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentEditor;
