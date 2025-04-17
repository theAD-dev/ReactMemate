import React from 'react';
import { FileEarmark } from 'react-bootstrap-icons';
import styles from './file-attachment.module.scss';

const FileAttachment = ({ file }) => {
  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <div className={styles.imagePreview}>
            <span>JPG</span>
          </div>
        );
      case 'pdf':
        return <FileEarmark size={24} color="#F04438" />;
      case 'doc':
      case 'docx':
        return <FileEarmark size={24} color="#2E90FA" />;
      case 'xls':
      case 'xlsx':
        return <FileEarmark size={24} color="#12B76A" />;
      default:
        return <FileEarmark size={24} color="#667085" />;
    }
  };

  return (
    <div className={styles.fileAttachment}>
      <div className={styles.fileInfo}>
        {getFileIcon(file.type)}
        <div className={styles.fileDetails}>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>{file.size}</span>
        </div>
      </div>
    </div>
  );
};

export default FileAttachment;
