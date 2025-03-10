import React, { useEffect, useRef, useState } from 'react';
import { Col, Placeholder, Row } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import { Dropdown } from 'primereact/dropdown';
import { useDebounce } from 'primereact/hooks';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { toast } from 'sonner';
import { getClientById, getListOfClients } from '../../../../../../APIs/ClientsApi';
import ImageAvatar from '../../../../../../ui/image-with-fallback/image-avatar';

const QuoteToBusiness = ({ isLoading, data, setPayload }) => {
    const [selectClient, setSelectClient] = useState(null);
    const [selectContact, setSelectContact] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const observerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const limit = 25;

    const mainAddress = data.addresses.find(address => address.is_main) || (data.addresses?.length ? data.addresses[0] : {});
    const mainContact = data.contact_persons.find(contact => contact.is_main) || (data.contact_persons?.length ? data.contact_persons[0] : {});

    const clientQuery = useQuery({
        queryKey: ['id', selectClient],
        queryFn: () => getClientById(selectClient),
        enabled: !!selectClient,
        retry: 1,
    });

    const contactOptions = clientQuery.data?.contact_persons || [];

    useEffect(() => {
        setPage(1);
    }, [debouncedValue]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await getListOfClients(page, limit, debouncedValue);
            if (page === 1) setClients(data.results);
            else {
                if (data?.results?.length > 0) {
                    setClients(prev => {
                        const existingClientIds = new Set(prev.map(client => client.id));
                        const newClients = data.results.filter(client => !existingClientIds.has(client.id));
                        return [...prev, ...newClients];
                    });
                }
            }
            setHasMoreData(data.count !== clients.length);
            setLoading(false);
        };

        loadData();
    }, [page, debouncedValue]);

    // Wait for the dropdown to render its items
    const setupObserver = () => {
        const lastRow = document.querySelector('.p-dropdown-items .p-dropdown-item:last-child');

        if (lastRow && !observerRef.current) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    setPage(prevPage => prevPage + 1);
                }
            }, { threshold: 1.0 });
            observerRef.current.observe(lastRow);
        }
    };

    useEffect(() => {
        if (!isEdit || !clients.length || !hasMoreData || !dropdownRef.current) return;

        // Use a small delay or MutationObserver to ensure DOM is ready
        const timeout = setTimeout(setupObserver, 100);

        return () => {
            clearTimeout(timeout);
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [clients, hasMoreData, isEdit]);

    const filterTemplate = () => {
        return (
            <IconField iconPosition="left">
                <InputIcon><Search className='mb-2' /></InputIcon>
                <InputText
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="p-inputtext p-component"
                    placeholder="Search clients"
                    style={{ width: '100%' }}

                />
            </IconField>
        );
    };

    const handleChangeSave = () => {
        if (!selectClient || !selectContact) return toast.error('Please select a client and contact person');
        setPayload((prev) => ({ ...prev, client: selectClient, contact_person: selectContact }));
        setIsEdit(false);
    };

    const clientOptionTemplate = (option) => {
        return (
            <div className="d-flex align-items-center gap-1">
                <ImageAvatar has_photo={option.has_photo} photo={option.photo} is_business={option.is_business} />
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedOptionTemplate = (option) => {
        if (option?.name) {
            return (
                <div className="d-flex align-items-center gap-1">
                    <ImageAvatar has_photo={option?.has_photo} photo={option?.photo} is_business={option?.is_business} />
                    <div>{option?.name}</div>
                </div>
            );
        }
    };

    return (
        <>
            <Row>
                {isEdit ? (
                    <>
                        <Col sm={6} style={{ minHeight: '190px' }}>
                            <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Company</p>
                            <Dropdown
                                ref={dropdownRef}
                                value={selectClient}
                                loading={loading}
                                onChange={(e) => setSelectClient(e.value)}
                                options={clients}
                                itemTemplate={clientOptionTemplate}
                                valueTemplate={selectClient && selectedOptionTemplate}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select client"
                                filter
                                filterTemplate={filterTemplate}
                                virtualScrollerOptions={{ itemSize: 38, lazy: true, onLazyLoad: setupObserver }}
                                className="w-100"
                            />
                        </Col>
                        <Col sm={6} style={{ minHeight: '190px' }}>
                            <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Main Contact</p>
                            <Dropdown
                                value={selectContact}
                                onChange={(e) => setSelectContact(e.value)}
                                options={contactOptions}
                                optionLabel={(option) => `${option.firstname} ${option.lastname}`}
                                optionValue='id'
                                placeholder="Select contact"
                                filter
                                loading={clientQuery.isLoading}
                                className="w-100"
                            />
                        </Col>
                    </>
                ) : (
                    <>
                        <Col sm={6}>
                            {isLoading ? (
                                <>
                                    <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                        <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '100%', height: '12px' }} />
                                    </Placeholder>
                                    <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                        <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '100%', height: '12px' }} />
                                    </Placeholder>
                                    <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                        <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '100%', height: '12px' }} />
                                    </Placeholder>
                                    <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                        <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '100%', height: '12px' }} />
                                    </Placeholder>
                                    <Placeholder as="p" animation="wave" className="mb-1 mt-0">
                                        <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '100%', height: '12px' }} />
                                    </Placeholder>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Company</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{data?.name || '-'}</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>ABN: {data?.abn || '-'}</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{data?.phone || '-'}</p>
                                    <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>{mainAddress?.address || '-'}</p>
                                </>
                            )}
                        </Col>
                        <Col sm={6}>
                            <p style={{ color: '#667085', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Main Contact</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{`${mainContact?.firstname || '-'} ${mainContact?.lastname || '-'}`}</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{mainContact?.position || '-'}</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{mainContact?.phone || '-'}</p>
                            <p style={{ color: '#1D2939', fontSize: '16px', fontWeight: '400', marginBottom: '4px' }}>{mainContact?.email || '-'}</p>
                        </Col>
                    </>
                )}

                <Col sm={12}>
                    {isEdit ? (
                        <div className="d-flex">
                            <button onClick={handleChangeSave} className="btn py-0" style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>
                                Save
                            </button>
                            <button onClick={() => setIsEdit(!isEdit)} className="btn py-0" style={{ color: '#B42318', fontSize: '14px', fontWeight: '600' }}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEdit(!isEdit)} className="btn p-0" style={{ color: '#158ECC', fontSize: '14px', fontWeight: '600' }}>
                            Edit info
                        </button>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default QuoteToBusiness;