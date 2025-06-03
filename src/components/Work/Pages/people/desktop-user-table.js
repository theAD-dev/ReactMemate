import React, { useEffect, useRef, useState } from 'react';
import { Chat, Envelope, Plus, Telephone } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { io } from 'socket.io-client';
import style from './people.module.scss';
import { getPrivilegesList } from '../../../../APIs/settings-user-api';
import { getTeamDesktopUser } from '../../../../APIs/team-api';
import { useAuth } from '../../../../app/providers/auth-provider';
import ImageAvatar from '../../../../shared/ui/image-with-fallback/image-avatar';
import Loader from '../../../../shared/ui/loader/loader';

const DesktopPeoplesTable = () => {
    const [loading, setLoading] = useState(false);
    const [peoples, setPeoples] = useState([]);
    const [selectedPeoples, setSelectedPeoples] = useState(null);
    const privilegesQuery = useQuery({ queryKey: ['privileges-list'], queryFn: getPrivilegesList });

    const { session } = useAuth();
    const currentUserId = session?.desktop_user_id;
    const organizationId = session?.organization?.id;
    const socketRef = useRef(null);

    if (!socketRef.current) {
        socketRef.current = io(process.env.REACT_APP_CHAT_API_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });
        // Register user once
        if (currentUserId) {
            socketRef.current.emit('register_user', { user_id: currentUserId });
        }
    }

    useEffect(() => {
        const getMobileUser = async () => {
            setLoading(true);
            try {
                const users = await getTeamDesktopUser();
                let activeUsers = users?.users?.filter((user) => user.is_active);
                setPeoples(activeUsers || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        getMobileUser();
    }, []);

    const nameBody = (rowdata) => {
        return <div className={`d-flex align-items-center justify-content-start gap-2 show-on-hover`}>
            <ImageAvatar has_photo={rowdata.has_photo} photo={rowdata.photo} is_business={false} />
            <div className={`${style.time} ${rowdata.time === 'TimeFrame' ? style.frame : style.tracker}`}>
                {rowdata?.first_name} {rowdata?.last_name}
            </div>
            <Button label="View Details" onClick={() => { }} className='primary-text-button ms-3 show-on-hover-element' text />
        </div>;
    };

    const typeBody = (rowData) => {
        const type = rowData.privilege;
        let privilege = privilegesQuery?.data?.find((t) => type === t.id);
        return privilege?.name || "-";
    };

    const daysBody = (rowData) => {
        return <Chip className={`custom ${style.defaultDays}`} label={rowData.days_in_company || "-"} />;
    };

    const emailBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center justify-content-center'>
            <Link to='#'
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `mailto:${rowData?.email}`;
                }}
            >
                <Envelope size={20} color='#98A2B3' className='email-icon' />
            </Link>
        </div>;
    };

    const phoneBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center justify-content-center'>
            <Link to='#'
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `tel:${rowData?.phone}`;
                }}
            >
                <Telephone size={20} color='#98A2B3' className='phone-icon' />
            </Link>
        </div>;
    };

    const chatBody = (rowData) => {
        console.log('rowData: ', rowData);
        const id = rowData.id;
        const isSelf = currentUserId === id;
        if (isSelf) return null;

        const handleChatClick = async (e) => {
            e.preventDefault();
            if (!currentUserId || !organizationId) return;
            const groupName = `${session?.first_name}${session?.last_name}-${rowData.first_name}${rowData.last_name}`;
            socketRef.current.emit(
                'create_chat_group',
                {
                    user_id: currentUserId,
                    name: groupName,
                    participants: [currentUserId, id],
                    organization_id: organizationId,
                    project_id: null,
                    task_id: null
                },
                (res) => {
                    if (res.status === 'ok' && res.chat_group_id) {
                        window.location.href = `/work/chat?id=${res.chat_group_id}`;
                    } else {
                        alert(res.message || 'Failed to create chat group');
                    }
                }
            );
        };

        return (
            <a href="#" onClick={handleChatClick} title="Start Chat">
                <Chat color='#98A2B3' size={20} />
            </a>
        );
    };

    const actionBody = () => {
        return <Button className='text-button bg-tranparent p-0 text-dark' disabled>New Job <Plus color='#667085' size={20} /></Button>;
    };

    return (
        <>
            <h1 className={clsx(style.tableCaption, 'mt-2')}>Desktop User</h1>
            <DataTable value={peoples}
                scrollable selectionMode={'checkbox'} removableSort
                columnResizeMode="expand" resizableColumns showGridlines
                size={'large'} className="border" selection={selectedPeoples}
                onSelectionChange={(e) => setSelectedPeoples(e.value)}
                loading={loading}
                loadingIcon={Loader}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="name" header="Name" body={nameBody} style={{ minWidth: '400px' }} headerClassName='shadowRight' bodyClassName='shadowRight' frozen sortable></Column>
                <Column field="role" header="Role" style={{ minWidth: '107px' }}></Column>
                <Column field="privilege" header="Privilege" body={typeBody} style={{ minWidth: '149px' }} sortable></Column>
                <Column field="days" header="Days in company" body={daysBody} style={{ minWidth: '150px' }} className='text-center' sortable></Column>
                <Column field="jobs_completed" header="Jobs complete" style={{ minWidth: '131px', textAlign: 'left' }} sortable></Column>
                <Column header="Email" body={emailBodyTemplate} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column header="Phone" body={phoneBodyTemplate} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column header="Chat" body={chatBody} style={{ minWidth: '73px', textAlign: 'center' }}></Column>
                <Column field="Actions" header="Status" body={actionBody} style={{ minWidth: '135px' }}></Column>
            </DataTable>
        </>
    );
};

export default DesktopPeoplesTable;