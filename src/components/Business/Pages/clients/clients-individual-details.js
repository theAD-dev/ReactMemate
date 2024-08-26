import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from './client.module.scss';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { X, Search, ChevronLeft } from 'react-bootstrap-icons';
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import { clientEditApi } from "../../../../APIs/ClientsApi";
import ClientView from './client-view';

function ClientsIndividualDetails() {
  const [show, setShow] = useState(true); // Set to true for default open
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [clientData, setClientData] = useState([]); // Initialize as an empty array
  const [selectedRow, setSelectedRow] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await clientEditApi(id);
        setClientData(Array.isArray(data) ? data : []); // Ensure data is always an array
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

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId === selectedRow ? null : rowId);
    setShow(true);
  };

  const handleInputChange = () => {
   
    
  };

  const columns = [
    {
      field: "id",
      width: 94,
      sortable: false,
      headerName: "Project ID",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.id}
        </div>
      ),
    },
    {
      field: "reference",
      width: 155,
      sortable: false,
      headerName: "Reference",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.reference}
        </div>
      ),
    },
    {
      field: "status",
      width: 113,
      sortable: false,
      headerName: "Status",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.status}
        </div>
      ),
    },
    {
      field: "invoice",
      width: 114,
      sortable: false,
      headerName: "Invoice",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.invoice}
        </div>
      ),
    },
    {
      field: "quote",
      width: 160,
      sortable: false,
      headerName: "Quote",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.quote}
        </div>
      ),
    },
    {
      field: "history",
      width: 70,
      sortable: false,
      headerName: "History",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.history}
        </div>
      ),
    },
    {
      field: "info",
      width: 68,
      sortable: false,
      headerName: "Info",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.info}
        </div>
      ),
    },
    {
      field: "total",
      width: 110,
      sortable: false,
      headerName: "Total",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.total}
        </div>
      ),
    },
    {
      field: "operationalProfit",
      width: 145,
      sortable: false,
      headerName: "Operational Profit",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.operationalProfit}
        </div>
      ),
    },
    {
      field: "replicate",
      width: 82,
      sortable: false,
      headerName: "Replicate",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.replicate}
        </div>
      ),
    },
    {
      field: "bringBack",
      width: 110,
      sortable: false,
      headerName: "Bring Back",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.bringBack}
        </div>
      ),
    },
  ];
  

  const rows = clientData.map(client => ({
    isSelected: selectedRow === client.id,
    id: client.id,
    reference: client.reference,
    status: client.status,
    invoice: client.invoice,
    quote: client.quote,
    history: client.history,
    info: client.info,
    total: client.total,
    operationalProfit: client.operationalProfit,
    replicate: client.replicate,
    bringBack: client.bringBack,
  }));
  

  return (

    <div className={`${styles.clientHistoryPage} ${styles.offcanvashWrap}`}>
       
      <div className={`flexbetween paddingLR tableTopBar`}>
        <Container fluid>
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
              <div className={styles.backBut} onClick={handleClose}>
              <ChevronLeft color="#1AB2FF" size={20} /> Go Back
              </div>
              <div className={styles.filterSearch}>
              <span className='mr-3'>
                <Search color='#98A2B3' size={20} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value="Search..."
                onChange={handleInputChange}
                
              />
              </div>
            </Col>
            <Col>
              <div className="centerTabSales">
                Club Marine
              </div>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Button className={styles.downloadBut}>Download</Button>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="clientTableWrap">
        <Table responsive>
          <thead style={{ position: "sticky", top: 0, zIndex: 9 }}>
            <tr>
              <th></th>
              {columns.map((column) => (
                <th key={column.field} style={{ width: column.width }}>
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id} className={row.isSelected ? "selected-row" : ""}>
                  {columns.map((column) => (
                    <td key={column.field} onClick={() => handleRowClick(row.id)}>
                      {column.renderCell({ value: row[column.field], row })}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="nodataTableRow">
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <div className="Nodata" style={{ background: `url(${nodataBg})` }}>
                      <div className="image">
                        <img src={NodataImg} alt="NodataImg" />
                        <img className="SearchIcon" src={SearchIcon} alt="SearchIcon" />
                      </div>
                      <h2>There are no results</h2>
                      <p>
                        The user you are looking for doesn't exist. Here are some helpful links:
                      </p>
                    
                    
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {isFetching && (
              <tr className="rowBorderHide targetObserver">
                <td className="targetObserver" colSpan={12}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {selectedRow && (
        <Offcanvas show={show} placement="end" className={styles.border} style={{ width: '607px' }}>
          <Offcanvas.Body className={styles.p0}>
            <ClientView id={selectedRow} close={handleClose} />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
}

export default ClientsIndividualDetails;
