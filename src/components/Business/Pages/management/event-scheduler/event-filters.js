import React from 'react';
import { useRef, useState } from 'react';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { ListGroup } from 'react-bootstrap';
import './event-filter.css';

const EventFilters = () => {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const anchorProps = useClick(isOpen, setOpen);
  const [selected, setSelected] = useState("monthly");
  return (
    <>
      <div className='d-flex justify-content-end'>
        <button type="button" className={`btn ${isOpen ? 'active' : ''} d-flex align-items-center`} style={{ gap: '8px', borderRadius: '4px', border: '1px solid #D0D5DD', color: '#1D2939', fontSize: '14px', fontWeight: '600' }} ref={ref} {...anchorProps}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13.75 8.125C13.75 7.77982 14.0298 7.5 14.375 7.5H15.625C15.9702 7.5 16.25 7.77982 16.25 8.125V9.375C16.25 9.72018 15.9702 10 15.625 10H14.375C14.0298 10 13.75 9.72018 13.75 9.375V8.125Z" fill="#106B99" />
            <path d="M10 8.125C10 7.77982 10.2798 7.5 10.625 7.5H11.875C12.2202 7.5 12.5 7.77982 12.5 8.125V9.375C12.5 9.72018 12.2202 10 11.875 10H10.625C10.2798 10 10 9.72018 10 9.375V8.125Z" fill="#106B99" />
            <path d="M3.75 11.875C3.75 11.5298 4.02982 11.25 4.375 11.25H5.625C5.97018 11.25 6.25 11.5298 6.25 11.875V13.125C6.25 13.4702 5.97018 13.75 5.625 13.75H4.375C4.02982 13.75 3.75 13.4702 3.75 13.125V11.875Z" fill="#106B99" />
            <path d="M7.5 11.875C7.5 11.5298 7.77982 11.25 8.125 11.25H9.375C9.72018 11.25 10 11.5298 10 11.875V13.125C10 13.4702 9.72018 13.75 9.375 13.75H8.125C7.77982 13.75 7.5 13.4702 7.5 13.125V11.875Z" fill="#106B99" />
            <path d="M4.375 0C4.72018 0 5 0.279822 5 0.625V1.25H15V0.625C15 0.279822 15.2798 0 15.625 0C15.9702 0 16.25 0.279822 16.25 0.625V1.25H17.5C18.8807 1.25 20 2.36929 20 3.75V17.5C20 18.8807 18.8807 20 17.5 20H2.5C1.11929 20 0 18.8807 0 17.5V3.75C0 2.36929 1.11929 1.25 2.5 1.25H3.75V0.625C3.75 0.279822 4.02982 0 4.375 0ZM1.25 5V17.5C1.25 18.1904 1.80964 18.75 2.5 18.75H17.5C18.1904 18.75 18.75 18.1904 18.75 17.5V5H1.25Z" fill="#106B99" />
          </svg>
          Month
        </button>
        <ControlledMenu
          state={isOpen ? 'open' : 'closed'}
          anchorRef={ref}
          onClose={() => setOpen(false)}
          menuStyle={{ padding: '4px', width: '265px' }}
        >
          <ListGroup variant="flush dropdown-menus border-0">
            <ListGroup.Item onClick={() => setSelected('monthly')} style={{ height: '40px' }} className={`d-flex list-menu-item ${selected === "monthly" ? 'active' : ''} justify-content-between align-items-center border-0`}>
              <span>Monthly</span>
              {selected === "monthly" &&
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.8536 3.64645C14.0488 3.84171 14.0488 4.15829 13.8536 4.35355L6.85355 11.3536C6.75979 11.4473 6.63261 11.5 6.5 11.5C6.36739 11.5 6.24021 11.4473 6.14645 11.3536L2.64645 7.85355C2.45118 7.65829 2.45118 7.34171 2.64645 7.14645C2.84171 6.95118 3.15829 6.95118 3.35355 7.14645L6.5 10.2929L13.1464 3.64645C13.3417 3.45118 13.6583 3.45118 13.8536 3.64645Z" fill="#158ECC" />
                  </svg>
                </span>
              }
            </ListGroup.Item>
            <ListGroup.Item onClick={() => setSelected('weekly')} className={`d-flex list-menu-item ${selected === "weekly" ? 'active' : ''} justify-content-between align-items-center border-0`}>
              <span>Weekly</span>
              {selected === "weekly" &&
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.8536 3.64645C14.0488 3.84171 14.0488 4.15829 13.8536 4.35355L6.85355 11.3536C6.75979 11.4473 6.63261 11.5 6.5 11.5C6.36739 11.5 6.24021 11.4473 6.14645 11.3536L2.64645 7.85355C2.45118 7.65829 2.45118 7.34171 2.64645 7.14645C2.84171 6.95118 3.15829 6.95118 3.35355 7.14645L6.5 10.2929L13.1464 3.64645C13.3417 3.45118 13.6583 3.45118 13.8536 3.64645Z" fill="#158ECC" />
                  </svg>
                </span>
              }
            </ListGroup.Item>
          </ListGroup>
        </ControlledMenu>
      </div>
    </>
  )
}

export default EventFilters