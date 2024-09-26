import { Building, Person } from 'react-bootstrap-icons';
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
                role: "Manager",
                privilege: "General Manager",
                photo:"https://dev.memate.com.au/media/user_13/cg0_cn.png",  
            },
            {
                id: 2,
                name: "John Smith",
                email: "bessiecooper@gmail.com",
                phone: '(201) 555-0124',
                role: "Finance",
                privilege: "Admin",
                photo:"https://dev.memate.com.au/media/user_13/cg0_cn.png", 
            },
        ];
    }
};
                                          
const Desktop = () => {

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
        <Button label="Edit" className='primary-text-button ms-3 show-on-hover-element not-show-checked' />
      </div>
      }
      const StatusBody = (data) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className={`styleGrey01  ${style.privilege}`}>
            {data.privilege}  
            </div>
        </div>
    }

    return (
        <>
        <div className={`settings-wrap ${style.userSettingPage}`}>
            <DataTable value={products} showGridlines tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" style={{ width: 'auto' }} body={nameBody} header="Name"></Column>
                <Column field="email" style={{ width: '267px' }} header="Email"></Column>
                <Column field="phone" style={{ width: '210px' }} header="Phone"></Column>
                <Column field="role" style={{ width: '210px' }} header="Role"></Column>
                <Column field="privilege" body={StatusBody} style={{ width: '147px' }} header="Privilege"></Column>
            </DataTable> 
            </div>
        </>
    );
}

export default Desktop;
