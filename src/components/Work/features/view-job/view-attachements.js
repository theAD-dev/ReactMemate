import React, { useCallback, useMemo, useState } from 'react';
import { CloudUpload, Download, Trash, X } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './view-job.module.scss';
import { deleteJobAttachment } from '../../../../APIs/jobs-api';
import { CircularProgressBar } from '../../../../shared/ui/circular-progressbar';
import { getFileIcon } from '../create-job/create-job';

const ViewAttachements = ({ jobId, show, setShow, attachments = [], onRefetch }) => {
    const [files, setFiles] = useState([]);
    const accessToken = localStorage.getItem("access_token");

    // Deduplicate attachments by link to prevent showing duplicates
    const uniqueAttachments = useMemo(() => {
        const attachmentsMap = new Map();
        attachments.forEach(att => {
            if (att?.link) {
                attachmentsMap.set(att.link, att);
            }
        });
        return Array.from(attachmentsMap.values());
    }, [attachments]);

    const uploadToS3 = useCallback(async (file, url, fileId) => {
        try {
            await axios.put(url, file, {
                headers: {
                    "Content-Type": "",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setFiles(prev =>
                        prev.map(f =>
                            f.id === fileId ? { ...f, progress, url: url.split('?')[0] } : f
                        )
                    );
                },
            });

            // Mark as successfully uploaded
            setFiles(prev =>
                prev.map(f =>
                    f.id === fileId ? { ...f, progress: 100, uploaded: true } : f
                )
            );

            return { success: true };
        } catch (err) {
            let errorMessage = "Upload failed";
            if (err.response) {
                if (err.response.status === 403) {
                    errorMessage = "Permission denied";
                } else {
                    errorMessage = `Server error: ${err.response.status}`;
                }
            } else if (err.request) {
                errorMessage = "No response from server";
            } else {
                errorMessage = err.message;
            }

            setFiles(prev =>
                prev.map(f =>
                    f.id === fileId ? { ...f, progress: 0, error: true, errorMessage } : f
                )
            );

            return { success: false, error: errorMessage };
        }
    }, []);

    const updateAttachmentsInDB = useCallback(async (fileData, fileUrl) => {
        try {
            // Only send the newly uploaded file, not all attachments
            const newAttachment = {
                name: fileData.name,
                link: fileUrl,
                size: fileData.size
            };

            await axios.post(
                `${process.env.REACT_APP_BACKEND_API_URL}/jobs/attachments/${jobId}/`,
                { attachments: [newAttachment] },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            return newAttachment;
        } catch (err) {
            console.error("Error updating attachments in DB:", err);
            throw err;
        }
    }, [jobId, accessToken]);

    const uploadFile = useCallback(async (fileData) => {
        try {
            // Step 1: Get signed URL
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_API_URL}/jobs/attachments/url/${jobId}/`,
                { filename: fileData.name },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const { url } = response.data;
            if (!url) {
                throw new Error('No URL received from server');
            }

            // Step 2: Upload to S3
            const result = await uploadToS3(fileData.file, url, fileData.id);

            if (result.success) {
                const fileUrl = url.split('?')[0];
                
                // Step 3: Update attachments in DB (only sends the new file)
                const uploadedFile = await updateAttachmentsInDB(fileData, fileUrl);
                toast.success(`Successfully uploaded ${fileData.name}`);
                
                // Remove from uploading files after success
                setTimeout(() => {
                    setFiles(prev => prev.filter(f => f.id !== fileData.id));
                }, 1000);
                
                // Refetch to update the attachments list
                if (onRefetch) onRefetch();
                
                return uploadedFile;
            }
            return null;
        } catch (error) {
            console.error("Error uploading file:", fileData.name, error);
            toast.error(`Failed to upload ${fileData.name}`);
            setFiles(prev =>
                prev.map(f =>
                    f.id === fileData.id ? { ...f, error: true, errorMessage: error.message } : f
                )
            );
            return null;
        }
    }, [jobId, accessToken, uploadToS3, updateAttachmentsInDB, onRefetch]);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!jobId) {
            toast.error('Job ID not found');
            return;
        }

        // Add files to state with initial progress
        const newFiles = acceptedFiles.map((file, index) => ({
            id: Date.now() + index,
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            uploaded: false,
            error: false,
            errorMessage: ''
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Upload each file sequentially
        for (const fileData of newFiles) {
            await uploadFile(fileData);
        }
    }, [jobId, uploadFile]);

    // Delete mutation similar to files-model.js
    const deleteMutation = useMutation({
        mutationFn: (attachmentId) => deleteJobAttachment(jobId, attachmentId),
        onSuccess: () => {
            toast.success('File deleted successfully');
            if (onRefetch) onRefetch();
        },
        onError: () => {
            toast.error('Failed to delete file');
        },
    });

    const handleDeleteAttachment = (attachment) => {
        if (!attachment?.id) {
            toast.error('Cannot delete: attachment ID not found');
            return;
        }
        deleteMutation.mutate(attachment.id);
    };

    const removeUploadingFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleClose = () => {
        setShow(false);
        setFiles([]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <span className={`white-space-nowrap ${style.headerTitle}`}>Documents</span>
            <span className='font-14' style={{ color: '#667085' }}>
                {uniqueAttachments.length} file{uniqueAttachments.length !== 1 ? 's' : ''}
            </span>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-center'>
            <Button className='outline-button' onClick={handleClose} style={{ borderRadius: '30px' }}>
                Close
            </Button>
        </div>
    );

    return (
        <Dialog 
            visible={show} 
            modal={false} 
            header={headerElement} 
            footer={footerContent} 
            className={`${style.modal} custom-modal`} 
            onHide={handleClose}
        >
            {/* Dropzone for uploading files */}
            <div
                {...getRootProps()}
                className={`${style.dropzone} ${isDragActive ? style.dropzoneActive : ''}`}
                style={{
                    border: `2px dashed ${isDragActive ? '#158ECC' : '#D0D5DD'}`,
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    background: isDragActive ? '#F0F9FF' : '#FAFAFA',
                    transition: 'all 0.2s ease'
                }}
            >
                <input {...getInputProps()} />
                <div className='d-flex flex-column align-items-center gap-2'>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#EBF8FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CloudUpload size={20} color="#158ECC" />
                    </div>
                    <div>
                        <span style={{ color: '#158ECC', fontWeight: 600 }}>Click to upload</span>
                        <span style={{ color: '#667085' }}> or drag and drop</span>
                    </div>
                    <span style={{ color: '#98A2B3', fontSize: '12px' }}>
                        PDF, DOC, XLS, JPG, PNG (max. 10MB)
                    </span>
                </div>
            </div>

            {/* Uploading Files List */}
            {files.length > 0 && (
                <div className='mb-3'>
                    <span className='font-14' style={{ color: '#344054', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                        Uploading...
                    </span>
                    <div className='d-flex flex-column gap-2'>
                        {files.map((fileData) => (
                            <div key={fileData.id} className={style.attachmentBox} style={{ width: '100%', position: 'relative' }}>
                                <div className='d-flex align-items-center gap-2' style={{ flex: 1, minWidth: 0 }}>
                                    {fileData.error ? (
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#FEF3F2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <X size={16} color="#B42318" />
                                        </div>
                                    ) : fileData.uploaded ? (
                                        getFileIcon(fileData.name.split('.').pop())
                                    ) : (
                                        <CircularProgressBar progress={fileData.progress} size={32} />
                                    )}
                                    <div className='d-flex flex-column' style={{ minWidth: 0 }}>
                                        <span className='text-dark ellipsis-width' style={{ fontSize: '14px' }}>
                                            {fileData.name}
                                        </span>
                                        {fileData.error && (
                                            <span style={{ color: '#B42318', fontSize: '12px' }}>
                                                {fileData.errorMessage || 'Upload failed'}
                                            </span>
                                        )}
                                        {!fileData.error && !fileData.uploaded && (
                                            <span style={{ color: '#667085', fontSize: '12px' }}>
                                                {fileData.progress}% uploaded
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {fileData.error && (
                                    <button
                                        className='border-0 p-1 bg-none'
                                        onClick={() => removeUploadingFile(fileData.id)}
                                        title="Remove"
                                    >
                                        <X size={16} color="#667085" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Existing Attachments List */}
            <div className='d-flex flex-wrap gap-2'>
                {uniqueAttachments.map((attachment) => (
                    <div key={attachment?.link} className={style.attachmentBox} style={{ position: 'relative' }}>
                        <div className='d-flex align-items-center gap-2' style={{ flex: 1, minWidth: 0 }}>
                            {getFileIcon(attachment?.extension || attachment?.link?.split('.').pop())}
                            <Link to={attachment?.link} target='_blank' style={{ minWidth: 0 }}>
                                <span className='text-dark ellipsis-width' style={{ display: 'block', maxWidth: '150px' }}>
                                    {attachment?.name}
                                </span>
                            </Link>
                        </div>
                        <div className='d-flex align-items-center gap-1'>
                            <button
                                className='border-0 p-1 bg-none'
                                onClick={() => window.open(attachment?.link, '_blank')}
                                title="Download"
                                style={{ 
                                    borderRadius: '4px',
                                    transition: 'background 0.2s ease'
                                }}
                            >
                                <Download size={16} color="#667085" />
                            </button>
                            <button
                                className='border-0 p-1 bg-none'
                                onClick={() => handleDeleteAttachment(attachment)}
                                disabled={deleteMutation.isPending && deleteMutation.variables === attachment.id}
                                title="Delete"
                                style={{ 
                                    borderRadius: '4px',
                                    transition: 'background 0.2s ease',
                                    opacity: (deleteMutation.isPending && deleteMutation.variables === attachment.id) ? 0.5 : 1
                                }}
                            >
                                {(deleteMutation.isPending && deleteMutation.variables === attachment.id) ? (
                                    <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="4" />
                                ) : (
                                    <Trash size={14} color="#B42318" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
                {uniqueAttachments.length === 0 && files.length === 0 && (
                    <div className='w-100 text-center py-4'>
                        <span style={{ color: '#98A2B3', fontSize: '14px' }}>
                            No documents uploaded yet
                        </span>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default ViewAttachements;