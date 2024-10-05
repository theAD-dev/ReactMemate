import React, { useEffect, useState } from 'react';
import style from './location.module.scss';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { Plus, Table } from 'react-bootstrap-icons';
import { getLocation, getLocationList } from '../../../../APIs/location-api';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import CreateLocation from './features/create-location';
import { Skeleton } from 'primereact/skeleton';

const Location = () => {
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('locations');
    const [activeLocation, setActiveLocation] = useState(null);
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
    const handleCreateLocation = () => {
        if (locationsQuery?.data?.locations?.length < locationsQuery?.data?.limits?.total)
            setVisible(true);
    }

    useEffect(() => {
        if (locationsQuery?.data?.locations?.length) {
            setActiveLocation(locationsQuery?.data?.locations[0].id);
        }
    }, [locationsQuery?.data])


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
                                        <li key={location.id} className={clsx(index === 0 && 'menuActive')}><Link to={`/settings/location/${location.id}`}>{location.name}</Link></li>
                                    ))
                                }
                            </ul>
                            <Button onClick={handleCreateLocation} disabled={locationsQuery?.data?.locations?.length >= locationsQuery?.data?.limits?.total} style={{ position: 'absolute', right: 0, bottom: '4px' }} className={style.addUserBut}>Add <Plus size={20} color="#000" /></Button>
                        </div>
                    </div>
                    <div className={`content_wrap_main ${style.contentwrapmain}`}>
                        <div className='content_wrapper w-100 flex-column'>
                            <div className="topHeadStyle w-100 py-4 mb-4 border-bottom">
                                {locationReadQuery?.isFetching
                                    ? <Skeleton width="45%" height='30px'></Skeleton>
                                    : <div className={style.userHead}>
                                        <h2>{locationReadQuery?.data?.name}</h2>
                                    </div>
                                }
                            </div>
                            {/* <Table striped className='w-100'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Username</th>
                                    </tr>
                                </thead>
                            </Table> */}


                        </div>
                    </div>

                    {
                        locationsQuery.isLoading &&
                        <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    <CreateLocation visible={visible} setVisible={setVisible} />
                </div>
            </div>
        </div>
    )
}

export default Location