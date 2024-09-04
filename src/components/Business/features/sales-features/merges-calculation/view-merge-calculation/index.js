import React from 'react';
import { useRef, useState } from 'react';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { CloseButton, ListGroup } from 'react-bootstrap';

const ViewMerge = ({ title, alias, items }) => {
    console.log('items: ', items);
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const anchorProps = useClick(isOpen, setOpen);
    return (
        <React.Fragment>
            <button type="button" className="btn p-0 ellipsis-width" style={{ maxWidth: '450px' }} ref={ref} {...anchorProps}>{title}</button>

            <ControlledMenu
                state={isOpen ? 'open' : 'closed'}
                anchorRef={ref}
                onClose={() => setOpen(false)}
                menuStyle={{ padding: '24px 24px 20px 24px', width: '365px' }}
            >
                <div className='d-flex justify-content-between'>
                    <div className='BoxNo'>
                        <div className='no'>{alias}</div>
                    </div>
                    <CloseButton onClick={() => setOpen(false)}/>
                </div>

                <ListGroup variant="flush border" style={{ marginTop: '16px' }}>
                    {
                        items?.map((data) =>
                            <ListGroup.Item key={data.label} className='d-flex justify-content-between border-0'>
                                <span style={{ color: '#475467', fontSize: '14px', fontWeight: 400 }}>{data?.label}</span>
                                <span style={{ color: '#475467', fontSize: '14px', fontWeight: 600 }}>$ {data?.value}</span>
                            </ListGroup.Item>
                        )
                    }
                </ListGroup>
            </ControlledMenu>
        </React.Fragment>
    )
}

export default ViewMerge