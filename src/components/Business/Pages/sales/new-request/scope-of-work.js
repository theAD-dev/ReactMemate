import React, { useContext, useState } from 'react';
import { CardList, ChevronLeft, InfoSquare, Person, FileText, FileImage, FileCode, FilePdf, FileWord, CloudUpload, Upload, Trash } from 'react-bootstrap-icons';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { v4 as uuidv4 } from 'uuid';
import { ClientContext } from './client-provider';

const schema = yup
    .object({
        reference: yup.string().required("Project reference is required"),
        requirements: yup.string().required("Description is required"),
    })
    .required();

const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FilePdf color="#000000" width={20} height={20} />;
    if (fileType.includes('image')) return <FileImage color="#000000" width={20} height={20} />;
    if (fileType.includes('text')) return <FileText color="#000000" width={20} height={20} />;
    if (fileType.includes('word')) return <FileWord color="#000000" width={20} height={20} />;
    if (fileType.includes('code')) return <FileCode color="#000000" width={20} height={20} />;
    return <FileText color="#000000" size={20} />; // Default icon
};

const ScopeOfWorkComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    let quoteFormData = {};
    try {
        const storedData = window.sessionStorage.getItem(`formData-${id}`);
        if (storedData) {
            quoteFormData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Failed to parse form data from sessionStorage', error);
    }
    const [files, setFiles] = useState([]);
    const [defaultValues, setDefaultValues] = useState({
        reference: quoteFormData.reference || "",
        requirements: quoteFormData.requirements || ""
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = (data) => {
        const formObject = {
            reference: data.reference,
            requirements: data.requirements,
            files: files.map(file => file.file)
        };
        console.log('formObject: ', formObject);
        window.sessionStorage.setItem(`formData-${id}`, JSON.stringify(formObject));
        navigate(`/sales/quote-calculation/client/${id}`);
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            id: uuidv4(),
            file,
            type: file.type,
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleRemoveFile = (id) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="newQuotePage existingClients borderSkyColor">
                <div style={{ height: 'calc(100vh - 249px)' }}>
                    <div className="newQuoteBack">
                        <NavLink to={""}>
                            <button onClick={() => { navigate(-1) }}>
                                <ChevronLeft color="#000000" size={20} /> &nbsp;&nbsp;Go Back
                            </button>
                        </NavLink>
                    </div>
                    <div className="newQuoteContent h-100">
                        <div className='navStepClient'>
                            <ul>
                                <li><span><Person color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
                                <li><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
                                <li className='activeClientTab'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
                            </ul>
                        </div>
                        <div className='individual height'>
                            <div className='formgroupboxs' style={{ paddingTop: '32px' }}>
                                <Row className='text-left'>
                                    <Col sm={12}>
                                        <div className="formgroup mb-3 mt-0">
                                            <label>Project Reference </label>
                                            <div className={`inputInfo ${errors.reference ? 'error-border' : ''}`}>
                                                <input {...register("reference")} placeholder='Add Reference for your Project' />
                                                {errors.reference && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.reference && <p className="error-message">{errors.reference.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="formgroup mb-2 mt-0">
                                            <label>Describe requirements for the order below <br />
                                                <small style={{ color: '#475467', fontWeight: 400 }}>Use for organisation. Not customer-facing.</small>
                                            </label>
                                            <div style={{ position: 'relative' }} className={`inputInfo textarea ${errors.requirements ? 'error-border' : ''}`}>
                                                <textarea {...register("requirements")} placeholder='Enter a description...' />
                                                {errors.requirements && <img className="ExclamationCircle" style={{ position: 'absolute', right: '10px', bottom: '10px' }} src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.requirements && <p className="error-message">{errors.requirements.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="formgroup mb-3 mt-0">
                                            <label style={{ fontWeight: 'normal' }}>Only for internal use.</label>
                                            <div className="custom-file-upload" style={{ marginTop: '10px' }}>
                                                <label htmlFor="file-upload" className="custom-upload-btn" style={{ border: "1px solid var(--Gray-300, #D0D5DD)", borderRadius: '4px', padding: '8px 14px' }}>
                                                    Attach Files &nbsp;<Upload color="#1D2939" width={20} height={20} />
                                                </label>
                                                <input id="file-upload" type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        {files.length > 0 && (
                                            <div className="uploaded-files pb-5">
                                                <ul>
                                                    {files.map(file => (
                                                        <li key={file.id} className='ps-0'>
                                                            {getFileIcon(file.type)}
                                                            <span className='text-lowercase'>{file.file.name}</span>
                                                            <Trash color="#98A2B3" style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={() => handleRemoveFile(file.id)} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className='individual bottomBox justify-content-between'>
                            <Link to={""} onClick={() => { navigate(-1) }}>
                                <button type="button" className="cancel-button border-0 text-danger">
                                    Cancel
                                </button>
                            </Link>

                            <div className='d-flex' style={{ gap: '12px' }}>
                                <button type="button" className="cancel-button">
                                    Save Draft
                                </button>

                                <button type="submit" className="submit-button">
                                    Calculate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ScopeOfWorkComponent;
