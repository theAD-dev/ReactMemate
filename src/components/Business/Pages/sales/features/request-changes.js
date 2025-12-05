import React, { useState } from 'react';
import { ChatText, X, Clock } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import styles from './request-changes.module.scss';

const RequestChanges = ({ requestChanges, quoteNumber, status }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Check if there are any request changes and status is Review
  const hasChanges = requestChanges && requestChanges.length > 0;
  const showIcon = hasChanges && status === 'Review';

  // Don't render anything if no changes or not in Review status
  if (!showIcon) {
    return null;
  }

  return (
    <>
      <button 
        className={styles.iconButton}
        onClick={handleShow}
        title={`${requestChanges.length} change request(s)`}
      >
        <ChatText 
          color="#FDB022" 
          size={16} 
        />
        {requestChanges.length > 0 && (
          <span className={styles.badge}>{requestChanges.length}</span>
        )}
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        size='lg'
        animation={false}
      >
        <Modal.Header className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <ChatText size={20} color="#FDB022" />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.headerTitle}>Change Requests</h2>
              <p className={styles.headerSubtitle}>
                Quote {quoteNumber} • {requestChanges?.length || 0} request{requestChanges?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            <X size={24} />
          </button>
        </Modal.Header>

        <Modal.Body className={styles.modalBody}>
          {hasChanges ? (
            <div className={styles.changesContainer}>
              {requestChanges.map((change, index) => (
                <div key={index} className={styles.changeCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.messageLabel}>
                      <Clock size={14} />
                      <span>Requested Changes:</span>
                    </div>
                    <div className={styles.messageText}>
                      {change.request_changes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ChatText size={48} color="#D0D5DD" />
              </div>
              <p className={styles.emptyText}>No change requests</p>
              <p className={styles.emptySubtext}>
                Change requests from clients will appear here
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RequestChanges;
