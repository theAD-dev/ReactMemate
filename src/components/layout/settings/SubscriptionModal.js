import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const SubscriptionModal = ({ statusValue }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setTimeout(() => {
      setOpen(false);
    }, 0);
  };

  return (
    <>
      <Button onClick={handleOpen} className="paynow">
        <div className={``}>Purchase Locations </div>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modelStyleBoxstatus " sx={{ width: 718 }}>
          <Typography id="modal-modal-title" className="">
            <>
              <div className="modelHeader d-flex justify-content-between align-items-start">
                <h3>Mobile App Users</h3>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon color="#667085" size={24} />
                </IconButton>
              </div>
              <div className="stepBoxStyle">
                <h5>Today’s charge: 61,93$</h5>
                <p>
                  In the next billing period, your account will be charged the
                  full cost of your subscription.{" "}
                </p>
              </div>
              <div className="footerButton">
                <button className="Cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button className="clickpaid">Pay now</button>
              </div>
            </>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
export default SubscriptionModal;
