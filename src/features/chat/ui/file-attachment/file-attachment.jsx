import { Download } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './file-attachment.module.scss';
import { getFileIcon } from '../../../../components/Work/features/create-job/create-job';

const FileAttachment = ({ file }) => {
  if (!file) return null;
  const { url, type } = file;
  const baseUrl = url.split("?")[0];
  const fileName = baseUrl.substring(baseUrl.lastIndexOf("/") + 1);
  const extension = type.split('-')[0] || '';
  const size = type.split('-')[1] || '';

  return (
    <div className={clsx(styles.fileAttachment)} style={{ display: 'flex', alignItems: 'center', marginBottom: 0, gap: 12, padding: 10, width: '508px', marginLeft: 'auto', position: 'relative' }}>
      {getFileIcon(extension)}
      <div style={{ width: '80%', textAlign: 'left' }}>
        <div className={clsx(styles.fileName, 'ellipsis-width')}>{fileName}</div>
        <div className={clsx(styles.fileSize)}>{size}</div>
      </div>
      <Link to={url} target='_blank' className={clsx(styles.downloadButton)}>
        <Download size={16} color='var(--gray-600, #475467)'/>
      </Link>
    </div>
  );
};

export default FileAttachment;
