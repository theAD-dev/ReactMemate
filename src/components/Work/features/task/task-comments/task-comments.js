import { forwardRef, useImperativeHandle } from 'react';
import { FileEarmark } from 'react-bootstrap-icons';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import styles from './task-comments.module.scss';
import { deleteTaskComment, getCommentsForTask } from '../../../../../APIs/task-api';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';

/**
 * Normalize API response → UI-friendly shape
 */
const normalizeComment = (c) => {
    // Parse attachments - could be single URL or JSON array string
    let attachmentUrls = [];
    let attachmentTypes = [];

    if (c.attachment_url) {
        try {
            // Try to parse as JSON array
            const parsed = JSON.parse(c.attachment_url);
            if (Array.isArray(parsed)) {
                attachmentUrls = parsed;
            } else {
                attachmentUrls = [c.attachment_url];
            }
        } catch {
            // Not JSON, treat as single URL
            attachmentUrls = [c.attachment_url];
        }
    }

    if (c.attachment_type) {
        try {
            const parsed = JSON.parse(c.attachment_type);
            if (Array.isArray(parsed)) {
                attachmentTypes = parsed;
            } else {
                attachmentTypes = [c.attachment_type];
            }
        } catch {
            attachmentTypes = [c.attachment_type];
        }
    }

    return {
        id: c.id,
        text: c.comment,
        created_at: c.created_at,
        attachments: attachmentUrls.map((url, index) => ({
            url,
            type: attachmentTypes[index] || 'application/octet-stream',
        })),
        // Keep backward compatibility
        attachment_url: c.attachment_url || null,
        attachment_type: c.attachment_type || null,
        user: {
            id: c.created_by?.id,
            full_name: c.created_by?.full_name,
            email: c.created_by?.email,
            photo: c.created_by?.avatar,
            role: c.created_by?.role,
        },
    };
};

/**
 * Time ago helper
 */
const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / (1000 * 60));

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
};

const TaskComments = forwardRef(({ taskId, usersMap = new Map() }, ref) => {
    const {
        data,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['task-comments', taskId],
        queryFn: ({ pageParam }) =>
            pageParam
                ? fetch(pageParam).then(res => res.json())
                : getCommentsForTask(taskId),
        enabled: !!taskId,
        getNextPageParam: (lastPage) => lastPage.next,
    });

    useImperativeHandle(ref, () => ({
        refetchComments: () => refetch(),
    }));

    const deleteCommentMutation = useMutation({
        mutationFn: deleteTaskComment,
        onSuccess: () => {
            toast.success('Comment deleted');
            refetch();
        },
        onError: () => {
            toast.error('Failed to delete comment');
        },
    });

    /**
     * Flatten + normalize + sort (oldest → newest)
     */
    const comments = data
        ? data.pages
            .slice()
            .flatMap(page => page.results)
            .map(normalizeComment)
            .sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            )
            .reverse()
        : [];

    if (isLoading) {
        return <div className={styles.loading}>Loading comments…</div>;
    }

    if (!comments.length) {
        return (
            <div className={styles.noComments}>No comments yet.</div>
        );
    }

    const handleDeleteComment = (commentId) => {
        deleteCommentMutation.mutate(commentId);
    };

    return (
        <div className={styles.commentsContainer}>
            {/* Load Older (Asana-style) */}
            {hasNextPage && (
                <div className={styles.loadMoreWrapper}>
                    <button
                        onClick={fetchNextPage}
                        disabled={isFetchingNextPage}
                        className={styles.loadMoreBtn}
                    >
                        {isFetchingNextPage
                            ? 'Loading…'
                            : 'Load older comments'}
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className={styles.commentsList}>
                {comments.map((comment) => {
                    // Get user data from usersMap if available, fallback to comment.user
                    const userFromMap = usersMap.get(comment.user?.id);
                    const avatarPhoto = userFromMap?.photo || comment.user?.photo;
                    const hasPhoto = userFromMap?.has_photo || !!avatarPhoto;
                    
                    return (
                    <div key={comment.id} className={styles.commentItem}>
                        <div className="d-flex gap-3">
                            <div
                                className={styles.avatar}
                            >
                                <FallbackImage
                                    photo={avatarPhoto}
                                    has_photo={hasPhoto}
                                    is_business={false}
                                    size={18}
                                />
                            </div>

                            <div className="flex-grow-1" style={{ width: 'calc(100% - 50px)'}}>
                                <div className={styles.header}>
                                    <span className={styles.userName}>
                                        {comment.user?.full_name}
                                    </span>
                                    <span className={styles.commentTime}>
                                        · {formatTimeAgo(comment.created_at * 1000)}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        disabled={deleteCommentMutation.isLoading}
                                        className={styles.deleteButton}
                                        style={{
                                            marginLeft: '5px',
                                            background: 'none',
                                            border: 'none',
                                            color: '#D92D20',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>

                                <p className={styles.commentText}>
                                    {comment.text}
                                </p>

                                {/* Attachments Display - supports multiple */}
                                {comment.attachments && comment.attachments.length > 0 && (
                                    <div className={styles.attachmentContainer}>
                                        {comment.attachments.map((attachment, index) => (
                                            attachment.type?.startsWith('image/') ? (
                                                <a 
                                                    key={index}
                                                    href={attachment.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={styles.imageAttachment}
                                                >
                                                    <img 
                                                        src={attachment.url} 
                                                        alt={`Attachment ${index + 1}`} 
                                                        className={styles.attachmentImage}
                                                    />
                                                </a>
                                            ) : (
                                                <a 
                                                    key={index}
                                                    href={attachment.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={styles.fileAttachment}
                                                >
                                                    <div className={styles.fileIconWrapper}>
                                                        <FileEarmark size={18} />
                                                    </div>
                                                    <div className={styles.fileDetails}>
                                                        <span className={styles.fileName}>
                                                            {attachment.url.split('/').pop()?.split('?')[0] || 'Attachment'}
                                                        </span>
                                                        <span className={styles.fileAction}>Click to download</span>
                                                    </div>
                                                </a>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
});

export default TaskComments;
