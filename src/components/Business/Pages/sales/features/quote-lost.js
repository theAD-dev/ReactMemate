import React, { useState } from 'react';
import { XCircle, Archive } from "react-bootstrap-icons";
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { toast } from 'sonner';
import { markLost } from "../../../../../APIs/SalesApi";
import ArchiveIcon from "../../../../../assets/images/icon/archive.svg";
import SalesIcon from "../../../../../assets/images/icon/SalesIcon.svg";


const QuoteWon = ({ saleUniqueId, LostQuote, quoteType, onRemoveRow }) => {
  const [open, setOpen] = React.useState(false);
  const [, setConfetti] = useState(false);
  const handleOpen = () => setOpen(true);
  const [message, ] = useState({ content: '', type: 'success' });

  const handleMoveToManagementLost = async () => {
    try {
      if (saleUniqueId) {
        const success = await markLost([saleUniqueId]);
        if (success.length) {
          onRemoveRow();
          toast.success("Sale request has been updated to Lost!");
        } else {
          toast.error("Failed to update the sale request to Lost. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
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

  return (
    <>
      <Button onClick={handleOpen} className={`quoteLost message ${message.type}`}>
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
                    <li>
                      <em className='lineHor'></em>
                      <strong>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_13244_72509)">
                            <path d="M4.31518 0.577465C4.6602 0.577465 4.93493 0.727048 5.13939 1.02621C5.3481 1.31938 5.45246 1.75914 5.45246 2.3455V5.45975H4.31518V2.71346C4.31518 2.40832 4.27473 2.18694 4.1938 2.04933C4.11287 1.91172 3.9936 1.84291 3.836 1.84291C3.6784 1.84291 3.54636 1.93266 3.43988 2.11215C3.33765 2.28566 3.28654 2.54594 3.28654 2.89296V5.45975H2.15566V2.71346C2.15566 2.40832 2.1152 2.18694 2.03427 2.04933C1.95334 1.91172 1.83407 1.84291 1.67648 1.84291C1.51888 1.84291 1.38684 1.93266 1.28035 2.11215C1.17813 2.28566 1.12701 2.54594 1.12701 2.89296V5.45975H-0.0102539V0.694137H1.08228V1.34032H1.10784C1.35915 0.831748 1.70842 0.577465 2.15566 0.577465C2.38567 0.577465 2.58586 0.64627 2.75624 0.783889C2.92661 0.915517 3.05866 1.11595 3.15237 1.3852C3.30144 1.13989 3.46543 0.945429 3.64433 0.801836C3.82323 0.652252 4.04684 0.577465 4.31518 0.577465ZM9.16305 4.02378C9.12046 4.26909 9.03099 4.51141 8.8947 4.75074C8.7584 4.98408 8.5667 5.18153 8.3197 5.34307C8.07264 5.49864 7.77023 5.57642 7.4124 5.57642C6.84593 5.57642 6.40293 5.35504 6.08346 4.91229C5.76405 4.46953 5.6043 3.86224 5.6043 3.09041C5.6043 2.30661 5.76187 1.69333 6.07711 1.25058C6.39652 0.801836 6.83952 0.577465 7.40605 0.577465C7.96399 0.577465 8.40276 0.795854 8.72217 1.23262C9.04593 1.6694 9.20776 2.29763 9.20776 3.11733L9.2014 3.39555H6.77352C6.77352 3.74856 6.83099 4.02977 6.94599 4.23917C7.06528 4.44261 7.22076 4.54432 7.4124 4.54432C7.58705 4.54432 7.72123 4.48448 7.81493 4.36482C7.90864 4.24516 7.9704 4.09857 8.00023 3.92506L9.16305 4.02378ZM7.40605 1.58264C7.21864 1.58264 7.06952 1.66641 6.95881 1.83393C6.84805 1.99548 6.7884 2.21088 6.77987 2.48012H8.03858C8.03005 2.21088 7.96828 1.99548 7.85328 1.83393C7.74252 1.66641 7.59346 1.58264 7.40605 1.58264ZM4.31518 6.3615C4.6602 6.3615 4.93493 6.51109 5.13939 6.81024C5.3481 7.10342 5.45246 7.54316 5.45246 8.12957V11.2438H4.31518V8.49752C4.31518 8.19237 4.27473 7.97101 4.1938 7.83335C4.11287 7.69577 3.9936 7.62694 3.836 7.62694C3.6784 7.62694 3.54636 7.71668 3.43988 7.89623C3.33765 8.06967 3.28654 8.32995 3.28654 8.67699V11.2438H2.15566V8.49752C2.15566 8.19237 2.1152 7.97101 2.03427 7.83335C1.95334 7.69577 1.83407 7.62694 1.67648 7.62694C1.51888 7.62694 1.38684 7.71668 1.28035 7.89623C1.17813 8.06967 1.12701 8.32995 1.12701 8.67699V11.2438H-0.0102539V6.47817H1.08228V7.12436H1.10784C1.35915 6.61579 1.70842 6.3615 2.15566 6.3615C2.38567 6.3615 2.58586 6.43031 2.75624 6.56793C2.92661 6.69955 3.05866 6.89999 3.15237 7.16923C3.30144 6.92393 3.46543 6.72947 3.64433 6.58587C3.82323 6.43629 4.04684 6.3615 4.31518 6.3615ZM7.92358 11.2438C7.85964 11.1361 7.8277 10.9057 7.8277 10.5528C7.74681 10.804 7.60623 11.0014 7.40605 11.145C7.21011 11.2887 6.98434 11.3605 6.72876 11.3605C6.53287 11.3605 6.34758 11.3036 6.17293 11.1899C5.99828 11.0763 5.85776 10.9147 5.75123 10.7053C5.64476 10.4959 5.59152 10.2476 5.59152 9.96039C5.59152 9.47577 5.7044 9.11377 5.93017 8.87448C6.15587 8.6351 6.49876 8.47356 6.95881 8.38977C7.19305 8.34193 7.37193 8.29706 7.49546 8.25517C7.61899 8.20733 7.70417 8.15643 7.75105 8.10264C7.80217 8.04281 7.8277 7.96498 7.8277 7.86929C7.8277 7.71965 7.78511 7.60604 7.69993 7.5282C7.61899 7.4445 7.50399 7.4026 7.35493 7.4026C7.21864 7.4026 7.09934 7.4564 6.99711 7.56414C6.89487 7.67181 6.82252 7.82443 6.77987 8.02183L5.7257 7.86929C5.79811 7.39657 5.98128 7.02863 6.27517 6.76537C6.56905 6.49612 6.93534 6.3615 7.37411 6.3615C7.89799 6.3615 8.29411 6.5051 8.56246 6.79229C8.83081 7.0735 8.96499 7.47441 8.96499 7.99489V10.3553C8.96499 10.6126 8.96923 10.807 8.97776 10.9386C8.99052 11.0643 9.01611 11.166 9.0544 11.2438H7.92358ZM7.8277 9.00007C7.78087 9.04197 7.70417 9.08088 7.5977 9.11675C7.49123 9.14666 7.37411 9.17657 7.24628 9.20648C6.91405 9.29622 6.74793 9.50568 6.74793 9.83471C6.74793 9.99625 6.78417 10.1249 6.85658 10.2207C6.93323 10.3104 7.03334 10.3553 7.15687 10.3553C7.25911 10.3553 7.36128 10.3224 7.46352 10.2565C7.56576 10.1908 7.65093 10.089 7.71911 9.95138C7.79152 9.80785 7.8277 9.6283 7.8277 9.41289V9.00007ZM11.3669 10.0681V11.2438C11.2988 11.2558 11.0688 11.2617 10.6769 11.2617C10.4 11.2617 10.1828 11.2288 10.0252 11.163C9.87187 11.0913 9.75687 10.9656 9.68023 10.7861C9.60781 10.6065 9.57158 10.3433 9.57158 9.99625V7.47441H9.05411V6.47817H9.57158V5.16786H10.7025V6.47817H11.3797V7.47441H10.7025V9.61938C10.7025 9.81083 10.7302 9.93345 10.7855 9.98733C10.8452 10.0412 10.9559 10.0681 11.1178 10.0681H11.3669ZM14.9363 9.80785C14.8937 10.0531 14.8042 10.2954 14.6679 10.5347C14.5316 10.7681 14.3399 10.9656 14.0929 11.1271C13.8459 11.2827 13.5435 11.3605 13.1856 11.3605C12.6192 11.3605 12.1762 11.1391 11.8567 10.6963C11.5373 10.2536 11.3775 9.64623 11.3775 8.87448C11.3775 8.09066 11.5351 7.47738 11.8503 7.03462C12.1698 6.58587 12.6128 6.3615 13.1793 6.3615C13.7372 6.3615 14.176 6.57989 14.4954 7.01666C14.8192 7.45342 14.981 8.08165 14.981 8.90133L14.9746 9.17954H12.5468C12.5468 9.53262 12.6042 9.8138 12.7192 10.0232C12.8385 10.2266 12.994 10.3283 13.1856 10.3283C13.3603 10.3283 13.4945 10.2685 13.5882 10.1489C13.6819 10.0292 13.7436 9.88263 13.7735 9.70911L14.9363 9.80785ZM13.1793 7.36666C12.9919 7.36666 12.8428 7.45045 12.732 7.61794C12.6213 7.77956 12.5616 7.99489 12.5531 8.26418H13.8118C13.8033 7.99489 13.7415 7.77956 13.6265 7.61794C13.5158 7.45045 13.3667 7.36666 13.1793 7.36666Z" fill="url(#paint0_radial_13244_72509)" />
                          </g>
                          <defs>
                            <radialGradient id="paint0_radial_13244_72509" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-0.195533 0.874516) rotate(33.8103) scale(16.7787 220.176)">
                              <stop stopColor="#1AB3FF" />
                              <stop offset="1" stopColor="#FFB258" />
                            </radialGradient>
                            <clipPath id="clip0_13244_72509">
                              <rect width="15" height="10.8451" fill="white" transform="translate(0 0.577465)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </strong>
                      <em className='lineHor'></em>
                    </li>
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
  );
};
export default QuoteWon;