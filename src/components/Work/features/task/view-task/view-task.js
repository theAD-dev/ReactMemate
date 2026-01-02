import { useQuery } from '@tanstack/react-query';
import { getTask } from '../../../../../APIs/task-api';
import CreateTask from '../create-task/create-task';

const ViewTaskModal = ({ view, setView, taskId, setTaskId, reInitialize }) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['taskId', taskId],
    queryFn: () => getTask(taskId),
    enabled: !!taskId && !!view,
    retry: 1,
    cacheTime: 0,
    staleTime: 0,
  });

  return (
    <>
      {view && <CreateTask show={view} setShow={setView} taskId={taskId} setTaskId={setTaskId} defaultValue={data} refetch={reInitialize} refetchTask={refetch} isFetching={isFetching} />}
    </>
  );
};

export default ViewTaskModal;