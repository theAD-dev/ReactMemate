import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CurrencyDollar ,Filter,FileEarmark,FilePdf,FileText,Link45deg,InfoCircle,XCircle,Files,Reply,Check2Circle,CardChecklist,ListCheck,PhoneVibrate,FolderSymlink
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
import FolderFileIcon from "../../../../assets/images/icon/folderFileIcon.svg";
import CalendarIcon from "../../../../assets/images/icon/calendar.svg";
import InvoicesIcon from "../../../../assets/images/icon/InvoicesIcon.svg";
import ProjectCardFilter from './components/ProjectCardFilter';
import FilesModel from './FilesModel';
import ScheduleUpdate from './components/ScheduleUpdate';
import { ProjectCardApi,cardScheduleUpdateApi } from "../../../../APIs/management-api";

const ProjectCardModel = ({viewShow, setViewShow, project, reInitilize  }) => {

    const [cardData , setCardData] = useState()
    console.log('cardData>>>>>>>>>>>>>>>>>>>>>>>>>: ', cardData);
    
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
        <Modal.Header className="mb-0 pb-0 ">
          <div className="modelHeader">
          <ul className='d-flex justify-content-between align-items-center'>
            <li><strong className='dollorIcon'><CurrencyDollar size={13} color='#F04438'/></strong><span className='cardId'>Q-THE-230401-1</span></li>
            <li>
            <label>
      <select name="selectedStatus">          
        <option value="">Status</option>
        <option value="">WN</option>
        <option value="">LOST</option>
      </select>
    </label>
            </li>
            <li className='refrencesTag'>Reference: <strong>{cardData?.reference}</strong></li>
          </ul>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
        </button>
        </Modal.Header>
        <Modal.Body className='p-0'>
            <div className="ContactModel">
                <Row className="text-left mt-0 projectCardMain">
                <Col className='orderDiscription'>
                 <strong>Order Description</strong>
                 <p className='customScrollBar'>Order ID 875309, placed on January 22, 2024, by customer Alex Johnson, includes two main items. The first item is a pair of stainless steel water bottles, each priced at $15.99, bringing the total for this item to $31.98. Alongside this, the order also contains one set of wireless Bluetooth headphones, with a noise-canceling feature, priced at $89.99. The overall total for the order, combining both items, comes to $121.97...</p>
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
                      cardData.jobs.map(({ id, number, status, total }) => (
                            <tr>
                                <td>{number.substring(4)}</td>
                                <td>Front End Developm...</td>
                                <td>gh</td>
                                <td>${total}</td>
                                <td>   
                                    {status === "Accepted" ? (
                                    <span className={status ? "Accepted" : "Confirmed"}>Finish</span>
                                      ) : (
                                        <span className={status ? "Accepted" : "Confirmed"}>Not Finish</span>
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
                    <Col className='tabModelMenu d-flex justify-content-between align-items-center' ><AddNote /> <NewTask project={project} reInitilize={reInitilize} /> <SendSMS /><ComposeEmail /></Col>
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
                          <p>{created} by {manager}</p>
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
                    <Col><Button><ScheduleUpdate /></Button>
                   
                   <Button>Expense <img src={ExpenseIcon} alt="Expense" /></Button>
                    <Button>Create PO  <img src={CreatePoIcon} alt="CreatePoIcon" /></Button>
                    <Button>Create a Job   <img src={Briefcase} alt="briefcase" /></Button>
                    <Button>Google Review  <img src={GoogleReview} alt="GoogleReview" /></Button>
               
                   <FilesModel />
                    <Button>Send to Calendar  <img src={CalendarIcon} alt="Calendar3" /></Button></Col>
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
                    <Button className='InvoiceAction'>Invoice  <img src={InvoicesIcon} alt="Invoices" /></Button>
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
