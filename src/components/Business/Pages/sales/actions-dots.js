import React, { useState, useEffect } from 'react';
import { ThreeDotsVertical, Layers, Tag, ClockHistory, Send } from "react-bootstrap-icons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import CloseIcon from "@mui/icons-material/Close";
import { fetchduplicateData } from "../../../../APIs/SalesApi";
import { fetchhistoryData } from "../../../../APIs/SalesApi";
import { ProgressSpinner } from 'primereact/progressspinner';
import SendInvoiceEmailForm from '../../../../ui/send-invoice/send-invoice';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../../../../APIs/ClientsApi';


const ActionsDots = ({ saleUniqueId, clientId, refreshData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(null);
  const [payload, setPayload] = useState({});
  const [isVisibleResendEmail, setIsVisibleResendEmail] = useState(false);

  const clientQuery = useQuery({
    queryKey: ['id', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId && isVisibleResendEmail,
    retry: 1,
  });

  const handleClick = async (event, option) => {
    if (option.label === "Replicate") {
      try {
        setLoading(4);
        const data = await fetchduplicateData(saleUniqueId);
        refreshData()
        handleClose()
      } catch (error) {
        console.error('Error fetching duplicate data:', error);
      } finally {
        setLoading(null);
      }
    } else if (option.label === 'Resend') {
      setIsVisibleResendEmail(true);
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [
    {
      label: "Resend",
      icon: loading === 1 ? (
        <ProgressSpinner style={{ width: "20px", height: "20px" }} />
      ) : (
        <Send color="#344054" size={20} />
      )
    },
    { label: "History", icon: <ClockHistory color="#344054" size={20} /> },
    { label: "Label", icon: <Tag color="#344054" size={20} /> },
    {
      label: "Replicate",
      icon: loading === 4 ? (
        <ProgressSpinner style={{ width: "20px", height: "20px", position: 'absolute', right: '15px', top: '10px' }} />
      ) : (
        <Layers color="#344054" size={20} />
      )
    },
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
          <MenuItem className='LmenuList d-flex justify-content-between' key={option.label} onClick={(event) => handleClick(event, option)}>
            {option.label}
            {option.icon}
          </MenuItem>
        ))}
      </Menu>
      <SendInvoiceEmailForm projectId={saleUniqueId} show={isVisibleResendEmail} create={() => { }} isLoading={false} setShow={setIsVisibleResendEmail} setPayload={setPayload} contactPersons={clientQuery?.data?.contact_persons || []} projectCardData={refreshData} isCreated={true} />
    </>
  );
};

export default ActionsDots;