import React, { useState, useRef } from 'react';
import { Overlay, Popover, Spinner } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteMergeQuote } from '../../../../../../APIs/CalApi';
import { romanize } from '../../../../shared/utils/helper';

const DeleteMerge = ({ id, index, alias, refetch, setMerges }) => {
  const { unique_id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const targetRef = useRef(null);
  
  // Helper function to update local merges state
  const removeFromLocalState = () => {
    setMerges((merges) => {
      const updatedMerges = merges
        .filter((_, i) => i !== index)
        .map((merge, i) => ({ ...merge, alias: romanize(i + 1) }));
      return updatedMerges;
    });
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteMergeQuote(id),
    onSuccess: () => {
      toast.success(`Merge item deleted successfully`);
      // Update local state immediately for UI responsiveness
      // Don't call refetch() as it regenerates keys and breaks the UI
      removeFromLocalState();
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.log('error: ', error);
      toast.error(`Failed to delete merge item. Please try again.`);
      setShowDeleteModal(false);
    }
  });

  const handleDelete = () => {
    // If merge has an id (saved to server), call delete API
    // Otherwise, just remove from local state
    if (id) {
      deleteMutation.mutate();
    } else {
      removeFromLocalState();
      setShowDeleteModal(false);
    }
  };

  const deleteMergeItem = () => {
    setShowDeleteModal(true);
  };

  return (
    <React.Fragment>
      {
        deleteMutation.isPending ? (
          <Spinner animation="border" role="status" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <span ref={targetRef}>
            <Trash onClick={deleteMergeItem} color="#98A2B3" size={16} className='cursor-pointer' />
          </span>
        )
      }

      <Overlay
        show={showDeleteModal}
        target={targetRef.current}
        placement="left"
        containerPadding={20}
        rootClose
        onHide={() => setShowDeleteModal(false)}
      >
        <Popover id="delete-popover" style={{ maxWidth: '280px' }}>
          <Popover.Body className="p-3">
            <div className="d-flex align-items-start">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0 me-2"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FEE4E2'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6.66667V10M10 13.3333H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#D92D20" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#344054',
                  margin: '0 0 12px 0',
                  lineHeight: '18px'
                }}>
                  Delete this record?
                </p>
                <div className="d-flex" style={{ gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      border: '1px solid #D0D5DD',
                      color: '#344054',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      lineHeight: '18px'
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      backgroundColor: '#D92D20',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      lineHeight: '18px'
                    }}
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Yes'}
                  </button>
                </div>
              </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </React.Fragment>
  );
};

export default DeleteMerge;
