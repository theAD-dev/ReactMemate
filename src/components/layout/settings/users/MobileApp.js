import React, { useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Plus, ThreeDotsVertical } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import CreateMobileUser from './features/create-mobile-user';
import style from './users.module.scss';
import { deleteMobileUser, getMobileUserList, resendInvite, restoreMobileUser } from '../../../../APIs/settings-user-api';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ExpertsCuate from '../../../../assets/Experts-cuate.svg';
import { PERMISSIONS } from '../../../../shared/lib/access-control/permission';
import { hasPermission } from '../../../../shared/lib/access-control/role-permission';
import ImageAvatar from '../../../../shared/ui/image-with-fallback/image-avatar';


const MobileApp = React.memo(() => {
    const { role } = useAuth();
    const { trialHeight } = useTrialHeight();
    const profileDataLocal = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const hasWorkSubscription = profileDataLocal?.has_work_subscription || false;

    const [visible, setVisible] = useState(false);
    const [isShowDeleted, setIsShowDeleted] = useState(false);

    const mobileUsersQuery = useQuery({ queryKey: ['mobile-users'], queryFn: getMobileUserList });
    const mobileUsers = isShowDeleted ? mobileUsersQuery?.data?.users?.filter((user) => user.status === 'disconnected') : mobileUsersQuery?.data?.users?.filter((user) => user.status !== 'disconnected') || [];


    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex justify-content-center align-items-center'>
                <ImageAvatar has_photo={data.has_photo} photo={data.photo} is_business={false} />
                <div className='d-flex flex-column gap-1'>
                    <div className={`${style.ellipsis}`}>{data?.first_name} {data?.last_name}</div>
                </div>
            </div>
        </div>;
    };

    const StatusBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`${style[data.status]}`}>
                {data.status}
            </div>
        </div>;
    };

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteMobileUser(data),
        onSuccess: () => {
            mobileUsersQuery.refetch();
            toast.success(`User disconnected successfully`);
            deleteMutation.reset();
        },
        onError: (error) => {
            console.log('Error during disconnect user', error);
            toast.error(`Failed to disconnect user. Please try again.`);
        }
    });

    const restoreMutation = useMutation({
        mutationFn: (data) => restoreMobileUser(data),
        onSuccess: () => {
            mobileUsersQuery.refetch();
            toast.success(`User re-connected successfully`);
            deleteMutation.reset();
            setIsShowDeleted(false);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to re-connected user. Please try again.`);
        }
    });

    const resendInviteMutation = useMutation({
        mutationFn: (data) => resendInvite(data),
        onSuccess: () => {
            mobileUsersQuery.refetch();
            toast.success(`Invite resent successfully`);
            resendInviteMutation.reset();
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to resend invite. Please try again.`);
        }
    });

    const restoreUser = (id) => {
        if (parseInt(mobileUsersQuery?.data?.limits?.total) > parseInt(mobileUsersQuery?.data?.limits?.number)) {
            restoreMutation.mutate(id);
        } else {
            toast.error(`You have reached the maximum number of users allowed.`);
        }
    };
    const ActionBody = (data) => {
        const ref = useRef(null);
        const [isOpen, setOpen] = useState(false);
        const anchorProps = useClick(isOpen, setOpen);

        return <React.Fragment>
            <div style={{ position: 'relative' }}>
                <ThreeDotsVertical size={24} color="#667085" className='cursor-pointer' ref={ref} {...anchorProps} />

                <ControlledMenu
                    state={isOpen ? 'open' : 'closed'}
                    anchorRef={ref}
                    onClose={() => setOpen(false)}
                    menuClassName="action-menu-portal"
                    menuStyle={{ padding: '4px', width: '171px', textAlign: 'left' }}
                    portal={{ target: document.body }}
                    align="end"
                    position="anchor"
                    direction="bottom"
                    overflow="auto"
                >
                <div className='d-flex flex-column'>
                    {
                        (data.status === "invited" || data.status === "connected") && <>
                            <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2 w-100' style={{ width: 'fit-content ' }} onClick={() => { deleteMutation.mutate(data?.id); }}>
                                <span className='d-flex align-items-center gap-2' style={{ color: '#344054', fontSize: '14px', fontWeight: 400 }}>
                                    Disconnect User
                                    {deleteMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                                </span>
                            </div>
                            <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2 w-100' style={{ width: 'fit-content ' }} onClick={() => { resendInviteMutation.mutate(data?.id); }}>
                                <span className='d-flex align-items-center justify-content-between gap-2' style={{ color: '#344054', fontSize: '14px', fontWeight: 400 }}>
                                    Resend Invite
                                    {resendInviteMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                                </span>
                            </div>
                        </>
                    }
                    {
                        (data.status === "disconnected") && <>
                            <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2 w-100' style={{ width: 'fit-content ' }} onClick={() => restoreUser(data.id)}>
                                <span className='d-flex align-items-center justify-content-between gap-2' style={{ color: '#344054', fontSize: '14px', fontWeight: 400 }}>
                                    Reconnect User
                                    {restoreMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                                </span>
                            </div>
                        </>
                    }
                </div>
            </ControlledMenu>
            </div>
        </React.Fragment>;
    };

    return (
        <>
            <Helmet>
                <title>MeMate - Mobile App Users</title>
            </Helmet>
            <div className={`${style.userSettingPage}`} id={`${style.appSettingPage}`}>
                <div className="settings-content setModalelBoots w-100">
                    <div className='headSticky'>
                        <h1 className='mb-0'>Users</h1>
                        <div className={`contentMenuTab ${style.contentMenuTab}`} style={{ height: '50px' }}>
                            <ul>
                                <li><Link to="/settings/users/desktop">Desktop</Link></li>
                                <li className='menuActive'><Link to="/settings/users/mobile-app">Mobile App</Link></li>
                            </ul>
                            {
                                hasWorkSubscription &&
                                hasPermission(role, PERMISSIONS.SETTINGS.USERS.MOBILE_APP.ADD) && (
                                    <Button disabled={parseInt(mobileUsersQuery?.data?.limits?.total) <= parseInt(mobileUsersQuery?.data?.limits?.number)} onClick={() => setVisible(true)} className={clsx(style.addUserBut, 'outline-none')}>Add <Plus size={20} color="#000" /></Button>
                                )
                            }
                        </div>
                    </div>
                    <div className={`content_wrap_main ${style.contentwrapmain}`} style={{ paddingBottom: `${trialHeight}px` }}>
                        <div className='content_wrapper'>
                            <div className="listwrapper border-top">
                                {
                                    hasWorkSubscription ? <>
                                        <div className="topHeadStyle pb-4">
                                            <div className={style.userHead}>
                                                <h2>Workforce - Mobile App Only Users </h2>
                                                <p className='d-flex align-items-center gap-2'>
                                                    {mobileUsersQuery?.data?.limits?.number || 0} / {mobileUsersQuery?.data?.limits?.total || 0}
                                                    {
                                                        hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.BUY_WORK_USER_SUBSCRIPTION) && (
                                                            <Link to={"/settings/generalinformation/subscription"} className='p-0 border-0' style={{ background: 'transparent' }}><span className='cursor-pointer'>Buy More</span></Link>
                                                        )
                                                    }
                                                </p>
                                            </div>
                                            {
                                                hasPermission(role, PERMISSIONS.SETTINGS.USERS.MOBILE_APP.RECONNECT_USER) && (
                                                    <Button onClick={() => setIsShowDeleted(!isShowDeleted)} className={style.showDeleteBut}>{!isShowDeleted ? "Show" : "Hide"} Disconnected</Button>
                                                )
                                            }
                                        </div>
                                        <DataTable value={mobileUsers} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                            <Column field="name" style={{ width: 'auto' }} body={nameBody} header="Name"></Column>
                                            <Column field="email" style={{ width: '447px' }} header="Email"></Column>
                                            <Column field="phone" style={{ width: '210px' }} header="Phone"></Column>
                                            <Column field="status" body={StatusBody} style={{ width: '85px' }} header="Status"></Column>
                                            {
                                                hasPermission(role, PERMISSIONS.SETTINGS.USERS.MOBILE_APP.DISCONNECT_USER) && (
                                                    <Column field="privilege" body={ActionBody} style={{ width: '64px' }} header="Action"></Column>
                                                )
                                            }
                                        </DataTable>
                                    </> : <div className='d-flex flex-column justify-content-center align-items-center'>
                                        <img src={ExpertsCuate} alt='expired-subscription' style={{ width: '300px' }} />
                                        <h4 style={{ fontWeight: 700 }}>Work Subscription Expired</h4>
                                        <p className='font-18 text-center'> Your MeMate subscription has expired. To continue enjoying all features,<br /> please activate your subscription plan.</p>

                                        <Link to={"/settings/generalinformation/subscription"}>
                                            <Button className='solid-button'>Active Work Subscription</Button>
                                        </Link>
                                    </div>
                                }
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
            {visible && <CreateMobileUser visible={visible} setVisible={setVisible} refetch={() => mobileUsersQuery.refetch()} />}
        </>
    );
});

export default MobileApp;
