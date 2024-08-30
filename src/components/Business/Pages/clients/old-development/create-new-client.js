import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X,PlusCircle} from 'react-bootstrap-icons';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from './client.module.scss';
import HistoryTable from './history-table';
import NewClientTabbing from './new-client-tabbing';

function ClientNew() {
  const [show, setShow] = useState(true); // Set to true for default open
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [clientData, setClientData] = useState([
    {
      id: 'P240100001-1',
      reference: "Proj-2261 | Visual Advertising Solutions",
      status: "In Progress ",
      invoice: "INV001",
      quote: "QTE001",
      history: "Some history",
      info: "Some info",
      total: "$1000",
      operationalProfit: "$200",
      replicate: "Yes",
      bringBack: "No",
    },
    {
      id: 'P240100001-2',
      reference: "Proj-2261 | Visual Advertising Solutions",
      status: "In Progress ",
      invoice: "INV001",
      quote: "QTE001",
      history: "Some history",
      info: "Some info",
      total: "$1000",
      operationalProfit: "$200",
      replicate: "Yes",
      bringBack: "No",
    },
    {
      id: 'P240100001-2',
      reference: "Proj-2261 | Visual Advertising Solutions",
      status: "In Progress ",
      invoice: "INV001",
      quote: "QTE001",
      history: "Some history",
      info: "Some info",
      total: "$1000",
      operationalProfit: "$200",
      replicate: "Yes",
      bringBack: "No",
    },
    {
      id: 'P240100001-2',
      reference: "Proj-2261 | Visual Advertising Solutions",
      status: "In Progress ",
      invoice: "INV001",
      quote: "QTE001",
      history: "Some history",
      info: "Some info",
      total: "$1000",
      operationalProfit: "$200",
      replicate: "Yes",
      bringBack: "No",
    },
    {
      id: 'P240100001-2',
      reference: "Proj-2261 | Visual Advertising Solutions",
      status: "In Progress ",
      invoice: "INV001",
      quote: "QTE001",
      history: "Some history",
      info: "Some info",
      total: "$1000",
      operationalProfit: "$200",
      replicate: "Yes",
      bringBack: "No",
    },
    {
      id: 'P240100001-2',
      reference: "Proj-2261 | Visual Advertising Solutions",
      status: "In Progress ",
      invoice: "INV001",
      quote: "QTE001",
      history: "Some history",
      info: "Some info",
      total: "$1000",
      operationalProfit: "$200",
      replicate: "Yes",
      bringBack: "No",
    },

  ]);

  const [selectedRow, setSelectedRow] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        // Simulate fetching data from an API
        // In a real scenario, you would replace the mock data with a call to clientEditApi(id)
        // const data = await clientEditApi(id);
        // setClientData(Array.isArray(data) ? data : []); // Ensure data is always an array
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
    navigate('/clients'); 
  };





  return (

  <div className={`${styles.clientHistoryPage} ${styles.offcanvashWrap}`}>
  <HistoryTable clientData={clientData}/>
  <Offcanvas show={show} onHide={handleClose} placement="end" className={styles.border} style={{ width: '607px' }}>
        <Offcanvas.Body className={styles.p0}>
          <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
             <div className={styles.circledesignstyle}>
             <div className={styles.out}>
            
               <PlusCircle size={24} color="#17B26A" />
           
             </div>
             </div>

              <strong>Create New Client</strong>
      
            </div>
            <button className={styles.CustomCloseModal} onClick={handleClose}>
              <X size={24} color="#667085" />
            </button>
          </div>
           <NewClientTabbing />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default ClientNew;
