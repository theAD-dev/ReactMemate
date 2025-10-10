import { useState, useEffect } from 'react';
import { useDebounce } from 'primereact/hooks';
import { performUnifiedSearch } from '../../APIs/global-search-api';

/**
 * Custom hook for global search functionality
 * Provides reusable search logic with debouncing and state management
 */
export const useGlobalSearch = () => {
    const [searchResults, setSearchResults] = useState({
        projects: [],
        clients: [],
        jobs: [],
        tasks: [],
        invoices: [],
        suppliers: [],
        expenses: [],
        total: 0
    });
    const [loading, setLoading] = useState(false);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 300);

    // Perform search when debounced value changes
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedValue.trim().length < 2) {
                setSearchResults({ 
                    projects: [], 
                    clients: [], 
                    jobs: [], 
                    tasks: [], 
                    invoices: [], 
                    suppliers: [], 
                    expenses: [], 
                    total: 0 
                });
                return;
            }

            setLoading(true);
            try {
                const results = await performUnifiedSearch(debouncedValue, 5);
                setSearchResults(results);
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults({ 
                    projects: [], 
                    clients: [], 
                    jobs: [], 
                    tasks: [], 
                    invoices: [], 
                    suppliers: [], 
                    expenses: [], 
                    total: 0 
                });
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [debouncedValue]);

    const clearSearch = () => {
        setInputValue('');
        setSearchResults({ 
            projects: [], 
            clients: [], 
            jobs: [], 
            tasks: [], 
            invoices: [], 
            suppliers: [], 
            expenses: [], 
            total: 0 
        });
    };

    return {
        inputValue,
        setInputValue,
        debouncedValue,
        searchResults,
        loading,
        clearSearch
    };
};