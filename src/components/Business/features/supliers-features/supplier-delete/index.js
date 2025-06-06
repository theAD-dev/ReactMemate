import React from 'react';
import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { deleteSupplier } from '../../../../../APIs/SuppliersApi';
import { useAuth } from '../../../../../app/providers/auth-provider';
import { PERMISSIONS } from '../../../../../shared/lib/access-control/permission';
import { hasPermission } from '../../../../../shared/lib/access-control/role-permission';

const DeleteSupplier = ({ id }) => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: () => deleteSupplier(id),
    onSuccess: () => {
      toast.success(`Supplier deleted successfully`);
      navigate('/suppliers');
    },
    onError: (error) => {
      console.log('error: ', error);
      toast.error(`Failed to delete supplier. Please try again.`);
    }
  });

  const accept = () => {
    deleteMutation.mutate();
  };

  const reject = () => { };

  const handleDeleteClient = (event) => {
    if (!id) return toast.error("Id not found");
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
    <>
      <ConfirmPopup />
      {
        hasPermission(role, PERMISSIONS.SUPPLIERS.DELETE) ? (
          <Button type='button' onClick={handleDeleteClient} disabled={deleteMutation.isPending} className='outline-button'>
            {
              deleteMutation.isPending ? (
                <ProgressSpinner style={{ width: '20px', height: '20px' }} />
              ) : <Trash color='#344054' size={20} />
            }
          </Button>
        ) : <span></span>
      }
    </>

  );
};

export default DeleteSupplier;