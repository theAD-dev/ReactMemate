import { useState, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Placeholder } from "react-bootstrap";
import { BoxArrowUpRight, PencilSquare } from "react-bootstrap-icons";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import clsx from 'clsx';
import { Editor } from "primereact/editor";
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './terms-.module.scss';
import { getInvoiceTerms, updateTerms } from "../../../../APIs/terms-and-condition";
import { SunEditorComponent } from '../../../../shared/ui/editor';
import { renderHeader } from '../../../../shared/ui/editor/editor-header-template';

const TermsConditionsInvoice = () => {
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const orgId = profileData?.organization?.id;
    const has_work_subscription = !!profileData?.has_work_subscription;
    const [edit, setEdit] = useState(false);
    const [terms, setTerms] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // Fetching terms data
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getInvoiceTerms();
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
        mutationFn: (data) => updateTerms(data),
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
    const headerTemplate = renderHeader();

    return (
        <>
            <Helmet>
                <title>MeMate - Quote & Invoice Terms and Conditions</title>
            </Helmet>
            <div className="settings-content setModalelBoots w-100">
                <div className='headSticky'>
                    <h1>Terms and Conditions</h1>
                    <div className='contentMenuTab'>
                        <ul>
                            <li className='menuActive'>
                                <Link to="/settings/termsandconditions/terms-and-conditions-invoice">Quote & Invoice Terms and Conditions</Link>
                            </li>
                            {has_work_subscription && (
                                <li>
                                    <Link to="/settings/termsandconditions/terms-and-conditions">Application Terms and Conditions</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="content_wrap_main">
                    <div className='content_wrapper'>
                        <div className="listwrapper">
                            <div className={`topHeadStyle pb-4 flex-column ${style.topHeadStyle}`}>
                                <div className='w-100 d-flex gap-2 justify-content-end align-items-center'>
                                    {!edit && (
                                        <>
                                            <button onClick={handleEditClick} className='text-nowrap'>
                                                Edit &nbsp; <PencilSquare color="#344054" size={20} />
                                            </button>
                                            <Link to={`${process.env.REACT_APP_URL}/media/organization_${profileData?.organization?.id}/terms_and_conditions.pdf`} style={{ padding: '10px 18px' }} target='_blank'>
                                                Preview &nbsp; <BoxArrowUpRight color="#344054" size={20} />
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className='w-100 text-start'>
                                    <h2>Terms and Conditions for Quotes and Invoices</h2>
                                    <p>Use this section to display your Terms and Conditions on your Quote and Invoice PDFs.</p>
                                </div>
                            </div>
                            {/* 
                            <div>
                                {isLoading ? (
                                    <>
                                        <Placeholder as="h5" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                                            <Placeholder bg="secondary" size='md' style={{ width: '100%' }} />
                                        </Placeholder>

                                        <Placeholder as="p" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                                            <Placeholder bg="secondary" size='md' style={{ width: '100%', height: '300px' }} />
                                        </Placeholder>
                                    </>
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
                                                        style={{ minHeight: '320px', fontSize: "16px", color: '#475467' }}
                                                        headerTemplate={headerTemplate}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className='d-flex justify-content-end mt-4 mb-4'>
                                            <Button className='outline-button me-2' onClick={handleCancelClick}>
                                                Cancel
                                            </Button>
                                            <Button className='solid-button' disabled={updateMutation.isPending} onClick={handleSaveClick}>
                                                Save {updateMutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Editor readOnly showHeader={false} modules={{}}
                                        style={{ border: "none", fontSize: "16px", background: 'transparent', color: '#475467' }}
                                        value={terms.terms_invoice}
                                    />
                                )}
                            </div> 
                            */}
                            <div>
                                {isLoading ? (
                                    <>
                                        <Placeholder as="h5" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                                            <Placeholder bg="secondary" size='md' style={{ width: '100%' }} />
                                        </Placeholder>

                                        <Placeholder as="p" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                                            <Placeholder bg="secondary" size='md' style={{ width: '100%', height: '300px' }} />
                                        </Placeholder>
                                    </>
                                ) : (
                                    <>
                                        <Row className={clsx(style.qlEditorText, 'terms-conditions-editor')}>
                                            <Col sm={12}>
                                                <div className="d-flex flex-column gap-1" style={{ position: 'relative' }}>
                                                    {/* SunEditor in edit mode */}
                                                    {edit ? (
                                                        <SunEditorComponent
                                                            value={terms.terms_invoice || ''}
                                                            onChange={(content) => {
                                                                setTerms(prev => ({
                                                                    ...prev,
                                                                    terms_invoice: content
                                                                }));
                                                            }}
                                                            height={420}
                                                            placeholder="Enter terms and conditions..."
                                                            showTable={true}
                                                            showImage={true}
                                                            showLink={true}
                                                            showCodeView={true}
                                                            enableS3Upload={true}
                                                            uploadId={orgId}
                                                        />
                                                    ) : (
                                                        /* SunEditor in read-only preview mode */
                                                        <SunEditorComponent
                                                            value={terms.terms_invoice || ''}
                                                            readOnly={true}
                                                            hideToolbar={true}
                                                            height={420}
                                                        />
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Buttons only visible in edit mode */}
                                        {edit && (
                                            <div className='d-flex justify-content-end mt-4 mb-4'>
                                                <Button className='outline-button me-2' onClick={handleCancelClick}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className='solid-button'
                                                    disabled={updateMutation.isPending}
                                                    onClick={handleSaveClick}
                                                >
                                                    Save {updateMutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsConditionsInvoice;
