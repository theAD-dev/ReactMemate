import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { PlusLg } from "react-bootstrap-icons";
import style from './location.module.scss';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const ProductService = {
    getData() {
        return [
            {
                id: 1,
                streetaddress: "721 Broadway",
                city: "New York",
                postcode: 10003,
                state: "NYC",
                country: "USA",
                gmap: "Map",
                actions: "Edit",
            },
        ];
    }
};
                                          
const Headquarter = () => {
    const [activeTab, setActiveTab] = useState('headquarter');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); 

    const editTemplateHandle = () => {
        navigate("/settings/templates/edit-template/");
    };

    useEffect(() => {
        // Fetch the data using getData()
        const data = ProductService.getData();
        setProducts(data);
    }, []);

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Locations</h1>
                            <div className='contentMenuTab'>
                                <ul>
                                    <li className='menuActive'><Link to="/settings/location/headquarter">Headquarter</Link></li>
                                    <li><Link to="/settings/location/innovation-studio">Innovation Studio</Link></li>
                                    <li><Link to="/settings/location/creative-hub">Creative Hub</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className={`content_wrap_main`}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className="topHeadStyle pb-4">
                                        <h2>Headquarter</h2>
                                        <button onClick={editTemplateHandle}>Add New <PlusLg color="#000000" size={20} /></button>
                                    </div>
                                    <div className="card">
                                        <DataTable value={products} showGridlines tableStyle={{ minWidth: '50rem' }}>
                                        <Column field="streetaddress" header="Street address"></Column>
                                            <Column field="city" header="City/Suburb"></Column>
                                            <Column field="postcode" header="Post code"></Column>
                                            <Column field="state" header="State"></Column>
                                            <Column field="country" header="Country"></Column>
                                            <Column field="gmap" header="Google Maps"></Column>
                                            <Column field="actions" header="Actions"></Column>
                                           
                                        </DataTable>
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

export default Headquarter;
