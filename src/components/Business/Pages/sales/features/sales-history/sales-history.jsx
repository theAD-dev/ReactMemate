import { useState, useEffect, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
    X,
    Envelope,
    Calendar,
    FileText,
    ChatDots,
    CardChecklist,
    Telephone,
    FileEarmark,
    PhoneVibrate,
    FolderSymlink,
    ListCheck,
    Link45deg,
    FilePdf,
    CurrencyDollar,
    PencilSquare,
    InfoCircle,
    Person,
    Clock,
    Files,
    Check2Circle,
    PlusSlashMinus,
    XCircle,
    CheckCircle
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import styles from './sales-history.module.scss';
import { getClientById } from '../../../../../../APIs/ClientsApi';
import { getEnquirySubmissionDetails } from '../../../../../../APIs/enquiries-api';
import { ProjectCardApi } from '../../../../../../APIs/management-api';
import { markWon, markLost, saleDuplicateData } from '../../../../../../APIs/SalesApi';
import { FallbackImage } from '../../../../../../shared/ui/image-with-fallback/image-avatar';
import ConfettiComponent from '../../../../../layout/ConfettiComponent';
import { BusinessViewSection } from '../../../../features/clients-features/business-client-view/business-client-view';
import { IndividualViewSection } from '../../../../features/clients-features/indivisual-client-view/indivisual-client-view';
import AddNote from '../../../management/project-card/add-note';
import ComposeEmail from '../../../management/project-card/compose-email/compose-email';
import FilesModel from '../../../management/project-card/files-management/files-model';
import NewTask from '../../../management/project-card/new-task';
import SendSMS from '../../../management/project-card/send-sms/send-sms';

const TABS = {
    QUOTE: 'quote',
    CUSTOMER_INFO: 'customer_info',
    ENQUIRY: 'enquiry'
};

const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dayOptions = { weekday: 'short' };
    const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
    const dayString = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateString = `${day}.${month}.${year}`;
    return `${timeString} | ${dayString} | ${dateString}`;
};

const formatFieldLabel = (key) => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getHistoryIcon = (type) => {
    switch (type) {
        case 'quote':
            return <FileEarmark size={16} color="#1AB2FF" />;
        case 'task':
            return <ListCheck size={16} color="#1AB2FF" />;
        case 'order':
            return <Check2Circle size={16} color="#1AB2FF" />;
        case 'note':
            return <CardChecklist size={16} color="#1AB2FF" />;
        case 'tag':
            return <ListCheck size={16} color="#1AB2FF" />;
        case 'invoice':
            return <FileText size={16} color="#1AB2FF" />;
        case 'billing':
            return <PhoneVibrate size={16} color="#1AB2FF" />;
        case 'email':
            return <Envelope size={16} color="#1AB2FF" />;
        case 'sms':
            return <ChatDots size={16} color="#1AB2FF" />;
        case 'job':
            return <Check2Circle size={16} color="#1AB2FF" />;
        case 'expense':
            return <FolderSymlink size={16} color="#1AB2FF" />;
        default:
            return <FileEarmark size={16} color="#1AB2FF" />;
    }
};

const getHistoryTypeName = (type) => {
    switch (type) {
        case 'quote': return 'Quote';
        case 'task': return 'Tasks';
        case 'order': return 'Order';
        case 'note': return 'Notes';
        case 'tag': return 'Tag';
        case 'invoice': return 'Invoice';
        case 'billing': return 'Billing';
        case 'email': return 'Email';
        case 'sms': return 'SMS';
        case 'job': return 'Job Created';
        case 'expense': return 'Expense Linked';
        default: return type?.charAt(0).toUpperCase() + type?.slice(1);
    }
};

