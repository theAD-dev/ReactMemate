import clsx from 'clsx';
import styles from './job-status.module.scss';

const JobStatus = ({ status, actionStatus, published }) => {
    const getStatusLabel = (status, actionStatus, published=true) => {
        if (!published) {
            return { label: "Draft", className: "DRAFT", color: '#344054', backColor: '#f9fafb', borderColor: '#eaecf0' };
        }

        if (status === 'a' && actionStatus) {
            return { label: "In Progress", className: "IN_PROGRESS", color: '#3D5AFE', backColor: '#EEF1FF', borderColor: '#C3CCFF' };
        }

        const statusMap = {
            "1": { label: "Open", className: "OPEN", color: '#065b76', backColor: '#ecf7fd', borderColor: '#a9d6ef' },
            "2": { label: "Assigned", className: "ASSIGNED", color: '#520676', backColor: '#f6ecfd', borderColor: '#dda9ef' },
            "3": { label: "Submitted", className: "SUBMITTED", color: '#344054', backColor: '#f9fafb', borderColor: '#eaecf0' },
            "4": { label: "Finished", className: "FINISHED", color: '#29B27C', backColor: '#BBFFE4', borderColor: '#BBFFE4' },
            "6": { label: "Declined", className: "DECLINED", color: '#b42318', backColor: '#fef3f2', borderColor: '#fecdca' },
            'a': { label: "Confirmed", className: "CONFIRMED", color: '#067647', backColor: '#ecfdf3', borderColor: '#a9efc5' },
        };

        return statusMap[status] || { label: status, className: "defaultStatus" };
    };

    return (
        <div className={clsx(styles.status, styles[getStatusLabel(status, actionStatus, published).className])}>
            {getStatusLabel(status, actionStatus, published).label}
        </div>
    );
};

export default JobStatus;