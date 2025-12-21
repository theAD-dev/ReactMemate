import { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { X, CloudUpload, Trash, Folder as FolderIcon, Plus, Check, X as CancelIcon } from "react-bootstrap-icons";
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'sonner';
import styles from './files-model.module.scss';
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

// Folder Preview Component
const FolderPreview = () => (
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
    <FolderIcon size={28} color="#FFA500" />
  </div>
);

// Function to get contents at current path
const getContentsAtPath = (allFiles, path) => {
  const prefix = path.join('/') + (path.length ? '/' : '');
  const items = new Map();

  for (const file of allFiles) {
    if (file.key.startsWith(prefix)) {
      const rel = file.key.slice(prefix.length);
      if (rel === '') continue;
      const parts = rel.split('/');
      const first = parts[0];
      if (parts.length > 1) {
        if (!items.has(first)) {
          items.set(first, { type: 'folder', name: first, ...file });
        }
      } else {
        items.set(first, { type: 'file', name: first, ...file });
      }
    }
  }

  return Array.from(items.values()).sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1
  );
};

const FilesModel = ({ projectId }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [creatingFile, setCreatingFile] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [isFolderCreating, setIsFolderCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [viewShow, setViewShow] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentPath, setCurrentPath] = useState([]);
  const folderInputRef = useRef(null);
  const accessToken = localStorage.getItem("access_token");
  const handleClose = () => {
    setViewShow(false);
    setCurrentPath([]);
    setInputValue('');
    setCreatingFolder(false);
    setNewFolderName('');
    setUploadingFiles([]);
  };

  const filesQuery = useQuery({
    queryKey: ['id', projectId],
    queryFn: () => getProjectFilesById(projectId),
    enabled: !!projectId || !!viewShow,
    retry: 1,
    staleTime: 0,
    cacheTime: 0,
  });

  const handleShow = () => {
    setViewShow(true);
  };

  const uploadToS3 = async (file, url, fileId) => {
    return axios.put(url, file, {
      headers: {
        "Content-Type": "",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress } : f
          )
        );
      },
    }).catch((err) => {
      console.log('err: ', err);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: 0, error: true } : f
        )
      );
      throw err;
    });
  };

  const fileUploadBySignedURL = async (uploadFiles) => {
    if (!uploadFiles.length) return;
    if (!accessToken) return toast.error('Access token is missing. Please log in again.');

    const currentPrefix = currentPath.join('/') + (currentPath.length ? '/' : '');

    const newUploading = uploadFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      progress: 0,
      error: false,
      type: 'uploading_file',
    }));
    setUploadingFiles((prev) => [...newUploading, ...prev]);

    for (const [index, file] of uploadFiles.entries()) {
      const fileId = newUploading[index].id;
      const uniqueNumber = Date.now();
      const fileNameParts = file.name.split('.');
      const ext = fileNameParts.pop();
      const baseName = fileNameParts.join('.');
      const newName = `${currentPrefix}${baseName}-${uniqueNumber}.${ext}`;

      try {
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
          throw new Error('No URL received');
        }
        let originalURL = url.split('?')[0];
        await uploadToS3(file, originalURL, fileId);
        toast.success(`Successfully uploaded ${file.name}`);
        filesQuery?.refetch();
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
        toast.error(`Failed to upload ${file.name}. Please try again.`);
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, error: true } : f
          )
        );
        continue;
      } finally {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    }

  };

  const createFolder = async (name) => {
    if (!name.trim()) {
      toast.error('Folder name cannot be empty.');
      setCreatingFolder(false);
      setNewFolderName('');
      return;
    }
    if (!accessToken) {
      toast.error('Access token is missing. Please log in again.');
      setCreatingFolder(false);
      return;
    }

    const currentPrefix = currentPath.join('/') + (currentPath.length ? '/' : '');
    const folderKey = `${currentPrefix}${name}/`;

    try {
      setIsFolderCreating(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/projects/file/${projectId}/`,
        { file_name: folderKey },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { url } = response.data;
      if (!url) {
        throw new Error('No URL received');
      }

      await axios.put(url, new Blob(), {
        headers: {
          "Content-Type": "",
        },
      });
      toast.success(`Successfully created folder ${name}`);
      filesQuery?.refetch();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error(`Failed to create folder ${name}. Please try again.`);
    } finally {
      setCreatingFolder(false);
      setNewFolderName('');
      setIsFolderCreating(false);
    }
  };

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    multiple: true,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'], 'video/mp4': ['.mp4'] },
    maxSize: 25 * 1024 * 1024,
    onDrop: acceptedFiles => {
      fileUploadBySignedURL(acceptedFiles);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (fileKey) => deleteFileByKey(projectId, fileKey),
    onSuccess: () => {
      toast.success('File deleted successfully');
      filesQuery?.refetch();
    },
    onError: () => {
      toast.error('Failed to delete file');
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (folderPrefix) => {
      console.log('folderPrefix: ', folderPrefix);
      const toDelete = filesQuery.data.filter((f) => f.url.includes(folderPrefix));
      console.log('toDelete: ', toDelete);
      await Promise.all(toDelete.map((file) => {
        let url = file?.url;
        if (!url) return;
        const urlObj = new URL(url);
        const fileKey = urlObj.pathname.replace(/^\/+/, '');
        deleteFileByKey(projectId, fileKey);
      }));
      const markerKey = folderPrefix;
      if (filesQuery.data.some((f) => f.key === markerKey) && !toDelete.some((f) => f.key === markerKey)) {
        await deleteFileByKey(projectId, markerKey);
      }
    },
    onSuccess: () => {
      toast.success('Folder deleted successfully');
      filesQuery?.refetch();
    },
    onError: (error) => {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    },
  });

  const removeFile = (item) => {
    let url = item?.url;
    if (!url) return;

    try {
      const urlObj = new URL(url);
      const fileKey = urlObj.pathname.replace(/^\/+/, '');
      deleteMutation.mutate(fileKey);
    } catch (error) {
      console.error('Invalid URL:', url);
      toast.error('Failed to delete file');
    }
  };

  const removeFolder = (item) => {
    let url = item?.url;
    if (!url) return;

    try {
      const urlObj = new URL(url);
      const folderPrefix = urlObj.pathname.replace(/^\/+/, '');
      deleteFolderMutation.mutate(folderPrefix);
    } catch (error) {
      console.error('Invalid URL:', url);
      toast.error('Failed to delete folder');
    }
  };

  const startCreatingFolder = () => {
    setCreatingFolder(true);
    setNewFolderName('');
    setTimeout(() => {
      if (folderInputRef.current) {
        folderInputRef.current.focus();
      }
    }, 0);
  };

  const cancelCreatingFolder = () => {
    setCreatingFolder(false);
    setNewFolderName('');
  };

  const contents = getContentsAtPath(filesQuery.data || [], currentPath);
  let displayContents = inputValue
    ? contents.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()))
    : contents;

  displayContents = [...uploadingFiles, ...displayContents];

  if (creatingFolder) {
    displayContents = [{ type: 'new_folder' }, ...displayContents];
  }

  return (
    <>
      {/* View modal trigger */}
      <Button className={`filebut ${filesQuery?.data?.length ? 'fileActive' : ''}`} onClick={handleShow}>
        Files
        <img src={FolderFileIcon} alt="FolderFileIcon" />
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
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb" style={{ fontSize: '14px', marginBottom: '0' }}>
                {['Files', ...currentPath].map((part, index, arr) => (
                  <li className={`breadcrumb-item ${index === arr.length - 1 ? 'active' : ''}`} key={index}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPath(currentPath.slice(0, index));
                      }}
                      className='font-14'
                      style={{ color: index === arr.length - 1 ? '#344054' : '#106B99', textDecoration: 'none' }}
                    >
                      {part}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className='d-flex gap-2 justify-content-end align-items-center'>
              <Button className="solid-button font-14 d-flex align-items-center" onClick={() => setCreatingFile(!creatingFile)}>
                Upload Files
              </Button>
              <Button className="outline-button font-14 d-flex align-items-center" onClick={startCreatingFolder}>
                New Folder
              </Button>

              <div className="searchBox" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '3px', left: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                  </svg>
                </div>
                <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
              </div>
            </div>
          </div>

          {/* Professional Upload Section - Always visible */}
          {creatingFile && (
            <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column cursor-pointer mb-4' })} style={{ width: '100%', height: '100px', background: '#F9FAFB', borderRadius: '8px', border: '2px dashed #D0D5DD', padding: '20px' }}>
              <input {...getInputProps()} />
              <CloudUpload size={24} color="#106B99" />
              <p className='mb-0 mt-2' style={{ color: '#475467', fontSize: '14px', textAlign: 'center' }}>
                <span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop files here<br />
                <small>(PDF, PNG, JPG, JPEG, MP4 - Max 25MB)</small>
              </p>
            </div>
          )}

          <div style={{ height: '300px', overflow: 'auto', paddingRight: '4px' }}>
            <div className='d-flex gap-2 flex-wrap'>
              {!filesQuery?.isPending && displayContents?.map((item, idx) => {
                if (item.type === 'new_folder') {
                  return (
                    <div
                      key="new_folder"
                      style={{
                        background: '#F9FAFB',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #EAECF0',
                        height: 'fit-content',
                        width: 'calc(33.333% - 5.33px)',
                        minWidth: '200px'
                      }}
                      className='d-flex align-items-center gap-2'
                    >
                      <FolderPreview />
                      <input
                        ref={folderInputRef}
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            createFolder(newFolderName);
                          } else if (e.key === 'Escape') {
                            cancelCreatingFolder();
                          }
                        }}
                        style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', fontWeight: '500', color: '#344054' }}
                        placeholder="Folder name"
                      />
                      <div className='d-flex gap-1'>
                        <div
                          onClick={() => createFolder(newFolderName)}
                          style={{ cursor: 'pointer', color: '#106B99' }}
                          title="Save"
                        >
                          {
                            isFolderCreating
                              ? <ProgressSpinner style={{ width: '14px', height: '14px' }} />
                              : <Check size={20} />
                          }
                        </div>
                        <div
                          onClick={cancelCreatingFolder}
                          style={{ cursor: 'pointer', color: '#F04438' }}
                          title="Cancel"
                        >
                          <CancelIcon size={20} />
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === 'uploading_file') {
                  return (
                    <div
                      key={item.id}
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
                      <div className='d-flex align-items-center gap-2' style={{ flex: 1, minWidth: 0 }}>
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
                          <CloudUpload size={28} color="#106B99" />
                        </div>
                        <div className='d-flex flex-column' style={{ flex: 1, minWidth: 0, fontSize: '13px' }}>
                          <div
                            title={item.name}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: '500',
                              color: '#344054',
                              marginBottom: '2px'
                            }}
                          >
                            {item.name}
                          </div>
                          {item.error ? (
                            <small style={{ color: '#F04438', fontSize: '12px' }}>Upload failed</small>
                          ) : (
                            <ProgressBar value={item.progress} style={{ height: '6px' }} showValue={false} />
                          )}
                        </div>
                      </div>
                      {item.error && (
                        <div
                          onClick={() => setUploadingFiles((prev) => prev.filter((f) => f.id !== item.id))}
                          style={{ cursor: 'pointer', color: '#F04438' }}
                          title="Remove"
                        >
                          <Trash size={14} />
                        </div>
                      )}
                    </div>
                  );
                }

                const isDeleting = deleteMutation?.isPending && item.url.includes(deleteMutation?.variables);
                return (
                  <div
                    key={item.name || idx}
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
                    {item.type === 'file' ? (
                      <Link
                        to={`${item.url}`}
                        target='_blank'
                        className='d-flex align-items-center gap-2'
                        style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}
                      >
                        <FilePreview file={item} />
                        <div className='d-flex flex-column' style={{ flex: 1, minWidth: 0, fontSize: '13px' }}>
                          <div
                            title={item?.name}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: '500',
                              color: '#344054',
                              marginBottom: '2px'
                            }}
                          >
                            {item?.name}
                          </div>
                          <small style={{ color: '#667085', fontSize: '12px' }}>{formatFileSize(item?.size)}</small>
                        </div>
                      </Link>
                    ) : (
                      <div
                        className='d-flex align-items-center gap-2 cursor-pointer'
                        style={{ flex: 1, minWidth: 0 }}
                        onClick={() => setCurrentPath([...currentPath, item.name])}
                      >
                        <FolderPreview />
                        <div className='d-flex flex-column' style={{ flex: 1, minWidth: 0, fontSize: '13px' }}>
                          <div
                            title={item?.name}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: '500',
                              color: '#344054',
                              marginBottom: '2px'
                            }}
                          >
                            {item?.name}
                          </div>
                          <small style={{ color: '#667085', fontSize: '12px' }}>Folder</small>
                        </div>
                      </div>
                    )}
                    <div
                      className='d-flex align-items-center justify-content-center'
                      onClick={() => item.type === 'file' ? removeFile(item) : removeFolder(item)}
                      title='Delete'
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
                      {isDeleting
                        ? <ProgressSpinner style={{ width: '14px', height: '14px' }} />
                        : <Trash size={14} color="#F04438" />
                      }
                    </div>
                  </div>
                );
              })}
              {filesQuery?.isPending && <>
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
                <Skeleton width='calc(33.333% - 5.33px)' height={68} borderRadius='8px' />
              </>}
              {!filesQuery?.isPending && displayContents.length === 0 && (
                <div style={{ width: '100%', textAlign: 'center', color: '#667085', fontSize: '14px' }}>
                  No files found.
                </div>
              )}
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