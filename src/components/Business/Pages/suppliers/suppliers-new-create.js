import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from "./suppliers.module.scss";
import { Button, Col, Row, Placeholder, Form ,Container,Table} from "react-bootstrap";
import { X,Pen,PlusCircle, Search, ChevronLeft,PlusLg ,ChevronDown,Upload} from 'react-bootstrap-icons';
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';
import SearchIcon from "../../../../assets/images/icon/searchIcon.png";
import NodataImg from "../../../../assets/images/img/NodataImg.png";
import nodataBg from "../../../../assets/images/nodataBg.png";
import { clientEditApi } from "../../../../APIs/ClientsApi";

import { PhoneInput } from 'react-international-phone';
import FileUploader from '../../../../ui/file-uploader/file-uploader';

function SuppliersNewCreate({countryCode,close}) {
  const [show, setShow] = useState(true); // Set to true for default open
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [clientData, setClientData] = useState([]); // Initialize as an empty array
  const [selectedRow, setSelectedRow] = useState(null);
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('Business');
  const [photo, setPhoto] = useState({});
  const [category, setCategory] = useState();
  const [industry, setIndustry] = useState();
  const [company, setCompany] = useState();
  const [customer, setCustomer] = useState();
  const [phone, setPhone] = useState();
  const [wurl, setUrl] = useState();
  const [abn, setAbn] = useState();
  const [payment, setPayment] = useState();
  const [position , setPosition] = useState();
  const [fName , setFnanme] = useState();
  const [lName , setLnanme] = useState();
  const [email , setEmail] = useState();
  const [location , setLocation] = useState();
  const [country , setCountry] = useState();
  const [streetAddress , setStreetAddress] = useState();
  const [state , setState] = useState();
  const [city , setCity] = useState();
  const [postcode , setPostcode] = useState();
  const [description , setDescription] = useState();

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
    navigate('/suppliers'); 
  };

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId === selectedRow ? null : rowId);
    setShow(true);
  };

  const handleInputChange = () => {
   
    
  };
  const handleSaveClient = () => {
    // Add your save logic here
    console.log("Suppliers details saved:", { category, industry,company,customer,wurl,abn,payment ,position,fName,lName,email,location
      ,country,streetAddress,state,city,postcode,description
    });
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

      <Offcanvas show={show} onHide={handleClose} placement="end" className={styles.border} style={{ width: '607px' }}>
        <Offcanvas.Body className={styles.p0}>
          <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
             <div className={styles.circledesignstyle}>
             <div className={styles.out}>
            
               <PlusCircle size={24} color="#17B26A" />
           
             </div>
             </div>

              <strong>Create new Supplier</strong>
      
            </div>
            <button className={styles.CustomCloseModal} onClick={handleClose}>
              <X size={24} color="#667085" />
            </button>
          </div>
          <div className={`${styles.mainScrollWrap} ${styles.editClientValue}`}>
          <div className={styles.displayFlexGrid}>
              <strong>Supplier Details</strong>
              <span>PVG-SP001	</span>
            </div>
        
       
        
   
         <div>
          
           <Row>
             <Col md={12}>
             <FileUpload photo={photo} setPhoto={setPhoto} />
             </Col>
             <Col md={6}>
               <p className={styles.labelColor}>Customer Category</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                   <Select
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     displayEmpty
                     IconComponent={ChevronDown}
                     style={{ color: '#101828' }}
                   >
                     <MenuItem value="">Platinium</MenuItem>
                   </Select>
                 </MUIFormControl>
               )}
             </Col>
           </Row>
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>Company Name</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Company Name"
                     value={company}
                     onChange={(e) => setCompany(e.target.value)}
                   />
             
                 </Form.Group>
               )}
             </Col>
             <Col md={6}>
               <p className={styles.labelColor}>Industry</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Industry"
                     value={industry}
                     onChange={(e) => setIndustry(e.target.value)}
                   />
                  
                 </Form.Group>
               )}
             </Col>
           </Row>
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>Customer Type</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                   <Select
                     value={customer}
                     onChange={(e) => setCustomer(e.target.value)}
                     displayEmpty
                     IconComponent={ChevronDown}
                     style={{ color: '#101828' }}
                   >
                     <MenuItem value="">Long-terms</MenuItem>
                   </Select>
                 </MUIFormControl>
               )}
             </Col>
             <Col sm={6}>
                   <Form.Group className="mb-3">
                   <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                   <PhoneInput
                   country={countryCode}
                   value={phone}
                     placeholder="Enter phone"
                   // onChange={(e) => setPhone(e.target.value)}
                 />
             
                 </Form.Group>
                </Col>
           </Row>
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>ABN</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="ABN"
                     value={abn}
                     onChange={(e) => setAbn(e.target.value)}
                   />
                 
                 </Form.Group>
               )}
             </Col>
           <Col md={6}>
               <p className={styles.labelColor}>Website</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Website URL"
                     value={wurl}
                     onChange={(e) => setUrl(e.target.value)}
                   />
                
                 </Form.Group>
               )}
             </Col> 
           </Row>
         </div>
         <div className={styles.displayFlexGrid}>
           <strong>Payment Terms</strong>
         </div>
         <div className={styles.greyBox}>
           <Row>
             <Col md={6}>
               <p className={styles.labelColor}>Payment Terms</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                   <Select
                     value={payment}
                     onChange={(e) => setPayment(e.target.value)}
                     displayEmpty
                     IconComponent={ChevronDown}
                     style={{ color: '#101828' }}
                   >
                     <MenuItem value="">Monthly</MenuItem>
                   </Select>
                 </MUIFormControl>
               )}
             </Col>
           </Row>
         </div>
         <div className={styles.displayFlexGrid}>
           <strong>Contact Person</strong>
         </div>
         <div className={styles.greyBox}>
         <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>Position</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="position"
                     value={position}
                     onChange={(e) => setPosition(e.target.value)}
                   />
                  
                 </Form.Group>
                 
               )}
             </Col>
        
           </Row>
          
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>First Name</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="First Name"
                     value={fName}
                     onChange={(e) => setFnanme(e.target.value)}
                   />
             
                 </Form.Group>
               )}
             </Col>
           <Col md={6}>
               <p className={styles.labelColor}>Last Name</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Last Name"
                     value={lName}
                     onChange={(e) => setLnanme(e.target.value)}
                   />
                   
                 </Form.Group>
               )}
             </Col>
         
           </Row>
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>Email</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
     
                 </Form.Group>
               )}
             </Col>
           <Col sm={6}>
                   <Form.Group className="mb-3">
                   <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                   <PhoneInput
                   country={countryCode}
                   value={phone}
                     placeholder="Enter phone"
                   // onChange={(e) => setPhone(e.target.value)}
                 />
        
                 </Form.Group>
                </Col>
           </Row>
         </div>
         <div className={`mt-3  d-flex justify-content-end align-items-center ${styles.addNewButton}`}>
             <Button className={styles.deleteBut}>Delete</Button>
             <Button className={styles.addNewBut}>Add New  <PlusLg size={20} color="#106B99" /></Button>
         </div>
         <div className={styles.displayFlexGrid}>
           <strong>Locations</strong>
         </div>
         <div className={styles.greyBox}>
         <Row className="pt-2">
             <Col md={6}>
               <p className={styles.labelColor}>Location Name</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Enter location name"
                     value={location}
                     onChange={(e) => setLocation(e.target.value)}
                   />
            
                 </Form.Group>
                 
               )}
             </Col>
             <Col md={6}>
               <p className={styles.labelColor}>Country</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                   <Select
                     value={country}
                     onChange={(e) => setCountry(e.target.value)}
                     displayEmpty
                     IconComponent={ChevronDown}
                     style={{ color: '#101828' }}
                   >
                     <MenuItem value="">AUS</MenuItem>
                   </Select>
                 </MUIFormControl>
               )}
             </Col>
           </Row>
           
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>Street Address</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Street Address"
                     value={streetAddress}
                     onChange={(e) => setStreetAddress(e.target.value)}
                   />
        
                 </Form.Group>
               )}
             </Col>
           <Col md={6}>
               <p className={styles.labelColor}>State</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="State"
                     value={state}
                     onChange={(e) => setState(e.target.value)}
                   />
              
                 </Form.Group>
               )}
             </Col>
         
           </Row>
           <Row className="pt-2">
           <Col md={6}>
               <p className={styles.labelColor}>City/Suburb</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Enter city"
                     value={city}
                     onChange={(e) => setCity(e.target.value)}
                   />
   
                 </Form.Group>
               )}
             </Col>
            
           <Col md={6}>
               <p className={styles.labelColor}>Postcode</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3">
                   <Form.Control
                     required
                     type="text"
                     placeholder="Enter postcode"
                     value={postcode}
                     onChange={(e) => setPostcode(e.target.value)}
                   />
            
                 </Form.Group>
               )}
             </Col>
           
           </Row>
         </div>
         <div className={`mt-3  d-flex justify-content-end align-items-center ${styles.addNewButton}`}>
             <Button className={styles.deleteBut}>Delete</Button>
             <Button className={styles.addNewBut}>Add New  <PlusLg size={20} color="#106B99" /></Button>
         </div>
      
         <div className={`mt-4 ${styles.greyBox}`}>
         <Row className="pt-2">
           <Col md={12}>
               <p className={styles.labelColor}>Client Description</p>
               {isFetching ? (
                 <Placeholder as="span" animation="wave" className="ms-2 me-2">
                   <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                 </Placeholder>
               ) : (
                 <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                 <Form.Control
                   as="textarea"
                   rows={3}
                   Placeholder="Enter a description..."
                   value={description} // Bind the textarea value to `description`
                   onChange={(e) => setDescription(e.target.value)} // Update `description` on change
                 />
                 <p className={styles.paragraphColor}>This is a hint text to help user.</p>
                 
               </Form.Group>
               
                 
               )}
             </Col>
       
           </Row>
          
           
         </div>
         </div>
       <div className={styles.FooterSuppliersView}>
         <div className="d-flex justify-content-end align-items-center">
           <Button className={styles.cancelBut} onClick={close}>Cancel</Button>
           <Button onClick={handleSaveClient} className={styles.savesupplier}>Save Client Details</Button>
         </div>
       </div>
      
        

        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
function FileUpload({ photo, setPhoto }) {
    const [show, setShow] = useState(false);
  
    return (
      <section className="container mb-3" style={{ marginTop: '24px', padding: '0px' }}>
        {/* <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label> */}
        <div className='d-flex justify-content-center align-items-center flex-column' style={{ width: '100%', minHeight: '126px', padding: '16px', background: '#fff', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
          {
            photo?.croppedImageBase64 ? (
              <div className='text-center'>
                <img
                  alt='uploaded-file'
                  src={photo?.croppedImageBase64}
                  style={{ width: '64px', height: '64px', marginBottom: '12px' }}
                />
              </div>
            ) : (
              <button type='button' onClick={() => setShow(true)} className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', padding: '10px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
                <Upload />
              </button>
            )
          }
          <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#1AB2FF', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShow(true)}>Click to upload</span></p>
          <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
        </div>
        <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
      </section>
    );
  }
  
export default SuppliersNewCreate;
