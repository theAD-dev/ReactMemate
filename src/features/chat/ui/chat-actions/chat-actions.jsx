import { useState, useEffect } from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import styles from './chat-action.module.scss';

const ChatActions = ({ privateChat }) => {
    const [menuRef, setMenuRef] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    return (
        <>
            <button
                className={styles.menuButton}
                onClick={() => setMenuVisible(!menuVisible)}
                ref={setMenuRef}
            >
                <ThreeDotsVertical size={20} color="#667085" />
            </button>
        </>
    );
};

export default ChatActions;