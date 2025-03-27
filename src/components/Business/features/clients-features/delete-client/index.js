import React from 'react';
import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { deleteClient } from '../../../../../APIs/ClientsApi';


const DeleteClient = ({ id }) => {
    const navigate = useNavigate();
    const deleteMutation = useMutation({
        mutationFn: (data) => deleteClient(id),
        onSuccess: () => {
            navigate('/clients');
            toast.success(`Client deleted successfully`);
        },
        onError: (error) => {
            toast.error(`Failed to delete client. Please try again.`);
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
    };
    return (
        <>
            <ConfirmPopup />
            <Button type='button' onClick={handleDeleteClient} disabled={deleteMutation.isPending} className='outline-button'>
                {
                    deleteMutation.isPending ? (
                        <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                    ) : <Trash color='#344054' size={20} />
                }
            </Button>
        </>

    );
};

export default DeleteClient;