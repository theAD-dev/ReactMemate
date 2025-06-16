import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { restoreSupplier } from '../../../../../APIs/SuppliersApi';

const RestoreSupplier = ({ id, refetch }) => {
    const navigate = useNavigate();
    const [isRestoring, setIsRestoring] = useState(false);

    const restore = async (id) => {
        if (!id) toast.error('Id not found');

        try {
            setIsRestoring(true);
            const res = await restoreSupplier(id);
            if (res?.detail) {
                refetch();
                navigate('/suppliers');
                toast.success(`Supplier restored successfully`);
            }
            else throw new Error("Failed to restore supplier.");
        } catch (err) {
            console.log('err: ', err);
            toast.error(`Failed to restore supplier. Please try again.`);
        } finally {
            setIsRestoring(false);
        }
    };
    return (
        <Button type='button' disabled={isRestoring} onClick={(e) => { e.stopPropagation(); restore(id); }} className='outline-button'>
            Restore Supplier {isRestoring && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
        </Button>
    );
};

export default RestoreSupplier;