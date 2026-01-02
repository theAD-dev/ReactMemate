
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasksRead } from '../../../../../APIs/TasksApi';
import CreateTask from '../../../../Work/features/task/create-task/create-task';

const ViewTask = ({ view, setView, taskId, setTaskId, reInitialize }) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => fetchTasksRead(taskId),
    enabled: !!taskId,
    retry: 1,
  });

  useEffect(() => {
    if (taskId) {
      refetch({ cancelRefetch: false });
    }
  }, [taskId, refetch]);

  return (
    <>
      {view && <CreateTask show={view} setShow={setView} taskId={taskId} setTaskId={setTaskId} defaultValue={data} refetch={reInitialize} refetchTask={refetch} isFetching={isFetching} />}
    </>
  );
};

export default ViewTask;