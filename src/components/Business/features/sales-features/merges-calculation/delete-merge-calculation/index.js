import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { toast } from 'sonner';
import { deleteMergeQuote } from '../../../../../../APIs/CalApi';

const DeleteMerge = ({ id, alias, refetch, setMerges }) => {
  const { unique_id } = useParams();
  const deleteMutation = useMutation({
    mutationFn: () => deleteMergeQuote(id),
    onSuccess: () => {
      toast.success(`Merge item deleted successfully`);
      refetch();
    },
    onError: (error) => {
      console.log('error: ', error);
      toast.error(`Failed to delete merge item. Please try again.`);
    }
  });

  const accept = () => {
    if (unique_id) {
      if (!id) return toast.error("Id not found");
      deleteMutation.mutate();
    } else {
      setMerges((merges) => {
        let updatedMerges = merges.filter((merge) => merge.alias !== alias);
        return updatedMerges;
      });
    }
  };
  const reject = () => { };

  const deleteMergeItem = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Do you want to delete this record?',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept,
      reject,
    });
  };

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
  );
};

export default DeleteMerge;