import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Building,PlusLg, Person ,Plus} from 'react-bootstrap-icons';
import style from './users.module.scss';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
export const ProductService = {
    getData() {
        return [
            {
                id: 1,
                name: "Bessie Cooper",
                email: "bessiecooper@gmail.com",
                phone: '(201) 555-0124',
                status: "Active",
                action: "Edit",
                photo:"https://dev.memate.com.au/media/user_13/cg0_cn.png",  
            },
         
        ];
    }
};
                                          
const MobileApp = () => {
    const [activeTab, setActiveTab] = useState('desktop');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const data = ProductService.getData();
        setProducts(data);
    }, []);

    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex justify-content-center align-items-center'><div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.userImg} ${data.is_business ? "" : "rounded-circle"}`}>
          {data.photo ? <img src={data.photo} alt='clientImg' className='w-100' /> : data.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
        </div>
        <div className='d-flex flex-column gap-1'>
          <div className={`${style.ellipsis}`}>{data.name}</div>
        </div></div>
        
      </div>
      }
      const StatusBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`styleGrey01  ${style.appstatus}`}>
            {data.status}  
            </div>
        </div>
    }
      const ActionBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`styleGrey01  ${style.appaction}`}>
            <Button>{data.action}  </Button>
            </div>
        </div>
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
                                <Button className={style.addUserBut}>Add <Plus size={20} color="#000" /></Button>
                            </div>
                           
                        </div>
                        <div className={`content_wrap_main ${style.contentwrapmain}`}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <div className={style.userHead}>
                                        <h2>Mobile App Users</h2>
                                        <p>Desktop Users  3 / 5 <span>Buy More</span></p>
                                        </div>
                                        <Button className={style.showDeleteBut}>Show Deleted</Button>
                                    </div>
                                        <DataTable value={products} showGridlines tableStyle={{ minWidth: '50rem' }}>
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
        </>
    );
}

export default MobileApp;