import React, { useRef, useState } from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './RecurringJobActions.module.scss';
import { deleteRecurringJob, activateRecurringJob, pauseRecurringJob } from '../../../../APIs/settings-recurring-api';

const RecurringJobActions = ({ jobId, status, onActionComplete }) => {
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteRecurringJob(jobId);
      if (onActionComplete) onActionComplete('delete');
    } catch (error) {
      console.error('Error deleting recurring job:', error);
      toast.error('Failed to delete recurring job');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      await pauseRecurringJob(jobId);
      if (onActionComplete) onActionComplete('pause');
    } catch (error) {
      console.error('Error pausing recurring job:', error);
      toast.error('Failed to pause recurring job');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    try {
      setLoading(true);
      await activateRecurringJob(jobId);
      if (onActionComplete) onActionComplete('activate');
    } catch (error) {
      console.error('Error activating recurring job:', error);
      toast.error('Failed to activate recurring job');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      label: status === 'active' ? 'Pause' : 'Activate',
      icon: status === 'active' ? 'pi pi-pause' : 'pi pi-play',
      command: status === 'active' ? handlePause : handleActivate,
      className: status === 'active' ? styles.suspendItem : styles.activateItem,
      disabled: loading,
      template: (item) => (
        <div
          className={`${styles.menuItem} ${loading ? styles.disabled : ''}`}
          onClick={loading ? null : item.command}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <span className={styles.menuItemText}>
            {status === 'active' ? 'Suspend schedule' : 'Activate schedule'}
          </span>
          <span className={styles.menuItemIcon}>
            {status === 'active' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
              </svg>
            )}
          </span>
        </div>
      )
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: handleDelete,
      className: styles.deleteItem,
      disabled: loading,
      template: (item) => (
        <div
          className={`${styles.menuItem} ${loading ? styles.disabled : ''}`}
          onClick={loading ? null : item.command}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <span className={styles.menuItemText}>Delete</span>
          <span className={styles.menuItemIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </span>
        </div>
      )
    }
  ];

  return (
    <div className={styles.actionButton}>
      <Button
        icon={loading ? <ProgressSpinner style={{ width: '18px', height: '18px' }} /> : <ThreeDotsVertical size={18} color={loading ? "#ccc" : "#667085"} />}
        className="m-auto"
        onClick={(e) => {
          if (!loading) {
            e.stopPropagation();
            menuRef.current.toggle(e);
          }
        }}
        disabled={loading}
        aria-label="Actions"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          width: 'fit-content',
          height: 'fit-content',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      />
      <Menu
        model={loading ? [] : items}
        popup
        ref={menuRef}
        className={styles.actionMenu}
        appendTo={document.body}
      />
    </div>
  );
};

export default RecurringJobActions;
