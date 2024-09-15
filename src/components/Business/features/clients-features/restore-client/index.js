import React, { useState } from 'react'
import { restoreClient } from '../../../../../APIs/ClientsApi';
import { toast } from 'sonner';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'react-bootstrap';

const Restore = ({ id, refetch }) => {
    const [isRestoring, setIsRestoring] = useState(false);

    const restorClient = async (id) => {
        if (!id) toast.error('Id not found');

        try {
            setIsRestoring(true);
            const res = await restoreClient(id);
            if (res?.detail) {
                refetch();
                toast.success(`Client restored successfully`);
            }
            else throw new Error("Failed to restore client.");
        } catch (err) {
            console.log('err: ', err);
            toast.error(`Failed to restore client. Please try again.`);
        } finally {
            setIsRestoring(false);
        }
    }
    return (
        <Button type='button' disabled={isRestoring} onClick={(e) => { e.stopPropagation(); restorClient(id); }} className='outline-button'>
            Restore Client {isRestoring && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
        </Button>
    )
}

export default Restore