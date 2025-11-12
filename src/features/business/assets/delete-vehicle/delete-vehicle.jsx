import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { deleteVehicle } from '../../../../APIs/assets-api';

const DeleteVehicle = ({ id, refetch, onClose }) => {
    const deleteVehicleMutation = useMutation({
        mutationFn: () => deleteVehicle(id),
        onSuccess: () => {
            if (refetch) refetch();
            if (onClose) onClose();
            toast.success('Vehicle deleted successfully');
        },
        onError: (error) => {
            console.error('Error deleting vehicle:', error);
            toast.error('Failed to delete vehicle. Please try again.');
        }
    });

    const handleConfirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to delete this vehicle?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deleteVehicleMutation.mutate(),
            reject: () => { }
        });
    };

    return (
        <>
            <ConfirmPopup />
            <Button 
                type='button' 
                className='outline-button'
                onClick={handleConfirmDelete}
                disabled={deleteVehicleMutation.isPending}
            >
                {deleteVehicleMutation.isPending ? (
                    <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                ) : (
                    <Trash color='#344054' size={20} />
                )}
            </Button>
        </>
    );
};

export default DeleteVehicle;
