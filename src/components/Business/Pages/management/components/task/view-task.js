import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Placeholder from 'react-bootstrap/Placeholder';
import placeholderUser from '../../../../../../assets/images/Avatar.svg';
import taskdetails from '../../../../../../assets/images/task-details.svg';
import './task.css';
import { ArrowRight } from 'react-bootstrap-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchTasksRead, fetchTasksUpdate, partialsTasksUpdate } from '../../../../../../APIs/TasksApi';

const TaskLoadingView = () => {
  return (
    <>
      <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
        <Placeholder xs={12} bg="secondary" size='lg' />
      </Placeholder>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={12} bg="secondary" style={{ height: '80px' }} size='lg' />
      </Placeholder>
      <table className='task-deatils-table w-100'>
        <tr style={{ marginBottom: '12px' }}>
          <td style={{ width: '122px', paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
          <td style={{ paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
        </tr>
        <tr style={{ marginBottom: '12px' }}>
          <td style={{ width: '122px', paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
          <td style={{ paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
        </tr>
        <tr style={{ marginBottom: '12px' }}>
          <td style={{ width: '122px', paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
          <td style={{ paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
        </tr>
        <tr style={{ marginBottom: '12px' }}>
          <td style={{ width: '122px', paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
          <td style={{ paddingBottom: '12px' }}>
            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px' }}>
              <Placeholder xs={12} bg="secondary" />
            </Placeholder>
          </td>
        </tr>
      </table>

    </>
  )
}

const ViewTask = ({ taskId, handleEdit }) => {
  console.log('taskId: ', taskId);
  const [show, setShow] = useState(false);
  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['taskId', taskId],
    queryFn: () => fetchTasksRead(taskId),
    enabled: !!taskId,
    retry: 1,
  });
  const mutation = useMutation({
    mutationFn: (updateData) => fetchTasksUpdate(updateData, taskId),
    onSuccess: () => {
      // Optionally refetch data or show success message
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    }
  });

  console.log('statusUpdated: ', mutation);

  useEffect(() => {
    if (taskId) {
      handleShow();
    }
  }, [taskId])

  const handleInComplete = () => mutation.mutate({ finished: false });
  const handleComplete = () => mutation.mutate({ finished: true });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dateFormat = (dateInMiliSec) => {
    if (!dateInMiliSec) return "-";

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(1000 * +dateInMiliSec);
    const formattedDate = date.toLocaleDateString('en-US', options)?.replace(/,/g, '');
    return formattedDate;
  }
  return (
    <>
      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <img src={taskdetails} alt='task-details' style={{ width: '48px', height: '48px' }} />
            <span className='modal-task-title'>Task Details</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? <TaskLoadingView />
            : (
              <>
                <p className='task-title'>{data?.title || "-"}</p>
                <p className='task-description'>{data?.description || "-"}</p>

                <table className='task-deatils-table'>
                  <tr style={{ marginBottom: '12px' }}>
                    <td style={{ width: '122px', paddingBottom: '12px' }}>Project Task</td>
                    <td style={{ paddingBottom: '12px' }}>{data?.project && data.project.reference ? data.project.reference : '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ width: '122px', paddingBottom: '12px' }}>ID</td>
                    <td style={{ paddingBottom: '12px' }}>{data?.number || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ width: '122px', paddingBottom: '12px' }}>Assigned</td>
                    <td style={{ paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <img src={data?.user?.has_photo ? data?.user.photo : placeholderUser} alt='img-assigned' style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                      <span>{data?.user?.full_name || "-"}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: '122px', paddingBottom: '12px' }}>Date</td>
                    <td style={{ paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{dateFormat(data?.from_date)}</span>
                      <ArrowRight size={20} color="#475467" />
                      <span>{dateFormat(data?.to_date)}</span>
                    </td>
                  </tr>
                </table>
              </>
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button className='edit-button' onClick={handleEdit}>Edit Task</Button>
          {
            data?.finished
              ?
              <Button className='incomplete-button' onClick={handleInComplete}>
                {
                  mutation.isPending ? (
                    <>
                      Loading...
                    </>
                  ) : <>
                    Incomplete
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                      <path d="M20 10.5C20 16.0228 15.5228 20.5 10 20.5C4.47715 20.5 0 16.0228 0 10.5C0 4.97715 4.47715 0.5 10 0.5C15.5228 0.5 20 4.97715 20 10.5ZM15.0379 6.71209C14.6718 6.34597 14.0782 6.34597 13.7121 6.71209C13.7032 6.72093 13.6949 6.73029 13.6872 6.74013L9.34674 12.2709L6.72985 9.65403C6.36373 9.28791 5.77014 9.28791 5.40402 9.65403C5.0379 10.0201 5.0379 10.6137 5.40402 10.9799L8.71208 14.2879C9.0782 14.654 9.67179 14.654 10.0379 14.2879C10.0461 14.2798 10.0538 14.2712 10.061 14.2622L15.0512 8.02434C15.404 7.65727 15.3995 7.07371 15.0379 6.71209Z" fill="#F04438" />
                    </svg>
                  </>
                }
              </Button>
              :
              <Button className='complete-button' onClick={handleComplete}>
                {
                  mutation.isPending ? (
                    <>
                      Loading...
                    </>
                  ) : <>
                    Complete
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                      <path d="M20 10.5C20 16.0228 15.5228 20.5 10 20.5C4.47715 20.5 0 16.0228 0 10.5C0 4.97715 4.47715 0.5 10 0.5C15.5228 0.5 20 4.97715 20 10.5ZM15.0379 6.71209C14.6718 6.34597 14.0782 6.34597 13.7121 6.71209C13.7032 6.72093 13.6949 6.73029 13.6872 6.74013L9.34674 12.2709L6.72985 9.65403C6.36373 9.28791 5.77014 9.28791 5.40402 9.65403C5.0379 10.0201 5.0379 10.6137 5.40402 10.9799L8.71208 14.2879C9.0782 14.654 9.67179 14.654 10.0379 14.2879C10.0461 14.2798 10.0538 14.2712 10.061 14.2622L15.0512 8.02434C15.404 7.65727 15.3995 7.07371 15.0379 6.71209Z" fill="#17B26A" />
                    </svg>
                  </>
                }
              </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewTask