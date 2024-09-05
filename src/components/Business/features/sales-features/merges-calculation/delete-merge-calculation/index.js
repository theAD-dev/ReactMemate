import React from 'react'
import { toast } from 'sonner';
import { Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import { deleteMergeQuote } from '../../../../../../APIs/CalApi';

const DeleteMerge = ({ id, refetch }) => {
  const deleteMutation = useMutation({
    mutationFn: (data) => deleteMergeQuote(id),
    onSuccess: () => {
      toast.success(`Merge item deleted successfully`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete merge item. Please try again.`);
    }
  });

  const accept = () => deleteMutation.mutate();
  const reject = () => { };

  const deleteMergeItem = (event) => {
    if (!id) return toast.error("Id not found");
    confirmPopup({
      target: event.currentTarget,
      message: 'Do you want to delete this record?',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept,
      reject,
    });
  }

  return (
    <React.Fragment>
      <ConfirmPopup />
      {
        deleteMutation.isPending ? (
          <Spinner animation="border" role="status" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : <Trash onClick={deleteMergeItem} color="#98A2B3" size={16} className='cursor-pointer' />
      }
    </React.Fragment>
  )
}

export default DeleteMerge