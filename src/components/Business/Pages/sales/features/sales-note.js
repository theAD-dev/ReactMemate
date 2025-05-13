import React, { useState, useEffect } from 'react';
import { FileEarmarkPlus, PlusLg, CheckLg } from 'react-bootstrap-icons';
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Form from 'react-bootstrap/Form';
import { fetchSales, fetchSalesNotes } from "../../../../../APIs/SalesApi";

const SalesNote = ({ saleUniqueId, noteData, onNoteUpdate, refreshData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [noteText, setNoteText] = useState(noteData || '');
  const [isEditMode, setIsEditMode] = useState(!noteData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_LENGTH = 1000;
  const MIN_LENGTH = 3;

  const validateNote = (text) => {
    if (!text.trim()) return 'Note is required';
    if (text.length < MIN_LENGTH) return `Note must be at least ${MIN_LENGTH} characters`;
    if (text.length > MAX_LENGTH) return `Note must not exceed ${MAX_LENGTH} characters`;
    return '';
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setError('');
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNoteText(noteData || ''); // Reset to original note on close
    setError('');
    setIsEditMode(!noteData); // Reset edit mode based on whether there's existing note
  };

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setNoteText(value);
    const validationError = validateNote(value);
    setError(validationError);
  };

  const handleSave = async () => {
    const validationError = validateNote(noteText);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!saleUniqueId) {
      setError('Sale ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      await fetchSalesNotes(saleUniqueId, noteText.trim());
      await fetchSales();
      if (onNoteUpdate) onNoteUpdate(noteText.trim());
      setIsEditMode(false);
      handleClose();
      refreshData();
    } catch (error) {
      console.error('Error saving note:', error);
      setError(error.message || 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  useEffect(()=> {
    if (noteData) setNoteText(noteData);
  }, [noteData]);

  return (
    <>
      <div 
        className={`saleNoteBorder noteInfo ${noteText ? "Yes" : "No"}`} 
        aria-describedby={open ? 'simple-popover' : undefined} 
        onClick={handleClick}
      >
        {noteText ? (
          <span style={{ cursor: 'pointer' }} onClick={() => setIsEditMode(true)}>
            Note <CheckLg color="#17B26A" size={16} />
          </span>
        ) : (
          <strong>
            <span style={{ cursor: 'pointer' }}>
              Note <PlusLg color="#667085" size={16} />
            </span>
          </strong>
        )}
      </div>

      <Popover
        id="simple-popover"
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
          style: { width: '640px' },
          id: 'popoverStyleChange'
        }}
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
            <IconButton 
              className="popupcrossInfo" 
              size="small" 
              onClick={handleClose}
              disabled={isLoading}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className='popupcrossInfomain'>
            <Typography sx={{ p: '16px 24px 24px 24px' }}>
              <h3>Note <span className="required">*</span></h3>
              <Form.Control
                id='placeholderColor'
                as="textarea"
                placeholder="Enter a description..."
                style={{ height: '157px' }}
                value={noteText}
                onChange={handleNoteChange}
                maxLength={MAX_LENGTH}
                className={error ? 'error-border' : ''}
              />
              <div className="d-flex justify-content-between mt-1">
                <small className={error ? 'error-message' : 'text-muted'}>
                  {error || `${noteText.length}/${MAX_LENGTH} characters`}
                </small>
              </div>
            </Typography>
          </div>

          <div className='popoverbottom popoverendflex'>
            <Button 
              className='closebox' 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              className='savebox' 
              onClick={handleSave}
              disabled={isLoading || !!error}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Form>
      </Popover>
    </>
  );
};

export default SalesNote;