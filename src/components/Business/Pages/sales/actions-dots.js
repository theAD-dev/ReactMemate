import React, { useState,useEffect } from 'react';
import { ThreeDotsVertical, Layers ,Tag,ClockHistory,Send} from "react-bootstrap-icons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import CloseIcon from "@mui/icons-material/Close";
import { fetchduplicateData } from "../../../../APIs/SalesApi";
import { fetchhistoryData } from "../../../../APIs/SalesApi";

// Define separate components for each option
const ResendPopover = ({ onClose }) => {
  return (
    <div style={{ padding: '10px' }}>
      Resend Popover Content
      <CloseIcon style={{ cursor: 'pointer', position: 'absolute', top: '5px', right: '5px' }} onClick={onClose} />
    </div>
  );
};

const HistoryPopover = ({ onClose, historyData }) => {
  return (
    <div style={{ padding: '10px' }}>
     {historyData}
  
      <CloseIcon style={{ cursor: 'pointer', position: 'absolute', top: '5px', right: '5px' }} onClick={onClose} />
    </div>
  );
};

const LabelPopover = ({ onClose }) => {
  return (
    <div style={{ padding: '10px' }}>
      Label Popover Content
      <CloseIcon style={{ cursor: 'pointer', position: 'absolute', top: '5px', right: '5px' }} onClick={onClose} />
    </div>
  );
};

const ActionsDots = ({ saleUniqueId,refreshData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [duplicateData, setDuplicateData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchhistoryData(saleUniqueId);
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching history data:', error);
        // Handle error, set default or empty value for historyData
        setHistoryData([]);
      }
    };

    fetchData();
  }, [saleUniqueId]);

  const handleClick = async (event, option) => {
    if (option.label === "Replicate") {
      try {
        const data = await fetchduplicateData(saleUniqueId);
        // setDuplicateData(data);
        refreshData()
        handleClose()
      } catch (error) {
        console.error('Error fetching duplicate data:', error);
        // Handle error, set default or empty value for duplicateData
        setDuplicateData([]);
      }
    } else {
      setAnchorEl(event.currentTarget);
      setSelectedOption(option);
     
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOption(null);
  };

  const options = [
    { label: "Resend",  icon: <Send color="#344054" size={20} />, component: <ResendPopover onClose={handleClose} /> },
    { label: "History", icon: <ClockHistory color="#344054" size={20}/>, component: <HistoryPopover onClose={handleClose} historyData={historyData}/> },
    { label: "Label", icon: <Tag color="#344054" size={20}/>, component: <LabelPopover onClose={handleClose} /> },
    { label: "Replicate", icon: <Layers color="#344054" size={20} /> },
  ];

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={anchorEl ? "long-menu" : undefined}
        aria-expanded={anchorEl ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <ThreeDotsVertical size={24} color="#667085" />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderBottom: "1px solid #EAECF0",
            width: "215px",
            padding: "0"
          },
        }}
      >
        {options.map((option) => (
          <MenuItem className='LmenuList' key={option.label} onClick={(event) => handleClick(event, option)}>
            {option.label}
            {option.icon}
          </MenuItem>
        ))}
      </Menu>
      {selectedOption && selectedOption.label && (
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          {selectedOption.component}
        </Popover>
      )}
    </>
  );
};

export default ActionsDots;