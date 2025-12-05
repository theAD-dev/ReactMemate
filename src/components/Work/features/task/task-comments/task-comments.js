import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './task-comments.module.scss';
import { useAuth } from '../../../../../app/providers/auth-provider';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';

const TaskComments = ({ comments = [] }) => {
    const { session } = useAuth();
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;
        
        // TODO: Implement API call to submit comment
        console.log('Submitting comment:', newComment);
        
        // Reset after submission
        setNewComment('');
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hours ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`;
        }
    };

    return (
        <div className={styles.commentsContainer}>
            {/* Comments Header */}
            {comments.length > 0 && (
                <div className={styles.commentsHeader}>
                    <h6 className={styles.commentsTitle}>Comments</h6>
                </div>
            )}

            {/* Comments List */}
            {comments.length > 0 && (
                <div className={styles.commentsList}>
                    {comments.map((comment, index) => (
                        <div key={comment.id || index} className={styles.commentItem}>
                            <div className='d-flex align-items-start gap-3'>
                                <div className='d-flex justify-content-center align-items-center' style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #EAECF0', flexShrink: 0 }}>
                                    <FallbackImage 
                                        photo={comment.user?.photo} 
                                        has_photo={comment.user?.has_photo} 
                                        is_business={false} 
                                        size={23} 
                                    />
                                </div>
                                <div className='flex-grow-1'>
                                    <div className='d-flex align-items-center gap-2 mb-1'>
                                        <span className={styles.userName}>
                                            {comment.user?.first_name} {comment.user?.last_name}
                                        </span>
                                        <span className={styles.commentTime}>
                                            · {formatTimeAgo(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className={styles.commentText}>{comment.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskComments;
