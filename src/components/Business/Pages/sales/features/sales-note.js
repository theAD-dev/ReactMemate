
import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { FileEarmarkPlus, PlusLg, CheckLg } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { fetchSales } from "../../../../../APIs/SalesApi";
import { fetchSalesNotes } from "../../../../../APIs/SalesApi";

const SalesNote = ( props ) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [noteText, setNoteText] = useState(props.noteData || '');
    const [isEditMode, setIsEditMode] = useState(!props.noteData);
    const [isViewMode, setIsViewMode] = useState(false);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      setIsViewMode(!isEditMode && !isViewMode);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    
    const handleSave = async () => {
      try {
        if (!props.saleUniqueId) {
          console.error('Error: saleUniqueId is not defined');
          return;
        }
    
        setNoteText(noteText);
        const saleUniqueId = props.saleUniqueId;
        const updatedNote = noteText;

        fetchSalesNotes(saleUniqueId, updatedNote);
        fetchSales();
    
        setIsEditMode(false);
        handleClose();
      } catch (error) {
        console.error('Error saving note:', error);
      }
    };
    
  return (
    <>
     <div  className={`saleNoteBorder noteInfo ${noteText ? "Yes" : "No"}`} aria-describedby={id} variant="contained" onClick={handleClick}>
    {isViewMode ? (
     
          <span style={{ cursor: 'pointer' }} onClick={() => setIsViewMode(false)}>
         Note <CheckLg color="#17B26A" size={16} />
        </span>
      ) : (
      <strong>
      {noteText ? (
            <span style={{ cursor: 'pointer' }} onClick={() => setIsEditMode(true)}>
             Note <CheckLg color="#17B26A" size={16} />
            </span>
          ) : (
            <span style={{ cursor: 'pointer' }}>
              Note <PlusLg color="#667085" size={16} />
            </span>
          )}
      </strong>
      )}
       </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        PaperProps={{
            style: {
              width: '460px', 
            },
            id: 'popoverStyleChange'
          }}
      >
      <Form>
          <div className='popoverHead popoverHeadflex salesTableWrap'>
            <span>
              <div className='iconOutStyle'>
                <div className='iconinStyle'>
                  <div className='iconinnerStyle'>
                    <FileEarmarkPlus color="#17B26A" size={24} />
                  </div>
                </div>
              </div>
              Add Note
            </span>
            <IconButton className="popupcrossInfo" size="small" onClick={handleClose}><CloseIcon /></IconButton>
          </div>

          <div className='popupcrossInfomain'>
            
          <Typography sx={{ p: '16px 24px 24px 24px' }}>
            <h3>Note</h3>
            <Form.Control id='placeholderColor'
              as="textarea"
              placeholder="Enter a description..." 
              style={{ height: '157px' }}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              readOnly={!isEditMode}
            />
          </Typography>
          </div>

          <div className='popoverbottom popoverendflex'>
            <Button className='closebox' onClick={handleClose}>
              Cancel
            </Button>
            <Button className='savebox' onClick={handleSave}>
              Save
            </Button>
          </div>
        </Form>
        </Popover>
    </>
  );
};

export default SalesNote
