import React, { useState } from 'react';
import { EnvelopeCheck, X } from 'react-bootstrap-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'sonner';
import styles from './mailchimp-integration.module.scss';
import { getMailchimpLists } from '../../../../../../APIs/integrations-api';
import { useAuth } from '../../../../../../app/providers/auth-provider';
import mailchimpLogo from '../../../../../../assets/images/mailchimp_icon.png';

const MailchimpIntegration = ({ projectId, contactPersons = [] }) => {
  const { session } = useAuth();
  const [show, setShow] = useState(false);
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
  
  const handleShow = () => setShow(true);

  const mailchimpListsQuery = useQuery({ 
    queryKey: ['mailchimp-lists'], 
    queryFn: getMailchimpLists,
    enabled: show && session?.has_mailchimp
  });

  // TODO: Replace with actual API call
  const addToMailchimpMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Adding to Mailchimp:', data);
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Successfully added to Mailchimp mailing list!');
      handleClose();
    },
    onError: (error) => {
      console.error('Error adding to Mailchimp:', error);
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

    addToMailchimpMutation.mutate({
      project_id: projectId,
      email: selectedEmail,
      list_id: selectedListId
    });
  };

  // Check if Mailchimp is available and client has email
  if (!session?.has_mailchimp || emailOptions.length === 0) {
    return null;
  }

  return (
    <>
      <Button 
        variant="light" 
        className={clsx('rounded-circle px-2', styles.triggerButton)} 
        onClick={handleShow}
        title='Add to Mailchimp'
      >
        <EnvelopeCheck color="#344054" size={20} />
      </Button>

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
