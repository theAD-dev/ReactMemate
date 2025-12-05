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
        const publicKey = rowData.public_key;
        
        // Check if public_key exists
        if (!publicKey) {
            toast.error('Public key not available for this form');
            setOpen(false);
            return;
        }

        let contentToCopy;
        let successMessage;

        if (rowData.type === 'form') {
            // For type "form", copy the direct link
            const apiBase = process.env.REACT_APP_BACKEND_API_URL || 'https://app.memate.com.au/api/v1';
            contentToCopy = `${apiBase}/inquiries/form/page/${publicKey}/`;
            successMessage = 'Form link copied to clipboard';
        } else {
            // For type "web", copy the embed code
            const host =  process.env.REACT_APP_URL || window.location.origin;
            contentToCopy = `<script src="${host}/astatic/inquiries/embed.js" data-form-id="${publicKey}"></` + `script>`;
            successMessage = 'Embed code copied to clipboard';
        }

        try {
            await navigator.clipboard.writeText(contentToCopy);
            toast.success(successMessage);
        } catch (error) {
            // Fallback for browsers that don't support clipboard API
            const ta = document.createElement('textarea');
            ta.value = contentToCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand && document.execCommand('copy');
            document.body.removeChild(ta);
            toast.success(successMessage);
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
            <div style={{ position: 'relative' }}>
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
                    menuClassName="action-menu-portal"
                    menuStyle={{ padding: '4px', width: '241px', textAlign: 'left' }}
                    portal={{ target: document.body }}
                    align="end"
                    position="anchor"
                    direction="bottom"
                    overflow="auto"
                >
                <div className='d-flex flex-column gap-2'>
                    <div
                        className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'
                        onClick={handleCopyEmbed}
                    >
                        <Copy color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>
                            {rowData.type === 'form' ? 'Copy Link' : 'Copy Embed'}
                        </span>
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
                            navigate(`/enquiries?formId=${rowData.id}`);
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
            </div>
        </React.Fragment>
    );
};

export default ActionsMenu;
