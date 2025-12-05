import { useState, useRef, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { InfoCircle, X } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import styles from './view-vehicle.module.scss';
import { getVehicle, getVehicleServices, getLinkedExpenses } from '../../../../APIs/assets-api';
import NewExpensesCreate from '../../../../components/Business/features/expenses-features/new-expenses-create/new-expense-create';
import { formatMoney } from '../../../../components/Business/shared/utils/helper';
import { formatAUD } from '../../../../shared/lib/format-aud';
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';
import DeleteVehicle from '../delete-vehicle/delete-vehicle';
import EditVehicle from '../edit-vehicle/edit-vechicle';
import RestoreVehicle from '../restore-vehicle/restore-vehicle';

const dateFormat = (timestamp) => {
    if (!timestamp) return '-';
    // Handle Unix timestamp (in seconds)
    const date = new Date(+timestamp * 1000);
    const formatter = new Intl.DateTimeFormat("en-AU", {
        timeZone: 'Australia/Sydney',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    return formatter.format(date);
};

const ViewVehicle = ({ visible, setVisible, editData, onClose, setRefetch, drivers }) => {
    const formRef = useRef(null);
    const [isPending, setIsPending] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const id = editData?.id;
    const getVehicleQuery = useQuery({
        queryKey: ['getVehicle', id],
        queryFn: () => getVehicle(id),
        enabled: !!id
    });
    const vehicleData = getVehicleQuery?.data;

    const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
    const [assetForExpense, setAssetForExpense] = useState(null);

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
        <>
            <Sidebar visible={visible} position="right" onHide={onClose} modal={false} dismissable={false} style={{ width: '702px' }}
                content={({ closeIconRef, hide }) => (
                    <div className='create-sidebar d-flex flex-column'>
                        <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '12px 24px' }}>
                            <div className="d-flex align-items-center gap-2">
                                <div className={styles.circledesignstyle}>
                                    <div className={styles.out}>
                                        <InfoCircle size={24} color="#17B26A" />
                                    </div>
                                </div>
                                <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>Vehicle Information</span>
                            </div>
                            <span>
                                <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                    <X size={24} color='#667085' />
                                </Button>
                            </span>
                        </div>

                        <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 100px)', overflow: 'auto' }}>
                            {!isEdit && <div className='d-flex align-items-center justify-content-between'>
                                <h5 className={styles.boxLabel}>General Information</h5>
                                {/* <h6 className={styles.boxLabel2}>Vehicle ID: {vehicleData?.registration_number || id}</h6> */}
                            </div>}
                            {vehicleData && !isEdit ? <ViewSection vehicle={vehicleData} drivers={drivers} /> : vehicleData && <EditVehicle ref={formRef} vehicle={vehicleData} setVisible={setVisible} setIsEdit={setIsEdit} refetch={getVehicleQuery.refetch} setIsPending={setIsPending} handleExternalSubmit={handleExternalSubmit} setRefetch={setRefetch} />}
                        </div>

                        <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                            {isEdit ? (
                                <div className='d-flex align-items-center gap-3'>
                                    <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(false); }} className='outline-button'>Cancel</Button>
                                    <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '179px' }}>{isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : "Save Vehicle Details"}</Button>
                                </div>
                            ) : (
                                <div className='d-flex align-items-center justify-content-between gap-3 w-100'>
                                    {vehicleData?.is_deleted ? (
                                        <RestoreVehicle id={id} refetch={() => { setRefetch((prev) => !prev); getVehicleQuery?.refetch(); }} onClose={onClose} />
                                    ) : (
                                        <DeleteVehicle id={id} refetch={() => { setRefetch((prev) => !prev); getVehicleQuery?.refetch(); }} onClose={onClose} />
                                    )}
                                    <div className='d-flex align-items-center gap-2'>
                                        <Button type='button' onClick={() => {
                                            setShowCreateExpenseModal(true);
                                            setAssetForExpense({ id: id, type: 1 });
                                        }} className='outline-button'>Create Expense</Button>
                                        <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(true); }} className='solid-button'>Edit Vehicle</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            ></Sidebar>
            {showCreateExpenseModal && assetForExpense?.id && (
                <NewExpensesCreate
                    visible={showCreateExpenseModal}
                    setVisible={setShowCreateExpenseModal}
                    setRefetch={setRefetch}
                    assetForExpense={assetForExpense}
                />
            )}
        </>
    );
};

