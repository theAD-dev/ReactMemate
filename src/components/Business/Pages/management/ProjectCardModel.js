import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CurrencyDollar ,PencilSquare,Github,FileEarmark,FilePdf,FileText,Link45deg,InfoCircle,XCircle,Files,Reply,Check2Circle,CardChecklist,ListCheck,PhoneVibrate,FolderSymlink
} from "react-bootstrap-icons";
import { Table } from 'react-bootstrap';
import AddNote from './AddNote';
import NewTask from './NewTask';
import SendSMS from './SendSMS';
import ComposeEmail from './ComposeEmail';
import OrdersIcon from "../../../../assets/images/icon/OrdersIcon.svg";
import ExpenseIcon from "../../../../assets/images/icon/ExpenseIcon.svg";
import CreatePoIcon from "../../../../assets/images/icon/createPoIcon.svg";
import Briefcase from "../../../../assets/images/icon/briefcase.svg";
import GoogleReview from "../../../../assets/images/icon/googleReviewIcon.svg";
import CalendarIcon from "../../../../assets/images/icon/calendar.svg";
import InvoicesIcon from "../../../../assets/images/icon/InvoicesIcon.svg";
import ProjectCardFilter from './components/ProjectCardFilter';
import FilesModel from './FilesModel';
import ScheduleUpdate from './components/ScheduleUpdate';
import { ProjectCardApi,cardScheduleUpdateApi } from "../../../../APIs/management-api";

