import React, { useEffect, useState } from 'react';
import style from './location.module.scss';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { getDesktopUserList, getLocation, getLocationList, userAssigned, userUnassigned } from '../../../../APIs/location-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import CreateLocation from './features/create-location';
import { Skeleton } from 'primereact/skeleton';
import Table from 'react-bootstrap/Table';
import GoogleMap from "../../../../assets/images/icon/google_maps_ico.png";
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';

const Location = () => {
    const [visible, setVisible] = useState(false);
    const [desktopsUsersOptions, setDesktopUserOptions] = useState([]);
    const [activeTab, setActiveTab] = useState('locations');
    const [activeLocation, setActiveLocation] = useState(null);
    const [defaultLocation, setDefaultLocation] = useState(null);
    const locationsQuery = useQuery({
        queryKey: ["locations"],
        queryFn: getLocationList,
    });
    const locationReadQuery = useQuery({
        queryKey: ['states', activeLocation],
        queryFn: () => getLocation(activeLocation),
        enabled: !!activeLocation,
        retry: 1
    });
    const desktopUser = useQuery({
        queryKey: ["desktop-users"],
        queryFn: getDesktopUserList,
    });
    const assignedMutation = useMutation({
        mutationFn: (data) => userAssigned(activeLocation, data?.id),
        onSuccess: (response) => {
            locationReadQuery?.refetch();
            toast.success(`User assigned successfully.`);
        },
        onError: (error) => {
            console.error('Error assigning user:', error);
            toast.error(`Failed to assign user. Please try again.`);
        }
    });
    const unassignedMutation = useMutation({
        mutationFn: (data) => userUnassigned(activeLocation, data?.id),
        onSuccess: (response) => {
            locationReadQuery?.refetch();
            toast.success(`User unassigned successfully.`);
        },
        onError: (error) => {
            console.error('Error unassigning user:', error);
            toast.error(`Failed to unassign user. Please try again.`);
        }
    });

    const handleCreateLocation = () => {
        if (locationsQuery?.data?.locations?.length < locationsQuery?.data?.limits?.total) {
            setDefaultLocation(null);
            setVisible(true);
        }
    }
    const handleEditLocation = () => {
        setDefaultLocation({
            id: locationReadQuery?.data?.id,
            name: locationReadQuery?.data?.name,
            address: locationReadQuery?.data?.address,
            postcode: locationReadQuery?.data?.postcode
        })
        setVisible(true);
    }

    const assignedUser = (id) => {
        assignedMutation.mutate({ id: id })
    }

    const fallbackLocation = () => {
        if (locationsQuery?.data?.locations?.length) {
            setActiveLocation(locationsQuery?.data?.locations[0].id);
        }
    }

    useEffect(() => {
        if (!activeLocation && locationsQuery?.data?.locations?.length) {
            setActiveLocation(locationsQuery?.data?.locations[0].id);
        }
    }, [locationsQuery?.data])

    useEffect(() => {
        const locationUserIds = locationReadQuery?.data?.users.map(user => user.id);
        const filteredDesktopUsers = desktopUser?.data?.filter(user => !locationUserIds?.includes(user.id));
        setDesktopUserOptions(filteredDesktopUsers);
    }, [desktopUser?.data, locationReadQuery?.data])

    return (
        <div className={`settings-wrap ${style.userSettingPage}`}>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky'>
                        <h1 className='mb-0'>Locations</h1>
                        <p className='d-flex align-items-center'>{locationsQuery?.data?.locations?.length || 0} / {locationsQuery?.data?.limits?.total} <Button className='text-button'>Buy More</Button></p>
                        <div className={`contentMenuTab ${style.contentMenuTab}`} style={{ position: 'relative' }}>
                            <ul className='w-100'>
                                {
                                    locationsQuery?.data?.locations?.map((location, index) => (
                                        <li key={location.id} className={clsx(location.id === activeLocation && 'menuActive')}>
                                            <Link onClick={() => setActiveLocation(location.id)}>{location.name}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                            <Button onClick={handleCreateLocation} disabled={locationsQuery?.data?.locations?.length >= locationsQuery?.data?.limits?.total} style={{ position: 'absolute', right: 0, bottom: '4px' }} className={style.addUserBut}>Add <Plus size={20} color="#000" /></Button>
                        </div>
                    </div>
                    <div className={`content_wrap_main ${style.contentwrapmain}`}>
                        <div className='content_wrapper'>
                            <div className="listwrapper">
                                <div className="topHeadStyle w-100 pb-4 mb-4 border-bottom">
                                    {locationReadQuery?.isFetching
                                        ? <Skeleton width="45%" height='32px'></Skeleton>
                                        : <div className={style.userHead}>
                                            <h2 className='mb-0'>{locationReadQuery?.data?.name}</h2>
                                        </div>
                                    }
                                </div>
                                <Table className='custom-table' bordered style={{ marginBottom: '24px' }}>
                                    <thead className={clsx(style.borderNone)}>
                                        <tr>
                                            <th>Country</th>
                                            <th>State</th>
                                            <th>City/Suburb</th>
                                            <th>Street address</th>
                                            <th>Post code</th>
                                            <th>Google Maps</th>
                                        </tr>
                                    </thead>
                                    <tbody className={clsx(style.table)}>
                                        <tr>
                                            <td className={clsx(style.td, 'd-flex align-items-center gap-2')}>
                                                {locationReadQuery?.isFetching
                                                    ? <Skeleton width="100%"></Skeleton>
                                                    : locationReadQuery?.data?.country || "-"
                                                }
                                                {locationsQuery?.data?.locations?.[0]?.id === activeLocation
                                                    ? <Link to={"/settings/generalinformation"}>
                                                        <Button className={clsx(style.hoverShow, 'p-0 text-button')} style={{ visibility: 'hidden' }}>Edit</Button>
                                                    </Link>
                                                    : <Button onClick={handleEditLocation} className={clsx(style.hoverShow, 'p-0 text-button')} style={{ visibility: 'hidden' }}>Edit</Button>
                                                }
                                            </td>
                                            <td className={style.td}>
                                                {locationReadQuery?.isFetching
                                                    ? <Skeleton width="100%"></Skeleton>
                                                    : locationReadQuery?.data?.state || "-"
                                                }
                                            </td>
                                            <td className={style.td}>
                                                {locationReadQuery?.isFetching
                                                    ? <Skeleton width="100%"></Skeleton>
                                                    : locationReadQuery?.data?.city || "-"
                                                }
                                            </td>
                                            <td className={style.td}>
                                                {locationReadQuery?.isFetching
                                                    ? <Skeleton width="100%"></Skeleton>
                                                    : locationReadQuery?.data?.address || "-"
                                                }
                                            </td>
                                            <td className={style.td}>
                                                {locationReadQuery?.isFetching
                                                    ? <Skeleton width="100%"></Skeleton>
                                                    : locationReadQuery?.data?.postcode || "-"
                                                }
                                            </td>
                                            <td className={clsx(style.td, 'text-start')}>
                                                {locationReadQuery?.isFetching
                                                    ? <Skeleton width="100%"></Skeleton>
                                                    : <Link to={`http://maps.google.com/?q=${locationReadQuery?.data?.address}`} target='_blank'>
                                                        <img src={GoogleMap} alt='google-map-location' />
                                                    </Link>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <div className="topHeadStyle w-100 pb-4 mb-4 border-bottom" style={{ paddingTop: '24px' }}>
                                    <div className={'w-100 d-flex justify-content-between align-items-center'}>
                                        <h2 className='mb-0'>Desktop Users</h2>
                                        <div>
                                            {
                                                (assignedMutation?.isPending) && <ProgressSpinner className='me-3' style={{ width: '20px', height: '20px' }} />
                                            }
                                            <Dropdown
                                                onChange={(e) => assignedUser(e.value)}
                                                options={desktopsUsersOptions?.map((user) => ({
                                                    value: user?.id,
                                                    label: user?.name || "-",
                                                    photo: user?.photo || "",
                                                }))}
                                                placeholder="Select Desktop User"
                                                itemTemplate={(option) => {
                                                    return (
                                                        <div className='d-flex gap-2 align-items-center'>
                                                            <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                                                                <img src={option?.photo} alt='user-img' style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                                            </div>
                                                            {option?.label}
                                                        </div>
                                                    )
                                                }}
                                                className='outline-none'
                                                style={{ width: '230px' }}
                                                loading={desktopUser?.isFetching}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Table className='custom-table' bordered style={{ marginBottom: '24px' }}>
                                    <thead className={clsx(style.borderNone)}>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Privilege</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            locationReadQuery?.data?.users?.map((user, index) =>
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className='d-flex gap-2 align-items-center'>
                                                            <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                                                                <img src={user.photo} alt='user-img' style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                                            </div>
                                                            {user.first_name} {user.last_name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {user.email || "-"}
                                                    </td>
                                                    <td>
                                                        {user.phone || "-"}
                                                    </td>
                                                    <td>
                                                        {user.role || "-"}
                                                    </td>
                                                    <td>
                                                        <div className={`styleGrey01  ${style.privilege}`}>
                                                            {user.privilege || "-"}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => unassignedMutation.mutate({ id: user.id })} className={clsx(style.dangerTextButton, 'text-button')} style={{ width: '120px' }}>
                                                            {
                                                                (unassignedMutation?.variables?.id === user.id && unassignedMutation?.isPending)
                                                                    ? <ProgressSpinner style={{ width: '15px', height: '15px' }} />
                                                                    : "Delete"
                                                            }
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        {
                                            (locationReadQuery?.isFetching || assignedMutation?.isPending) && <tr>
                                                <td>
                                                    <Skeleton width="100%"></Skeleton>
                                                </td>
                                                <td>
                                                    <Skeleton width="100%"></Skeleton>
                                                </td>
                                                <td>
                                                    <Skeleton width="100%"></Skeleton>
                                                </td>
                                                <td>
                                                    <Skeleton width="100%"></Skeleton>
                                                </td>
                                                <td>
                                                    <Skeleton width="100%"></Skeleton>
                                                </td>
                                                <td>
                                                    <Skeleton width="100%"></Skeleton>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    {
                        (locationsQuery.isLoading || locationReadQuery.isFetching) &&
                        <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    <CreateLocation visible={visible} setVisible={setVisible} defaultValues={defaultLocation} id={defaultLocation?.id} refetch={locationsQuery.refetch} refetch2={locationReadQuery.refetch} fallbackLocation={fallbackLocation} />
                </div>
            </div>
        </div>
    )
}

export default Location