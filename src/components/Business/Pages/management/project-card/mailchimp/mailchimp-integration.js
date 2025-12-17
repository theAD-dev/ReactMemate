import React, { useState } from 'react';
import { EnvelopeCheck, X } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'sonner';
import styles from './mailchimp-integration.module.scss';
import { addUserToMailchimpList, getMailchimpLists } from '../../../../../../APIs/integrations-api';
import { useAuth } from '../../../../../../app/providers/auth-provider';
import mailchimpLogo from '../../../../../../assets/images/mailchimp_icon.png';

const MailchimpIntegration = ({ projectId, contactPersons = [] }) => {
  const { session } = useAuth();
  const [show, setShow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedListId, setSelectedListId] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');

  // Get email options for dropdown from contactPersons prop
  const emailOptions = contactPersons
    .filter(person => person.email)
    .map(person => ({
      value: person.email,
      label: person.email
    }));

  const handleClose = () => {
    setShow(false);
    setSelectedListId('');
    setSelectedEmail('');
  };

  const handleShow = () => {
    if (session?.has_mailchimp) {
      setShow(true);
    } else {
      setShowInstructions(true);
    }
  };

  const mailchimpListsQuery = useQuery({
    queryKey: ['mailchimp-lists'],
    queryFn: getMailchimpLists,
    enabled: show && session?.has_mailchimp
  });

  const addToMailchimpMutation = useMutation({
    mutationFn: addUserToMailchimpList,
    onSuccess: () => {
      toast.success('Successfully added to Mailchimp mailing list!');
      handleClose();
    },
    onError: (error) => {
      console.log('Error adding to Mailchimp:', error);
      if (error?.details?.title === 'Member Exists') {
        toast.warning('User is already subscribed to the mailing list.');
        return;
      }
      toast.error('Failed to add to Mailchimp. Please try again.');
    }
  });

  const handleSubmit = () => {
    if (!selectedEmail) {
      toast.error('Please select an email address');
      return;
    }
    if (!selectedListId) {
      toast.error('Please select a mailing list');
      return;
    }

    const selectedUser = contactPersons.find(person => person.email === selectedEmail);
    if (!selectedUser) {
      toast.error('Selected email address is not valid');
      return;
    }

    const mailchimpData = {
      list_id: selectedListId,
      project_id: projectId,
      email: selectedEmail,
      first_name: selectedUser.firstname || '',
      last_name: selectedUser.lastname || '',
      phone: selectedUser.phone || ''
    };

    addToMailchimpMutation.mutate(mailchimpData);
  };

  return (
    <>
      <Button
        variant="light"
        className={clsx('rounded-circle px-2', styles.triggerButton)}
        onClick={handleShow}
        title='Add to Mailchimp'
      >
        <EnvelopeCheck color="#667085" size={20} />
      </Button>

      {/* Instructions modal - shown when Mailchimp is not connected */}
      <Modal
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4.5" width="48" height="48" rx="24" fill="#FEE4E2" />
                <rect x="4" y="4.5" width="48" height="48" rx="24" stroke="#FEF3F2" strokeWidth="8" />
                <path d="M28 18C22.48 18 18 22.48 18 28C18 33.52 22.48 38 28 38C33.52 38 38 33.52 38 28C38 22.48 33.52 18 28 18ZM29 33H27V31H29V33ZM29 29H27V23H29V29Z" fill="#F04438" />
              </svg>
              <span className='ms-3'>Mailchimp is currently unavailable</span>
            </span>
          </div>
          <button className='CustonCloseModal' onClick={() => setShowInstructions(false)}>
            <X size={24} color='#667085' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <p className={styles.unavailableText}>
              Mailchimp functionality is currently unavailable. To use this feature, please connect your Mailchimp account via <Link to="/settings/integrations?openMailchimp=true" style={{ color: '#158ECC' }}>Settings &gt; Integrations</Link>.
            </p>

            <div className={clsx("d-flex align-items-center justify-content-center flex-column gap-1 m-auto", styles.integrationStatus)}>
              <div className={clsx("d-flex align-items-center justify-content-center gap-2")}>
                <img src={mailchimpLogo} alt="Mailchimp" style={{ width: '40px', height: '40px' }} />
                <h6 className="mb-0" style={{ color: '#101828', fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
                  Mailchimp
                </h6>
              </div>
              <span className={clsx("px-2 py-1", styles.disconnectedBadge)}>
                Disconnected
                &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <circle cx="4" cy="4.5" r="3" fill="#F79009" />
                </svg>
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Main Mailchimp modal */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="taskModelProject"
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start w-100">
            <div className="d-flex align-items-center">
              <img src={mailchimpLogo} alt="Mailchimp" style={{ width: '40px', height: '40px' }} />
              <span className='ms-3' style={{ fontSize: '18px', fontWeight: 600, color: '#101828' }}>
                Add to Mailchimp
              </span>
            </div>
            <button className='CustonCloseModal' onClick={handleClose}>
              <X size={24} color='#667085' />
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="ContactModel">
            {/* Client Email Selection */}
            <div className={styles.emailSection}>
              <label className={styles.label}>
                Select Email <span style={{ color: '#F04438' }}>*</span>
              </label>
              <Dropdown
                value={selectedEmail}
                options={emailOptions}
                onChange={(e) => setSelectedEmail(e.value)}
                className={styles.dropdown}
                placeholder="Select an email address"
                emptyMessage="No email addresses found"
              />
            </div>

            {/* Mailing List Dropdown */}
            <div className={styles.dropdownSection}>
              <label className={styles.label}>
                Select Mailing List <span style={{ color: '#F04438' }}>*</span>
              </label>
              <Dropdown
                value={selectedListId}
                options={Array.isArray(mailchimpListsQuery?.data?.lists)
                  ? mailchimpListsQuery.data.lists.map((list) => ({
                    value: list.id,
                    label: list.name
                  }))
                  : []
                }
                onChange={(e) => setSelectedListId(e.value)}
                className={styles.dropdown}
                placeholder="Select a mailing list"
                loading={mailchimpListsQuery?.isFetching}
                emptyMessage={mailchimpListsQuery?.isFetching ? "Loading..." : "No mailing lists found"}
                filter
                filterPlaceholder="Search lists"
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="pt-0">
          <div className="popoverbottom w-100 border-0 mt-0 pt-0">
            <Button
              variant="outline-danger"
              onClick={handleClose}
              disabled={addToMailchimpMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary save"
              onClick={handleSubmit}
              disabled={!selectedEmail || !selectedListId || addToMailchimpMutation.isPending}
            >
              {addToMailchimpMutation.isPending ? (
                <>
                  <ProgressSpinner style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Adding...
                </>
              ) : (
                'Add to Mailchimp'
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MailchimpIntegration;
