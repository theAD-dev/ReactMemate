import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { X,FileEarmarkPersonFill,ThreeDotsVertical
} from "react-bootstrap-icons";
import FolderFileIcon from "../../../../assets/images/icon/folderFileIcon.svg";
import AddNoteModeIcon from "../../../../assets/images/icon/addNoteModeIcon.svg";
import { Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FilesModel = () => {
  const [viewShow, setViewShow] = useState(false);
  const [items, setItems] = useState(Array.from({ length: 40 }, (_, index) => `Item ${index + 1}`)); // Example items
  
  const handleClose = () => {
    setViewShow(false);
  };

  const handleShow = () => {
    setViewShow(true);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);

    setItems(reorderedItems);
  };

  return (
    <>
      {/* View modal trigger */}
      <Button className="linkByttonStyle" onClick={handleShow}>
        Files <img src={FolderFileIcon} alt="FolderFileIcon" />
      </Button>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject taskModelProjectFiles"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              {/* <img src={AddNoteModeIcon} alt="AddNoteModeIcon" /> */}
              Files
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
            <X size={24} color='#667085'/>
          </button>
        </Modal.Header>
        <Modal.Body>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  className="ContactModel"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {items.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index} >
                      {(provided) => (
                        <div className="dragItem"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                           <span><FileEarmarkPersonFill size={16} color='#667085'/> soap_maryland.nlu</span>   <ThreeDotsVertical size={16} color='#344054'/>

                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Modal.Body>
        <div className='CustonCloseModalBottom'>
        <button className='but' onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FilesModel;
