import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Fade from '@mui/material/Fade';
import { Calendar2Event } from "react-bootstrap-icons";
import DateRangePicker from './DateRangePicker';

const formatDateRange = (startDate, endDate) => {
  const options = { month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);
  return `${start} - ${end}`;
};

// Example component
const DateRangeComponent = ({ startDate, endDate }) => {
  return (
    <div className='dateSelectdTaskBar'>
      {formatDateRange(startDate, endDate)}
    </div>
  );
};

const TaskDatePicker = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDataApply = (data) => {
    setDateRange(data);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {dateRange.startDate && dateRange.endDate ? (
          <>
            <span style={{ marginLeft: '5px' }}>
              <DateRangeComponent startDate={dateRange.startDate} endDate={dateRange.endDate} />
            </span>
          </>
        ) : (
          <span className='iconStyleCircle'><Calendar2Event color="#475467" size={18} /></span>
        )}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <DateRangePicker onDataApply={handleDataApply} onClose={handleClose} />
      </Menu>
    </>
  );
};

export default TaskDatePicker;