const ViewSection = ({ vehicle, drivers }) => {
    const driver = drivers[vehicle?.driver];

    const fuelTypeLabels = {
        'gasoline': 'Gasoline',
        'diesel': 'Diesel',
        'petrol': 'Petrol',
        'hybrid': 'Hybrid',
        'electric': 'Electric',
        'hydrogen': 'Hydrogen'
    };

    const bodyTypeLabels = {
        'sedan': 'Sedan',
        'suv': 'SUV',
        'hatchback': 'Hatchback',
        'truck': 'Truck',
        'van': 'Van',
        'other': 'Other'
    };

    return (
        <>
            <div className={styles.box}>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Registration Number</label>
                        <h4 className={styles.text}>{vehicle?.registration_number || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Date Of Expiry</label>
                        <h4 className={styles.text}>{vehicle?.date_of_expiry ? dateFormat(vehicle.date_of_expiry) : "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Make</label>
                        <h4 className={styles.text}>{vehicle?.make || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Model</label>
                        <h4 className={styles.text}>{vehicle?.model || "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Year Manufactured</label>
                        <h4 className={styles.text}>{vehicle?.year_manufactured || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Fuel Type</label>
                        <h4 className={styles.text}>{fuelTypeLabels[vehicle?.fuel_type] || "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>VIN Number</label>
                        <h4 className={styles.text}>{vehicle?.vin_number || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Engine Number</label>
                        <h4 className={styles.text}>{vehicle?.engine_number || "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Date of Purchase</label>
                        <h4 className={styles.text}>{vehicle?.date_of_purchase ? dateFormat(vehicle.date_of_purchase) : "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Purchased Amount</label>
                        <h4 className={styles.text}>{vehicle?.purchased_amount ? "$" + formatMoney(vehicle.purchased_amount) : "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Purchase Odometer</label>
                        <h4 className={styles.text}>{vehicle?.purchase_odometer_km ? `${vehicle.purchase_odometer_km.toLocaleString()} km` : "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Current Odometer</label>
                        <h4 className={styles.text}>{vehicle?.odometer_km ? `${vehicle.odometer_km.toLocaleString()} km` : "-"}</h4>
                    </Col>
                </Row>
            </div>

            <h5 className={styles.boxLabel}>Responsible Person</h5>
            <div className={styles.box}>
                {drivers[vehicle?.driver] ? (
                    <div className='d-flex gap-2 align-items-center'>
                        <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                            <FallbackImage photo={driver?.photo} has_photo={driver?.has_photo} is_business={false} size={17} />
                        </div>
                        {driver?.first_name} {driver?.last_name}
                    </div>
                ) : ("-")}
            </div>

            <h5 className={styles.boxLabel}>Insurance and Legal Information</h5>
            <div className={styles.box}>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Insurer</label>
                        <h4 className={styles.text}>{vehicle?.insurer || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Insurance Policy Number</label>
                        <h4 className={styles.text}>{vehicle?.insurance_policy_number || "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Insurance Expiry</label>
                        <h4 className={styles.text}>{vehicle?.insurance_expiry ? dateFormat(vehicle.insurance_expiry) : "-"}</h4>
                    </Col>
                </Row>
            </div>

            <h5 className={styles.boxLabel}>Other</h5>
            <div className={styles.box}>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Receipt Number</label>
                        <h4 className={styles.text}>{vehicle?.receipt_number || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Etag</label>
                        <h4 className={styles.text}>{vehicle?.etag || "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Colour</label>
                        <h4 className={styles.text}>{vehicle?.colour || "-"}</h4>
                    </Col>
                    <Col sm={6}>
                        <label className={styles.label}>Body Type</label>
                        <h4 className={styles.text}>{bodyTypeLabels[vehicle?.body_type] || "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Trim</label>
                        <h4 className={styles.text}>{vehicle?.trim || "-"}</h4>
                    </Col>
                </Row>
            </div>

            <h5 className={styles.boxLabel}>Service History</h5>
            <ServiceHistoryList vehicleId={vehicle?.id} />

            <h5 className={styles.boxLabel}>Expense History</h5>
            <LinkedExpenseList vehicleId={vehicle?.id} />
        </>
    );
};

const ServiceHistoryList = ({ vehicleId }) => {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);
    const lastItemRef = useRef(null);
    const limit = 10;

    useEffect(() => {
        const fetchServices = async () => {
            if (!vehicleId) return;
            setLoading(true);

            try {
                const data = await getVehicleServices(vehicleId, page, limit, '', '-date');
                if (page === 1) {
                    setServices(data?.results || []);
                } else {
                    if (data?.results?.length > 0) {
                        setServices(prev => {
                            const existingIds = new Set(prev.map(service => service.id));
                            const newData = data.results.filter(service => !existingIds.has(service.id));
                            return [...prev, ...newData];
                        });
                    }
                }
                setHasMoreData(data?.results?.length === limit);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [vehicleId, page]);

    useEffect(() => {
        if (!hasMoreData || loading) return;

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (lastItemRef.current) {
            observerRef.current.observe(lastItemRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMoreData, loading, services]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        const date = new Date(+timestamp * 1000);
        const formatter = new Intl.DateTimeFormat("en-AU", {
            timeZone: 'Australia/Sydney',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        return formatter.format(date);
    };

    if (!vehicleId) return null;

    return (
        <div className={styles.box} style={{ padding: '0', maxHeight: '300px', overflow: 'auto' }}>
            {services.length === 0 && !loading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#98A2B3' }}>
                    No service history found
                </div>
            ) : (
                <div>
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            ref={index === services.length - 1 ? lastItemRef : null}
                            style={{
                                padding: '16px 24px',
                                borderBottom: index < services.length - 1 ? '1px solid #EAECF0' : 'none'
                            }}
                        >
                            <div className='d-flex justify-content-between align-items-start mb-2'>
                                <div>
                                    <div style={{ fontWeight: '500', fontSize: '14px', color: '#344054' }}>
                                        ID: {service.id || '-'}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#98A2B3', marginTop: '4px' }}>
                                        Expense: {service.number || '-'}
                                    </div>
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '14px', color: '#344054' }}>
                                    ${formatAUD(service.cost || 0)}
                                </div>
                            </div>

                            <div className='d-flex gap-3' style={{ fontSize: '13px', color: '#667085' }}>
                                {service.odometer_km && (
                                    <div>
                                        <span style={{ color: '#98A2B3' }}>Odometer: </span>
                                        {service.odometer_km.toLocaleString()} km
                                    </div>
                                )}
                                {service.upcoming_date && (
                                    <div>
                                        <span style={{ color: '#98A2B3' }}>Next Service: </span>
                                        {formatDate(service.upcoming_date)}
                                    </div>
                                )}
                            </div>

                            {service.notes && (
                                <div style={{ marginTop: '8px', fontSize: '13px', color: '#667085' }}>
                                    Note: {service.notes}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ padding: '16px', textAlign: 'center' }}>
                            <ProgressSpinner style={{ width: '24px', height: '24px' }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const LinkedExpenseList = ({ vehicleId }) => {
    const [expenses, setExpenses] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);
    const lastItemRef = useRef(null);
    const limit = 10;

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!vehicleId) return;
            setLoading(true);

            try {
                const data = await getLinkedExpenses(1, vehicleId, page, limit, '-id');
                if (page === 1) {
                    setExpenses(data || []);
                } else {
                    if (data?.length > 0) {
                        setExpenses(prev => {
                            const existingIds = new Set(prev.map(expense => expense.id));
                            const newData = data.filter(expense => !existingIds.has(expense.id));
                            return [...prev, ...newData];
                        });
                    }
                }
                setHasMoreData(data.length === limit);
            } catch (error) {
                console.error('Error fetching linked expenses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [vehicleId, page]);

    useEffect(() => {
        if (!hasMoreData || loading) return;

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (lastItemRef.current) {
            observerRef.current.observe(lastItemRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMoreData, loading]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        const date = new Date(+timestamp * 1000);
        const formatter = new Intl.DateTimeFormat("en-AU", {
            timeZone: 'Australia/Sydney',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        return formatter.format(date);
    };

    if (!vehicleId) return null;

    return (
        <div className={styles.box} style={{ padding: '0', maxHeight: '300px', overflow: 'auto' }}>
            {expenses.length === 0 && !loading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#98A2B3' }}>
                    No expense history found
                </div>
            ) : (
                <div>
                    {expenses.map((expense, index) => (
                        <div
                            key={expense.id}
                            ref={index === expenses.length - 1 ? lastItemRef : null}
                            style={{
                                padding: '16px 24px',
                                borderBottom: index < expenses.length - 1 ? '1px solid #EAECF0' : 'none'
                            }}
                        >
                            <div className='d-flex justify-content-between align-items-start mb-2'>
                                <div>
                                    <div style={{ fontWeight: '500', fontSize: '14px', color: '#344054' }}>
                                        {expense.number || '-'}
                                    </div>
                                    {expense.supplier?.name && (
                                        <div style={{ fontSize: '12px', color: '#98A2B3', marginTop: '4px' }}>
                                            Supplier: {expense.supplier.name}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '14px', color: '#344054' }}>
                                    ${formatAUD(expense.total || 0)}
                                </div>
                            </div>

                            <div className='d-flex gap-3' style={{ fontSize: '13px', color: '#667085' }}>
                                {expense.invoice_reference && (
                                    <div>
                                        <span style={{ color: '#98A2B3' }}>Reference: </span>
                                        {expense.invoice_reference}
                                    </div>
                                )}
                                {expense.due_date && (
                                    <div>
                                        <span style={{ color: '#98A2B3' }}>Due Date: </span>
                                        {formatDate(expense.due_date)}
                                    </div>
                                )}
                            </div>

                            {expense.account_code && (
                                <div style={{ marginTop: '8px', fontSize: '13px', color: '#667085' }}>
                                    <span style={{ color: '#98A2B3' }}>Account Code: </span>
                                    {expense.account_code.code}:{expense.account_code.name}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ padding: '16px', textAlign: 'center' }}>
                            <ProgressSpinner style={{ width: '24px', height: '24px' }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewVehicle;