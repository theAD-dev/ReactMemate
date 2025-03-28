import { useState } from 'react';
import CreateTask from '../task/create-task';

const NewTask = ({ project, reInitialize, projectCardData }) => {
    const [viewShow, setViewShow] = useState(false);
    const handleShow = () => setViewShow(true);
    
    return (
        <>
            <div className="linkByttonStyle py-2 border-right pe-5" onClick={handleShow}>
                New Task
            </div>
            <CreateTask show={viewShow} setShow={setViewShow} project={project} reInitialize={reInitialize} projectCardData={projectCardData} />
        </>
    );
};

export default NewTask;
