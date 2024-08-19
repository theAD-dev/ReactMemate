import { useState } from 'react';
import CreateTask from '../task/create-task';
import '../task/task.css';

const NewTask = ({ project, reInitilize }) => {
    console.log('project: ', project);
    const [viewShow, setViewShow] = useState(false);
    const handleShow = () => setViewShow(true);
    
    return (
        <>
            <div className="linkByttonStyle" onClick={handleShow}>
                New Task
            </div>
            <CreateTask show={viewShow} setShow={setViewShow} project={project} reInitilize={reInitilize} />
        </>
    );
};

export default NewTask;
