import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './client.module.scss';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
import { X, Search, ChevronLeft,Link ,Link45deg,FilePdf,PlusSlashMinus,FileText,InfoCircle,Files,ArrowLeftCircle} from 'react-bootstrap-icons';
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";

function HistoryTable({clientData}) {
  const [show, setShow] = useState(true); 
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [isEdit, setIsEdit] = useState(false);



  const [selectedRow, setSelectedRow] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        setSelectedRow(id); 
        setShow(true); 
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
      width: 178,
      sortable: false,
      headerName: "Project ID",
      renderCell: ({ row }) => (
        
        <div className={`mainStyle ${styles.id}`}
        style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {row.id}
        </div>
      ),
    },
    {
      field: "reference",
      sortable: false,
      headerName: "Reference",
      renderCell: ({ row }) => (
        <div className={`mainStyle ${styles.refrencess}`}
         style={{ whiteSpace: "nowrap", textAlign: "left" }}>
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
        <div className={`mainStyle ${styles.status}`}
        style={{ whiteSpace: "nowrap", textAlign: "left" }}>
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
    
             <ul className={`disPlayInline ${styles.disPlayInlineCenter}`}>
        <li>
        <a href="#" target="_blank" rel="noopener noreferrer">
            <FilePdf color="#FF0000" size={16} />
          </a>
        </li>
        <li>
        <a href="#" target="_blank" rel="noopener noreferrer">
            <Link45deg color="#3366CC" size={16} />
          </a>
        </li>
      </ul>
      ),
    },
    {
      field: "quote",
      width: 160,
      sortable: false,
      headerName: "Quote",
      renderCell: ({ row }) => (
    
            <ul className={`disPlayInline ${styles.disPlayInlineCenter}`}>
            <li className="disable">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <PlusSlashMinus color="#FDB022" size={16} />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
              <FilePdf color="#FF0000" size={16} />
              </a>
            </li>
            <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <Link45deg color="#3366CC" size={16} />
              </a>
            </li>
          </ul>
      ),
    },
    {
      field: "history",
      width: 70,
      sortable: false,
      headerName: "History",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        <FileText color="#98A2B3" size={16} />
        
        </div>
      ),
    },
    {
      field: "info",
      width: 68,
      sortable: false,
      headerName: "Info",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
        <InfoCircle color="#98A2B3" size={16} />
        
        </div>
      ),
    },
    {
      field: "total",
      width: 110,
      sortable: false,
      headerName: "Total",
      renderCell: ({ row }) => (
        <div className={`mainStyle ${styles.total}`}
         style={{ whiteSpace: "nowrap", textAlign: "right" }}>
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
        <div className={`mainStyle ${styles.oProfit}`}
        style={{ whiteSpace: "nowrap", textAlign: "right" }}>
          <span>{row.operationalProfit}</span>
        </div>
      ),
    },
    {
      field: "replicate",
      width: 82,
      sortable: false,
      headerName: "Replicate",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
         <Files color="#98A2B3" size={16} />
        
        </div>
      ),
    },
    {
      field: "bringBack",
      width: 110,
      sortable: false,
      headerName: "Bring Back",
      renderCell: ({ row }) => (
        <div className="mainStyle id" style={{ whiteSpace: "nowrap", textAlign: "center" }}>
          <ArrowLeftCircle color="#667085" size={16} />
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


       
     <>
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

  
      <div className={`clientTableWrap ${styles.clientTablehistory} ${styles.clientTableBodyWrap}`}>
        <Table responsive>
          <thead style={{ position: "sticky", top: 0, zIndex: 9 }}>
            <tr>
             
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
                    <td key={column.field} >
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
     </>

    
  );
}

export default HistoryTable;