const parseEmailData = (text) => {
    if (!text) return { subject: '', recipients: [], body: '' };
    const lines = text.split("\n");

    const subject = lines.find((line) => line.startsWith("Subject:"))?.replace("Subject: ", "") || "";

    const rawRecipients = lines.find((line) => line?.startsWith("Recipient(s):"))?.replace("Recipient(s): ", "") || "[]";
    let recipients = [];
    try {
        recipients = JSON.parse(rawRecipients?.replace(/'/g, '"'));
    } catch (e) {
        recipients = [];
    }

    const body = text.split("Body:")[1]?.trim() || "";

    return { subject, recipients, body };
};

const EmailComponent = ({ emailData }) => {
    const [showFullBody, setShowFullBody] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const emailBodyRef = useRef(null);
    const email = parseEmailData(emailData);

    useEffect(() => {
        if (emailBodyRef.current) {
            const bodyHeight = emailBodyRef.current.scrollHeight;
            setIsOverflowing(bodyHeight > 90);
        }
    }, [email.body]);

    return (
        <div className={styles.emailPreview}>
            <div className="d-flex gap-2 flex-wrap">
                <strong className="font-12">Subject:</strong>
                <span className="font-12">{email.subject}</span>
            </div>
            <div className="d-flex gap-2 flex-wrap">
                <strong className="font-12">Recipients:</strong>
                <span className="font-12">{email.recipients?.join(', ')}</span>
            </div>
            <div
                ref={emailBodyRef}
                className={styles.emailBody}
                style={{
                    maxHeight: showFullBody ? "none" : "87px",
                    overflowY: "hidden"
                }}
                dangerouslySetInnerHTML={{ __html: email.body }}
            />
            {isOverflowing && (
                <button
                    className="text-button font-12 px-0"
                    onClick={() => setShowFullBody(!showFullBody)}
                >
                    {showFullBody ? "Show Less" : "Load More"}
                </button>
            )}
        </div>
    );
};

const SalesHistory = ({ salesHistoryId, setSalesHistoryId, onRemoveRow, managers }) => {
    const [activeTab, setActiveTab] = useState(TABS.QUOTE);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isProcessingWon, setIsProcessingWon] = useState(false);
    const [isProcessingLost, setIsProcessingLost] = useState(false);
    const [isProcessingDuplicate, setIsProcessingDuplicate] = useState(false);

    const { data: cardData, isFetching, refetch } = useQuery({
        queryKey: ['project-card', salesHistoryId],
        queryFn: () => ProjectCardApi(salesHistoryId),
        enabled: !!salesHistoryId,
    });

    // Fetch enquiry submission details
    const { data: leadData, isFetching: leadFetching } = useQuery({
        queryKey: ['enquiry-submission-details', cardData?.enquiry_id],
        queryFn: () => getEnquirySubmissionDetails(cardData?.enquiry_id),
        enabled: !!cardData?.enquiry_id,
    });

    // Fetch client data once for all child components
    const clientQuery = useQuery({
        queryKey: ['getClientById', cardData?.client],
        queryFn: () => getClientById(cardData?.client),
        enabled: !!cardData?.client,
        retry: 1,
    });
    const client = clientQuery?.data || null;

    const projectId = salesHistoryId;
    const project = { value: salesHistoryId };
    const history = cardData?.history || [];
    const contactPersons = cardData?.contact_persons || [];

    const handleClose = () => {
        setSalesHistoryId(null);
    };

    const reInitialize = () => {
        refetch();
    };

    const projectCardData = () => {
        refetch();
    };

    const handleMarkWon = async () => {
        if (!salesHistoryId) return;
        setIsProcessingWon(true);
        try {
            const success = await markWon([salesHistoryId]);
            if (success?.length) {
                setShowConfetti(true);
                toast.success("Successfully moved to Management!");
                if (onRemoveRow) onRemoveRow();
                setTimeout(() => {
                    setShowConfetti(false);
                    handleClose();
                }, 2000);
            } else {
                toast.error("Failed to move to Management. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsProcessingWon(false);
        }
    };

    const handleDuplicate = async () => {
        if (!salesHistoryId) return;
        setIsProcessingDuplicate(true);
        try {
            const success = await saleDuplicateData(salesHistoryId);
            console.log('success: ', success);
            toast.success("Sale request has been duplicated!");
            if (onRemoveRow) onRemoveRow();
            handleClose();
        } catch (error) {
            toast.error("Failed to duplicate sale request. Please try again.");
        } finally {
            setIsProcessingDuplicate(false);
        }
    };

    const handleMarkLost = async () => {
        if (!salesHistoryId) return;
        setIsProcessingLost(true);
        try {
            const success = await markLost([salesHistoryId]);
            if (success?.length) {
                toast.success("Sale request has been marked as Lost!");
                if (onRemoveRow) onRemoveRow();
                handleClose();
            } else {
                toast.error("Failed to mark as Lost. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsProcessingLost(false);
        }
    };

    const renderHistoryItem = (item, index) => {
        const { id, type, text, title, created, manager, links } = item;

        return (
            <div className={styles.historyItem} key={`history-${id || index}`}>
                <div className={styles.historyHeader}>
                    <span className={styles.historyIcon}>
                        {getHistoryIcon(type)}
                    </span>
                    <span className={styles.historyType}>
                        {getHistoryTypeName(type)}
                    </span>
                    {(links?.quote_pdf || links?.invoice_pdf || (projectId && (title === "Quote Created" || title === "Invoice Created"))) && (
                        <div className={styles.historyLinks}>
                            {links?.quote_pdf && (
                                <Link to={links.quote_pdf} target="_blank">
                                    <FilePdf color="#F04438" size={14} />
                                </Link>
                            )}
                            {links?.invoice_pdf && (
                                <Link to={links.invoice_pdf} target="_blank">
                                    <FilePdf color="#F04438" size={14} />
                                </Link>
                            )}
                            {projectId && (title === "Quote Created" || title === "Invoice Created") && (
                                <Link to={title === "Quote Created" ? `/quote/${projectId}` : `/invoice/${projectId}`} target="_blank">
                                    <Link45deg color="#667085" size={16} />
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {title && <p className={styles.historySubtitle}>{title}</p>}
                {text && <p className={styles.historySubtitle}>{text}</p>}

                {type === "email" && text && (
                    <EmailComponent emailData={text} />
                )}

                <p className={styles.historyTimestamp}>
                    {formatTimestamp(+created)} by {manager}
                </p>
            </div>
        );
    };

    // Quote Tab - Matching Figma design
    const renderQuoteTab = () => (
        <div className={styles.quoteSection}>
            {isFetching ? (
                <div className={styles.loadingContainer}>
                    <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                </div>
            ) : (
                <>
                    <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>
                            <h4>
                                Reference
                                <InfoCircle size={14} color="#98A2B3" />
                            </h4>
                            <PencilSquare size={16} className={styles.editIcon} />
                        </div>
                        <p className={styles.sectionContent}>
                            {cardData?.reference || '-'}
                        </p>
                    </div>

                    <div className={styles.sectionBlock}>
                        <div className={styles.sectionTitle}>
                            <h4>Description</h4>
                            <PencilSquare size={16} className={styles.editIcon} />
                        </div>
                        <p className={styles.sectionContent}>
                            {cardData?.description || '-'}
                        </p>
                    </div>
                </>
            )}
        </div>
    );

    // Customer Info Tab - Matching Figma design exactly
    const renderCustomerInfoTab = () => (
        <div className={styles.customerInfoSection}>
            {clientQuery?.isFetching ? (
                <div className={styles.loadingContainer}>
                    <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                </div>
            ) : (
                <>
                    <div className="d-flex align-items-center gap-2">
                        <div className={styles.profileBox} style={client?.is_business ? { borderRadius: '4px' } : { borderRadius: '50%' }}>
                            <FallbackImage has_photo={client?.has_photo} photo={client.photo} is_business={client?.is_business} size={30} />
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            <span style={{ color: '344054', fontSize: '16px', fontWeight: 600 }}>{client.name}</span>
                            {client.deleted ? <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
                        </div>
                    </div>
                    <hr />
                    <div className='d-flex align-items-center justify-content-between'>
                        <h5 className={clsx(styles.boxLabel)}>Client Details</h5>
                        <h6 className={clsx(styles.boxLabel2)}>Client ID: {client?.number}</h6>
                    </div>
                    {
                        client?.is_business
                            ? <BusinessViewSection client={client} refetch={() => clientQuery?.refetch()} />
                            : <IndividualViewSection client={client} />
                    }
                </>
            )}
        </div>
    );

    // Enquiry Tab - Matching Figma design exactly
    const renderEnquiryTab = () => {
        return (
            <div className={styles.enquirySection}>
                { leadFetching ? (
                    <div className={styles.loadingContainer}>
                        <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                    </div>
                ) : leadData ? (
                    <div className={styles.leadInfoSection}>
                        {/* Two Column Info Grid */}
                        <div className={styles.infoGrid}>
                            {/* Row 1 */}
                            {leadData?.data?.name && (
                                <div className={styles.infoItem}>
                                    <Person size={16} color="#1AB2FF" />
                                    <span className={styles.infoLabel}>Name</span>
                                    <span className={clsx(styles.infoValue, styles.ellipsis)}>{leadData?.data?.name}</span>
                                </div>
                            )}
                            {leadData?.data?.date_field && (
                                <div className={styles.infoItem}>
                                    <Calendar size={16} color="#1AB2FF" />
                                    <span className={styles.infoLabel}>Date Field</span>
                                    <span className={clsx(styles.infoValue, styles.ellipsis)}>{leadData?.data?.date_field}</span>
                                </div>
                            )}

                            {/* Row 2 */}
                            {leadData?.data?.email && (
                                <div className={styles.infoItem}>
                                    <Envelope size={16} color="#1AB2FF" />
                                    <span className={styles.infoLabel}>Email</span>
                                    <span className={clsx(styles.infoValue, styles.ellipsis)}>{leadData?.data?.email}</span>
                                </div>
                            )}
                            {leadData?.data?.time_field && (
                                <div className={styles.infoItem}>
                                    <Clock size={16} color="#1AB2FF" />
                                    <span className={styles.infoLabel}>Time Field</span>
                                    <span className={clsx(styles.infoValue, styles.ellipsis)}>{leadData?.data?.time_field}</span>
                                </div>
                            )}

                            {/* Row 3 */}
                            {leadData?.data?.phone && (
                                <div className={styles.infoItem}>
                                    <Telephone size={16} color="#1AB2FF" />
                                    <span className={styles.infoLabel}>Phone</span>
                                    <span className={clsx(styles.infoValue, styles.ellipsis)}>{leadData?.data?.phone}</span>
                                </div>
                            )}
                            <div className={styles.infoItem}>
                                <FileText size={16} color="#1AB2FF" />
                                <span className={styles.infoLabel}>Form Type</span>
                                <span className={clsx(styles.infoValue, styles.ellipsis)}>
                                    {leadData?.form_type === 'web' ? 'Web' : 'Form'}
                                </span>
                            </div>
                        </div>

                        {/* Form Data Fields as bordered cards */}
                        <div className={styles.fieldCardsContainer}>
                            {leadData?.data && Object.entries(leadData?.data)
                                .filter(([key, value]) =>
                                    !['name', 'email', 'phone', 'date_field', 'time_field'].includes(key) &&
                                    value !== '' &&
                                    value !== null &&
                                    value !== undefined &&
                                    !(typeof value === 'object' && Object.keys(value).length === 0)
                                )
                                .map(([key, value]) => (
                                    <div key={key} className={styles.fieldCard}>
                                        <span className={styles.fieldLabel}>{formatFieldLabel(key)}</span>
                                        <span className={styles.fieldValue}>
                                            {typeof value === 'boolean'
                                                ? (value ? 'Yes' : 'No')
                                                : typeof value === 'object'
                                                    ? Array.isArray(value) ? value.join(', ') : JSON.stringify(value)
                                                    : value}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FileText size={24} color="#98A2B3" />
                        </div>
                        <p className={styles.emptyText}>No enquiry data available</p>
                        <p className={styles.emptySubtext}>
                            This quote may not have been created from an enquiry form.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case TABS.QUOTE:
                return renderQuoteTab();
            case TABS.CUSTOMER_INFO:
                return renderCustomerInfoTab();
            case TABS.ENQUIRY:
                return renderEnquiryTab();
            default:
                return renderQuoteTab();
        }
    };

    return (
        <>
            <ConfettiComponent active={showConfetti} config={{}} />
            <Modal
                show={!!salesHistoryId}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="projectCardModel"
                onHide={handleClose}
                animation={false}
                enforceFocus={false}
                size="xl"
                contentClassName={styles.modalContentClass}
            >
                <Modal.Header className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <CurrencyDollar size={24} color="#17B26A" />
                        </div>
                        <div className={styles.headerText}>
                            <h2 className={styles.headerTitle}>Quote Request</h2>
                            <p className={styles.headerSubtitle}>
                                {client?.name || 'Customer Name'}
                            </p>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        {cardData?.status !== 'qd' && (
                            <Link to={cardData?.quote_pdf || '#'} target="_blank" className={styles.headerIconButton}>
                                <FilePdf size={18} color="#F04438" />
                            </Link>
                        )}
                        {cardData?.status !== 'qd' && (
                            <Link to={`/quote/${projectId}`} target="_blank" className={styles.headerIconButton}>
                                <Link45deg size={18} color="#667085" />
                            </Link>
                        )}
                        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                            <X size={24} />
                        </button>
                    </div>
                </Modal.Header>

                <Modal.Body className="p-0">
                    <div className={styles.modalContent}>
                        <Row className="g-0 h-100">
                            <Col sm={6} className={styles.leftColumn}>
                                {/* Tabs - Matching Figma bordered style */}
                                <div className={styles.tabsContainer}>
                                    <ul className={styles.tabsList}>
                                        <li
                                            className={clsx(styles.tabItem, activeTab === TABS.QUOTE && styles.active)}
                                            onClick={() => setActiveTab(TABS.QUOTE)}
                                        >
                                            Quote
                                        </li>
                                        <li
                                            className={clsx(styles.tabItem, activeTab === TABS.CUSTOMER_INFO && styles.active)}
                                            onClick={() => setActiveTab(TABS.CUSTOMER_INFO)}
                                        >
                                            Customer Info
                                        </li>
                                        <li
                                            className={clsx(styles.tabItem, activeTab === TABS.ENQUIRY && styles.active)}
                                            onClick={() => setActiveTab(TABS.ENQUIRY)}
                                        >
                                            Enquiry
                                        </li>
                                    </ul>
                                </div>

                                <div className={styles.scrollContainer}>
                                    {renderTabContent()}
                                </div>
                            </Col>

                            <Col sm={6} className={styles.rightColumn}>
                                <div className={styles.actionsRow}>
                                    <AddNote projectId={projectId} projectCardData={projectCardData} />
                                    <NewTask project={project} reInitialize={reInitialize} projectCardData={projectCardData} />
                                    <SendSMS projectId={projectId} projectCardData={projectCardData} />
                                    <ComposeEmail projectId={projectId} projectCardData={projectCardData} contactPersons={contactPersons} />
                                </div>

                                <div className={styles.activitySection}>
                                    <div className={styles.historySectionHeader}>
                                        <h3>Project History</h3>
                                    </div>
                                    <div className={styles.activityScroll}>
                                        {isFetching ? (
                                            <div className={styles.skeletonContainer}>
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="d-flex flex-column mb-3">
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <div className={styles.skeletonCircle}></div>
                                                            <div className={styles.skeletonLineShort} style={{ width: '80px', marginBottom: 0 }}></div>
                                                        </div>
                                                        <div className={styles.skeletonLine} style={{ marginLeft: '24px', marginTop: '8px' }}></div>
                                                        <div className={styles.skeletonLineLong} style={{ marginLeft: '24px', width: '120px' }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : history?.length > 0 ? (
                                            <div className={styles.historyList}>
                                                {history.map(renderHistoryItem)}
                                            </div>
                                        ) : (
                                            <div className={styles.emptyState}>
                                                <div className={styles.emptyIcon}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 5V19M5 12H19" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p className={styles.emptyText}>No history available yet.</p>
                                                <p className={styles.emptySubtext}>
                                                    Activities like notes, tasks, emails, and SMS will appear here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>

                <Modal.Footer className={styles.modalFooter}>
                    <div className={styles.footerLeft}>
                        <div className={styles.assignedTo}>
                            <span className={styles.assignedLabel}>Assigned To</span>
                            {managers && managers.length > 0 ? (
                                <AvatarGroup className={styles.avatarGroup}>
                                    {managers.slice(0, 3).map((manager, index) => (
                                        <OverlayTrigger
                                            key={`${manager.id || manager.email}-${index}`}
                                            placement="top"
                                            overlay={
                                                <Tooltip id={`tooltip-${manager.id || index}`}>
                                                    {manager.full_name || `${manager.first_name || ''} ${manager.last_name || ''}`.trim()}
                                                </Tooltip>
                                            }
                                        >
                                            <Avatar
                                                shape="circle"
                                                image={manager.has_photo && manager.photo ? manager.photo : null}
                                                label={!manager.has_photo || !manager.photo ? (
                                                    <small>{manager.alias_name || (manager.full_name ? manager.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : '')}</small>
                                                ) : null}
                                                style={{ 
                                                    background: '#fff', 
                                                    border: '1px solid #dedede',
                                                    width: '32px',
                                                    height: '32px',
                                                    fontSize: '12px'
                                                }}
                                            />
                                        </OverlayTrigger>
                                    ))}
                                    {managers.length > 3 && (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-more">
                                                    {managers.slice(3).map(m => m.full_name || `${m.first_name || ''} ${m.last_name || ''}`.trim()).join(', ')}
                                                </Tooltip>
                                            }
                                        >
                                            <Avatar
                                                label={`+${managers.length - 3}`}
                                                shape="circle"
                                                style={{ 
                                                    background: '#f2f4f7', 
                                                    border: '1px solid #dedede',
                                                    width: '32px',
                                                    height: '32px',
                                                    fontSize: '12px',
                                                    color: '#344054'
                                                }}
                                            />
                                        </OverlayTrigger>
                                    )}
                                </AvatarGroup>
                            ) : (
                                <span className={styles.noManager}>—</span>
                            )}
                        </div>

                        <button
                            className={styles.footerActionButton}
                            onClick={handleDuplicate}
                            disabled={isProcessingDuplicate || isProcessingLost || isProcessingWon}
                        >
                            Duplicate
                            {
                                isProcessingDuplicate ? (
                                    <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="4" />
                                ) : (
                                    <Files size={16} />
                                )
                            }
                        </button>
                        <Link to={`/sales/quote-calculation/${projectId}`} target="_blank" className={styles.calculationButton}>
                            Calculation
                            <PlusSlashMinus color="#FDB022" size={16} />
                        </Link>
                        <FilesModel projectId={projectId} />
                    </div>

                    <div className={styles.footerRight}>
                        <button
                            className={styles.lostButton}
                            onClick={handleMarkLost}
                            disabled={isProcessingLost || isProcessingWon}
                        >
                            Lost
                            {isProcessingLost ? (
                                <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="4" />
                            ) : (
                                <XCircle size={16} />
                            )}
                        </button>
                        <button
                            className={styles.wonButton}
                            onClick={handleMarkWon}
                            disabled={isProcessingWon || isProcessingLost}
                        >
                            Won
                            {isProcessingWon ? (
                                <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="4" />
                            ) : (
                                <CheckCircle size={16} />
                            )}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SalesHistory;
