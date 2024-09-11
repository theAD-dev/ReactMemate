import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { PlusLg,PencilSquare} from "react-bootstrap-icons";
import style from './customer.module.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './industries-list';
import { useQuery } from '@tanstack/react-query';
import { getIndustriesList } from '../../../../APIs/industrieslist-api';


const Industries = () => {
    const [activeTab, setActiveTab] = useState('industries');
    const [industryName, setIndustryName] = useState("");
   
    const handleClose = (e) => {
        setVisible2(false);
        setVisible(false);
        
    }

    const { data: industriesList } = useQuery({
        queryKey: ['industriesList'],
        queryFn: getIndustriesList,
        enabled: true,
    });


    console.log('industriesList: ', industriesList);



    const [visible2, setVisible2] = useState(false);
    const [visible, setVisible] = useState(false);
    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PencilSquare size={24} color="#17B26A" className='mb-3' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                Edit Industries
                </span>
            </div>
        </div>
    );
    const headerElement1 = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PencilSquare size={24} color="#17B26A" className='mb-3' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                Create Industries
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={handleClose}>Cancel</Button>
            <Button className='solid-button' style={{ width: '132px' }}  >Save Details</Button>
        </div>
    );
    const footerContent1 = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={handleClose}>Cancel</Button>
            <Button className='solid-button' style={{ width: '132px' }} >Save Details</Button>
        </div>
    );

    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getProductsMini().then(data => setProducts(data));
    }, []);

    const editBody = () => {
        return <PencilSquare onClick={() => setVisible2(true)} style={{ cursor: 'pointer' }} size={24} color="#667085" className='mb-3' />
    }

    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Templates</h1>
                <div className='contentMenuTab'>
                <ul>
                <li className='menuActive'><Link to="/settings/customerssettings/industries">Industries</Link></li>
                <li><Link to="/settings/customerssettings/customers-discount-category">Customers Discount Category</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                        <h2>Industries</h2>
                        <Button label="Add New" onClick={() => setVisible(true)}> <PlusLg color="#000000" size={20} /></Button>
                    </div>
                    <DataTable value={industriesList} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Industry Name" style={{ width: '100%' }}></Column>
                    <Column field="edit" header="Edit" body={editBody} style={{ width: '56px' }} className='text-end'></Column>
                    </DataTable>



                    <div className="card flex justify-content-center">
                      
                        <Dialog visible={visible2} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
                        <div className="d-flex flex-column">
                        <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Industry name</p>
                       <InputText value={industryName} keyfilter={"alphanum"} placeholder='Agriculture' onChange={(e) => setIndustryName(e.target.value)} className={style.inputBox} />
                        </div>
                      </Dialog>


                        <Dialog visible={visible} modal={true} header={headerElement1} footer={footerContent1} className={`${style.modal} custom-modal`} onHide={handleClose}>
                        <div className="d-flex flex-column">
                        <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Industry name</p>
                       <InputText value={industryName} keyfilter={"alphanum"} placeholder='Agriculture' onChange={(e) => setIndustryName(e.target.value)} className={style.inputBox} />
                        </div>
                      </Dialog>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        
        </div>
          
        </>
    );
}

export default Industries;
