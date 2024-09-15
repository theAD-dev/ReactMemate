import React, { useState } from 'react'
import style from './calculators.module.scss';
import { Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { deleteSettingCalculator } from '../../../../APIs/CalApi';
import confirmImg from '../../../../assets/images/confirm-img.svg';

const DeleteConfirmationModal = ({ title, api, refetch }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible(false);
    const stop = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            await deleteSettingCalculator(api);
            refetch();
            toast.success(`${title} deleted successfully`);
            setVisible(false);
        } catch (err) {
            console.log('err: ', err);
            toast.error(`Failed to delete ${title}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    }

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex justify-content-center align-items-center gap-2">
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    Are you sure you want to delete {title}?
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={() => setVisible(false)}>Cancel</Button>
            <Button className='danger-button' onClick={handleConfirm}>Delete {title} {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px', color: '#fff' }} />}</Button>
        </div>
    );
    return (
        <div onClick={stop}>
            <Button className={style.delete} onClick={(e) => setVisible(true)}><Trash color="#B42318" size={18} className='me-2' />Delete {title}</Button>
            <Dialog visible={visible} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} style={{ width: '670px' }} onHide={handleClose}>
                <div className="d-flex flex-column align-items-center justify-content-center">
                   <img src={confirmImg} alt='confirm'/> 
                </div>
            </Dialog>
        </div>
    )
}

export default DeleteConfirmationModal