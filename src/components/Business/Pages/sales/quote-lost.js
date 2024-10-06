import React, { useState, useEffect} from 'react';
import { XCircle, Archive } from "react-bootstrap-icons";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SalesIcon from "../../../../assets/images/icon/SalesIcon.svg";
import ArchiveIcon from "../../../../assets/images/icon/archive.svg"
import ProgressLogo from "../../../../assets/images/progressLogo.png";
import { markLost  } from "../../../../APIs/SalesApi";
import ConfettiComponent from '../../../layout/ConfettiComponent';


const QuoteWon = ( {salesData,saleUniqueId,LostQuote,quoteType,onRemoveRow}) => {
  
  const [open, setOpen] = React.useState(false);
  const [confetti, setConfetti] = useState(false); 
  const handleOpen = () => setOpen(true);
  const [message, setMessage] = useState({ content: '', type: 'success' });
  const [totalWonQuote, setTotalWonQuote] = useState(sessionStorage.getItem('totalWonQuote') || 0);

  const handleMoveToManagementLost = async () => {
    try {
      if(saleUniqueId){
            const success = await markLost([saleUniqueId]);
            if (success.status === 'wn') {
              console.log("salesData123 ===> ",salesData)
               onRemoveRow()
              setMessage({ content: 'Successfully moved to Management!', type: 'success' });
              const newTotalWonQuote = parseInt(totalWonQuote, 10) + 1;
              setTotalWonQuote(newTotalWonQuote);
              sessionStorage.setItem('totalWonQuote', newTotalWonQuote);
            }else{
              setMessage({ content: 'Failed to move to Management. Please try again.', type: 'error' });
            }
        }
    } catch (error) {
        console.error('Error:', error);
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
 
  setTotalWonQuote(LostQuote);
  sessionStorage.setItem('totalWonQuote', LostQuote);


}, [LostQuote]);







  
  return (
    <>
   <Button onClick={handleOpen} className={`quoteLost message ${message.type} ${LostQuote === 'Draft'}`}>
    <XCircle color="#D92D20" size={16} />
   </Button>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modelStyleBox QuoteLost salesTableWrap  QuoteActionStyle" sx={{ width: 460 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
        <div className='modelHeader d-flex justify-content-between align-items-start'>
        <span>
        <div className='iconOutStyleflex'>
        <div className='flexIconWrap'>
        <div className='iconOutStyle'>
        <div className='iconinStyle'>
        <div className='iconinnerStyle'>
        <Archive color="#F04438" size={24} />
        </div>
        </div>
        </div>
        <div className='quoteStyleHeading'>
        {quoteType === 'lost' && (
                   <>
                     {`Quote Lost ${LostQuote}`}
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
            <li><strong><img src={ArchiveIcon} alt="Archive" /></strong><span>Archive</span></li>
           </ul>
           <p>Sorry to see a lost opportunity. This quote will be stored in the client's history, should you need to refer to it in the future.</p>
         </div>
        
        </span>
        </div>
        <div className='footerBorder text-center'>
        <button onClick={handleMoveToManagementLost}>Archive</button>
        </div>
        </Typography>
      </Box>
    </Modal>
  </>
  )
}
export default QuoteWon