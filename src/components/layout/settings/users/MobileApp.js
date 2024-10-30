import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Building, PlusLg, Person, Plus, Send, Files, FileEarmarkSpreadsheet, ThreeDotsVertical } from 'react-bootstrap-icons';
import style from './users.module.scss';
import React, { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useQuery } from '@tanstack/react-query';
import { getMobileUserList } from '../../../../APIs/settings-user-api';
import { Spinner } from 'react-bootstrap';
import clsx from 'clsx';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import CreateMobileUser from './features/create-mobile-user';

const MobileApp = () => {
    const [activeTab, setActiveTab] = useState('desktop');
    const [visible, setVisible] = useState(false);

    const mobileUsersQuery = useQuery({ queryKey: ['mobile-users'], queryFn: getMobileUserList });
    const mobileUsers = mobileUsersQuery?.data?.users || [];

    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex justify-content-center align-items-center'><div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.userImg} ${data.is_business ? "" : "rounded-circle"}`}>
                {data.photo ? <img src={data.photo} alt='clientImg' className='w-100' /> : data.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
            </div>
                <div className='d-flex flex-column gap-1'>
                    <div className={`${style.ellipsis}`}>{data?.first_name} {data?.last_name}</div>
                </div></div>
        </div>
    }

    const StatusBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`${style[data.status]}`}>
                {data.status}
            </div>
        </div>
    }

    const ActionBody = (data) => {
        const ref = useRef(null);
        const [isOpen, setOpen] = useState(false);
        const anchorProps = useClick(isOpen, setOpen);

        return <React.Fragment>
            <ThreeDotsVertical size={24} color="#667085" className='cursor-pointer' ref={ref} {...anchorProps} />

            <ControlledMenu
                state={isOpen ? 'open' : 'closed'}
                anchorRef={ref}
                onClose={() => setOpen(false)}
                className={"threeDots-setting"}
                menuStyle={{ padding: '4px', width: '171px', textAlign: 'left' }}
            >
                <div className='d-flex flex-column gap-2'>
                    {
                        (data.status === "invited" || data.status === "connected") && <>
                            <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'>
                                <span style={{ color: '#344054', fontSize: '14px', fontWeight: 400 }}>Disconnect User</span>
                            </div>
                        </>
                    }
                    {
                        (data.status === "disconnected") && <>
                            <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'>
                                <span style={{ color: '#344054', fontSize: '14px', fontWeight: 400 }}>Reconnect User </span>
                            </div>
                        </>
                    }
                </div>
            </ControlledMenu>
        </React.Fragment>
    }

    return (
        <>
            <div className={`settings-wrap ${style.userSettingPage}`} id={`${style.appSettingPage}`}>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Users</h1>
                            <div className={`contentMenuTab ${style.contentMenuTab}`}>
                                <ul>
                                    <li><Link to="/settings/users/desktop">Desktop</Link></li>
                                    <li className='menuActive'><Link to="/settings/users/mobile-app">Mobile App</Link></li>
                                </ul>
                                <Button onClick={()=> setVisible(true)} className={clsx(style.addUserBut, 'outline-none')}>Add <Plus size={20} color="#000" /></Button>
                            </div>
                        </div>
                        <div className={`content_wrap_main ${style.contentwrapmain}`}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <div className={style.userHead}>
                                            <h2>Mobile App Users</h2>
                                            <p>{mobileUsersQuery?.data?.limits?.number || 0} / {mobileUsersQuery?.data?.limits?.total || 0} <span>Buy More</span></p>
                                        </div>
                                        <Button className={style.showDeleteBut}>Show Disconnected</Button>
                                    </div>
                                    <DataTable value={mobileUsers} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                        <Column field="name" style={{ width: 'auto' }} body={nameBody} header="Name"></Column>
                                        <Column field="email" style={{ width: '447px' }} header="Email"></Column>
                                        <Column field="phone" style={{ width: '210px' }} header="Phone"></Column>
                                        <Column field="status" body={StatusBody} style={{ width: '85px' }} header="Status"></Column>
                                        <Column field="privilege" body={ActionBody} style={{ width: '64px' }} header="Action"></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                mobileUsersQuery.isLoading &&
                <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
            <CreateMobileUser visible={visible} setVisible={setVisible} refetch={mobileUsersQuery.refetch()} />
        </>
    );
}

export default MobileApp;
