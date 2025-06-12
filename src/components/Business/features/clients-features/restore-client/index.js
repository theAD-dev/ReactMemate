import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { restoreClient } from '../../../../../APIs/ClientsApi';

const Restore = ({ id, refetch }) => {
    const navigate = useNavigate();
    const [isRestoring, setIsRestoring] = useState(false);

    const restorClient = async (id) => {
        if (!id) toast.error('Id not found');

        try {
            setIsRestoring(true);
            const res = await restoreClient(id);
            if (res?.detail) {
                refetch();
                navigate('/clients');
                toast.success(`Client restored successfully`);
            }
            else throw new Error("Failed to restore client.");
        } catch (err) {
            console.log('err: ', err);
            toast.error(`Failed to restore client. Please try again.`);
        } finally {
            setIsRestoring(false);
        }
    };
    return (
        <Button type='button' disabled={isRestoring} onClick={(e) => { e.stopPropagation(); restorClient(id); }} className='outline-button'>
            Restore Client {isRestoring && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
        </Button>
    );
};

export default Restore;