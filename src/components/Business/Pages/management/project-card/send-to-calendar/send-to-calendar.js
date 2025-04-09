import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Calendar3 } from 'react-bootstrap-icons';
import { addDays, format } from 'date-fns';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './send-to-calendar.module.scss';
import CalendarIcon from "../../../../../../assets/images/icon/calendar.svg";

/**
 * Component for sending project events to calendar
 * @param {Object} props - Component props
 * @param {string} props.projectId - The ID of the project
 * @param {Object} props.project - The project data
 * @param {Function} props.projectCardData - Function to refresh project card data
 */
const SendToCalendar = ({ projectId, project, projectCardData }) => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [calendarType, setCalendarType] = useState('google');

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Set default event title based on project data
    if (project?.reference) {
      setEventTitle(`Project: ${project.reference}`);
    } else if (project?.number) {
      setEventTitle(`Project #${project.number}`);
    } else {
      setEventTitle('New Project Event');
    }

    // Set default description
    setEventDescription(`Project details for ${project?.reference || `#${project?.number}` || 'this project'}`);

    setShow(true);
  };

  /**
   * Generate Google Calendar URL
   * @returns {string} Google Calendar URL with event parameters
   */
  const generateGoogleCalendarUrl = () => {
    const formatDate = (date) => {
      return format(date, "yyyyMMdd'T'HHmmss'Z'");
    };

    const baseUrl = 'https://calendar.google.com/calendar/render';
    const action = 'action=TEMPLATE';
    const text = `text=${encodeURIComponent(eventTitle)}`;
    const dates = `dates=${formatDate(startDate)}/${formatDate(endDate)}`;
    const details = `details=${encodeURIComponent(eventDescription)}`;

    return `${baseUrl}?${action}&${text}&${dates}&${details}`;
  };

  /**
   * Generate Outlook Calendar URL
   * @returns {string} Outlook Calendar URL with event parameters
   */
  const generateOutlookCalendarUrl = () => {
    const formatDate = (date) => {
      return format(date, "yyyy-MM-dd'T'HH:mm:ss");
    };

    const baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose';
    const subject = `subject=${encodeURIComponent(eventTitle)}`;
    const startDateTime = `startdt=${formatDate(startDate)}`;
    const endDateTime = `enddt=${formatDate(endDate)}`;
    const body = `body=${encodeURIComponent(eventDescription)}`;

    return `${baseUrl}?${subject}&${startDateTime}&${endDateTime}&${body}`;
  };

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
   * Download iCalendar file
   */
  const downloadICalFile = () => {
    const icalContent = generateICalContent();
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      if (!eventTitle.trim()) {
        toast.error('Event title is required');
        setIsLoading(false);
        return;
      }

      if (startDate > endDate) {
        toast.error('End date must be after start date');
        setIsLoading(false);
        return;
      }

      // Handle different calendar types
      if (calendarType === 'google') {
        // Open Google Calendar in a new tab
        window.open(generateGoogleCalendarUrl(), '_blank');
        toast.success('Event sent to Google Calendar');
      } else if (calendarType === 'outlook') {
        // Open Outlook Calendar in a new tab
        window.open(generateOutlookCalendarUrl(), '_blank');
        toast.success('Event sent to Outlook Calendar');
      } else if (calendarType === 'ical') {
        // Download iCal file
        downloadICalFile();
        toast.success('iCalendar file downloaded');
      }

      // Close modal and reset form
      handleClose();
    } catch (error) {
      console.error('Error sending to calendar:', error);
      toast.error('Failed to send event to calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button className={`calenBut calenActive ${styles.calendarButton}`} onClick={handleShow}>
        Send to Calendar <img src={CalendarIcon} alt="Calendar" />
      </Button>

      <Modal show={show} onHide={handleClose} centered className={styles.calendarModal}>
        <Modal.Header closeButton>
          <Modal.Title className={styles.modalTitle}>Send to Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>Calendar Type</Form.Label>
              <div className={styles.calendarTypeRadio}>
                <label className={calendarType === 'google' ? styles.selected : ''}>
                  <Form.Check
                    type="radio"
                    name="calendarType"
                    id="google-calendar"
                    checked={calendarType === 'google'}
                    onChange={() => setCalendarType('google')}
                    className="me-2"
                  />
                  Google Calendar
                </label>
                <label className={calendarType === 'outlook' ? styles.selected : ''}>
                  <Form.Check
                    type="radio"
                    name="calendarType"
                    id="outlook-calendar"
                    checked={calendarType === 'outlook'}
                    onChange={() => setCalendarType('outlook')}
                    className="me-2"
                  />
                  Outlook
                </label>
                <label className={calendarType === 'ical' ? styles.selected : ''}>
                  <Form.Check
                    type="radio"
                    name="calendarType"
                    id="ical-calendar"
                    checked={calendarType === 'ical'}
                    onChange={() => setCalendarType('ical')}
                    className="me-2"
                  />
                  iCalendar (.ics)
                </label>
              </div>
            </Form.Group>

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
                      // Auto-close is handled by the onSelect and onClear props
                    }}
                    onSelect={() => {
                      // Auto-close after selecting a date
                      document.body.click(); // This will close the calendar
                    }}
                    onClear={() => {
                      // Auto-close after clearing the date
                      setTimeout(() => document.body.click(), 100); // Slight delay to ensure the clear happens first
                    }}
                    onTodayButtonClick={() => {
                      // Auto-close after clicking Today button
                      setTimeout(() => document.body.click(), 100); // Slight delay to ensure today is set first
                    }}
                    showTime
                    showIcon
                    showButtonBar
                    todayButtonClassName="p-button-sm p-button-outlined"
                    clearButtonClassName="p-button-sm p-button-outlined p-button-danger"
                    icon={<Calendar3 color='#667085' size={20} />}
                    className="w-100 border rounded"
                    appendTo={document.body} /* This ensures the calendar panel is appended to the document body */
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
                      // Auto-close is handled by the onSelect and onClear props
                    }}
                    onSelect={() => {
                      // Auto-close after selecting a date
                      document.body.click(); // This will close the calendar
                    }}
                    onClear={() => {
                      // Auto-close after clearing the date
                      setTimeout(() => document.body.click(), 100); // Slight delay to ensure the clear happens first
                    }}
                    onTodayButtonClick={() => {
                      // Auto-close after clicking Today button
                      setTimeout(() => document.body.click(), 100); // Slight delay to ensure today is set first
                    }}
                    showTime
                    showIcon
                    showButtonBar
                    todayButtonClassName="p-button-sm p-button-outlined"
                    clearButtonClassName="p-button-sm p-button-outlined p-button-danger"
                    icon={<Calendar3 color='#667085' size={20} />}
                    className="w-100 border rounded"
                    appendTo={document.body} /* This ensures the calendar panel is appended to the document body */
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
              <Button className="solid-button" variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <ProgressSpinner style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Sending...
                  </>
                ) : (
                  'Send to Calendar'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SendToCalendar;
