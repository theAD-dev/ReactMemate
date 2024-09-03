import React from 'react';
import { Sidebar } from 'primereact/sidebar';

const SupplierView = ({ visible, setVisible }) => {
    return (
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='supplier-view-details'>
                    <div className="d-flex flex-column">
                        
                    </div>
                </div>
            )}
        ></Sidebar>
    )
}

export default SupplierView