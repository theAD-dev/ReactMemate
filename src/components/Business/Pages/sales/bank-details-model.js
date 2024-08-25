import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PlusCircle,PlusLg,ExclamationOctagon } from "react-bootstrap-icons";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import NewQuoteImg from "../../../../assets/images/img/newQuote.png";
import "./new-request/new-request.css";
import { useNavigate } from 'react-router-dom';

const BankDetailsModel = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleAdd = () => {
    
    navigate("/settings/generalinformation/bank-details" );
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen} className="addNewBilling">
        <div className={`styleGrey01 tabActive`}>
          New  <PlusLg color="#fff" size={16} />
        </div>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="modelStyleBoxstatus NewQuoteModal" sx={{ width: 732 }}>
          <Typography id="modal-modal-title" className={``} variant="h6" component="h2">
            <>
              <div className='modelHeader modelHeaderBillig d-flex justify-content-between align-items-start'>
                <span className='modelHeadFlex'>
                      <div className='iconinnerStyle1'>
                        <ExclamationOctagon color="#F04438" size={24} />
                      </div>
                  <h2>Complete Your Profile to Proceed</h2>
                </span>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close">
                  <CloseIcon color="#667085" size={24} />
                </IconButton>
              </div>
              <div className='stepBoxStyle '>
              <img src={NewQuoteImg} alt="NewQuoteImg" />
              <div className='newQuotewrap'>
                <h3>Bank Details Required</h3>
                <p>Before creating a new request, please ensure you have filled in your bank details. This is necessary to process your transactions smoothly. You can add your bank information by navigating to your profile settings. </p>
              </div>
              </div>
              <div className='footerButton'>
                <button className='Cancel' onClick={handleClose}>Cancel and Return</button>
                <Button className='save' onClick={handleAdd}>Add Bank Details</Button>
              </div>
            </>
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

export default BankDetailsModel;
