import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { X, CloudUpload, Trash } from "react-bootstrap-icons";
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'sonner';
import { deleteFileByKey, getProjectFilesById } from '../../../../../../APIs/management-api';
import FolderFileIcon from "../../../../../../assets/images/icon/folderFileIcon.svg";
import { formatFileSize } from '../../../../../../features/chat/ui/chat-area/chat-attachment-popover';
import { BootstrapFileIcons } from '../../../../../../shared/lib/bootstrap-file-icons';

// Helper function to check if file is an image
const isImageFile = (extension) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp', 'heic'];
  return imageExtensions.includes(extension?.toLowerCase());
};

// File Preview Component
const FilePreview = ({ file }) => {
  const extension = file?.key?.split('.').pop()?.toLowerCase();
  const isImage = isImageFile(extension);

  if (isImage) {
    return (
      <div 
        style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '6px', 
          overflow: 'hidden',
          flexShrink: 0,
          background: '#E5E7EB'
        }}
      >
        <img 
          src={file.url} 
          alt={file.key} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
          }}
        />
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '6px', 
        background: '#F9FAFB',
        border: '1px solid #E5E7EB',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <BootstrapFileIcons extension={extension} size={28} />
    </div>
  );
};

const FilesModel = ({ projectId }) => {
  // Used for upload progress tracking in uploadToS3 function
  // eslint-disable-next-line no-unused-vars
  const [files, setFiles] = useState([]);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const accessToken = localStorage.getItem("access_token");
  const handleClose = () => {
    setViewShow(false);
  };

  const filesQuery = useQuery({
    queryKey: ['id', projectId],
    queryFn: () => getProjectFilesById(projectId),
    enabled: !!projectId,
    retry: 1,
    staleTime: 0,
    cacheTime: 0,
  });

  const handleShow = () => {
    setViewShow(true);
  };

  const uploadToS3 = async (file, url) => {
    return axios.put(url, file, {
      headers: {
        "Content-Type": "",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setFiles((prevFiles) => {
          return prevFiles.map((f) =>
            f.name === file.name
              ? Object.assign(f, { progress, url })
              : f
          );
        });
      },
    }).catch((err) => {
      console.log('err: ', err);
      setFiles((prevFiles) => {
        return prevFiles.map((f) =>
          f.name === file.name
            ? Object.assign(f, { progress: 0, url, error: true })
            : f
        );
      });
    });
  };

  const fileUploadBySignedURL = async (files) => {
    if (!files.length) return;
    if (!accessToken) return toast.error('Access token is missing. Please log in again.');

    for (const file of files) {
      const uniqueNumber = Date.now();
      const fileNameParts = file.name.split('.');
      const ext = fileNameParts.pop(); // extension
      const baseName = fileNameParts.join('.');
      const newName = `${baseName}-${uniqueNumber}.${ext}`;

      try {
        setUploadingFile(true);
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/projects/file/${projectId}/`,
          { file_name: newName },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const { url } = response.data;
        if (!url) {
          setFiles([]);
          toast.error(`Failed to upload ${file.name}. Please try again.`);
          return;
        }

        await uploadToS3(file, url);
        filesQuery?.refetch();
        toast.success(`Successfully uploaded ${file.name}`);
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
        toast.error(`Failed to upload ${file.name}. Please try again.`);
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: { 'application/pdf': ['.pdf', '.png', '.jpg', '.jpeg', '.mp4'] },
    maxSize: 25 * 1024 * 1024,
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          progress: 0
        })
      );
      setFiles(() => [...newFiles]);
      fileUploadBySignedURL(newFiles);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (fileKey) => deleteFileByKey(projectId, fileKey),
    onSuccess: () => {
      toast.success('File deleted successfully');
      filesQuery?.refetch();
      deleteMutation.reset();
    },
    onError: () => {
      toast.error('Failed to delete file');
    },
  });

  const removeFile = async (fileKey) => {
    deleteMutation.mutate(fileKey);
  };

  return (
    <>
      {/* View modal trigger */}
      <Button className={`filebut ${filesQuery?.data?.length ? 'fileActive' : ''}`} onClick={handleShow}>
        Files <img src={FolderFileIcon} alt="FolderFileIcon" />
      </Button>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject taskModelProjectFiles"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start py-2">
            <span>
              Integrated File System
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
            <X size={24} color='#667085' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h2 style={{ fontSize: '22px' }}>All Files</h2>
            <div className='d-flex justify-content-end align-items-center'>
              <Button className="solid-button py-1 me-3 font-14" onClick={() => setShowUploadSection(!showUploadSection)}>
                Add
              </Button>

              <div className="searchBox" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                  </svg>
                </div>
                <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
              </div>
            </div>
          </div>

          {showUploadSection &&
            <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column cursor-pointer mb-4' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #EAECF0', marginTop: '16px' }}>
              <input {...getInputProps()} />
              <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '8px', marginBottom: '16px' }}>
                {uploadingFile ? <ProgressSpinner style={{ width: '18px', height: '18px' }} /> : <CloudUpload />}
              </button>
              <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
            </div>
          }
          <div style={{ height: '400px', overflow: 'auto', paddingRight: '4px' }}>
            <div className='d-flex gap-2 flex-wrap'>
              {!filesQuery?.isLoading && filesQuery?.data?.map((file) => {
                return (
                  <div 
                    key={file?.key} 
                    style={{ 
                      background: '#F9FAFB', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      border: '1px solid #EAECF0',
                      height: 'fit-content',
                      width: 'calc(33.333% - 5.33px)',
                      minWidth: '200px'
                    }} 
                    className='d-flex align-items-center justify-content-between gap-2'
                  >
                    <Link 
                      to={`${file.url}`} 
                      target='_blank' 
                      className='d-flex align-items-center gap-2'
                      style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}
                    >
                      <FilePreview file={file} />
                      <div className='d-flex flex-column' style={{ flex: 1, minWidth: 0, fontSize: '13px' }}>
                        <div 
                          title={file?.key} 
                          style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            fontWeight: '500',
                            color: '#344054',
                            marginBottom: '2px'
                          }}
                        >
                          {file?.key}
                        </div>
                        <small style={{ color: '#667085', fontSize: '12px' }}>{formatFileSize(file?.size)}</small>
                      </div>
                    </Link>
                    <div 
                      className='d-flex align-items-center justify-content-center' 
                      onClick={() => removeFile(file?.key)} 
                      title='Delete file'
                      style={{ 
                        background: '#FEE4E2', 
                        borderRadius: '50%', 
                        width: '28px', 
                        height: '28px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF3F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FEE4E2'}
                    >
                      {deleteMutation?.isPending && deleteMutation?.variables === file?.key 
                        ? <ProgressSpinner style={{ width: '14px', height: '14px' }} /> 
                        : <Trash size={14} color="#F04438" />
                      }
                    </div>
                  </div>
                );
              })}
              {filesQuery?.isLoading && <>
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
              </>}
            </div>
          </div>
        </Modal.Body>
        <div className='CustonCloseModalBottom'>
          <button className='but' onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FilesModel;
