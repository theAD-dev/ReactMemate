import { Button } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { restoreVehicle } from '../../../../APIs/assets-api';

const RestoreVehicle = ({ id, refetch, onClose }) => {
    const restoreVehicleMutation = useMutation({
        mutationFn: () => restoreVehicle(id),
        onSuccess: () => {
            if (refetch) refetch();
            if (onClose) onClose();
            toast.success('Vehicle restored successfully');
        },
        onError: (error) => {
            console.error('Error restoring vehicle:', error);
            toast.error('Failed to restore vehicle. Please try again.');
        }
    });

    const handleConfirmRestore = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to restore this vehicle?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-success',
            accept: () => restoreVehicleMutation.mutate(),
            reject: () => { }
        });
    };

    return (
        <>
            <ConfirmPopup />
            <Button 
                type='button' 
                className='outline-button'
                onClick={handleConfirmRestore}
                disabled={restoreVehicleMutation.isPending}
            >
                {restoreVehicleMutation.isPending ? (
                    <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                ) : (
                    <>
                        <ArrowCounterclockwise color='#17B26A' size={20} />
                        <span style={{ marginLeft: '0px', color: '#17B26A' }}>Restore</span>
                    </>
                )}
            </Button>
        </>
    );
};

export default RestoreVehicle;
