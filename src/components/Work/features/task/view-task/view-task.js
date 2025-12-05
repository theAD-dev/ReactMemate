import { useQuery } from '@tanstack/react-query';
import Placeholder from 'react-bootstrap/Placeholder';
import { getTask } from '../../../../../APIs/task-api';
import CreateTask from '../create-task/create-task';

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
        <tbody>
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
        </tbody>
      </table>

    </>
  );
};

const ViewTaskModal = ({ view, setView, taskId, setTaskId, reInitialize }) => {
  const { data } = useQuery({
    queryKey: ['taskId', taskId],
    queryFn: () => getTask(taskId),
    enabled: !!taskId && !!view,
    retry: 1,
    cacheTime: 0,
    staleTime: 0,
  });

  return (
    <>
      {view && <CreateTask show={view} setShow={setView} taskId={taskId} setTaskId={setTaskId} defaultValue={data} refetch={reInitialize} />}
    </>
  );
};

export default ViewTaskModal;