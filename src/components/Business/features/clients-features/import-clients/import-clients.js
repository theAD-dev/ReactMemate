import React, { useCallback, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BuildingAdd, CheckCircle, CloudUpload, ExclamationTriangle, FileEarmarkSpreadsheet, PersonAdd, X, XCircle, Download } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import * as yup from 'yup';
import styles from './import-clients.module.scss';
import { importClients } from '../../../../../APIs/ClientsApi';

// Template columns for Business clients (matching business-form.js fields)
const BUSINESS_TEMPLATE_COLUMNS = [
    { key: 'name', label: 'Company Name', required: true },
    { key: 'abn', label: 'ABN', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'industry', label: 'Industry', required: false },
    { key: 'payment_terms', label: 'Payment Terms', required: false },
    { key: 'address_title', label: 'Address Title', required: false },
    { key: 'address_line', label: 'Address', required: false },
    { key: 'city', label: 'City/Suburb', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'postcode', label: 'Postcode', required: false },
    { key: 'country', label: 'Country', required: false },
    { key: 'contact_firstname', label: 'Contact First Name', required: false },
    { key: 'contact_lastname', label: 'Contact Last Name', required: false },
    { key: 'contact_email', label: 'Contact Email', required: false },
    { key: 'contact_phone', label: 'Contact Phone', required: false },
    { key: 'contact_position', label: 'Contact Position', required: false },
];

// Template columns for Individual clients (matching indivisual-form.js fields)
const INDIVIDUAL_TEMPLATE_COLUMNS = [
    { key: 'firstname', label: 'First Name', required: true },
    { key: 'lastname', label: 'Last Name', required: true },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'payment_terms', label: 'Payment Terms', required: false },
    { key: 'address_title', label: 'Address Title', required: false },
    { key: 'address_line', label: 'Address', required: false },
    { key: 'city', label: 'Suburb/City', required: false },
    { key: 'state', label: 'State', required: false },
    { key: 'postcode', label: 'Postcode', required: false },
    { key: 'country', label: 'Country', required: false },
];

// Yup validation schema for Business clients (matching business-form.js)
const businessValidationSchema = yup.object({
    name: yup.string().required('Company name is required'),
    abn: yup.string().nullable().transform((value) => (value === "" ? null : value)).matches(/^\d{11}$/, "ABN must be an 11-digit number").notRequired(),
    email: yup.string().nullable().transform((value) => (value === "" ? null : value)).matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").notRequired(),
    contact_email: yup.string().nullable().email('Invalid contact email format').notRequired(),
});

// Yup validation schema for Individual clients (matching indivisual-form.js)
const individualValidationSchema = yup.object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup.string().nullable().transform((value) => (value === "" ? null : value)).matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").notRequired(),
});

const ImportClients = ({ visible, setVisible, refetch }) => {
    const [step, setStep] = useState(1); // 1: Select type & method, 2: Upload file, 3: Map columns, 4: Preview & Import
    const [clientType, setClientType] = useState('business'); // 'business' or 'individual'
    const [useDefaultTemplate, setUseDefaultTemplate] = useState(null); // true: default template, false: custom file
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileData, setFileData] = useState({ headers: [], rows: [] });
    const [columnMappings, setColumnMappings] = useState({});
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    const TEMPLATE_COLUMNS = clientType === 'business' ? BUSINESS_TEMPLATE_COLUMNS : INDIVIDUAL_TEMPLATE_COLUMNS;
    const validationSchema = clientType === 'business' ? businessValidationSchema : individualValidationSchema;

    const resetState = () => {
        setStep(1);
        setClientType('business');
        setUseDefaultTemplate(null);
        setUploadedFile(null);
        setFileData({ headers: [], rows: [] });
        setColumnMappings({});
        setIsImporting(false);
        setImportResult(null);
        setValidationErrors([]);
    };

    const handleClose = () => {
        resetState();
        setVisible(false);
    };

    const parseExcelFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    if (jsonData.length < 2) {
                        reject(new Error('File must contain at least a header row and one data row'));
                        return;
                    }

                    const headers = jsonData[0].map((header, index) => ({
                        index,
                        name: String(header || `Column ${index + 1}`).trim()
                    }));
                    const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
                    
                    resolve({ headers, rows });
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    // Auto-map columns for default template
    const autoMapColumns = (headers) => {
        const autoMappings = {};
        TEMPLATE_COLUMNS.forEach(templateCol => {
            // Normalize strings for comparison - remove spaces, special chars, lowercase
            const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
            const templateLabelNormalized = normalizeString(templateCol.label);
            const templateKeyNormalized = normalizeString(templateCol.key);
            
            const matchingHeader = headers.find(h => {
                const headerNormalized = normalizeString(h.name);
                // Match by label or by key
                return headerNormalized === templateLabelNormalized || 
                       headerNormalized === templateKeyNormalized ||
                       // Also check if header contains the key words
                       headerNormalized.includes(templateKeyNormalized) ||
                       templateKeyNormalized.includes(headerNormalized);
            });
            
            if (matchingHeader) {
                autoMappings[templateCol.key] = matchingHeader.index;
            }
        });
        return autoMappings;
    };

    // Validate a single row
    const validateRow = async (row, rowIndex) => {
        try {
            await validationSchema.validate(row, { abortEarly: false });
            return null;
        } catch (err) {
            return {
                row: rowIndex + 1,
                errors: err.inner.map(e => e.message)
            };
        }
    };

    // Validate all rows
    const validateAllRows = async (mappedData) => {
        const errors = [];
        for (let i = 0; i < mappedData.length; i++) {
            const rowError = await validateRow(mappedData[i], i);
            if (rowError) {
                errors.push(rowError);
            }
        }
        return errors;
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        setUploadedFile(file);
        setValidationErrors([]);

        try {
            const parsed = await parseExcelFile(file);
            setFileData(parsed);

            if (useDefaultTemplate) {
                // Auto-map columns for default template
                const autoMappings = autoMapColumns(parsed.headers);
                setColumnMappings(autoMappings);
                setStep(4); // Skip to preview for default template
            } else {
                setStep(3); // Go to column mapping for custom file
            }
        } catch (error) {
            toast.error(error.message || 'Failed to parse file');
            setUploadedFile(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useDefaultTemplate, TEMPLATE_COLUMNS]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv']
        },
        maxFiles: 1,
        multiple: false
    });

    const handleColumnMapping = (templateKey, fileColumnIndex) => {
        setColumnMappings(prev => ({
            ...prev,
            [templateKey]: fileColumnIndex
        }));
    };

    const getMappedData = () => {
        return fileData.rows.map(row => {
            const mappedRow = { type: clientType };
            Object.entries(columnMappings).forEach(([templateKey, fileColumnIndex]) => {
                if (fileColumnIndex !== null && fileColumnIndex !== undefined && fileColumnIndex !== '') {
                    mappedRow[templateKey] = row[fileColumnIndex] || '';
                }
            });
            return mappedRow;
        });
    };

    const handleImport = async () => {
        const mappedData = getMappedData();
        
        if (mappedData.length === 0) {
            toast.error('No data to import');
            return;
        }

        // Check if required columns are mapped
        const missingRequired = TEMPLATE_COLUMNS
            .filter(col => col.required)
            .filter(col => columnMappings[col.key] === undefined || columnMappings[col.key] === '');
        
        if (missingRequired.length > 0) {
            toast.error(`Please map required column: ${missingRequired.map(c => c.label).join(', ')}`);
            return;
        }

        // Validate all rows using Yup schema
        const errors = await validateAllRows(mappedData);
        if (errors.length > 0) {
            setValidationErrors(errors);
            toast.error(`Validation failed for ${errors.length} row(s). Please fix the errors.`);
            return;
        }

        setIsImporting(true);

        try {
            const result = await importClients(mappedData);
            setImportResult(result);
            toast.success(`Successfully imported ${result.success || mappedData.length} clients`);
            
            if (refetch) {
                refetch(prev => !prev);
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error(error.message || 'Failed to import clients');
            setImportResult({ error: error.message || 'Import failed' });
        } finally {
            setIsImporting(false);
        }
    };

    const downloadDefaultTemplate = () => {
        const link = document.createElement('a');
        link.href = `/templates/clients-import-template-${clientType}.xls`;
        link.download = `clients-import-template-${clientType}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFooterContent = () => {
        if (step === 1) {
            return (
                <>
                    <Button type='button' onClick={handleClose} className='outline-button'>Cancel</Button>
                    <Button type='button' onClick={() => setStep(2)} className='solid-button' disabled={useDefaultTemplate === null}>Continue</Button>
                </>
            );
        }
        if (step === 2) {
            return (
                <Button type='button' onClick={() => { setStep(1); setUploadedFile(null); }} className='outline-button'>Back</Button>
            );
        }
        if (step === 3) {
            const requiredMapped = TEMPLATE_COLUMNS.filter(c => c.required).every(c => columnMappings[c.key] !== undefined && columnMappings[c.key] !== '');
            return (
                <>
                    <Button type='button' onClick={() => { setStep(2); setColumnMappings({}); setUploadedFile(null); }} className='outline-button'>Back</Button>
                    <Button type='button' onClick={() => { setValidationErrors([]); setStep(4); }} className='solid-button' disabled={!requiredMapped}>Preview Data</Button>
                </>
            );
        }
        if (step === 4) {
            if (importResult) {
                return <Button type='button' onClick={handleClose} className='solid-button'>Done</Button>;
            }
            return (
                <>
                    <Button type='button' onClick={() => { setStep(useDefaultTemplate ? 2 : 3); setValidationErrors([]); }} className='outline-button' disabled={isImporting}>Back</Button>
                    <Button type='button' onClick={handleImport} className='solid-button' disabled={isImporting || validationErrors.length > 0} style={{ minWidth: '140px' }}>
                        {isImporting ? 'Importing...' : `Import ${fileData.rows.length} Clients`}
                    </Button>
                </>
            );
        }
        return null;
    };

    const renderStep1 = () => (
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Select Client Type</h3>
            <p className={styles.stepDescription}>
                Choose the type of clients you want to import
            </p>

            <div className={styles.typeOptions}>
                <div 
                    className={clsx(styles.typeOption, { [styles.selected]: clientType === 'business' })}
                    onClick={() => setClientType('business')}
                >
                    <div className={styles.iconBox}>
                        <BuildingAdd size={24} color="#1AB2FF" />
                    </div>
                    <span className={styles.tabText}>Business</span>
                </div>
                <div 
                    className={clsx(styles.typeOption, { [styles.selected]: clientType === 'individual' })}
                    onClick={() => setClientType('individual')}
                >
                    <div className={styles.iconBox}>
                        <PersonAdd size={24} color="#1AB2FF" />
                    </div>
                    <span className={styles.tabText}>Individual</span>
                </div>
            </div>

            <h3 className={styles.stepTitle} style={{ marginTop: '24px' }}>Choose Import Method</h3>
            <p className={styles.stepDescription}>
                Select how you'd like to import your {clientType} clients
            </p>

            <div className={styles.methodOptions}>
                <div 
                    className={clsx(styles.methodCard, { [styles.selected]: useDefaultTemplate === true })}
                    onClick={() => setUseDefaultTemplate(true)}
                >
                    <div className={styles.radioCircle}>
                        {useDefaultTemplate === true && <div className={styles.radioInner} />}
                    </div>
                    <div className={styles.methodCardContent}>
                        <div className={styles.methodCardHeader}>
                            <FileEarmarkSpreadsheet size={20} color="#158ECC" />
                            <h4>Use Default Template</h4>
                        </div>
                        <p>Download our pre-formatted template for seamless import with auto column mapping</p>
                        {useDefaultTemplate === true && (
                            <Button 
                                className={styles.downloadBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadDefaultTemplate();
                                }}
                            >
                                <Download size={16} /> Download Template
                            </Button>
                        )}
                    </div>
                </div>

                <div 
                    className={clsx(styles.methodCard, { [styles.selected]: useDefaultTemplate === false })}
                    onClick={() => setUseDefaultTemplate(false)}
                >
                    <div className={styles.radioCircle}>
                        {useDefaultTemplate === false && <div className={styles.radioInner} />}
                    </div>
                    <div className={styles.methodCardContent}>
                        <div className={styles.methodCardHeader}>
                            <CloudUpload size={20} color="#475467" />
                            <h4>Use Custom File</h4>
                        </div>
                        <p>Upload your own file and manually map columns to our system fields</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Upload Your File</h3>
            <p className={styles.stepDescription}>
                {useDefaultTemplate 
                    ? 'Upload the filled template file' 
                    : 'Upload your Excel or CSV file with client data'}
            </p>

            <div 
                {...getRootProps()} 
                className={clsx(styles.dropzone, { [styles.active]: isDragActive })}
            >
                <input {...getInputProps()} />
                <CloudUpload size={48} color="#158ECC" />
                <p className={styles.dropzoneText}>
                    {isDragActive 
                        ? 'Drop the file here...' 
                        : 'Drag & drop your file here, or click to browse'}
                </p>
                <span className={styles.dropzoneHint}>
                    Supported formats: .xls, .xlsx, .csv
                </span>
            </div>

            {uploadedFile && (
                <div className={styles.uploadedFile}>
                    <FileEarmarkSpreadsheet size={24} color="#158ECC" />
                    <span>{uploadedFile.name}</span>
                    <button onClick={() => setUploadedFile(null)} className={styles.removeFile}>
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Map Your Columns</h3>
            <p className={styles.stepDescription}>
                Match your file columns to our system fields
            </p>

            <div className={styles.mappingContainer}>
                <div className={styles.mappingHeader}>
                    <span>SYSTEM FIELD</span>
                    <span>YOUR FILE COLUMN</span>
                </div>
                
                <div className={styles.mappingList}>
                    {TEMPLATE_COLUMNS.map((templateCol) => (
                        <div key={templateCol.key} className={styles.mappingRow}>
                            <div className={styles.systemField}>
                                <span>{templateCol.label}</span>
                                {templateCol.required && <span className={styles.required}>*</span>}
                            </div>
                            <Dropdown
                                value={columnMappings[templateCol.key] ?? ''}
                                options={[
                                    { label: 'Select column', value: '' },
                                    ...fileData.headers.map(h => ({
                                        label: h.name,
                                        value: h.index
                                    }))
                                ]}
                                onChange={(e) => handleColumnMapping(templateCol.key, e.value)}
                                placeholder="Select column"
                                className={clsx(styles.mappingDropdown, 'w-100')}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => {
        const previewData = getMappedData().slice(0, 5);
        const totalRows = fileData.rows.length;

        return (
            <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Preview & Import</h3>
                <p className={styles.stepDescription}>
                    Review the data before importing ({totalRows} records found)
                </p>

                {validationErrors.length > 0 && (
                    <div className={styles.validationErrors}>
                        <div className={styles.errorHeader}>
                            <ExclamationTriangle size={20} color="#B42318" />
                            <span>Validation Errors Found ({validationErrors.length} rows)</span>
                        </div>
                        <div className={styles.errorList}>
                            {validationErrors.slice(0, 5).map((err, idx) => (
                                <div key={idx} className={styles.errorRow}>
                                    <strong>Row {err.row}:</strong> {err.errors.join(', ')}
                                </div>
                            ))}
                            {validationErrors.length > 5 && (
                                <div className={styles.errorMore}>
                                    ... and {validationErrors.length - 5} more errors
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isImporting && !importResult && validationErrors.length === 0 && (
                    <>
                        <div className={styles.previewTable}>
                            <table>
                                <thead>
                                    <tr>
                                        {Object.entries(columnMappings)
                                            .filter(([, value]) => value !== '' && value !== undefined)
                                            .map(([key]) => {
                                                const col = TEMPLATE_COLUMNS.find(c => c.key === key);
                                                return <th key={key}>{col?.label || key}</th>;
                                            })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, index) => (
                                        <tr key={index}>
                                            {Object.entries(columnMappings)
                                                .filter(([, value]) => value !== '' && value !== undefined)
                                                .map(([key]) => (
                                                    <td key={key}>{row[key] || '-'}</td>
                                                ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalRows > 5 && (
                            <p className={styles.previewNote}>
                                Showing first 5 of {totalRows} records
                            </p>
                        )}
                    </>
                )}

                {isImporting && (
                    <div className={styles.importProgress}>
                        <div className={styles.spinner}>
                            <span className="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
                        </div>
                        <p>Importing clients...</p>
                    </div>
                )}

                {importResult && (
                    <div className={clsx(styles.importResult, { [styles.error]: importResult.error })}>
                        {importResult.error ? (
                            <>
                                <XCircle size={48} color="#B42318" />
                                <h4>Import Failed</h4>
                                <p>{importResult.error}</p>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={48} color="#17B26A" />
                                <h4>Import Successful</h4>
                                <p>{importResult.success || fileData.rows.length} clients have been imported</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };



    const renderStepIndicator = () => {
        const steps = useDefaultTemplate 
            ? [
                { num: 1, label: 'Setup' },
                { num: 2, label: 'Upload File' },
                { num: 4, label: 'Import' }
            ]
            : [
                { num: 1, label: 'Setup' },
                { num: 2, label: 'Upload File' },
                { num: 3, label: 'Map Columns' },
                { num: 4, label: 'Import' }
            ];

        return (
            <div className={styles.stepIndicator}>
                {steps.map((s, idx) => (
                    <div 
                        key={s.num} 
                        className={clsx(styles.step, { 
                            [styles.active]: step === s.num,
                            [styles.completed]: step > s.num
                        })}
                    >
                        <div className={styles.stepNumber}>
                            {step > s.num ? <CheckCircle size={16} /> : idx + 1}
                        </div>
                        <span className={styles.stepLabel}>{s.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Sidebar 
            visible={visible} 
            position="right" 
            onHide={handleClose} 
            modal={false} 
            dismissable={false} 
            style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.circledesignstyle}>
                                <div className={styles.out}>
                                    <FileEarmarkSpreadsheet size={24} color="#158ECC" />
                                </div>
                            </div>
                            <span style={{ color: '#344054', fontSize: '20px', fontWeight: 600 }}>Import Clients</span>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 72px - 45px)', overflow: 'auto' }}>
                        {renderStepIndicator()}
                        
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        {getFooterContent()}
                    </div>
                </div>
            )}
        />
    );
};

export default ImportClients;
