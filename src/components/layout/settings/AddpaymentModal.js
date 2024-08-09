import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PlusCircle } from "react-bootstrap-icons";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import VisaIcon from "../../../assets/images/icon/visaIcon.png";
import Paymentmethodicon from "../../../assets/images/icon/Paymentmethodicon.png";
import { CreditCard2Front } from "react-bootstrap-icons";

const AddPaymentModal = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    expiry: '',
    number: '',
    cvc: '',
  });
  const [cardType, setCardType] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Determine the card type based on the input value
    setCardType(determineCardType(name === 'number' ? value : formData.number));
  };

  const determineCardType = (cardNumber) => {
    // Logic to determine card type (e.g., Visa, Mastercard, etc.)
    // Here's a simplified version just for demonstration
    if (/^4/.test(cardNumber)) {
      return 'visa';
    } else if (/^5[1-5]/.test(cardNumber)) {
      return 'mastercard';
    } else {
      return '';
    }
  };
  

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <img src={VisaIcon} alt="Visa" className="card-icon" />;
      case 'mastercard':
        return <img src={Paymentmethodicon} alt="Mastercard" className="card-icon" />;
      default:
        return <CreditCard2Front color="#344054" size={20} />;
    }
  };

  const handleAdd = () => {
    // Handle adding the payment method using formData
    console.log(formData);
    // You can call onAdd function and pass formData to it
    onAdd(formData);
    // Close the modal after adding
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen} className="addNewBilling">
        <div className={`styleGrey01`}>
          Add new payment method
        </div>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="modelStyleBoxstatus" sx={{ width: 608 }}>
          <Typography id="modal-modal-title" className={``} variant="h6" component="h2">
            <>
              <div className='modelHeader modelHeaderBillig d-flex justify-content-between align-items-start'>
                <span className='modelHeadFlex'>
                  <div className='iconOutStyle'>
                    <div className='iconinStyle'>
                      <div className='iconinnerStyle'>
                        <PlusCircle color="#17B26A" size={24} />
                      </div>
                    </div>
                  </div>
                  <h2>Add New Card</h2>
                </span>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close">
                  <CloseIcon color="#667085" size={24} />
                </IconButton>
              </div>
              <div className='stepBoxStyle stepBoxStylePayment'>
                <div className="formgroup">
                  <label>Name on card</label>
                  <div className={`inputInfo`}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      placeholder="Name on Card"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="formgroup">
                  <label>Expiry</label>
                  <div className={`inputInfo`}>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      placeholder="MM/YY Expiry"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="formgroup">
                  <label>Card number</label>
                  <div className={`inputInfo`}>
                    {getCardIcon()}
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      placeholder="Card Number"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="formgroup">
                  <label>CVV</label>
                  <div className={`inputInfo`}>
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      placeholder="CVV"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className='footerButton'>
                <button className='Cancel' onClick={handleClose}>Cancel</button>
                <Button className='save' onClick={handleAdd}>Save</Button>
              </div>
            </>
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

export default AddPaymentModal;
