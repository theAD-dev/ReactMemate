import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Calendar3 } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import { format } from 'date-fns';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import styles from './send-to-calendar.module.scss';
import { getClientById } from '../../../../../../APIs/ClientsApi';
import { getOutgoingEmail } from '../../../../../../APIs/email-template';
import CalendarIcon from "../../../../../../assets/images/icon/calendar.svg";

const SendToCalendar = ({ projectId, project, projectCardData }) => {
  const autoCompleteRef = useRef(null);
  const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
  const accessToken = localStorage.getItem("access_token");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState([]);
  const [from, setFrom] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);

  const clientQuery = useQuery({
    queryKey: ['getClientById', project?.client],
    queryFn: () => getClientById(project?.client),
    enabled: !!project?.client && !!show,
    retry: 1,
  });

  const outgoingEmailTemplateQuery = useQuery({
    queryKey: ["getOutgoingEmail"],
    queryFn: getOutgoingEmail,
    enabled: !!show,
  });

  const handleClose = () => {
    setShow(false);
    setGuests([]);
    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setStartDate(null);
    setEndDate(null);
    setMeetLink('');
    setFrom('');
  };

  const handleShow = () => {
    if (project?.reference) {
      setEventTitle(`${project.reference}`);
    } else if (project?.number) {
      setEventTitle(`Project #${project.number}`);
    } else {
      setEventTitle('Project Event');
    }

    setEventDescription(project?.description || '');

    if (project?.booking_start) {
      setStartDate(new Date(project.booking_start * 1000));
    }

    if (project?.booking_end) {
      setEndDate(new Date(project.booking_end * 1000));
    }

    setShow(true);
  };

  useEffect(() => {
    if (project?.booking_start && !startDate) {
      setStartDate(new Date(project.booking_start * 1000));
    }

    if (project?.booking_end && !endDate) {
      setEndDate(new Date(project.booking_end * 1000));
    }
  }, [project, startDate, endDate]);


  const generateICalContent = (attendees = [], organizerEmail = 'no-reply@memate.com.au') => {
    const formatDate = (date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
    const now = new Date();
    const uid = `${Date.now()}@memate.com.au`;
    const dtStamp = formatDate(now);

    const googleMeetLink = meetLink || "";
    const formattedDescription = `${eventDescription || "Meeting Invitation"}\n\nJoin with Meet Link: ${googleMeetLink}`;

    const htmlDescription = `<html><body>
      <p>${eventDescription || "Meeting Invitation"}</p>
      <p>Join with Meet Link: <a href="${googleMeetLink}">${googleMeetLink}</a></p>
    </body></html>`.replace(/\n/g, '').replace(/\s+/g, ' ');
    const calendarContent = [
      "BEGIN:VCALENDAR",
      "PRODID:-//MeMate//Calendar//EN",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${formattedDescription.replace(/\n/g, '\\n')}`,
      `LOCATION:${eventLocation || googleMeetLink}`,
      `URL:${googleMeetLink}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `ORGANIZER;CN=MeMate:mailto:${organizerEmail}`
    ];

    if (attendees && attendees.length > 0) {
      attendees.forEach(email => {
        let name = email.split('@')[0].replace(/[.]/g, ' ');
        name = name.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

        calendarContent.push(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${name}:mailto:${email}`);
      });
    }

    calendarContent.push(
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "TRANSP:OPAQUE",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder",
      "END:VALARM",
      "X-MICROSOFT-CDO-BUSYSTATUS:BUSY",
      "X-MICROSOFT-CDO-IMPORTANCE:1",
      "X-MICROSOFT-DISALLOW-COUNTER:FALSE",
      "X-MICROSOFT-DONOTFORWARDMEETING:FALSE",
      "X-MICROSOFT-CDO-ALLDAYEVENT:FALSE",
      `X-GOOGLE-CONFERENCE:${googleMeetLink}`,
      `X-ALT-DESC;FMTTYPE=text/html:${htmlDescription}`,
      "END:VEVENT",
      "END:VCALENDAR"
    );

    return calendarContent.join("\r\n");
  };

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

    if (guests.length === 0) {
      toast.error('At least one guest is required');
      return false;
    }

    if (!from) {
      toast.error('From email is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const calendarContent = generateICalContent(guests, from);
      const fileName = `invite.ics`;
      const icsFile = new File([calendarContent], fileName, { type: 'text/calendar' });
      const formData = new FormData();

      formData.append('subject', `Invitation: ${eventTitle}`);
      formData.append('email_body', eventDescription);
      formData.append('from_email', from);
      formData.append('to', guests.toString());
      formData.append('attachments', icsFile);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/custom/email/${projectId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success('Calendar event created successfully!');
      handleClose();
      projectCardData(projectId);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      toast.error('Failed to create calendar event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const search = (event) => {
    const query = event?.query?.toLowerCase() || '';

    const contactPersons = clientQuery.data?.contact_persons || [];
    let emails = contactPersons.map((data) => (data.email));
    emails = emails.filter((email) => !guests.includes(email));

    emails = emails.filter((email) =>
      email.toLowerCase().includes(query)
    );

    setFilteredEmails(emails);
  };

  const onFocus = () => {
    search();
    if (autoCompleteRef.current) autoCompleteRef.current.show();
  };

  const onInputChange = (e) => {
    const currentValue = e.target.value;
    if (currentValue.includes(',') || e.key === 'Enter') {
      const emails = currentValue.split(/[\s,]+/).filter((email) => email);
      setGuests((prev) => [...new Set([...prev, ...emails])]);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (outgoingEmailTemplateQuery?.data) {
      if (outgoingEmailTemplateQuery?.data?.outgoing_email && outgoingEmailTemplateQuery?.data?.outgoing_email_verified)
        setFrom(outgoingEmailTemplateQuery?.data?.outgoing_email);
      else
        setFrom('no-reply@memate.com.au');
    }
  }, [outgoingEmailTemplateQuery]);

  useEffect(() => {
    if (profileData?.email) {
      setGuests([profileData?.email]);
    }
  }, [profileData?.email]);

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
              <Form.Label className={styles.formLabel}>Add Guests</Form.Label>
              <AutoComplete
                ref={autoCompleteRef}
                value={guests}
                completeMethod={search}
                onChange={(e) => {
                  setGuests(e.value);
                }}
                multiple
                suggestions={filteredEmails}
                onClick={onFocus}
                onFocus={onFocus}
                onKeyUp={onInputChange}
                onBlur={(e) => {
                  const currentValue = e.target.value.trim();
                  if (currentValue) {
                    setGuests((prev) => [...new Set([...prev, currentValue])]);
                    e.target.value = '';
                  }
                }}
                className={clsx(styles.AutoComplete, "w-100")}
                placeholder="Add guests"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>Meet Link</Form.Label>
              <Form.Control
                type="text"
                className='border outline-none'
                placeholder="Enter Meet link (optional)"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>Location</Form.Label>
              <Form.Control
                type="text"
                className='border outline-none'
                placeholder="Enter location (optional)"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </Form.Group>

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
                  'Send via Email'
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
