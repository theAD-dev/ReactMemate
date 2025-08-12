import CreateTask from '../../../../Work/features/task/create-task/create-task';

const CreateTaskFeature = ({ show, setShow, project, reInitialize }) => {
    const projectId = project.value;
    return (
        <>
            {show && <CreateTask show={show} setShow={setShow} projectId={projectId} refetch={reInitialize} />}
        </>
    );
};

export default CreateTaskFeature;
