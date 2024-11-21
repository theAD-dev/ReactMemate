import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  X, CurrencyDollar, PencilSquare, Github, FileEarmark, FilePdf, FileText, Link45deg, InfoCircle, XCircle, Files, Reply, Check2Circle, CardChecklist, ListCheck, PhoneVibrate, FolderSymlink,
  Envelope
} from "react-bootstrap-icons";
import { Placeholder, Table } from 'react-bootstrap';
import AddNote from './add-note';
import NewTask from './new-task';
import SendSMS from './send-sms';
import ComposeEmail from './compose-email/compose-email';
import OrdersIcon from "../../../../../assets/images/icon/OrdersIcon.svg";
import ExpenseIcon from "../../../../../assets/images/icon/ExpenseIcon.svg";
import CreatePoIcon from "../../../../../assets/images/icon/createPoIcon.svg";
import Briefcase from "../../../../../assets/images/icon/briefcase.svg";
import CalendarIcon from "../../../../../assets/images/icon/calendar.svg";
import InvoicesIcon from "../../../../../assets/images/icon/InvoicesIcon.svg";
import placeholderUser from '../../../../../assets/images/Avatar.svg';
import ProjectCardFilter from './project-card-filter';
import FilesModel from './files-model';
import ScheduleUpdate from './schedule-update';
import { createInvoiceById, ProjectCardApi, projectsComplete, projectsOrderDecline, projectsToSalesUpdate, updateProjectReferenceById } from "../../../../../APIs/management-api";
import SelectStatus from './select-status';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { fetchduplicateData } from '../../../../../APIs/SalesApi';
import { ProgressSpinner } from 'primereact/progressspinner';
import InvoiceCreate from './invoice-create/invoice-create';
import GoogleReviewEmail from './google-review/google-review';

const ProjectCardModel = ({ viewShow, setViewShow, projectId, project, statusOptions, reInitilize }) => {
  console.log('lo....')
  const navigate = useNavigate();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [editedReference, setEditedReference] = useState('');
  const [expenseJobsMapping, setExpenseJobsMapping] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  console.log('filteredHistory: ', filteredHistory);
  const [filteredHistoryOptions, setFilteredHistoryOptions] = useState([]);

  //Real Cost Calculation
  const cs = parseFloat(cardData?.cost_of_sale) || 0;
  const le = parseFloat(cardData?.labor_expenses) || 0;
  const oe = parseFloat(cardData?.operating_expense) || 0;
  const RealCost = cs + le + oe;
  const formattedRealCost = RealCost.toFixed(2);

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

  const projectCardData = async (uniqueId) => {
    setIsFetching(true);
    try {
      const data = await ProjectCardApi(uniqueId);
      setCardData(data);
    } catch (error) {
      console.error('Error fetching project card data:', error);
    } finally {
      setIsFetching(false);
    }
  }

  const duplicateSale = async () => {
    try {
      if (!projectId) return toast.error("Project id not found");
      setIsDuplicating(true);
      const data = await fetchduplicateData(projectId);
      navigate('/sales');
      toast.success('Sale has been successfully duplicated');
    } catch (error) {
      console.error('Error is duplicating:', error);
      toast.error(`Failed to duplicate sale. Please try again.`);
    } finally {
      setIsDuplicating(false);
    }
  }

  const referencemutation = useMutation({
    mutationFn: (data) => updateProjectReferenceById(projectId, data),
    onSuccess: () => {
      setCardData(prevData => ({
        ...prevData,
        reference: editedReference
      }));
    },
    onError: (error) => {
      console.error('Error creating task:', error);
    }
  });

  const handleSaveReference = () => {
    setIsEditingReference(false);
    referencemutation.mutate({ reference: editedReference })
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

  const updateReturnMutation = useMutation({
    mutationFn: (data) => projectsToSalesUpdate(data),
    onSuccess: (response) => {
      if (response) {
        navigate('/sales');
      } else {
        toast.error(`Failed to update sendBack to sales. Please try again.`);
      }
    },
    onError: (error) => {
      console.error('Error updating sendBack to sales:', error);
      toast.error(`Failed to update sendBack to sales. Please try again.`);
    }
  });

  const declinecOrderMutation = useMutation({
    mutationFn: (data) => projectsOrderDecline(data),
    onSuccess: (response) => {
      if (response) {
        handleClose();
        toast.success('Order has been successfully declined');
      } else {
        toast.error(`Failed to decline the order. Please try again.`);
      }
    },
    onError: (error) => {
      console.error('Error declining the order:', error);
      toast.error(`Failed to decline the order. Please try again.`);
    }
  });

  const completeMutation = useMutation({
    mutationFn: (data) => projectsComplete(data),
    onSuccess: (response) => {
      if (response) {
        navigate('/sales');
        toast.success('Project has been successfully completed');
      } else {
        toast.error(`Failed to complete the project. Please try again.`);
      }
    },
    onError: (error) => {
      console.error('Error completing the project:', error);
      toast.error(`Failed to complete the project. Please try again.`);
    }
  });

  const createInvoiceMutation = useMutation({
    mutationFn: (data) => createInvoiceById(data),
    onSuccess: (response) => {
      if (response) {
        handleClose();
        projectCardData(projectId);
        toast.success('Invoice has been successfully created');
      } else {
        toast.error(`Failed to create the invoice. Please try again.`);
      }
    },
    onError: (error) => {
      console.error('Error creating the invoice:', error);
      toast.error(`Failed to create the invoice. Please try again.`);
    }
  });

  const createInvoice = () => {
    createInvoiceMutation.mutate(projectId);
  }

  const declinecOrder = () => {
    declinecOrderMutation.mutate(projectId);
  }

  const canReturn = (isReturn) => {
    if (isReturn) return;
    updateReturnMutation.mutate(projectId);
  }

  useEffect(() => {
    if (filteredHistoryOptions?.length) {
      let histories = cardData?.history?.filter((history) => filteredHistoryOptions.includes(history.type))
      setFilteredHistory(histories || []);
    } else {
      setFilteredHistory(cardData?.history);
    }
  }, [filteredHistoryOptions, cardData?.history]);

  useEffect(() => {
    if (cardData) {
      let expensesWithType = cardData?.expenses.map(item => ({ ...item, type: 'expense' }));
      let jobsWithType = cardData?.jobs.map(item => ({ ...item, type: 'job' }));
      let mix = [...expensesWithType, ...jobsWithType];
      let sortedMix = mix.sort((a, b) => parseInt(b.created) - parseInt(a.created));
      setExpenseJobsMapping(sortedMix);
      setFilteredHistory(cardData?.history || []);
    }
  }, [cardData]);

  useEffect(() => {
    if (projectId && viewShow) projectCardData(projectId);
  }, [projectId, viewShow]);

  const parseEmailData = (text) => {
    const lines = text.split("\n");

    // Extract and clean the subject
    const subject = lines.find((line) => line.startsWith("Subject:")).replace("Subject: ", "");

    // Extract and clean the recipients
    const rawRecipients = lines.find((line) => line.startsWith("Recipient(s):")).replace("Recipient(s): ", "");
    const recipients = JSON.parse(rawRecipients.replace(/'/g, '"')); // Replace single quotes with double quotes

    // Extract the body
    const body = text.split("Body:")[1]?.trim();

    return { subject, recipients, body };
  };

  const EmailComponent = ({ emailData }) => {
    const [showFullBody, setShowFullBody] = useState(false);

    const email = parseEmailData(emailData);

    // Process email body lines, splitting by paragraph or newlines
    const bodyLines = email.body.split(/<\/p>\s*<p>|<br\s*\/?>|\n/).map((line, idx) => `<p key=${idx}>${line.trim()}</p>`);

    // Limit the number of lines displayed initially
    const visibleBody = showFullBody ? bodyLines.join("") : bodyLines.slice(0, 3).join("");

    return (
      <div>
        <ul className="d-flex flex-column align-items-start">
          <li className="font-14">
            <strong className="font-12">Subject:</strong>&nbsp; {email.subject}
          </li>
          <li>
            <strong className="font-12">Recipients:</strong>&nbsp;
            <ul>
              {email.recipients.map((recipient, index) => (
                <li className="font-14" key={index}>
                  {recipient}
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <div>
          <div dangerouslySetInnerHTML={{ __html: visibleBody }} />
          {bodyLines.length > 3 && (
            <button
              className="text-button font-12 px-0"
              onClick={() => setShowFullBody(!showFullBody)}
            >
              {showFullBody ? "Show Less" : "Load More"}
            </button>
          )}
        </div>
      </div>
    );
  };


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
              <li className='me-1 d-flex align-items-center'>
                <strong className='dollorIcon' style={{
                  background: !cardData?.invoice_created ? '#F9FAFB'
                    : cardData?.payment_status === 'paid' ? '#F2FDEC'
                      : cardData?.payment_status === 'not_paid' ? "#FEF3F2"
                        : "#FFFAEB"
                }}><CurrencyDollar size={13} color={
                  !cardData?.invoice_created ? '#667085'
                    : cardData?.payment_status === 'paid' ? '#17B26A'
                      : cardData?.payment_status === 'not_paid' ? "#F04438"
                        : "#B54708"
                } /></strong>
                {
                  isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size='md' style={{ width: '120px' }} />
                    </Placeholder>
                  ) : <span className='cardId'>{cardData?.number} &nbsp;</span>
                }
              </li>
              <li className='refrencesTag mt-1'>
                Reference:&nbsp;
                {isFetching ? (
                  <Placeholder as="p" animation="wave" className="mb-0 mt-1">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '120px', height: '20px' }} />
                  </Placeholder>
                ) : isEditingReference ? (
                  <input
                    type="text"
                    value={editedReference}
                    onChange={handleReferenceChange}
                    onBlur={handleSaveReference}
                    autoFocus
                    className='border rounded'
                  />
                ) : (
                  <>
                    {
                      referencemutation.isPending
                        ? <div class="dot-flashing ms-5 mt-1"></div>
                        : <>
                          <small style={{ color: '#1D2939', fontSize: '16px' }}> {cardData?.reference}</small>
                          <span> <PencilSquare size={16} color='#106B99' onClick={handleEditReference} style={{ cursor: 'pointer' }} /></span>
                        </>
                    }
                  </>
                )}
              </li>
            </ul>
          </div>
          <div className='d-flex align-items-center' style={{ gap: '15px' }}>
            <div className='selectButStatus'>
              {
                isFetching ? (
                  <Placeholder as="p" animation="wave" className="mb-0 mt-1">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '120px', height: '20px' }} />
                  </Placeholder>
                ) : (<SelectStatus projectId={projectId} statusOptions={statusOptions} custom_status={cardData?.custom_status} />)
              }
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
                  {
                    isFetching ? (<>
                      <Placeholder as="p" animation="wave" className="mb-0 mt-1">
                        <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                      </Placeholder>
                      <Placeholder as="p" animation="wave" className="mb-0 mt-1">
                        <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                      </Placeholder>
                      <Placeholder as="p" animation="wave" className="mb-0 mt-1">
                        <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                      </Placeholder>
                      <Placeholder as="p" animation="wave" className="mb-0 mt-1">
                        <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '12px' }} />
                      </Placeholder>
                    </>
                    ) : (
                      <ul>
                        {cardData?.calculator_descriptions?.length ? (
                          cardData.calculator_descriptions.map(({ description }, index) => (
                            <li key={index}>- {description}</li>
                          ))
                        ) : (
                          <li>No Description available</li>
                        )}
                      </ul>
                    )
                  }
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
                      {
                        isFetching ? (
                          <>
                            <tr>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '80%', height: '14px', position: 'relative', left: '-10px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '80%', height: '14px', position: 'relative', left: '-10px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '80%', height: '14px', position: 'relative', left: '-10px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '80%', height: '14px', position: 'relative', left: '-10px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                              <td>
                                <Placeholder as="p" animation="wave" className="mb-0">
                                  <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                                </Placeholder>
                              </td>
                            </tr>
                          </>
                        ) : expenseJobsMapping?.length ? (
                          expenseJobsMapping.map((data, index) => (
                            <tr key={data.number || `je-${index}`}>
                              <td>{data?.number || "-"}</td>
                              <td>
                                {data?.type === 'job'
                                  ? data?.reference || "-"
                                  : data?.invoice_reference || "-"}
                              </td>
                              <td>
                                {
                                  data?.type === 'job'
                                    ? <Github size={24} color='#101828' />
                                    : (<img src={data?.supplier?.photo || placeholderUser} alt='supplier' style={{ width: '24px', height: '24px', borderRadius: '50%', }} />)
                                }
                              </td>
                              <td>${data?.total || "-"}</td>
                              <td className='status'>
                                {data?.type === 'job'
                                  ? <span>{data?.status || "-"}</span>
                                  : <span className={data?.paid ? 'paid' : 'unpaid'}>
                                    {data?.paid ? 'Paid' : 'Not Paid'}
                                  </span>}
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
                    <AddNote projectId={projectId} projectCardData={projectCardData} />
                    <NewTask project={project} reInitilize={reInitilize} projectCardData={() => projectCardData(projectId)} />
                    <SendSMS />
                    <ComposeEmail clientId={cardData?.client} projectId={projectId} />
                  </Col>
                  <Col className='d-flex justify-content-center align-items-center filter'  >
                    <ProjectCardFilter setFilteredHistoryOptions={setFilteredHistoryOptions} />
                  </Col>
                </Row>
                <Row className='projectHistoryWrap'>
                  <Col className='p-0' >
                    <h3>Project History</h3>
                    {
                      isFetching ? (
                        <>
                          {Array.from({ length: 10 }, (_, index) => (
                            <Placeholder
                              key={`history-key-${index + 1}`}
                              as="p"
                              animation="wave"
                              className={index % 2 === 0 ? "mb-0 mt-1" : "mb-3 mt-1"}
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                className="rounded-0"
                                size='sm'
                                style={{
                                  width: index % 2 === 0 ? '200px' : '90%',
                                  height: index % 2 === 0 ? '15px' : '10px'
                                }}
                              />
                            </Placeholder>
                          ))}
                        </>
                      ) : (
                        <div className='projectHistoryScroll'>
                          {filteredHistory?.length ? (
                            filteredHistory.map(({ id, type, text, title, created, manager, links, ...rest }, index) => (
                              <div className='projectHistorygroup' key={`history-${id || index}`}>
                                <ul>
                                  <li>
                                    {type === "quote" ? (
                                      <>
                                        <div className='d-flex align-items-center'>
                                          <FileEarmark size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Quote &nbsp;</strong>
                                          &nbsp;{links?.quote_pdf && <Link to={`${links?.quote_pdf || "#"}`} target='_blank'><FilePdf color='#FF0000' size={14} /></Link>}
                                          &nbsp;&nbsp;{projectId && title === "Quote Created" && <Link to={`/quote/${projectId}`} target='_blank'><Link45deg color='#3366CC' size={16} /></Link>}
                                        </div>
                                      </>

                                    ) : type === "task" ? (
                                      <>
                                        <>
                                          <Check2Circle size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Task</strong>
                                        </>
                                      </>

                                    ) : type === "order" ? (
                                      <>
                                        <>
                                          <Check2Circle size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Order</strong>
                                        </>
                                      </>

                                    ) : type === "note" ? (
                                      <>
                                        <>
                                          <CardChecklist size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Note</strong>
                                        </>
                                      </>
                                    ) : type === "tag" ? (
                                      <>
                                        <>
                                          <ListCheck size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Tag</strong>
                                        </>
                                      </>

                                    ) : type === "invoice" ? (
                                      <>
                                        <div className='d-flex align-items-center'>
                                          <FileText size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Invoice&nbsp;</strong>
                                          &nbsp;{links?.invoice_pdf && <Link to={`${links?.invoice_pdf || "#"}`} target='_blank'><FilePdf color='#FF0000' size={14} /></Link>}
                                          &nbsp;&nbsp;{projectId && title === "Invoice Created" && <Link to={`/invoice/${projectId}`} target='_blank'><Link45deg color='#3366CC' size={16} /></Link>}
                                        </div>
                                      </>

                                    ) : type === "billing" ? (
                                      <>
                                        <>
                                          <PhoneVibrate size={16} color="#1AB2FF" />{" "}
                                          <strong>&nbsp; Billing</strong>
                                        </>
                                      </>

                                    ) : type === "email" ? (<>
                                      <Envelope size={16} color="#1AB2FF" />{" "}
                                      <strong>&nbsp; Email</strong>
                                    </>) : (
                                      ''
                                    )}
                                  </li>

                                </ul>
                                <h5 style={{ whiteSpace: "pre-line" }}>{title}</h5>
                                {
                                  type === "email" ? <EmailComponent emailData={text} />
                                    :
                                    <h6 style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: text }} />
                                }
                                <p>{formatTimestamp(created)} by {manager}</p>
                              </div>
                            ))
                          ) : (
                            <p>No history available</p>
                          )}
                        </div>
                      )
                    }

                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='projectCardButWrap'>
              <Col>
                {
                  isFetching ? (
                    <Placeholder as="div" animation="wave" className="">
                      <Placeholder xs={12} bg="secondary" className="rounded" size='md' style={{ width: '190px', height: '45px' }} />
                    </Placeholder>
                  ) : <ScheduleUpdate key={projectId} projectId={projectId} startDate={+cardData?.booking_start} endDate={+cardData?.booking_end} />
                }
                <Link to={`/expenses?projectId=${project?.value}`}><Button className='expense expActive'>Create Expense <img src={ExpenseIcon} alt="Expense" /></Button></Link>
                {/* <Button className='createPo poActive'>Create PO  <img src={CreatePoIcon} alt="CreatePoIcon" /></Button> */}
                <Button className='createJob jobActive'>Create a Job   <img src={Briefcase} alt="briefcase" /></Button>
                <GoogleReviewEmail clientId={cardData?.client} projectId={projectId} />
                {/* <FilesModel /> */}
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
                <Button onClick={declinecOrder} disabled={!cardData?.can_be_declined} className='declineAction'>
                  <XCircle size={20} color='#912018' /> Decline Order
                  {
                    declinecOrderMutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px', left: '8px' }} />
                  }
                </Button>
                <Button disabled={isDuplicating} className='duplicateAction' onClick={duplicateSale}>
                  <Files size={20} color='#0A4766' className='me-1' />
                  <span style={{ position: 'relative', top: '2px' }}>Duplicate</span> {isDuplicating && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '6px' }} />}
                </Button>
                <Button disabled={!cardData?.can_be_return} onClick={() => canReturn(!cardData?.can_be_return)} className='sendBackAction'>
                  <Reply size={20} color='#344054' opacity={!cardData?.can_be_return ? .5 : 1} />
                  Send Back to Sales
                  {
                    updateReturnMutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px', left: '8px' }} />
                  }
                </Button>
              </Col>
              <Col className='actionRightSide'>
                <InvoiceCreate clientId={cardData?.client} isCreated={cardData?.invoice_created} projectId={projectId} isLoading={createInvoiceMutation?.isPending} create={() => createInvoice(projectId)} projectCardData={() => projectCardData(projectId)} />

                {/* <Button className='InvoiceAction InvoiceActive me-3' >
                  Invoice  <img src={InvoicesIcon} alt="Invoices" />
                  {createInvoiceMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px', left: '8px' }} />}
                </Button> */}

                {/* <Button className='ProgressAction'>Progress Invoice  <img src={InvoicesIcon} alt="Invoices" /></Button> */}

                <Button onClick={() => completeMutation.mutate(projectId)} disabled={!cardData?.can_be_completed} className='CompleteActionBut'>
                  Complete & Archive
                  {
                    completeMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px', left: '8px' }} />
                  }
                </Button>
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