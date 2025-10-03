import { useState, useRef } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { InfoCircle, X } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import styles from './view-vehicle.module.scss';
import { getVehicle } from '../../../../APIs/assets-api';
import { dateFormat, formatMoney } from '../../../../components/Business/shared/utils/helper';
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';
import EditVehicle from '../edit-vehicle/edit-vechicle';

const ViewVehicle = ({ visible, setVisible, editData, setEditData, onClose, setRefetch, drivers }) => {
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

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
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
                            <h6 className={styles.boxLabel2}>Vehicle ID: {vehicleData?.registration_number || id}</h6>
                        </div>}
                        {vehicleData && !isEdit ? <ViewSection vehicle={vehicleData} drivers={drivers} /> : <EditVehicle ref={formRef} vehicle={vehicleData} setVisible={setVisible} setIsEdit={setIsEdit} refetch={getVehicleQuery.refetch} setIsPending={setIsPending} handleExternalSubmit={handleExternalSubmit} setRefetch={setRefetch} />}
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        {isEdit ? (
                            <div className='d-flex align-items-center gap-3'>
                                <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(false); }} className='outline-button'>Cancel</Button>
                                <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '179px' }}>{isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : "Save Vehicle Details"}</Button>
                            </div>
                        ) : (
                            <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(true); }} className='solid-button'>Edit Vehicle</Button>
                        )}
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};

const ViewSection = ({ vehicle, drivers }) => {
    const driver = drivers[vehicle?.driver];

    const fuelTypeLabels = {
        'gasoline': 'Gasoline',
        'diesel': 'Diesel',
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
                        <h4 className={styles.text}>{vehicle?.purchased_amount ? formatMoney(vehicle.purchased_amount) : "-"}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <label className={styles.label}>Odometer</label>
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
                ): ("-")}
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
        </>
    );
};

export default ViewVehicle;