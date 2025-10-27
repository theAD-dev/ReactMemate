import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Folder } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useGlobalSearch } from '../../../hooks/use-global-search';
import { 
    formatProjectResult, 
    formatClientResult, 
    formatSupplierResult,
    formatSearchMetadata,
    getProjectStatusBadge
} from '../../../utils/search-formatters';
import style from '../header.module.scss';
import searchStyle from './global-search.module.scss';
import ImageAvatar from '../../image-with-fallback/image-avatar';

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const resultsContainerRef = useRef(null);
    const navigate = useNavigate();
    
    // Detect if user is on Mac for keyboard shortcut display
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const {
        inputValue,
        setInputValue,
        debouncedValue,
        searchResults,
        loading,
        clearSearch
    } = useGlobalSearch();

    // Global keyboard shortcut to open search (Cmd+/ or Ctrl+/)
    useEffect(() => {
        const handleGlobalKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === '/') {
                event.preventDefault();
                setIsOpen(true);
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    // Restore search term from session storage on mount
    useEffect(() => {
        const savedSearchTerm = sessionStorage.getItem('globalSearchTerm');
        if (savedSearchTerm && !inputValue) {
            setInputValue(savedSearchTerm);
            // Clear it so it doesn't persist across app sessions
            sessionStorage.removeItem('globalSearchTerm');
        }
    }, [inputValue, setInputValue]);

    // Handle item selection
    const handleSelectItem = useCallback((item, type) => {
        console.log('Navigating to:', type, item);
        setIsOpen(false);
        setSelectedIndex(-1);
        
        // Store search term in session storage for potential back navigation
        if (debouncedValue) {
            sessionStorage.setItem('globalSearchTerm', debouncedValue);
        }
        
        // Dispatch custom event before navigation to trigger modal opening on same page
        window.dispatchEvent(new CustomEvent('openSearchResult', { 
            detail: { 
                type: type,
                item: item
            } 
        }));
        
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
            case 'supplier':
                console.log('Navigating to supplier history page:', `/suppliers/${item.id}/history`);
                // Navigate to supplier history page (matches existing supplier table navigation)
                navigate(`/suppliers/${item.id}/history`);
                break;
            default:
                console.log('Unknown type:', type);
        }
    }, [debouncedValue, navigate]);

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

    // Reset selected index when search results change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [searchResults]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsContainerRef.current) {
            const selectedElement = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    // Handle escape key to close and arrow key navigation
    useEffect(() => {
        const getAllResults = () => {
            const results = [];
            if (debouncedValue.length >= 2) {
                if (searchResults.projects) {
                    searchResults.projects.forEach(item => results.push({ item, type: 'project' }));
                }
                if (searchResults.clients) {
                    searchResults.clients.forEach(item => results.push({ item, type: 'client' }));
                }
                if (searchResults.suppliers) {
                    searchResults.suppliers.forEach(item => results.push({ item, type: 'supplier' }));
                }
            }
            return results;
        };
        
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setSelectedIndex(-1);
                return;
            }
            
            const allResults = getAllResults();
            
            // Arrow key navigation for search results
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex(prev => 
                    prev < allResults.length - 1 ? prev + 1 : 0
                );
            }
            
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : allResults.length - 1
                );
            }
            
            if (event.key === 'Enter' && isOpen && selectedIndex >= 0) {
                event.preventDefault();
                const selectedResult = allResults[selectedIndex];
                if (selectedResult) {
                    handleSelectItem(selectedResult.item, selectedResult.type);
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, selectedIndex, searchResults, handleSelectItem, debouncedValue]);

    // Handle search icon click
    const handleSearchClick = () => {
        setIsOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    // Handle clear search
    const handleClear = () => {
        // Clear the input value directly
        setInputValue('');
        // Also call the hook's clear function to ensure search results are cleared
        clearSearch();
        // Focus the input after clearing
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div className={searchStyle.globalSearchContainer} ref={searchRef}>
            <li className={style.navbarActionIcon} onClick={handleSearchClick}>
                <Search color="#475467" size={20} />
            </li>

            {isOpen && (
                <div className={searchStyle.searchDropdown}>
                    <div className={searchStyle.searchInputContainer}>
                        <Search className={searchStyle.searchIcon} size={16} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className={searchStyle.searchInput}
                        />
                        {!inputValue && (
                            <div className={searchStyle.shortcutHint}>
                                {isMac ? '⌘' : '⌃'}/
                            </div>
                        )}
                        {inputValue && (
                            <button onClick={handleClear} className={searchStyle.clearButton}>
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className={searchStyle.searchResults} ref={resultsContainerRef}>
                        {loading ? (
                            <div className={searchStyle.loadingContainer}>
                                <ProgressSpinner style={{ width: "20px", height: "20px" }} />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            <>
                                {debouncedValue.length < 2 ? (
                                    <div className={searchStyle.emptyState}>
                                        <p>Start typing to search projects, clients, and suppliers...</p>
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
                                                {searchResults.projects.map((project, index) => {
                                                    const formatted = formatProjectResult(project);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    const isSelected = selectedIndex === index;
                                                    
                                                    return (
                                                        <div
                                                            key={`project-${project.id}`}
                                                            data-index={index}
                                                            className={`${searchStyle.resultItem} ${isSelected ? searchStyle.selected : ''}`}
                                                            onClick={() => handleSelectItem(project, 'project')}
                                                        >
                                                            <div className={searchStyle.resultIcon}>
                                                                <div className={searchStyle.projectIcon}>
                                                                <Folder size={16} color="#344054" />
                                                                </div>
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
                                                                <div className={`${searchStyle.resultBadge} ${formatted.is_archived ? searchStyle.archived : ''}`}>
                                                                    {getProjectStatusBadge(formatted)}
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
                                                {searchResults.clients.map((client, index) => {
                                                    const formatted = formatClientResult(client);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    const globalIndex = (searchResults.projects?.length || 0) + index;
                                                    const isSelected = selectedIndex === globalIndex;
                                                    
                                                    return (
                                                        <div
                                                            key={`client-${client.id}`}
                                                            data-index={globalIndex}
                                                            className={`${searchStyle.resultItem} ${isSelected ? searchStyle.selected : ''}`}
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

                                        {/* Suppliers Section */}
                                        {searchResults.suppliers && searchResults.suppliers.length > 0 && (
                                            <div className={searchStyle.resultSection}>
                                                <h6 className={searchStyle.sectionTitle}>
                                                    Suppliers ({searchResults.suppliers.length})
                                                </h6>
                                                {searchResults.suppliers.map((supplier, index) => {
                                                    const formatted = formatSupplierResult(supplier);
                                                    const metadata = formatSearchMetadata(formatted);
                                                    const globalIndex = (searchResults.projects?.length || 0) + (searchResults.clients?.length || 0) + index;
                                                    const isSelected = selectedIndex === globalIndex;
                                                    
                                                    return (
                                                        <div
                                                            key={`supplier-${supplier.id}`}
                                                            data-index={globalIndex}
                                                            className={`${searchStyle.resultItem} ${isSelected ? searchStyle.selected : ''}`}
                                                            onClick={() => handleSelectItem(supplier, 'supplier')}
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
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* Navigation Help */}
                    <div className={searchStyle.navigationHelp}>
                        <div className={searchStyle.helpItem}>
                            <span className={searchStyle.helpKey}>↑↓</span>
                            <span>to navigate</span>
                        </div>
                        <div className={searchStyle.helpItem}>
                            <span className={searchStyle.helpKey}>↵</span>
                            <span>to select</span>
                        </div>
                        <div className={searchStyle.helpItem}>
                            <span className={searchStyle.helpKey}>esc</span>
                            <span>to close</span>
                        </div>
                        <div className={searchStyle.helpItem}>
                            <span className={searchStyle.helpKey}>↵</span>
                            <span>return to parent</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;