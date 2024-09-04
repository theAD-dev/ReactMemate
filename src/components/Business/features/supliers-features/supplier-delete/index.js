import React from 'react'
import { Button, Spinner } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { toast } from 'sonner';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const DeleteSupplier = ({ id }) => {
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: (data) => alert('NO API'),
    onSuccess: () => {
      toast.success(`Supplier deleted successfully`);
      navigate('/suppliers');
    },
    onError: (error) => {
      toast.error(`Failed to delete supplier. Please try again.`);
    }
  });

  const accept = () => {
    deleteMutation.mutate();
  };

  const reject = () => { };

  const handleDeleteClient = (event) => {
    if (!id) return toast.error("Id not found");
    console.log('id: ', id);
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
    <>
      <ConfirmPopup />
      <Button type='button' onClick={handleDeleteClient} className='outline-button'>
        {
          deleteMutation.isPending ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : <Trash color='#344054' size={20} />
        }
      </Button>
    </>

  )
}

export default DeleteSupplier