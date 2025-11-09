import React, { useState, useEffect, useRef } from 'react';
import { OverlayTrigger, Placeholder, Table, Tooltip } from 'react-bootstrap';
import {
  X, CurrencyDollar, PencilSquare, FileEarmark, FilePdf, FileText, Link45deg, XCircle, Files, Reply, Check2Circle, CardChecklist, ListCheck, PhoneVibrate,
  Envelope,
  Tag,
  Postcard,
  PlusCircle,
  PauseCircle,
  Copy,
  Trash
} from "react-bootstrap-icons";
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import AddNote from './add-note';
import ComposeEmail from './compose-email/compose-email';
import FilesModel from './files-management/files-model';
import GoogleReviewEmail from './google-review/google-review';
import InvoiceCreate from './invoice-create/invoice-create';
import NewTask from './new-task';
import ProjectCardFilter from './project-card-filter';
import ScheduleUpdate from './schedule-update';
import SelectStatus from './select-status';
import SendSMS from './send-sms/send-sms';
import SendToCalendar from './send-to-calendar';
import StartChat from './start-chat/start-chat';
import CurrentJobAndExpenseLoading from './ui/current-job-and-expense-loading';
import JobStatus from './ui/job-status/job-status';
import { createInvoiceById, ProjectCardApi, projectsComplete, projectsOrderDecline, projectsToSalesUpdate, updateCostBreakDownDescription, updateProjectReferenceById } from "../../../../../APIs/management-api";
import { fetchduplicateData } from '../../../../../APIs/SalesApi';
import Briefcase from "../../../../../assets/images/icon/briefcase.svg";
import ExpenseIcon from "../../../../../assets/images/icon/ExpenseIcon.svg";
import useSocket from '../../../../../shared/hooks/use-socket';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import ImageAvatar from '../../../../../shared/ui/image-with-fallback/image-avatar';
import CreateJob from '../../../../Work/features/create-job/create-job';
import NewExpensesCreate from '../../../features/expenses-features/new-expenses-create/new-expense-create';



const ProjectCardModel = ({ viewShow, setViewShow, projectId, project, statusOptions, reInitialize }) => {
  const navigate = useNavigate();
  const { socket, isConnected, listen } = useSocket();
  const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [editedReference, setEditedReference] = useState('');
  const [expenseJobsMapping, setExpenseJobsMapping] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filteredHistoryOptions, setFilteredHistoryOptions] = useState([]);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [visible, setVisible] = useState(false);
  const [createExpenseVisible, setCreateExpenseVisible] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  //Real Cost Calculation
  const cs = parseFloat(cardData?.cost_of_sale) || 0;
  const le = parseFloat(cardData?.labor_expense) || 0;
  const oe = parseFloat(cardData?.operating_expense) || 0;
  const RealCost = cs + le + oe;
  const formattedRealCost = parseFloat(RealCost).toFixed(2);

  const handleClose = () => {
    setViewShow(false);
    reInitialize();
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
      if (data?.detail === 'Not found.') throw new Error('Project card not found');
      setCardData(data);
    } catch (error) {
      console.error('Error fetching project card data:', error);
      toast.error(`Failed to fetch project card data. Please try again.`);
      setViewShow(false);
      setCardData(null);
    } finally {
      setIsFetching(false);
    }
  };

  const duplicateSale = async () => {
    try {
      if (!projectId) return toast.error("Project id not found");
      setIsDuplicating(true);
      await fetchduplicateData(projectId);
      navigate('/sales');
      toast.success('Sale has been successfully duplicated');
    } catch (error) {
      console.error('Error is duplicating:', error);
      toast.error(`Failed to duplicate sale. Please try again.`);
    } finally {
      setIsDuplicating(false);
    }
  };

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

  const handleSaveReference = async () => {
    setIsEditingReference(false);
    await referencemutation.mutateAsync({ reference: editedReference });
    await createInvoiceById(projectId);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dayOptions = { weekday: 'short' };
    const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
    const dayString = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = date.getFullYear();
    const dateString = `${day} ${monthAbbreviation} ${year}`;
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
        toast.success('Order has been successfully cancelled');
      } else {
        toast.error(`Failed to cancel the order. Please try again.`);
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
        handleClose();
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

  const handleCompleteProject = () => {
    if (socket && isConnected) {
      completeMutation.mutate(projectId);
      socket.emit('archive_chat_by_project', { project_id: projectId });
    }else {
      console.error('Socket is not connected');
      toast.error('Unable to delete chat. Please try again.');
    }
  };

  const createInvoice = () => {
    createInvoiceMutation.mutate(projectId);
  };

  const declinecOrder = () => {
    setShowCancelConfirmation(true);
  };

  const canReturn = (isReturn) => {
    if (isReturn) return;
    updateReturnMutation.mutate(projectId);
  };

  const confirmCancelOrder = async () => {
    setShowCancelConfirmation(false);
    declinecOrderMutation.mutate(projectId);
  };

  useEffect(() => {
    if (filteredHistoryOptions?.length) {
      let histories = cardData?.history?.filter((history) => filteredHistoryOptions.includes(history.type));
      setFilteredHistory(histories || []);
    } else {
      setFilteredHistory(cardData?.history);
    }
  }, [filteredHistoryOptions, cardData?.history]);

  useEffect(() => {
    if (cardData) {
      let expensesWithType = cardData?.expenses?.map(item => ({ ...item, type: 'expense' }));
      let jobsWithType = cardData?.jobs?.map(item => ({ ...item, type: 'job' }));
      let mix = [...expensesWithType, ...jobsWithType];
      let sortedMix = mix.sort((a, b) => parseInt(b.created) - parseInt(a.created));
      setExpenseJobsMapping(sortedMix);
      setFilteredHistory(cardData?.history || []);
    }
  }, [cardData]);

  useEffect(() => {
    if (projectId && viewShow) projectCardData(projectId);
    window.history.pushState({}, '', '/management');
  }, [projectId, viewShow]);

  const parseEmailData = (text) => {
    const lines = text.split("\n");

    // Extract and clean the subject
    const subject = lines.find((line) => line.startsWith("Subject:"))?.replace("Subject: ", "") || "";

    // Extract and clean the recipients
    const rawRecipients = lines.find((line) => line?.startsWith("Recipient(s):"))?.replace("Recipient(s): ", "") || [];
    const recipients = JSON.parse(rawRecipients?.length && rawRecipients?.replace(/'/g, '"')); // Replace single quotes with double quotes

    // Extract the body
    const body = text.split("Body:")[1]?.trim();

    return { subject, recipients, body };
  };

  const EmailComponent = ({ emailData }) => {
    const [showFullBody, setShowFullBody] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const emailBodyRef = useRef(null); // Ref to measure the height of the content

    const email = parseEmailData(emailData);

    // Process email body lines, splitting by paragraph or newlines
    const bodyLines = email.body?.split(/<\/p>\s*<p>|<br\s*\/?>|\n/)?.map(
      (line, idx) => `<p key=${idx}>${line?.trim()}</p>`
    );

    const visibleBody = bodyLines?.join("");

    useEffect(() => {
      if (emailBodyRef.current) {
        const bodyHeight = emailBodyRef.current.scrollHeight;
        setIsOverflowing(bodyHeight > 90); // Check if the content exceeds 100px
      }
    }, [visibleBody]);

    return (
      <div>
        <ul className="d-flex flex-column align-items-start">
          <li className="font-12">
            <strong className="font-12">Subject:</strong>&nbsp; {email.subject}
          </li>
          <li>
            <strong className="font-12">Recipients:</strong>&nbsp;
            <ul>
              {email?.recipients?.length && email?.recipients?.map((recipient, index) => (
                <li className="font-12" key={index}>
                  {recipient}
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <div>
          <div
            ref={emailBodyRef}
            style={{
              maxHeight: showFullBody ? "none" : "87px",
              overflowY: "hidden",
              overflowX: showFullBody ? "auto" : "hidden"
            }}
            dangerouslySetInnerHTML={{ __html: visibleBody }}
          />
          {isOverflowing && (
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

  const updateCostBreakDownMutation = useMutation({
    mutationFn: (data) => updateCostBreakDownDescription(projectId, data),
    onSuccess: () => {
      toast.success('Cost breakdown updated successfully');
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error('Failed to update cost breakdown');
      projectCardData(projectId);
    }
  });

  const handleCostBreakdown = (id, description) => {
    updateCostBreakDownMutation.mutate({ id, description });
  };

  const ConstBreakDownTextArea = (rowData) => {
    const [description, setDescription] = useState(rowData.description);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      if (isEditing) {
        document.getElementById(`cost-breakdown-${rowData.id}`)?.focus();
      }
    }, [isEditing, rowData.id]);

    return (<div className='d-flex'>
      <textarea rows={1} className="auto-expand" style={{ background: 'transparent', border: '0px solid #fff', fontSize: '14px', minHeight: '50px' }}
        value={description}
        id={`cost-breakdown-${rowData.id}`}
        onChange={(e) => { setDescription(e.target.value); }}
        disabled={!isEditing}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onFocus={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
          e.target.style.border = '1px solid #dedede';
          e.target.style.background = '#fff';
        }}
        onBlur={(e) => {
          e.target.style.height = '50px';
          e.target.style.border = '0px solid #fff';
          e.target.style.background = 'transparent';
          handleCostBreakdown(rowData.id, description);
          setIsEditing(false);
        }}
        onClick={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      ></textarea>
      {updateCostBreakDownMutation?.isPending && updateCostBreakDownMutation?.variables?.id === rowData.id ?
        <ProgressSpinner style={{ width: '20px', height: '20px' }} />
        : <PencilSquare size={16} color='#106B99'
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer', marginLeft: '8px' }} />
      }
    </div>
    );
  };

  const handleCopy = () => {
    if (cardData?.calculator_descriptions?.length) {
      let allDescriptions = cardData?.calculator_descriptions?.map(item => `- ${item.description}`).join('\n');
      navigator.clipboard.writeText(allDescriptions);
      toast.success('Copied to clipboard');
    }
  };

  const headerElement = (
    <div style={{ textAlign: 'center', paddingBottom: '0px' }}>
      <h5 style={{ margin: 0, color: '#1D2939', fontSize: '18px', fontWeight: 600 }}>
        Are you sure you want to cancel this order?
      </h5>
    </div>
  );

  const footerContent = (
    <div className='d-flex justify-content-center gap-2'>
      <Button className='outline-button' onClick={() => setShowCancelConfirmation(false)}>Keep Order</Button>
      <Button className='danger-button' onClick={confirmCancelOrder} disabled={declinecOrderMutation.isPending}>
        Cancel Order {declinecOrderMutation.isPending && <ProgressSpinner style={{ width: '16px', height: '16px', color: '#fff', marginLeft: '8px' }} />}
      </Button>
    </div>
  );

  return (
    <>
      {/* Cancel Order Confirmation Modal */}
      <Dialog 
        visible={showCancelConfirmation} 
        onHide={() => setShowCancelConfirmation(false)}
        modal={true}
        header={headerElement}
        footer={footerContent}
        className='custom-modal'
        style={{ width: '550px' }}
        onShow={() => {}}
      >
        <div className="d-flex flex-column align-items-center justify-content-center gap-4" style={{ padding: '24px 0' }}>
          {/* Trash Icon */}
          <div style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer light gray circle */}
            <div style={{
              position: 'absolute',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: '#F3F4F6'
            }}></div>
            
            {/* Inner gray circle with icon */}
            <div style={{
              position: 'relative',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
              <Trash size={48} color="#fff" strokeWidth={1.5} />
            </div>
          </div>

          {/* Description */}
          <p style={{
            margin: 0,
            color: '#4B5563',
            fontSize: '15px',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            This action will cancel the order and cannot be undone.
            {cardData?.invoice_created && (<b>The invoice associated with this order will be permanently deleted.</b>)}
          </p>
        </div>
      </Dialog>

      {/* Main Project Card Modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="projectCardModel"
        onHide={handleClose}
        animation={false}
        enforceFocus={false}
      >
        <Modal.Header className="mb-0 pb-0 justify-content-between ">
          <div className="modelHeader" style={{ flex: '1', maxWidth: "calc(100% - 350px)" }}>
            <ul className='d-flex align-items-center'>
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
                  ) : <span className='cardId text-nowrap'>{cardData?.number} &nbsp;</span>
                }
              </li>
              <li className='refrencesTag mt-1' style={{ width: "calc(100% - 120px)" }}>
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

                    className='border rounded w-100'
                    style={{ maxWidth: "calc(100% - 120px)" }}
                  />
                ) : (
                  <>
                    {
                      referencemutation.isPending
                        ? <div className="dot-flashing ms-5 mt-1"></div>
                        : <>
                          <small className='ellipsis-width' style={{ color: '#1D2939', fontSize: '16px', maxWidth: "calc(100% - 220px)" }}> {cardData?.reference}</small>
                          <span> <PencilSquare size={16} color='#106B99' onClick={handleEditReference} style={{ cursor: 'pointer' }} /></span>
                        </>
                    }
                  </>
                )}
              </li>
            </ul>
          </div>
          <div className='d-flex align-items-center' style={{ gap: '15px' }}>
            <Link to={`/api/v1/project-card/${projectId}/pdf/`} target='_blank'>
              <Button variant="light" className='rounded-circle px-2' title='Project Card'><Postcard color="#344054" size={20} /></Button>
            </Link>

            <Link to={`/api/v1/sales/${projectId}/label/`} target='_blank' title='Label'>
              <Button variant="light" className='rounded-circle px-2'><Tag color="#344054" size={20} /></Button>
            </Link>

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
              <Col sm={6} className='orderDiscription'>
              <div className='d-flex justify-content-between align-items-center w-100'>
                <strong>Order Description</strong>
                <Copy size={16} color='#106B99' onClick={handleCopy} style={{ cursor: 'pointer' }} />
              </div>
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
                          cardData?.calculator_descriptions?.map(({ description }, index) => (
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
                        <th className='border-right'>#</th>
                        <th>Reference</th>
                        <th>Provider</th>
                        <th>Estimate/Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        isFetching ? (
                          <>
                            <CurrentJobAndExpenseLoading />
                            <CurrentJobAndExpenseLoading />
                            <CurrentJobAndExpenseLoading />
                            <CurrentJobAndExpenseLoading />
                          </>
                        ) : expenseJobsMapping?.length ? (
                          expenseJobsMapping?.map((data, index) => (
                            <tr key={data.number || `je-${index}`}>
                              <td className='border-right'>
                                {
                                  data?.type === 'job' ? (
                                    <Link to={`/work/jobs?jobId=${data?.id}`} className='linkText' target='_blank'>
                                      {data?.number}
                                    </Link>
                                  ) : (
                                    <Link to={`/expenses?expenseId=${data?.id}&supplierName=${data?.supplier?.name}`} className='linkText' target='_blank'>
                                      {data?.number}
                                    </Link>
                                  )
                                }
                              </td>
                              <td>
                                <div className='ellipsis-width'>
                                  {data?.type === 'job'
                                    ? data?.reference || "-"
                                    : data?.invoice_reference || "-"}
                                </div>
                              </td>
                              <td>
                                <OverlayTrigger
                                  key={'top'}
                                  placement={'top'}
                                  overlay={
                                    <Tooltip className='TooltipOverlay' id={`tooltip-${top}`}>
                                      {
                                        data?.type === 'job'
                                          ? data?.worker?.full_name || ""
                                          : data?.supplier?.name || ""
                                      }
                                    </Tooltip>
                                  }
                                >
                                  <div className='mx-auto d-flex align-items-center justify-content-center ps-2' style={{ width: 'fit-content' }}>
                                    {
                                      data?.type === 'job'
                                        ? (<ImageAvatar has_photo={data?.worker?.has_photo} photo={data?.worker?.photo} is_business={false} size={16} />)
                                        : (<ImageAvatar has_photo={data?.supplier?.has_photo} photo={data?.supplier?.photo} is_business={true} size={16} />)
                                    }
                                  </div>
                                </OverlayTrigger>
                              </td>
                              <td>${formatAUD(data?.total) || "-"}</td>
                              <td className='status'>
                                {data?.type === 'job'
                                  ? <JobStatus status={data?.status} actionStatus={data?.action_status} published={data?.published} />
                                  : <span className={data?.paid ? 'paid' : 'unpaid'}>
                                    {data?.paid ? 'Paid' : 'Not Paid'}
                                  </span>}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className='noDataAvilable text-center'> No data available</td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col sm={6} className='projectHistoryCol'>
                <Row>
                  <Col className='tabModelMenu d-flex justify-content-between align-items-center p-0' >
                    <AddNote projectId={projectId} projectCardData={projectCardData} />
                    <NewTask project={project} reInitialize={reInitialize} projectCardData={() => projectCardData(projectId)} />
                    <SendSMS projectId={projectId} projectCardData={() => projectCardData(projectId)} />
                    <ComposeEmail clientId={cardData?.client} projectId={projectId} projectCardData={() => projectCardData(projectId)} />
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
                            filteredHistory?.map(({ id, type, text, title, created, manager, links }, index) => (
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
                                <h5 style={{ whiteSpace: "pre-line" }}>{type !== "email" && title || ""}</h5>
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
                <ScheduleUpdate key={projectId} projectId={projectId} projectCardData={projectCardData} isFetching={isFetching} startDate={+cardData?.booking_start} endDate={+cardData?.booking_end} />
                <Button className='expense expActive text-nowrap' onClick={() => setCreateExpenseVisible(true)}>Create Expense <img src={ExpenseIcon} alt="Expense" /></Button>
                {/* <Button className='createPo poActive'>Create PO  <img src={CreatePoIcon} alt="CreatePoIcon" /></Button> */}
                {
                  profileData?.has_work_subscription &&<>
                    <Button className='createJob jobActive text-nowrap' onClick={() => setVisible(true)}>Create a Job <img src={Briefcase} alt="briefcase" /></Button>
                  </>
                }
                <GoogleReviewEmail clientId={cardData?.client} projectId={projectId} />
                <FilesModel projectId={projectId} />
                <SendToCalendar projectId={projectId} project={cardData} projectCardData={projectCardData} />
                <StartChat projectId={projectId} project={cardData} />
              </Col>
            </Row>
            <Row className='projectCardCalculation'>
              <Col className='proCostSale projectColBg'>
                <div style={{ position: 'relative', left: '20px' }}>
                  <h5>Cost Of Sale</h5>
                  <p>${formatAUD(cardData?.cost_of_sale)}</p>
                </div>
                <div className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', borderRadius: '40px', border: '1px solid #D0D5DD', background: '#fff', boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)', position: 'relative', left: '42px' }}>
                  <PlusCircle size={20} color='#344054' />
                </div>
              </Col>
              <Col className='proLabour projectColBg'>
                <div style={{ position: 'relative', left: '20px' }}>
                  <h5>Labour</h5>
                  <p>${formatAUD(cardData?.labor_expense)}</p>
                </div>
                <div className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', borderRadius: '40px', border: '1px solid #D0D5DD', background: '#fff', boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)', position: 'relative', left: '42px' }}>
                  <PlusCircle size={20} color='#344054' />
                </div>
              </Col>
              <Col className='proOperatingExpense projectColBg'>
                <div style={{ position: 'relative', left: '20px' }}>
                  <h5>Operating Expense</h5>
                  <p>${formatAUD(cardData?.operating_expense)}</p>
                </div>
                <div className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', borderRadius: '40px', border: '1px solid #D0D5DD', background: '#fff', boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)', position: 'relative', left: '42px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M4.16675 8H15.8334M4.16675 13H15.8334" stroke="#344054" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Col>
              <Col className='proRealCost projectColBg'>
                <div style={{ position: 'relative', left: '20px' }}>
                  <h5>Real Cost</h5>
                  <p>${formatAUD(formattedRealCost)}</p>
                </div>
                <div className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', borderRadius: '40px', border: '1px solid #D0D5DD', background: '#fff', boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)', position: 'relative', left: '42px' }}>
                  <span className='font-14'>VS</span>
                </div>
              </Col>
              <Col className='proBuget projectColBg'>
                <div>
                  <h5>Budget</h5>
                  <p>${formatAUD(cardData?.budget)}</p>
                </div>
              </Col>
            </Row>
            <Row className='projectCardactionBut'>
              <Col className='actionLeftSide'>
                <Button onClick={declinecOrder} disabled={!cardData?.can_be_declined || declinecOrderMutation.isPending} className='declineAction'>
                  <XCircle size={20} color='#912018' /> Cancel Order
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

                <Button onClick={handleCompleteProject} disabled={!cardData?.can_be_completed} className='CompleteActionBut'>
                  Complete & Archive
                  {
                    completeMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '2px', left: '8px' }} />
                  }
                </Button>
              </Col>
            </Row>
            <Row className='projectBreakdown px-0 pb-0'>
              <Col sm={12} className='px-0'>
                <Button className='mb-2' onClick={() => setShowCostBreakdown(!showCostBreakdown)}>{!showCostBreakdown ? 'Show' : 'Hide'} Cost breakdown</Button>
                {
                  showCostBreakdown &&
                  <>
                    <DataTable value={cardData?.calculations || []} showGridlines className="border-top">
                      <Column field="id" header="Order" bodyClassName='text-center' headerClassName='text-center' style={{ width: '60px' }} body={(_, options) => options.rowIndex + 1}></Column>
                      <Column field="subindex" header="Department" style={{ minWidth: '192px' }} body={(rowData) => <div className="ellipsis-width" title={rowData.subindex} style={{ maxWidth: '192px' }}>{rowData.subindex}</div>}></Column>
                      <Column field="description" header="Description"
                        body={ConstBreakDownTextArea}
                        style={{ width: '100%' }}
                      ></Column>
                      <Column field="cost" header="Cost" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.cost)}`}></Column>
                      <Column field="profit_type_value" header="Markup/Margin" body={(rowData) => `${rowData.profit_type_value} ${rowData.profit_type === "AMN" ? "AMT $" : rowData.profit_type === "MRG" ? "MRG %" : "MRK %"}`} style={{ width: '100%' }}></Column>
                      <Column field="unit_price" header="Unit Price" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.unit_price)}`}></Column>
                      <Column field="quantity" header="Qty/Unit" style={{ width: '100%' }}></Column>
                      <Column field="discount" header="Discount" style={{ width: '100%' }} body={(rowData) => `${rowData.discount}%`}></Column>
                      <Column field="total" header="Amount" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.total)}`}></Column>
                    </DataTable>
                    <div className='w-100 d-flex align-items-center justify-content-end gap-4' style={{ background: '#EBF8FF', padding: '8px 24px 8px 40px' }}>
                      <div className='d-flex flex-column align-items-end'>
                        <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Sub Total</p>
                        <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(cardData?.sub_total)}</p>
                      </div>
                      <div>
                        <PlusCircle size={20} color='#106B99' />
                      </div>
                      <div className='d-flex flex-column align-items-end'>
                        <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Tax</p>
                        <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(cardData?.gst)}</p>
                      </div>
                      <div>
                        <div>
                          <PauseCircle size={20} color='#106B99' style={{ transform: 'rotate(90deg)' }} />
                        </div>
                      </div>
                      <div className='d-flex flex-column align-items-end'>
                        <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Total Invoice Amount</p>
                        <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(cardData?.total)}</p>
                      </div>
                    </div>
                  </>
                }
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      <CreateJob visible={visible} setVisible={setVisible} setRefetch={() => projectCardData(projectId)} jobProjectId={visible ? project?.value : ""} projectReference={visible ? project?.reference : ""} />
      <NewExpensesCreate visible={createExpenseVisible} setVisible={setCreateExpenseVisible} setRefetch={() => projectCardData(projectId)} expenseProjectId={project?.value} projectReference={project?.reference} />
    </>
  );
};

export default ProjectCardModel;