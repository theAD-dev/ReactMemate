import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { PencilSquare ,Plus} from 'react-bootstrap-icons';
import clsx from 'clsx';
import style from './location.module.scss';
import React, { forwardRef, useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import {  Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import GoogleMap from "../../../../assets/images/icon/google_maps_ico.png";
import Desktop from '../users/desktop';
import SelectUsers from './select-user';
import { Dialog } from 'primereact/dialog';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';



export const ProductService = {
    getData() {
        return [
            {
                id: 1,
                country: "USA",
                state: "NYC",
                city: 'New York',
                streetaddress: "721 Broadway",
                privilege: "General Manager",
                postcode:"10003",  
                mapgoogle:GoogleMap,  
            },
            {
                id: 2,
                country: "AUS",
                state: "VIC",
                city: 'Melbourne',
                streetaddress: "721 Broadway",
                privilege: "Admin",
                postcode:"3000", 
                mapgoogle:GoogleMap,
            },
        ];
    }
};
                                          
const Headquarter = () => {
    
    const [activeTab, setActiveTab] = useState('desktop');
    const [products, setProducts] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const data = ProductService.getData();
        setProducts(data);
    }, []);

    const countyBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex justify-content-center align-items-center'>
        <div className='d-flex flex-column gap-1'>
          <div className={`${style.ellipsis}`}>{data.country}</div>
        </div>
        <Button label="Edit" onClick={() => setVisible(true)} className={`primary-text-button ms-3 show-on-hover-element not-show-checked ${style.editBut}`} />
        </div>
        
      </div>
      }
    const mapBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex justify-content-center align-items-center'>
        <img src={data.mapgoogle} alt='mapgoogle'/>
        </div>
        
      </div>
      }

 
    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(yup.object({
            lname: yup.string().required("Name is required"),
        }).required()),

        defaultValues: { lname: '' },
    });
  
    const onSubmit = (data) => {
        console.log(data);
        // Handle your save logic here
    };

      const headerElement1 = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PencilSquare size={24} color="#17B26A" className='mb-0' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                Edit Location
                </span>
            </div>
        </div>
    );
    const footerContent1 = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' >Cancel</Button>
            <Button className='solid-button'  onClick={handleSubmit(onSubmit)} style={{ width: '132px' }} >Save Details</Button>
        </div>
    );
 
    const handleClose = () => {
        setVisible(false);
      
    };

    return (
        <>
            <div className={`settings-wrap ${style.userSettingPage}`}>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Locations</h1>
                            <div className={`contentMenuTab ${style.contentMenuTab}`}>
                                <ul>
                              
                                <li className='menuActive'><Link to="/settings/location/headquarter">Headquarter</Link></li>
                                    <li><Link to="/settings/location/innovation-studio">Innovation Studio</Link></li>
                                    <li><Link to="/settings/location/creative-hub">Creative Hub</Link></li>
                                </ul>
                                <Button className={style.addUserBut}>Add <Plus size={20} color="#000" /></Button>
                            </div>
                           
                        </div>
                        <div className={`content_wrap_main ${style.contentwrapmain}`}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <div className={style.userHead}>
                                        <h2>Headquarter</h2>
                                        <p>3/5 <span>Buy More</span></p>
                                        </div>
                                        
                                    </div>
                                        <DataTable value={products} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                            <Column field="country" style={{ width: '182px' }} body={countyBody} header="Country"></Column>
                                            <Column field="state" style={{ width: '182px' }} header="State"></Column>
                                            <Column field="city" style={{ width: '182px' }} header="City/Suburb"></Column>
                                            <Column field="streetaddress" style={{ width: '182px' }} header="Street address"></Column>
                                            <Column field="postcode" style={{ width: '182px' }} header="Post code"></Column>
                                            <Column field="mapgoogle" body={mapBody} style={{ width: '182px' }} header="Google Maps"></Column>
                                        </DataTable>


                                        <div className={style.HeadquarterDesktop}>
                                        <div className="topHeadStyle pb-4">
                                        <div className={style.userHeadSelect}>
                                        <h2>Desktop Users</h2>
                                        <SelectUsers />
                                        </div>
                                        
                                    </div>
                                      <Desktop />
                                        </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog visible={visible} modal={true} header={headerElement1} footer={footerContent1} className={`${style.modal} custom-modal`} onHide={handleClose}>
            <div className="d-flex flex-column">
            <form onSubmit={handleSubmit(onSubmit)} >
            <Row>
            <Col sm={6}>
                    
                    <div className="d-flex flex-column gap-1 mt-0">
                        <label className={clsx(style.lable)}>Location Name</label>
                        <IconField>
                            <InputIcon>{errors.lname?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("lname.title")} className={clsx(style.inputText, { [style.error]: errors.lname?.title })} placeholder='Enter Location name' />
                        </IconField>
                        {errors.lname?.title && <p className="error-message">{errors.lname?.title?.message}</p>}
                        </div>
                 
                </Col>
           
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-0 mb-0">
                        <label className={clsx(style.lable)}>Country</label>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        { value: 1, label: "Australia" },
                                     
                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(style.dropdownSelect, 'dropdown-height-fixed', { [style.error]: errors.category })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    placeholder="Select country"
                                />
                            )}
                        />
                        {errors.country && <p className="error-message">{errors.country.message}</p>}
                    </div>
                </Col>
            <Col sm={6}>
                   
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(style.lable)}>State</label>
                        <IconField>
                            <InputIcon>{errors.state?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("state.title")} className={clsx(style.inputText, { [style.error]: errors.state?.title })} placeholder='Enter state' />
                        </IconField>
                        {errors.state?.title && <p className="error-message">{errors.state?.title?.message}</p>}
                        </div>
               
                </Col>
            <Col sm={6}>
                   
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(style.lable)}>City</label>
                        <IconField>
                            <InputIcon>{errors.city?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("city.title")} className={clsx(style.inputText, { [style.error]: errors.city?.title })} placeholder='Enter city' />
                        </IconField>
                        {errors.city?.title && <p className="error-message">{errors.city?.title?.message}</p>}
                        </div>
               
                </Col>
            <Col sm={6}>
                   
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(style.lable)}>Street Address</label>
                        <IconField>
                            <InputIcon>{errors.streetaddress?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("streetaddress.title")} className={clsx(style.inputText, { [style.error]: errors.streetaddress?.title })} placeholder='Enter main address' />
                        </IconField>
                        {errors.streetaddress?.title && <p className="error-message">{errors.streetaddress?.title?.message}</p>}
                        </div>
               
                </Col>
            <Col sm={6}>
                   
                    <div className="d-flex flex-column gap-1 mt-4">
                        <label className={clsx(style.lable)}>Postcode</label>
                        <IconField>
                            <InputIcon>{errors.postcode?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("postcode.title")} className={clsx(style.inputText, { [style.error]: errors.postcode?.title })} placeholder='Enter postcode' />
                        </IconField>
                        {errors.postcode?.title && <p className="error-message">{errors.postcode?.title?.message}</p>}
                        </div>
               
                </Col>
            </Row>
            </form>
            </div>
        </Dialog>
        </>
    );
}

export default Headquarter;
