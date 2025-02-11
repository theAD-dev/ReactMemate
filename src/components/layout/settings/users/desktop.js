import { Building, Person } from 'react-bootstrap-icons';
import style from './users.module.scss';
import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteDesktopUser, getDesktopUserList, getPrivilegesList, restoreDesktopUser } from '../../../../APIs/settings-user-api';
import { Spinner } from 'react-bootstrap';
import CreateDesktopUser from './features/create-desktop-user';
import clsx from 'clsx';
import { Plus } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProgressSpinner } from 'primereact/progressspinner';

const Desktop = ({ visible, setVisible }) => {
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const [isShowDeleted, setIsShowDeleted] = useState(false);
    const desktopUsersQuery = useQuery({ queryKey: ['desktop-users-list'], queryFn: getDesktopUserList });
    const privilegesQuery = useQuery({ queryKey: ['privileges-list'], queryFn: getPrivilegesList });
    let activeUserCount = desktopUsersQuery?.data?.users?.filter((user) => user.is_active) || 0;
    const desktopUsers = isShowDeleted ? desktopUsersQuery?.data?.users?.filter((user) => !user.is_active) : desktopUsersQuery?.data?.users?.filter((user) => user.is_active) || [];

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteDesktopUser(data),
        onSuccess: () => {
            desktopUsersQuery?.refetch();
            toast.success(`User deleted successfully`);
            deleteMutation.reset();
        },
        onError: (error) => {
            toast.error(`Failed to delete user. Please try again.`);
        }
    });

    const restoreMutation = useMutation({
        mutationFn: (data) => restoreDesktopUser(data),
        onSuccess: () => {
            setIsShowDeleted(false);
            desktopUsersQuery?.refetch();
            toast.success(`User restored successfully`);
            restoreMutation.reset();
        },
        onError: (error) => {
            toast.error(`Failed to restore user. Please try again.`);
        }
    });

    console.log('restoreMutation: ', restoreMutation?.variables);
    const restore = (id) => {
        if (desktopUsersQuery?.data?.limits?.total <= activeUserCount?.length) {
            toast.error(`You have reached the maximum number of users allowed.`);
        } else {
            restoreMutation.mutate(id)
        }
    }

    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between show-on-hover'>
            <div className='d-flex justify-content-center align-items-center'><div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.userImg} ${data.is_business ? "" : "rounded-circle"}`}>
                {data.photo ? <img src={data.photo} alt='clientImg' className='w-100' /> : data.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
            </div>
                <div className='d-flex flex-column gap-1'>
                    <div className={`${style.ellipsis}`}>{data.first_name} {data.last_name}</div>
                </div></div>
            <Button label="Edit" onClick={() => {
                if (data?.privilege_name === "Admin") {
                    navigate('/settings/generalinformation/profile')
                } else {
                    setId(data?.id);
                    setVisible(true);
                }
            }} className='primary-text-button ms-3 show-on-hover-element not-show-checked' />
        </div>
    }

    const StatusBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`styleGrey01  ${style.privilege}`}>
                {data?.privilege_name || "-"}
            </div>
        </div>
    }

    const ActionsBody = (data) => {
        if (data?.privilege_name === "Admin") return "-";

        return <React.Fragment>
            {
                data?.is_active
                    ?
                    <Button onClick={() => { deleteMutation.mutate(data?.id) }} className={clsx(style.dangerTextButton, 'text-button')} style={{ width: '120px' }}>
                        Delete
                        {deleteMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                    </Button>
                    : <Button onClick={() => restore(data?.id)} className={clsx(style.successTextButton, 'text-button')} style={{ width: '120px', color: '#067647' }}>
                        Restore
                        {restoreMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                    </Button>
            }
        </React.Fragment>
    }

    return (
        <>
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                    <h1>Users</h1>
                    <div className={`contentMenuTab ${style.contentMenuTab}`}>
                        <ul>
                            <li className='menuActive'><Link to="/settings/users/desktop">Desktop</Link></li>
                            <li><Link to="/settings/users/mobile-app">Mobile App</Link></li>
                        </ul>
                        <Button disabled={desktopUsersQuery?.data?.limits?.total <= activeUserCount?.length} onClick={() => setVisible(true)} className={clsx(style.addUserBut, 'outline-none')}>Add <Plus size={20} color="#000" /></Button>
                    </div>
                </div>
                <div className={`content_wrap_main ${style.contentwrapmain}`}>
                    <div className='content_wrapper border-top'>
                        <div className="listwrapper">
                            <div className="topHeadStyle pb-4">
                                <div className={style.userHead}>
                                    <h2>Desktop Users</h2>
                                    <p>{activeUserCount?.length || 0} / {desktopUsersQuery?.data?.limits?.total || 0} <span className='cursor-pointer'>Buy More</span></p>
                                </div>
                                <Button onClick={() => setIsShowDeleted(!isShowDeleted)} className={clsx(style.showDeleteBut, 'outline-none')}>{!isShowDeleted ? "Show" : "Hide"} Deleted</Button>
                            </div>
                            <div className={`settings-wrap ${style.userSettingPage}`}>
                                <DataTable value={desktopUsers} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="name" style={{ width: 'auto' }} body={nameBody} header="Name"></Column>
                                    <Column field="email" style={{ width: '267px' }} header="Email"></Column>
                                    <Column field="phone" style={{ width: '210px' }} header="Phone"></Column>
                                    <Column field="role" style={{ width: '210px' }} header="Role"></Column>
                                    <Column field="privilege" body={StatusBody} style={{ width: '147px' }} header="Privilege"></Column>
                                    <Column style={{ width: '210px' }} header="Actions" body={ActionsBody}></Column>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            {
                desktopUsersQuery.isLoading &&
                <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
            <CreateDesktopUser id={id} setId={setId} visible={visible} setVisible={setVisible} refetch={() => desktopUsersQuery?.refetch()} privilegeOptions={privilegesQuery?.data || []} />
        </>
    );
}

export default Desktop;
