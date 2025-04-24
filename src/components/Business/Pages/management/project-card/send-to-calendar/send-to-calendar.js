import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Calendar3 } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './send-to-calendar.module.scss';
import { getClientById } from '../../../../../../APIs/ClientsApi';
import { sendComposeEmail } from '../../../../../../APIs/management-api';
import CalendarIcon from "../../../../../../assets/images/icon/calendar.svg";
import SendDynamicEmailForm from '../../../../../../ui/send-email-2/send-email';

/**
 * Component for sending project events to calendar
 * @param {Object} props - Component props
 * @param {string} props.projectId - The ID of the project
 * @param {Object} props.project - The project data
 * @param {Function} props.projectCardData - Function to refresh project card data
 */
const SendToCalendar = ({ projectId, project, projectCardData }) => {
  const [show, setShow] = useState(false);
  const [emailShow, setEmailShow] = useState(false);
  const [payload, setPayload] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // No need for icsFileUrl state as we're creating the file directly in the mutation

  // Query to get client data for email contacts
  const clientQuery = useQuery({
    queryKey: ['getClientById', project?.client],
    queryFn: () => getClientById(project?.client),
    enabled: !!project?.client && !!emailShow,
    retry: 1,
  });

  // Mutation for sending email with calendar attachment
  const emailMutation = useMutation({
    mutationFn: async (data) => {
      try {
        // Create the .ics file content
        const icalContent = generateICalContent();

        // Create a File object instead of just using a URL
        const fileName = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        const icsFile = new File([icalContent], fileName, { type: 'text/calendar' });

        // Create FormData to properly upload the file
        const formData = new FormData();

        // Add all the email data to the FormData
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });

        // Add the file to the FormData
        formData.append('attachments', icsFile);

        // Send the email with the attachment
        return sendComposeEmail(projectId, "", formData);
      } catch (error) {
        console.error('Error preparing email attachment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      setEmailShow(false);
      projectCardData();
      toast.success(`Calendar invitation sent successfully.`);
    },
    onError: (error) => {
      console.error('Error sending calendar invitation:', error);
      toast.error(`Failed to send calendar invitation. Please try again.`);
    }
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Set default event title based on project data
    if (project?.reference) {
      setEventTitle(`${project.reference}`);
    } else if (project?.number) {
      setEventTitle(`Project #${project.number}`);
    } else {
      setEventTitle('Project Event');
    }

    // Set default description from project data without extra text
    setEventDescription(project?.description || '');

    // Set dates from project booking data
    if (project?.booking_start) {
      setStartDate(new Date(project.booking_start * 1000));
    }

    if (project?.booking_end) {
      setEndDate(new Date(project.booking_end * 1000));
    }

    setShow(true);
  };

  // Update dates if project data changes
  useEffect(() => {
    if (project?.booking_start && !startDate) {
      setStartDate(new Date(project.booking_start * 1000));
    }

    if (project?.booking_end && !endDate) {
      setEndDate(new Date(project.booking_end * 1000));
    }
  }, [project, startDate, endDate]);

  /**
   * Generate iCalendar file content
   * @returns {string} iCalendar file content
   */
  const generateICalContent = () => {
    const formatDate = (date) => {
      return format(date, "yyyyMMdd'T'HHmmss'Z'");
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MeMate//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${eventTitle}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
DESCRIPTION:${eventDescription}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  };

  /**
   * Create iCalendar file and return URL
   * @returns {Object} Object containing fileUrl and fileName
   */
  const createICalFile = () => {
    const icalContent = generateICalContent();
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const fileUrl = URL.createObjectURL(blob);
    const fileName = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;

    return { fileUrl, fileName };
  };

  /**
   * Download iCalendar file directly
   */
  const downloadICalFile = () => {
    const { fileUrl, fileName } = createICalFile();
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Open email form with calendar attachment
   */
  const openEmailForm = () => {
    // Simply show the email form, the file will be created in the mutation
    setEmailShow(true);
  };

  /**
   * Validate form fields
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    if (!eventTitle.trim()) {
      toast.error('Event title is required');
      return false;
    }

    if (!startDate || !endDate) {
      toast.error('Start and end dates are required');
      return false;
    }

    if (startDate > endDate) {
      toast.error('End date must be after start date');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Open email form with calendar attachment
      openEmailForm();

      // Close the calendar modal
      handleClose();
    } catch (error) {
      console.error('Error creating calendar event:', error);
      toast.error('Failed to create calendar event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button disabled={!project?.booking_start} className={`calenBut calenActive ${styles.calendarButton}`} onClick={handleShow}>
        Send to Calendar <img src={CalendarIcon} alt="Calendar" />
      </Button>

      <Modal show={show} onHide={handleClose} centered className={styles.calendarModal}>
        <Modal.Header closeButton>
          <Modal.Title className={styles.modalTitle}>Send to Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>Event Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                className='border outline-none'
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Start Date & Time</Form.Label>
                  <Calendar
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.value);
                    }}
                    onSelect={() => {
                      document.body.click();
                    }}
                    onClear={() => {
                      setTimeout(() => document.body.click(), 100);
                    }}
                    onTodayButtonClick={() => {
                      setTimeout(() => document.body.click(), 100);
                    }}
                    showTime
                    showIcon
                    showButtonBar
                    todayButtonClassName="p-button-sm p-button-outlined"
                    clearButtonClassName="p-button-sm p-button-outlined p-button-danger"
                    icon={<Calendar3 color='#667085' size={20} />}
                    className="w-100 border rounded"
                    appendTo={document.body}
                    style={{ height: '46px', width: '230px', overflow: 'hidden' }}
                    panelClassName="calendar-panel-higher-z"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>End Date & Time</Form.Label>
                  <Calendar
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.value);
                    }}
                    onSelect={() => {
                      document.body.click();
                    }}
                    onClear={() => {
                      setTimeout(() => document.body.click(), 100);
                    }}
                    onTodayButtonClick={() => {
                      setTimeout(() => document.body.click(), 100);
                    }}
                    showTime
                    showIcon
                    showButtonBar
                    todayButtonClassName="p-button-sm p-button-outlined"
                    clearButtonClassName="p-button-sm p-button-outlined p-button-danger"
                    icon={<Calendar3 color='#667085' size={20} />}
                    className="w-100 border rounded"
                    appendTo={document.body}
                    style={{ height: '46px', width: '230px', overflow: 'hidden' }}
                    panelClassName="calendar-panel-higher-z"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className='border outline-none'
                placeholder="Enter event description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-4">
              <Button className="outline-button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="outline-button"
                variant="secondary"
                onClick={() => {
                  if (validateForm()) {
                    downloadICalFile();
                    toast.success('Calendar event file downloaded');
                  }
                }}
                disabled={isLoading}
              >
                Download .ics File
              </Button>
              <Button className="solid-button" variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <ProgressSpinner style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Creating...
                  </>
                ) : (
                  'Send via Email'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Email form with calendar attachment */}
      <SendDynamicEmailForm
        show={emailShow}
        setShow={setEmailShow}
        mutation={emailMutation}
        setPayload={setPayload}
        contactPersons={clientQuery?.data?.contact_persons || []}
        projectCardData={projectCardData}
      />
    </>
  );
};

export default SendToCalendar;
