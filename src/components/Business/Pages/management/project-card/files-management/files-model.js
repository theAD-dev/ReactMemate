import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { X, CloudUpload, Trash, Folder as FolderIcon, Check, X as CancelIcon, Share, CheckCircleFill } from "react-bootstrap-icons";
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

// Helper function to extract all files from the new API response format
const getAllFilesFromResponse = (data) => {
  if (!data) return [];
  
  // If it's already an array (old format), return as-is
  if (Array.isArray(data)) return data;
  
  // New format: { project: [], jobs: {} }
  const allFiles = [];
  
  // Add project files
  if (Array.isArray(data.project)) {
    allFiles.push(...data.project);
  }
  
  // Add job files - jobs is an object with job IDs as keys
  if (data.jobs && typeof data.jobs === 'object') {
    Object.entries(data.jobs).forEach(([jobId, jobFiles]) => {
      if (Array.isArray(jobFiles)) {
        // Add job context to each file for display purposes
        allFiles.push(...jobFiles.map(file => ({ ...file, jobId })));
      }
    });
  }
  
  return allFiles;
};

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

// Share File Popover Component - YouTube style
const ShareFilePopover = ({ file, onClose, triggerRef }) => {
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef(null);
  const fileUrl = file.url;
  const [position, setPosition] = useState(null); // Start with null to indicate not calculated yet

  // Calculate position based on trigger element
  useEffect(() => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 415;
      const popoverHeight = 280;
      
      // Calculate left position - try to align right edge with trigger
      let left = rect.right - popoverWidth;
      if (left < 10) left = 10; // Don't go off left edge
      
      // Calculate top position - prefer below, but go above if no space
      let top = rect.bottom + 8;
      if (top + popoverHeight > window.innerHeight - 10) {
        top = rect.top - popoverHeight - 8;
      }
      if (top < 10) top = 10; // Don't go off top edge
      
      setPosition({ top, left });
    }
  }, [triggerRef]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Don't render until position is calculated
  if (!position) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const ta = document.createElement('textarea');
      ta.value = fileUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#25D366"/>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this file: ${file.name}\n${fileUrl}`)}`, '_blank');
        onClose();
      }
    },
    {
      name: 'Facebook',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#1877F2"/>
          <path d="M16.671 15.469l.547-3.469h-3.343V9.531c0-.969.475-1.906 1.984-1.906h1.532V4.656s-1.39-.234-2.719-.234c-2.773 0-4.578 1.657-4.578 4.656V12H6.921v3.469h3.173V24h3.906v-8.531h2.671z" fill="white"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fileUrl)}`, '_blank', 'width=600,height=400');
        onClose();
      }
    },
    {
      name: 'X',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#000000"/>
          <path d="M13.544 10.456L17.89 5.5h-1.03l-3.773 4.305L10.16 5.5H6.5l4.56 6.513L6.5 17.5h1.03l3.987-4.55 3.184 4.55H18l-4.456-7.044zm-1.41 1.608l-.462-.649L8.04 6.28h1.585l2.97 4.17.462.649 3.862 5.423h-1.585l-3.2-4.458z" fill="white"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this file: ${file.name}`)}&url=${encodeURIComponent(fileUrl)}`, '_blank', 'width=600,height=400');
        onClose();
      }
    },
    {
      name: 'Email',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#9CA3AF"/>
          <path d="M6 8.5C6 7.67157 6.67157 7 7.5 7H16.5C17.3284 7 18 7.67157 18 8.5V15.5C18 16.3284 17.3284 17 16.5 17H7.5C6.67157 17 6 16.3284 6 15.5V8.5Z" stroke="white" strokeWidth="1.5"/>
          <path d="M6.5 8L12 12L17.5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => {
        const subject = encodeURIComponent(`Shared File: ${file.name}`);
        const body = encodeURIComponent(`Hi,\n\nI wanted to share this file with you:\n\n${file.name}\n\nYou can access it here:\n${fileUrl}\n\nBest regards`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        onClose();
      }
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#0A66C2"/>
          <path d="M8.5 10H6.5V17.5H8.5V10Z" fill="white"/>
          <path d="M7.5 8.5C8.19036 8.5 8.75 7.94036 8.75 7.25C8.75 6.55964 8.19036 6 7.5 6C6.80964 6 6.25 6.55964 6.25 7.25C6.25 7.94036 6.80964 8.5 7.5 8.5Z" fill="white"/>
          <path d="M13 10H10.5V17.5H13V13.5C13 12.5 13.5 11.5 14.75 11.5C16 11.5 16 12.75 16 13.5V17.5H18V13C18 10.5 16.5 10 15.25 10C14 10 13.25 10.75 13 11V10Z" fill="white"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fileUrl)}`, '_blank', 'width=600,height=400');
        onClose();
      }
    },
    {
      name: 'Telegram',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#0088CC"/>
          <path d="M17.0708 7.25736L5.82893 11.7157C5.19282 11.9722 5.19617 12.3354 5.71355 12.4916L8.45534 13.3441L15.2726 8.87451C15.5898 8.67576 15.879 8.78168 15.6426 9.00033L10.0851 14.0632H10.0839L10.0851 14.0637L9.87243 16.8879C10.1449 16.8879 10.2654 16.7614 10.4166 16.6161L11.734 15.3391L14.5173 17.4133C15.0157 17.6918 15.3734 17.5497 15.4991 16.9561L17.4706 8.19979C17.6561 7.47058 17.1969 7.14026 17.0708 7.25736Z" fill="white"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(fileUrl)}&text=${encodeURIComponent(`Check out this file: ${file.name}`)}`, '_blank');
        onClose();
      }
    }
  ];

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0px 12px 24px -4px rgba(16, 24, 40, 0.18), 0px 8px 16px -4px rgba(16, 24, 40, 0.08)',
        border: '1px solid #EAECF0',
        padding: '16px',
        width: '415px',
        zIndex: 9999
      }}
    >
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#101828' }}>Share</span>
        <div 
          onClick={onClose} 
          style={{ 
            cursor: 'pointer', 
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} color="#667085" />
        </div>
      </div>

      {/* Social Media Icons Row */}
      <div className='d-flex justify-content-start gap-3 mb-4' style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        {shareOptions.map((option) => (
          <div
            key={option.name}
            onClick={option.onClick}
            className='d-flex flex-column align-items-center gap-2'
            style={{
              cursor: 'pointer',
              minWidth: '48px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {option.icon}
            </div>
            <span style={{ fontSize: '11px', color: '#667085', textAlign: 'center' }}>{option.name}</span>
          </div>
        ))}
      </div>

      {/* Copy Link Section */}
      <div
        className='d-flex align-items-center gap-2'
        style={{
          background: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          padding: '8px 12px'
        }}
      >
        <input
          type="text"
          value={fileUrl}
          readOnly
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: '13px',
            color: '#667085',
            outline: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        />
        <button
          onClick={handleCopyLink}
          style={{
            padding: '8px 16px',
            background: copied ? '#17B26A' : '#158ECC',
            border: 'none',
            borderRadius: '20px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {copied ? (
            <>
              <CheckCircleFill size={14} />
              Copied
            </>
          ) : (
            'Copy'
          )}
        </button>
      </div>
    </div>
  );
};

// ShareButton Component - handles button and popover together
const ShareButton = ({ item, isShareOpen, onToggle, onClose }) => {
  const buttonRef = useRef(null);

  return (
    <>
      <div
        ref={buttonRef}
        className='d-flex align-items-center justify-content-center'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        title='Share'
        style={{
          background: isShareOpen ? '#EBF8FF' : '#F0F9FF',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: isShareOpen ? '1px solid #158ECC' : '1px solid transparent'
        }}
        onMouseEnter={(e) => {
          if (!isShareOpen) e.currentTarget.style.background = '#E0F2FE';
        }}
        onMouseLeave={(e) => {
          if (!isShareOpen) e.currentTarget.style.background = '#F0F9FF';
        }}
      >
        <Share size={14} color="#158ECC" />
      </div>
      {isShareOpen && (
        <ShareFilePopover 
          file={item} 
          onClose={onClose}
          triggerRef={buttonRef}
        />
      )}
    </>
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
  const [sharePopoverFile, setSharePopoverFile] = useState(null); // Track which file's share popover is open
  const folderInputRef = useRef(null);
  const accessToken = localStorage.getItem("access_token");
  const handleClose = () => {
    setViewShow(false);
    setCurrentPath([]);
    setInputValue('');
    setCreatingFolder(false);
    setNewFolderName('');
    setUploadingFiles([]);
    setSharePopoverFile(null);
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
      const allFiles = getAllFilesFromResponse(filesQuery.data);
      const toDelete = allFiles.filter((f) => f.url.includes(folderPrefix));
      console.log('toDelete: ', toDelete);
      await Promise.all(toDelete.map((file) => {
        let url = file?.url;
        if (!url) return;
        const urlObj = new URL(url);
        const fileKey = urlObj.pathname.replace(/^\/+/, '');
        deleteFileByKey(projectId, fileKey);
      }));
      const markerKey = folderPrefix;
      if (allFiles.some((f) => f.key === markerKey) && !toDelete.some((f) => f.key === markerKey)) {
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

  const removeFolder = async(item) => {
    let url = item?.url;
    if (!url) return;

    try {
      const urlObj = new URL(url);
      const folderPrefix = urlObj.pathname.replace(/^\/+/, '');
      await deleteFolderMutation.mutateAsync(folderPrefix);
      filesQuery?.refetch();
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

  const allFiles = getAllFilesFromResponse(filesQuery.data);
  const contents = getContentsAtPath(allFiles, currentPath);
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
      <Button className={`filebut ${allFiles?.length ? 'fileActive' : ''}`} onClick={handleShow}>
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
                const isShareOpen = sharePopoverFile === item.key;
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
                      minWidth: '200px',
                      position: 'relative'
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
                    {/* Action buttons */}
                    <div className='d-flex align-items-center gap-1'>
                      {/* Share button - only for files */}
                      {item.type === 'file' && (
                        <ShareButton 
                          item={item} 
                          isShareOpen={isShareOpen}
                          onToggle={() => setSharePopoverFile(isShareOpen ? null : item.key)}
                          onClose={() => setSharePopoverFile(null)}
                        />
                      )}
                      {/* Delete button */}
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