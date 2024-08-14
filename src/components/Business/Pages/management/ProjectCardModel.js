import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  X, CurrencyDollar, PencilSquare, Github, FileEarmark, FilePdf, FileText, Link45deg, InfoCircle, XCircle, Files, Reply, Check2Circle, CardChecklist, ListCheck, PhoneVibrate, FolderSymlink
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
import ProjectCardFilter from './ProjectCardFilter';
import FilesModel from './FilesModel';
import ScheduleUpdate from './ScheduleUpdate';
import { ProjectCardApi, cardScheduleUpdateApi } from "../../../../APIs/management-api";
import SelectStatus from './select-status';

const ProjectCardModel = ({ viewShow, setViewShow, projectId, project, statusOptions, reInitilize }) => {
  const [cardData, setCardData] = useState(null);
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [editedReference, setEditedReference] = useState('');

  const handleClose = () => {
    setViewShow(false);
    reInitilize();
  };
  const handleEditReference = () => {
    setIsEditingReference(true);
    setEditedReference(cardData?.reference || '');
  };
  const handleReferenceChange = (e) => {
    setEditedReference(e.target.value);
  };
  const handleSaveReference = () => {
    setCardData(prevData => ({
      ...prevData,
      reference: editedReference
    }));
    setIsEditingReference(false);
  };
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

  useEffect(() => {
    const projectCardData = async (uniqueId) => {
      try {
        const data = await ProjectCardApi(uniqueId);
        setCardData(data);
      } catch (error) {
        console.error('Error fetching project card data:', error);
      }
    }

    if (projectId && viewShow) projectCardData(projectId);
  }, [projectId, viewShow]);

  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const handleDateRangeChange = (range) => {
    // Handle the date range update
    console.log('New date range:', range);
};

//Real Cost Calculation
const cs = parseFloat(cardData?.cost_of_sale) || 0;
const le = parseFloat(cardData?.labor_expenses) || 0;
const oe = parseFloat(cardData?.operating_expense) || 0;
const RealCost = cs + le + oe;
const formattedRealCost = RealCost.toFixed(2);


  return (
    <>
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
              <li><strong className='dollorIcon'><CurrencyDollar size={13} color='#F04438' /></strong><span className='cardId'>{cardData?.number}&nbsp; </span> </li>
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
          <div className='d-flex align-items-center' style={{ gap: '15px' }}>
            <div className='selectButStatus'>
            <SelectStatus projectId={projectId} statusOptions={statusOptions} custom_status={cardData?.custom_status}/>
            </div>
            <button className='CustonCloseModal' onClick={handleClose}>
              <X size={24} color='#667085' />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <div className="ContactModel">
            <Row className="text-left mt-0 projectCardMain">
              <Col className='orderDiscription'>
                <strong>Order Description</strong>
                <div className='customScrollBar'>
                  <ul>
                    {cardData?.calculator_descriptions?.length ? (
                      cardData.calculator_descriptions.map(({ description }, index) => (
                        <li key={index}>- {description}</li>
                      ))
                    ) : (
                      <li>No Description available</li>
                    )}
                  </ul>
                </div>
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
                        cardData.jobs.map(({ id, number, reference, status, total }) => (
                          <tr>
                            <td>{number.substring(4)}</td>
                            <td>{reference}</td>
                            <td> <Github size={24} color='#101828' /></td>
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
                    <AddNote projectId={projectId}/>
                    <NewTask project={project} reInitilize={reInitilize} />
                    <SendSMS />
                    <ComposeEmail />
                  </Col>
                  <Col className='d-flex justify-content-center align-items-center filter'  >
                    <ProjectCardFilter />
                  </Col>
                </Row>
                <Row className='projectHistoryWrap'>
                  <Col className='p-0' >
                    <h3>Project History</h3>
                    <div className='projectHistoryScroll'>
                      {cardData?.history?.length ? (
                        cardData.history.map(({ id, type, text, title, created, manager }) => (
                         
                          <div className='projectHistorygroup' key={id}>
                            <ul>
                              <li>
                                {type === "quote" ? (
                                  <FileEarmark size={16} color='#1AB2FF' />
                                ) : type === "order" ? (
                                  <Check2Circle size={16} color='#1AB2FF' />
                                ) : type === "note" ? (
                                  <CardChecklist size={16} color='#1AB2FF' />
                                ) : type === "tag" ? (
                                  <ListCheck size={16} color='#1AB2FF' />
                                ) : type === "invoice" ? (
                                  <FileText size={16} color='#1AB2FF' />
                                ) : type === "billing" ? (
                                  <PhoneVibrate size={16} color='#1AB2FF' />
                                ) : (
                                  ''
                                )}
                              </li>
                              <li><strong>{title}</strong></li>
                              {/* <li><FilePdf size={16} color='#F04438' /></li>
                              <li><Link45deg size={16} color='#3366CC' /></li> */}
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
              <Col>
                <ScheduleUpdate key={projectId} projectId={projectId} startDate={+cardData?.booking_start} endDate={+cardData?.booking_end} />
                <Button className='expense expActive'>Create Expense <img src={ExpenseIcon} alt="Expense" /></Button>
                <Button className='createPo poActive'>Create PO  <img src={CreatePoIcon} alt="CreatePoIcon" /></Button>
                <Button className='createJob jobActive'>Create a Job   <img src={Briefcase} alt="briefcase" /></Button>
                <Button className='googleBut googleActive'>Google Review  <img src={GoogleReview} alt="GoogleReview" /></Button>
                <FilesModel />
                <Button className='calenBut calenActive'>Send to Calendar  <img src={CalendarIcon} alt="Calendar3" /></Button>
              </Col>
            </Row>
            <Row className='projectCardCalculation'>
              <Col className='proBuget projectColBg'>
                <div>
                  <h5>Budget</h5>
                  <p>${cardData?.budget}</p>
                </div>
              </Col>
              <Col className='proRealCost projectColBg'>
                <div>
                  <h5>Real Cost</h5>
                  <p>${formattedRealCost}</p>
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
                <span>Operational Profit <InfoCircle size={16} color='#1D2939' /></span><strong>${cardData?.operating_expense}</strong>
              </Col>
            </Row>
            <Row className='projectCardactionBut'>
              <Col className='actionLeftSide'>
                <Button className='declineAction'><XCircle size={20} color='#912018' /> Decline Order</Button>
                <Button className='duplicateAction'><Files size={20} color='#0A4766' /> Duplicate</Button>
                <Button className='sendBackAction'><Reply size={20} color='#344054' /> Send Back to Sales</Button>
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