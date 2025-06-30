import { XOctagon } from 'react-bootstrap-icons';
import { Dialog } from 'primereact/dialog';
import style from './show-job-declined.module.scss';

const JobDeclined = ({ showDeclined, setShowDeclined, message }) => {
  const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className={style.iconStyle}>
              <XOctagon color='#F04438' size={16} />
            </div>
            <span className={`white-space-nowrap ${style.headerTitle}`}>Job Declined</span>
        </div>
    );
  return (
    <Dialog visible={showDeclined} modal={false} header={headerElement} contentClassName='border-0 bg-transparent' className={`${style.modal} custom-modal`} onHide={() => { setShowDeclined(false); }}>
      <div className="">
        <p className="font-14 mb-1" style={{ color: '#667085' }}>Note:</p>
        <h6 style={{ fontSize: '16px', color: '#475467', fontWeight: 600, marginBottom: '16px' }}>{message}</h6>
      </div>
    </Dialog>
  );
};

export default JobDeclined;