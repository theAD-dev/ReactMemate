import { forwardRef, useImperativeHandle } from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import styles from './task-comments.module.scss';
import { deleteTaskComment, getCommentsForTask } from '../../../../../APIs/task-api';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';

/**
 * Normalize API response → UI-friendly shape
 */
const normalizeComment = (c) => ({
    id: c.id,
    text: c.comment,
    created_at: c.created_at,
    user: {
        id: c.created_by?.id,
        full_name: c.created_by?.full_name,
        email: c.created_by?.email,
        photo: c.created_by?.avatar,
        role: c.created_by?.role,
    },
});

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

const TaskComments = forwardRef(({ taskId }, ref) => {
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
                {comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                        <div className="d-flex gap-3">
                            <div
                                className={styles.avatar}
                            >
                                <FallbackImage
                                    photo={comment.user?.photo}
                                    has_photo={!!comment.user?.photo}
                                    is_business={false}
                                    size={18}
                                />
                            </div>

                            <div className="flex-grow-1">
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default TaskComments;
