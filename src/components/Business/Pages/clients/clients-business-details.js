import React, { useEffect, useState } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { clientEditApi } from "../../../../APIs/ClientsApi";
import Offcanvas from 'react-bootstrap/Offcanvas';

import styles from './client.module.scss'; 
import ClientView from './client-view';

function ClientsBusinessDetails() {
  const { id } = useParams(); 
  const [clientData, setClientData] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [show, setShow] = useState(false); // State to control Offcanvas visibility
  const [selectedRow, setSelectedRow] = useState(null);
   const navigate = useNavigate();
  console.log('clientData: ', clientData);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await clientEditApi(id);
        setClientData(data);
        setSelectedRow(id); // Set the selected row to the current client ID
        setShow(true); // Automatically open Offcanvas
      } catch (error) {
        console.error("Error fetching client information:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleClose = () => {
    setShow(false);
    setSelectedRow(null);
    navigate('/clients'); // Navigate to the specified route
  };

  return (
    <div>
      <h1>Client Business Details for ID: {id}</h1>
      <p>Client Name: {clientData?.name}</p>
      <p>Client Category: {clientData?.category}</p>
  
      {/* Sidebar */}
      {selectedRow && (
        <Offcanvas show={show} onHide={handleClose} placement="end" className={styles.border} style={{ width: '607px' }}>
          <Offcanvas.Body className={styles.p0}>
            <ClientView id={selectedRow} close={handleClose} />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
}

export default ClientsBusinessDetails;
