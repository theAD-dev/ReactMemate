import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'react-bootstrap-icons';

const CreateProposalEditText = () => {
    const [proposaltitle, setProposaltitle] = useState('');
  const onDragEnd = (result) => {
    // Handle drag and drop result
    console.log(result);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-accordion">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Draggable draggableId="draggable-accordion-1" index={0}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography><GripVertical color="#98A2B3" style={{ cursor: 'move' }} /> Paragraph 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                      <div className="formgroup1">
                    <label>Paragraph title</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="proposaltitle"
                        value={proposaltitle}
                        placeholder='Payment Reminder: Invoice {number}'
                        onChange={(e) => {
                            setProposaltitle(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </Draggable>
            <Draggable draggableId="draggable-accordion-2" index={1}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <Typography>Header</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CreateProposalEditText;
