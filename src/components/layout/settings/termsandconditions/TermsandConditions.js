import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { PencilSquare } from "react-bootstrap-icons";
import style from './terms-.module.scss';
import { Button, Col, Row } from 'react-bootstrap';
import clsx from 'clsx';
import { getInvoiceTermsapp, updateTermsapp } from "../../../../APIs/terms-and-condition";
import { Editor } from "primereact/editor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from 'sonner';
import { Placeholder } from "react-bootstrap";

const TermsandConditions = () => {
    const [activeTab, setActiveTab] = useState('terms-and-conditions');
    const [edit, setEdit] = useState(false);
    const [terms, setTerms] = useState('');
    console.log('terms: ', terms);
    const [isLoading, setIsLoading] = useState(false);

    // Fetching terms data
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getInvoiceTermsapp();
            setTerms(data);  // Assuming 'data' is a string
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    // UseEffect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const updateMutation = useMutation({
        mutationFn: (data) => updateTermsapp(data),
        onSuccess: async () => {
            toast.success('Terms have been successfully updated.');
            await fetchData();
            setEdit(false);
        },
        onError: (error) => {
            console.error('Error updating terms:', error);
            toast.error('Failed to update the terms. Please try again.');
        }
    });

    const handleEditClick = () => setEdit(true);

    const handleSaveClick = () => {
        updateMutation.mutate(terms); 
    };

    const handleCancelClick = () => setEdit(false);

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky'>
                        <h1>Terms and Conditions</h1>
                        <div className='contentMenuTab'>
                            <ul>
                                <li className='menuActive'>
                                    <Link to="/settings/termsandconditions/terms-and-conditions">Terms and Conditions Application</Link>
                                </li>
                                <li>
                                    <Link to="/settings/termsandconditions/terms-and-conditions-invoice">Terms and Conditions Invoice</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="content_wrap_main">
                        <div className='content_wrapper'>
                            <div className="listwrapper">
                                <div className={`topHeadStyle pb-4 ${style.topHeadStyle}`}>
                                    <div>
                                        <h2>Terms and Conditions for Application</h2>
                                        <p>Please fill in your company Terms and Conditions for Subcontractors, which they will follow while using the MeMate Application.</p>
                                    </div>
                                    {!edit && (
                                        <button onClick={handleEditClick}>
                                            Edit &nbsp; <PencilSquare color="#344054" size={20} />
                                        </button>
                                    )}
                                </div>

                                <div>
                                    {isLoading ? (
                                          <Placeholder as="p" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                                          <Placeholder bg="secondary" size='md' style={{ width: '100%' }} />
                                        </Placeholder>
                                   
                                    ) : edit ? (
                                        <>
                                            <Row className={style.qlEditorText}>
                                                <Col sm={12}>
                                                    <div className="d-flex flex-column gap-1" style={{ position: 'relative' }}>
                                                        <label className={clsx(style.label)}>Message</label>
                                                        <Editor 
                                                            value={terms.terms_invoice} 
                                                            onTextChange={(e) => setTerms(prevTerms => ({
                                                                ...prevTerms,
                                                                terms_invoice: e.htmlValue
                                                              }))}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className='d-flex justify-content-end mt-4'>
                                                <Button className='outline-button me-2' onClick={handleCancelClick}>
                                                    Cancel &nbsp; 
                                                </Button>
                                                <Button className='solid-button' onClick={handleSaveClick}>
                                                    Save &nbsp; 
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={style.editPara} dangerouslySetInnerHTML={{ __html: terms.terms_invoice
                                        }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsandConditions;
