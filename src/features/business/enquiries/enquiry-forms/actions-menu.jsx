import React, { useRef, useState } from 'react';
import { Copy, List, Pencil, ThreeDotsVertical, Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { useMutation } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { deleteForm } from '../../../../APIs/enquiries-api';

const ActionsMenu = ({ rowData, setRefetch }) => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const anchorProps = useClick(isOpen, setOpen);

    const handleCopyEmbed = async () => {
        const host = process.env.REACT_APP_URL || window.location.origin;
        const snippet = `<script src="${host}/astatic/inquiries/embed.js" data-form-id="${rowData.id}"></` + `script>`;

        try {
            await navigator.clipboard.writeText(snippet);
            toast.success('Embed code copied to clipboard');
        } catch (error) {
            // Fallback for browsers that don't support clipboard API
            const ta = document.createElement('textarea');
            ta.value = snippet;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand && document.execCommand('copy');
            document.body.removeChild(ta);
            toast.success('Embed code copied to clipboard');
        } finally {
            setOpen(false);
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteForm(id),
        onSuccess: () => {
            setRefetch(prev => !prev);
            setOpen(false);
            toast.success(`Form deleted successfully`);
        },
        onError: (error) => {
            console.log('Failed to delete form: ', error);
            toast.error(`Failed to delete form. Please try again.`);
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate(rowData.id);
    };

    return (
        <React.Fragment>
            <ThreeDotsVertical
                size={24}
                color="#667085"
                className='cursor-pointer'
                ref={ref}
                {...anchorProps}
            />

            <ControlledMenu
                state={isOpen ? 'open' : 'closed'}
                anchorRef={ref}
                onClose={() => setOpen(false)}
                className={"threeDots"}
                menuStyle={{ padding: '4px', width: '241px', textAlign: 'left' }}
            >
                <div className='d-flex flex-column gap-2'>
                    <div
                        className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'
                        onClick={handleCopyEmbed}
                    >
                        <Copy color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Copy Embed</span>
                    </div>

                    <div
                        className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'
                        onClick={() => {
                            navigate(`/enquiries/form-builder/${rowData.id}`);
                            setOpen(false);
                        }}
                    >
                        <Pencil color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Edit</span>
                    </div>

                    <div
                        className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'
                        onClick={() => {
                            navigate(`/enquiries/form-builder/inquiries?id=${rowData.id}`);
                            setOpen(false);
                        }}
                    >
                        <List color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Enquiries</span>
                    </div>

                    <div
                        className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'
                        onClick={handleDelete}
                    >
                        <Trash color='#B42318' size={20} />
                        <span style={{ color: '#B42318', fontSize: '16px', fontWeight: 500 }}>
                            Delete
                            {deleteMutation.isPending && <ProgressSpinner style={{ width: '14px', height: '14px', marginLeft: '8px' }} />}
                        </span>
                    </div>
                </div>
            </ControlledMenu>
        </React.Fragment>
    );
};

export default ActionsMenu;
