import React, { useState, useEffect } from 'react';
import { CheckCircle, Check2Circle } from "react-bootstrap-icons";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SalesIcon from "../../../../assets/images/icon/SalesIcon.svg";
import ManagementIcon from "../../../../assets/images/icon/ManagementIcon.svg";
import ProgressLogo from "../../../../assets/images/progressLogo.png";
import { fetchWon, markWon } from "../../../../APIs/SalesApi";
import ConfettiComponent from '../../../layout/ConfettiComponent';


const QuoteWon = ({ salesData, saleUniqueId, wonQuote, quoteType, onRemoveRow }) => {
  const [open, setOpen] = React.useState(false);
  const [confetti, setConfetti] = useState(false);
  const handleOpen = () => setOpen(true);
  const [message, setMessage] = useState({ content: '', type: 'success' });
  const [totalWonQuote, setTotalWonQuote] = useState(sessionStorage.getItem('totalWonQuote') || 0);


  const handleMoveToManagementWon = async () => {
    try {
      if (saleUniqueId) {
        const success = await markWon([saleUniqueId]);
        if (success.status === 'wn') {
          onRemoveRow()
          setMessage({ content: 'Successfully moved to Management!', type: 'success' });
          const newTotalWonQuote = parseInt(totalWonQuote, 10) + 1;
          setTotalWonQuote(newTotalWonQuote);
          sessionStorage.setItem('totalWonQuote', newTotalWonQuote);
        } else {
          setMessage({ content: 'Failed to move to Management. Please try again.', type: 'error' });
        }
      }
    } catch (error) {
      setMessage({ content: 'An error occurred. Please try again.', type: 'error' });
    }
    handleClose();
    setConfetti(true);
  };

  const handleClose = () => {
    setTimeout(() => {
      setConfetti(false);
      setOpen(false);
    }, 1000);
  };

  useEffect(() => {
    if (saleUniqueId) {

    }
  }, [saleUniqueId]);

  useEffect(() => {

    setTotalWonQuote(wonQuote);
    sessionStorage.setItem('totalWonQuote', wonQuote);


  }, [wonQuote]);


  return (
    <>

      <Button
        onClick={handleOpen}
        className={`message quoteWon ${message.type} ${wonQuote === 'Draft'}`}
      >
        <CheckCircle color="#079455" size={16} />
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modelStyleBox QuoteWon salesTableWrap QuoteActionStyle" sx={{ width: 460 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className='modelHeader justify-content-between align-items-start'>
              <span>
                <div className='iconOutStyleflex'>
                  <div className='flexIconWrap'>
                    <div className='iconOutStyle'>
                      <div className='iconinStyle'>
                        <div className='iconinnerStyle'>
                          <Check2Circle color="#17B26A" size={24} />
                        </div>
                      </div>
                    </div>
                    <div className='quoteStyleHeading'>
                      {quoteType === 'won' && (
                        <>
                          {`Quote Won ${wonQuote}`}
                        </>
                      )}
                    </div>
                  </div>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon color="#667085" size={24} />
                  </IconButton>
                </div>
                <div className='stepBoxStyle'>


                  <ul>
                    <li><strong><img src={SalesIcon} alt="SalesIcon" /></strong><span className='lightColorStyle'>Sales</span></li>
                    <li><em className='lineHor'></em><img src={ProgressLogo} alt="ProgressLogo" /><em className='lineHor'></em></li>
                    <li><strong><img src={ManagementIcon} alt="ManagementIcon" /></strong><span>Management</span></li>
                  </ul>
                  <p>Great, another quote converted into a project.</p>
                </div>
              </span>

            </div>
            <div className='footerBorder text-center'>
              <button onClick={handleMoveToManagementWon}>Move to the Management</button>
              <ConfettiComponent active={confetti} config={{ /* customize confetti config */ }} />
            </div>
          </Typography>
        </Box>
      </Modal>
    </>
  )
}
export default QuoteWon