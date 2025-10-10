import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useGlobalSearch } from '../../../hooks/useGlobalSearch';
import { 
    formatProjectResult, 
    formatClientResult, 
    formatJobResult,
    formatTaskResult,
    formatInvoiceResult,
    formatSupplierResult,
    formatExpenseResult,
    formatSearchMetadata 
} from '../../../utils/search-formatters';
import style from '../header.module.scss';
import searchStyle from './global-search.module.scss';
import ImageAvatar from '../../image-with-fallback/image-avatar';

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const {
        inputValue,
        setInputValue,
        debouncedValue,
        searchResults,
        loading,
        clearSearch
    } = useGlobalSearch();

    // Restore search term from session storage on mount
    useEffect(() => {
        const savedSearchTerm = sessionStorage.getItem('globalSearchTerm');
        if (savedSearchTerm && !inputValue) {
            setInputValue(savedSearchTerm);
            // Clear it so it doesn't persist across app sessions
            sessionStorage.removeItem('globalSearchTerm');
        }
    }, [inputValue, setInputValue]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle escape key to close and arrow key navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                return;
            }
            
            // Add keyboard navigation for search results
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                // Future enhancement: implement result navigation
                console.log('Arrow key navigation - to be implemented');
            }
            
            if (event.key === 'Enter' && isOpen) {
                // Future enhancement: select highlighted result
                console.log('Enter key selection - to be implemented');
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Handle search icon click
    const handleSearchClick = () => {
        setIsOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    // Handle item selection
    const handleSelectItem = (item, type) => {
        console.log('Navigating to:', type, item);
        setIsOpen(false);
        
        // Store search term in session storage for potential back navigation
        if (debouncedValue) {
            sessionStorage.setItem('globalSearchTerm', debouncedValue);
        }
        
        clearSearch();
        
        // Navigate to appropriate page with specific targeting
        switch(type) {
            case 'project':
                // For projects, use query parameters if available for precise navigation
                if (item.unique_id && item.reference && item.number) {
                    console.log('Navigating to specific project');
                    navigate(`/management?unique_id=${item.unique_id}&reference=${encodeURIComponent(item.reference)}&number=${encodeURIComponent(item.number)}&value=${item.id}`);
                } else {
                    console.log('Navigating to management page');
                    navigate('/management');
                }
                break;
            case 'client':
                console.log('Navigating to client page:', `/clients/${item.id}/order-history`);
                navigate(`/clients/${item.id}/order-history`);
                break;
            case 'job':
                console.log('Navigating to jobs page');
                // Navigate with job ID as state for potential highlighting
                navigate('/jobs', { state: { highlightJobId: item.id } });
                break;
            case 'task':
                console.log('Navigating to tasks page');
                // Navigate with task ID as state for potential highlighting
                navigate('/tasks', { state: { highlightTaskId: item.id } });
                break;
            case 'invoice':
                console.log('Navigating to invoices page');
                // Navigate with invoice ID as state for potential highlighting
                navigate('/invoices', { state: { highlightInvoiceId: item.id } });
                break;
            case 'supplier':
                console.log('Navigating to supplier history page:', `/suppliers/${item.id}/history`);
                // Navigate to supplier history page (matches existing supplier table navigation)
                navigate(`/suppliers/${item.id}/history`);
                break;
            case 'expense':
                console.log('Navigating to expenses page');
                // Navigate with expense ID as state for potential highlighting
                navigate('/expenses', { state: { highlightExpenseId: item.id } });
                break;
            default:
                console.log('Unknown type:', type);
        }
    };

    // Handle clear search
    const handleClear = () => {
        clearSearch();
        inputRef.current?.focus();
    };

    return (
        <div className={searchStyle.globalSearchContainer} ref={searchRef}>
            <li className={style.navbarActionIcon} onClick={handleSearchClick}>
                <Search color="#ccc" size={20} />
            </li>

            {isOpen && (
                <div className={searchStyle.searchDropdown}>
                    <div className={searchStyle.searchInputContainer}>
                        <Search className={searchStyle.searchIcon} size={16} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search projects, clients, expenses..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className={searchStyle.searchInput}
                        />
                        {inputValue && (
                            <button onClick={handleClear} className={searchStyle.clearButton}>
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className={searchStyle.searchResults}>
                        {loading ? (
                            <div className={searchStyle.loadingContainer}>
                                <ProgressSpinner style={{ width: "20px", height: "20px" }} />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            <>
                                {debouncedValue.length < 2 ? (
                                    <div className={searchStyle.emptyState}>
                                        <Search size={24} color="#ccc" />
                                        <p>Type at least 2 characters to search</p>
                                    </div>
                                ) : searchResults.total === 0 ? (
                                    <div className={searchStyle.emptyState}>
                                        <Search size={24} color="#ccc" />
                                        <p>No results found for "{debouncedValue}"</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Projects Section */}
                                        {searchResults.projects.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Projects ({searchResults.projects.length})
                                                </h6>
                                                {searchResults.projects.map((project) => {
                                                    const formatted = formatProjectResult(project);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`project-${project.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(project, 'project')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.projectIcon}>P</div>
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {formatted.status && (
                                                                <div className={searchStyle.resultBadge}>
                                                                    {formatted.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Clients Section */}
                                        {searchResults.clients.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Clients ({searchResults.clients.length})
                                                </h6>
                                                {searchResults.clients.map((client) => {
                                                    const formatted = formatClientResult(client);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`client-${client.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(client, 'client')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <ImageAvatar 
                                                                    photo={formatted.photo}
                                                                    has_photo={formatted.has_photo}
                                                                    is_business={formatted.is_business}
                                                                    size={16}
                                                                />
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={searchStyle.resultBadge}>
                                                                {formatted.type}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Jobs Section */}
                                        {searchResults.jobs && searchResults.jobs.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Jobs ({searchResults.jobs.length})
                                                </h6>
                                                {searchResults.jobs.map((job) => {
                                                    const formatted = formatJobResult(job);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`job-${job.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(job, 'job')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.jobIcon}>J</div>
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {formatted.status && (
                                                                <div className={searchStyle.resultBadge}>
                                                                    {formatted.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Tasks Section */}
                                        {searchResults.tasks && searchResults.tasks.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Tasks ({searchResults.tasks.length})
                                                </h6>
                                                {searchResults.tasks.map((task) => {
                                                    const formatted = formatTaskResult(task);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`task-${task.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(task, 'task')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.taskIcon}>T</div>
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {formatted.status && (
                                                                <div className={searchStyle.resultBadge}>
                                                                    {formatted.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Invoices Section */}
                                        {searchResults.invoices && searchResults.invoices.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Invoices ({searchResults.invoices.length})
                                                </h6>
                                                {searchResults.invoices.map((invoice) => {
                                                    const formatted = formatInvoiceResult(invoice);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`invoice-${invoice.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(invoice, 'invoice')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.invoiceIcon}>I</div>
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {formatted.status && (
                                                                <div className={searchStyle.resultBadge}>
                                                                    {formatted.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Suppliers Section */}
                                        {searchResults.suppliers && searchResults.suppliers.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Suppliers ({searchResults.suppliers.length})
                                                </h6>
                                                {searchResults.suppliers.map((supplier) => {
                                                    const formatted = formatSupplierResult(supplier);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`supplier-${supplier.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(supplier, 'supplier')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.supplierIcon}>S</div>
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={searchStyle.resultBadge}>
                                                                {formatted.type}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Expenses Section */}
                                        {searchResults.expenses && searchResults.expenses.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Expenses ({searchResults.expenses.length})
                                                </h6>
                                                {searchResults.expenses.map((expense) => {
                                                    const formatted = formatExpenseResult(expense);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    
                                                    return (
                                                        <div
                                                            key={`expense-${expense.id}`}
                                                            className={searchStyle.resultItem}
                                                            onClick={() => handleSelectItem(expense, 'expense')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.expenseIcon}>E</div>
                                                            </div>
                                                            <div className={searchStyle.resultContent}>
                                                                <div className={searchStyle.resultTitle}>
                                                                    {formatted.title}
                                                                </div>
                                                                <div className={searchStyle.resultSubtitle}>
                                                                    {formatted.subtitle}
                                                                </div>
                                                                {metadata.length > 0 && (
                                                                    <div className={searchStyle.resultMeta}>
                                                                        {metadata.map((meta, index) => (
                                                                            <span key={index}>{meta}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {formatted.status && (
                                                                <div className={searchStyle.resultBadge}>
                                                                    {formatted.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;