const ProjectCardModel = ({viewShow, setViewShow, project, reInitilize  }) => {
  console.log('project: ', project);

    const [cardData , setCardData] = useState()
    const [scheduleData , setScheduleData] = useState()
    const [isEditingReference, setIsEditingReference] = useState(false);
    const [editedReference, setEditedReference] = useState('');

    
  const handleClose = () => {
    setViewShow(false);
  };
  const handleShow = () => {
    setViewShow(true);

    };








  

  useEffect(() => {
    const handleClick = async (e) => {
      // Check if the clicked element is not a select element
      if (!(e.target instanceof HTMLSelectElement)) {
        // Check for the 'project-content-name' class
        if (e.target.closest('.project-content-name')) {
          const projectElement = e.target.closest('.project-content-name');
          const uniqueId = projectElement.getAttribute('unique-id');
          
          // Fetch data using the uniqueId
          try {
            const data = await ProjectCardApi(uniqueId);
           
            setCardData(data);
             const scheduledata = await cardScheduleUpdateApi(uniqueId);
             setScheduleData(scheduledata);
          } catch (error) {
            console.error('Error fetching project card data:', error);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []); // Add dependencies if necessary



  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const handleDateRangeChange = (range) => {
    // Handle the date range update
    console.log('New date range:', range);
};




const handleEditReference = () => {
  setIsEditingReference(true);
  setEditedReference(cardData?.reference || '');
};

const handleReferenceChange = (e) => {
  setEditedReference(e.target.value);
};

const handleSaveReference = () => {
  // Save the edited reference here (e.g., make an API call)
  setCardData(prevData => ({
      ...prevData,
      reference: editedReference
  }));
  setIsEditingReference(false);
};

// Date Formate
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const dayOptions = { weekday: 'short' };
  const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
  const dayString = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  const dateString = `${day}.${month}.${year}`;
  return `${timeString} | ${dayString} | ${dateString}`;
};



  return (
    <>
      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="projectCardModel"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 justify-content-between ">
          <div className="modelHeader">
          <ul className='d-flex justify-content-between align-items-center '>
            <li><strong className='dollorIcon'><CurrencyDollar size={13} color='#F04438'/></strong><span className='cardId'>{cardData?.number}&nbsp; </span> </li>
            <li className='refrencesTag'>
                                Reference: 
                                 {isEditingReference ? (
                                    <input 
                                        type="text" 
                                        value={editedReference}
                                        onChange={handleReferenceChange}
                                        onBlur={handleSaveReference}
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                         <strong> {cardData?.reference}</strong>
                                         <span> <PencilSquare size={16} color='#106B99' onClick={handleEditReference} style={{ cursor: 'pointer' }} /></span>
                                    </>
                                )}
                            </li>
          </ul>
          </div>
          <div className='selectedStatusWrap'>
         
            <label>
      <select name="selectedStatus">          
        <option value="">Orange Orange Orange 22</option>
        <option value="">Orange Orange Orange 21</option>
        <option value="">Orange Orange Orange 23</option>
      </select>
    </label>
      <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
        </button>
          </div>
        
        </Modal.Header>
        <Modal.Body className='p-0'>
            <div className="ContactModel">
                <Row className="text-left mt-0 projectCardMain">
                <Col className='orderDiscription'>
                 <strong>Order Description</strong>
                 <p className='customScrollBar'>
                 <ul>
                          {cardData?.calculator_descriptions?.length ? (
            cardData.calculator_descriptions.map(({ description }, index) => (
              <React.Fragment key={index}>
               
                <li>- {description}</li>
            
                </React.Fragment>
            ))
          ) : (
            <div>No Description available</div>
          )}
           
           </ul>

                  </p>
                  <div className='currentJobsTable'>
                    <h5>Current Jobs / Expense for this order</h5>
                    <Table responsive>
                        <thead style={{ position: "sticky", top: "0px", zIndex: 9 }}>
                     
                            <tr>
                            <th>#</th>
                            <th>Reference</th>
                            <th>Supplier</th>
                            <th>Estimate/Total</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                    {cardData?.jobs?.length ? (
                      cardData.jobs.map(({ id, number,reference, status, total }) => (
                            <tr>
                                <td>{number.substring(4)}</td>
                                <td>{reference}</td>
                                <td> <Github size={24} color='#101828'/></td>
                                <td>${total}</td>
                                <td className={status}>  
                                    {status === "Accepted" ? (
                                    <span className={status ? "Accepted" : "Confirmed"}>Paid</span>
                                      ) : (
                                        <span className={status ? "Accepted" : "Confirmed"}>Not Paid</span>
                                      )}
                                 </td>
                            </tr>
                             ))
                            ) : (
                              <tr>
                                <td colSpan={5} className='noDataAvilable'> No history available</td>
                              </tr>
                             
                            )}
                        </tbody>
                    </Table>
                   
                  </div>
                </Col>
                <Col className='projectHistoryCol'>
                 <Row>
                    <Col className='tabModelMenu d-flex justify-content-between align-items-center' >
                    <AddNote />
                    
                     <NewTask project={project} reInitilize={reInitilize} /> <SendSMS /><ComposeEmail /></Col>
                    <Col className='d-flex justify-content-center align-items-center filter'  >
                    {/* <span><Filter size={20} color='#344054'/></span> */}
                    <ProjectCardFilter />
                    </Col>
                 </Row>
                 <Row className='projectHistoryWrap'>
                    <Col className='p-0' >
                    <h3>Project History</h3>
                    <div className='projectHistoryScroll'>
                    {cardData?.history?.length ? (
                      cardData.history.map(({ id, type,text, title, created, manager }) => (
                        <div className='projectHistorygroup' key={id}>
                          <ul>
                            <li>
                            {type === "quote" ? (
                         <FileEarmark size={16} color='#1AB2FF'/>
                        ) : type === "order" ? (
                          <Check2Circle size={16} color='#1AB2FF'/>
                        ) : type === "note" ? (
                          <CardChecklist size={16} color='#1AB2FF'/>
                        ) : type === "tag" ? (
                          <ListCheck size={16} color='#1AB2FF'/>
                        ) : type === "invoice" ? (
                          <FileText size={16} color='#1AB2FF'/>
                        ) : type === "billing" ? (
                          <PhoneVibrate size={16} color='#1AB2FF'/>
                        ):(
                          ''
                        )}
                            </li>
                            <li><strong>{title}</strong></li>
                            <li><FilePdf size={16} color='#F04438'/></li>
                            <li><Link45deg size={16} color='#3366CC'/></li>
                          </ul>
                          <h6>{text}</h6>
                          <p>{formatTimestamp(created)} by {manager}</p>
                        </div>
                      ))
                    ) : (
                      <p>No history available</p>
                    )}


                    </div>
                    </Col>
                 </Row>
                </Col>
                </Row>
                <Row className='projectCardButWrap'>
                    <Col><Button className='schedule schActive'>
                    <ScheduleUpdate
            setDateRange={setDateRange}
            dateRange={dateRange}
            scheduleData={handleDateRangeChange}/>
                    </Button>
                   <Button className='expense expActive'>Create Expense <img src={ExpenseIcon} alt="Expense" /></Button>
                    <Button className='createPo poActive'>Create PO  <img src={CreatePoIcon} alt="CreatePoIcon" /></Button>
                    <Button className='createJob jobActive'>Create a Job   <img src={Briefcase} alt="briefcase" /></Button>
                    <Button className='googleBut googleActive'>Google Review  <img src={GoogleReview} alt="GoogleReview" /></Button>
                   <FilesModel />
                    <Button className='calenBut calenActive'>Send to Calendar  <img src={CalendarIcon} alt="Calendar3" /></Button></Col>
                </Row>
                <Row className='projectCardCalculation'>
                  <Col className='proBuget projectColBg'>
                  <div>
                  <h5>Budget</h5>
                  <p>$8,199.14</p>
                  </div>
                  </Col>
                  <Col className='proRealCost projectColBg'>
                  <div>
                  <h5>Real Cost</h5>
                  <p>${cardData?.operating_expense}</p>
                  </div>
                  </Col>
                  <Col className='proCostSale projectColBg'>
                 <div>
                 <h5>Cost Of Sale</h5>
                 <p>${cardData?.cost_of_sale}</p>
                 </div>
                  </Col>
                  <Col className='proLabour projectColBg'>
                 <div>
                 <h5>Labour</h5>
                 <p>${cardData?.labor_expenses}</p>
                 </div>
                  </Col>
                  <Col className='proProfit projectColBg'>
                 <span>Operational Profit <InfoCircle size={16} color='#1D2939'/></span><strong>${cardData?.profit}</strong>
                  </Col>
                </Row>
                <Row className='projectCardactionBut'>
                    <Col className='actionLeftSide'>
                    <Button className='declineAction'><XCircle size={20} color='#912018'/> Decline Order</Button>
                    <Button className='duplicateAction'><Files size={20} color='#0A4766'/> Duplicate</Button>
                    <Button className='sendBackAction'><Reply size={20} color='#344054'/> Send Back to Sales</Button>
                    </Col>
                    <Col className='actionRightSide'>
                    <Button className='InvoiceAction InvoiceActive'>Invoice  <img src={InvoicesIcon} alt="Invoices" /></Button>
                    <Button className='ProgressAction'>Progress Invoice  <img src={InvoicesIcon} alt="Invoices" /></Button>
                    <Button className='CompleteActionBut'>Complete & Archive</Button>
                    </Col>
                </Row>
                <Row className='projectBreakdown'>
                    <Col>
                    <Button>Cost breakdown</Button>
                    </Col>
                 
                </Row>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectCardModel;
