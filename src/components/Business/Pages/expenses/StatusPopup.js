import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const StatusPopup = ( {statusValue} ) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setTimeout(() => {
 
      setOpen(false); 
    }, 0); 
  };


  return (
    <>
   <Button onClick={handleOpen} className="expenseStatusbut">
   <div className={`styleGrey01 exstatus paid${statusValue}`}>
          {statusValue ? (
            <><span className="dots"></span> Paid </>
          ) : (
            <>Not Paid <span className="dots"></span></>
          )}
        </div>
   </Button>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box className="modelStyleBoxstatus " sx={{ width: 718 }}>
        <Typography id="modal-modal-title" className={`paid${statusValue}`}  variant="h6" component="h2">
        {statusValue ? (
           <>
            <div className='modelHeader d-flex justify-content-between align-items-start'>
          <h3>Mark Expense as paid?</h3>
           <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose} 
          aria-label="close">
          <CloseIcon color="#667085" size={24} />
        </IconButton>
        </div>  
        <div className='stepBoxStyle'>
                <p>Reference</p>
                <h5>REFRENCE 99686REFRENCE 99686</h5>
             <p>Total</p>
            <div className='borderBox'><span className="dots"></span>$188.51</div>
            </div>
            <div className='footerButton'>
                <button className='Cancel' onClick={handleClose}>Cancel</button>
                <button className='clickpaid'>Mark as paid</button>
            </div>
           </>
          ) : (
            <>
            <div className='modelHeader d-flex justify-content-between align-items-start'>
          <h3>Mark Expense as Unpaid?</h3>
           <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose} 
          aria-label="close">
          <CloseIcon color="#667085" size={24} />
        </IconButton>
        </div>  
            <div className='stepBoxStyle'>
                <p>Reference</p>
                <h5>REFRENCE 99686REFRENCE 99686</h5>
             <p>Total</p>
            <div className='borderBox'><span className="dots"></span>$188.51</div>
            </div>
            <div className='footerButton'>
                <button className='Cancel' onClick={handleClose}>Cancel</button>
                <button className='clickpaid'>Mark as Unpaid</button>
            </div>
            </>
          )}
        </Typography>
      </Box>
    </Modal>
  </>
  )
}
export default StatusPopup