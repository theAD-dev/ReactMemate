import React, { useState } from 'react';
import { ThreeDotsVertical, Layers, Tag, ClockHistory, Send, Trash, Postcard } from "react-bootstrap-icons";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ProgressSpinner } from 'primereact/progressspinner';
import { fetchduplicateData } from "../../../../../APIs/SalesApi";
import { useSaleQuotationDeleteMutations } from '../../../../../entities/sales/models/delete-sale-quotation.mutation';
import ResendQuoteEmail from '../../../features/sales-features/resend-quote/resend-quote';
import SaleHistory from '../../../features/sales-features/sales-history/sale-history';


const ActionsDots = ({ saleUniqueId, clientId, refreshData, status, salesHistory }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(null);
  const [history, setHistory] = useState(null);
  const [isVisibleResendEmail, setIsVisibleResendEmail] = useState(false);

  const deleteMutations = useSaleQuotationDeleteMutations();

  const handleClick = async (event, option) => {
    if (option.label === "Replicate") {
      try {
        setLoading(4);
        await fetchduplicateData(saleUniqueId);
        refreshData();
        handleClose();
      } catch (error) {
        console.error('Error fetching duplicate data:', error);
      } finally {
        setLoading(null);
      }
    } else if (option.label === 'Resend') {
      setIsVisibleResendEmail(true);
      setAnchorEl(null);
    } else if (option.label === 'Print Label') {
      window.open(`/api/v1/sales/${saleUniqueId}/label/`, '_blank');
    } else if (option.label === 'Project Card') {
      window.open(`/api/v1/project-card/${saleUniqueId}/pdf/`, '_blank');
    } else if (option.label === 'Delete' && saleUniqueId) {
      setLoading(5);
      await deleteMutations.mutateAsync(saleUniqueId);
      setLoading(null);
      refreshData();
    } else if (option.label === 'History') {
      setHistory(salesHistory);
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
    { label: "Print Label", icon: <Tag color="#344054" size={20} /> },
    { label: "Project Card", icon: <Postcard color="#344054" size={20} /> },
    {
      label: "Replicate",
      icon: loading === 4 ? (
        <ProgressSpinner style={{ width: "20px", height: "20px", position: 'absolute', right: '15px', top: '10px' }} />
      ) : (
        <Layers color="#344054" size={20} />
      )
    },
    ...(status === "Draft"
      ? [{ label: "Delete", icon: (loading === 5) ? <ProgressSpinner style={{ width: "20px", height: "20px", position: 'absolute', right: '15px', top: '10px' }} /> : <Trash size={20} /> }]
      : [])
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
          <MenuItem className='LmenuList d-flex justify-content-between' key={saleUniqueId + option.label} onClick={(event) => handleClick(event, option)}>
            {option.label}
            {option.icon}
          </MenuItem>
        ))}
      </Menu>
      <ResendQuoteEmail projectId={saleUniqueId} clientId={clientId} viewShow={isVisibleResendEmail} setViewShow={setIsVisibleResendEmail} projectCardData={refreshData} />
      {history && <SaleHistory history={history} setHistory={setHistory} />}
    </>
  );
};

export default ActionsDots;