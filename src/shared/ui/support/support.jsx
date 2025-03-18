import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import styles from './support.module.scss';

const Support = ({  visible, setVisible }) => {
    const [type, setType] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState('');

    const types = [
        { label: 'Report an issue', value: 'bug' },
        { label: 'Suggest an idea', value: 'suggestion' },
        { label: 'Other', value: 'other' }
    ];

    const headerElement = (
        <div className="d-flex flex-column">
            <h4 style={{ color: '#158ecc', fontWeight: 700 }}>Send us some feedback</h4>
            <small className='font-16' style={{ color: '#3d3d4e' }}>Do you have a suggestion or found some bug? Let us know in the field below.</small>
        </div>
    );

    const handleSubmit = () => {
        console.log({ type, subject, description });
        setVisible(false);
    };

    return (
        <Dialog header={headerElement} headerStyle={{ background: '#f2f2f2' }} visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}
            style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="type">Type</label>
                    <Dropdown id="type" value={type} options={types} onChange={(e) => setType(e.value)} placeholder="Select a type" />
                </div>
                <div className={styles.field}>
                    <label htmlFor="subject">Subject</label>
                    <InputText id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className='border'/>
                </div>
                <div className={styles.field}>
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" placeholder='Describe your issue or idea...' value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className='border'/>
                </div>
                <div className={styles.field}>
                    <Button label="Send Feedback" className='rounded py-3' icon="pi pi-check" onClick={handleSubmit} />
                </div>
            </div>
        </Dialog>
    );
};

export default Support;