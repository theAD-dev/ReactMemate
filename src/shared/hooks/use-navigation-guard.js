import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useNavigationGuard = (isDirty) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const navigate = useNavigate();

    // Block browser navigation (refresh, close tab, etc.)
    useEffect(() => {
        if (!isDirty) return;

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    // Intercept all link clicks globally
    useEffect(() => {
        if (!isDirty) return;

        const handleClick = (event) => {
            // Find if the click was on or within a link
            const link = event.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            const target = link.getAttribute('target');
            
            // Only block internal navigation links (not external or new tab links)
            if (href && !target && (href.startsWith('/') || href.startsWith('#'))) {
                event.preventDefault();
                event.stopPropagation();
                
                console.log('Link click blocked, showing confirmation modal');
                
                // Store the navigation function
                setPendingNavigation(() => () => {
                    if (href.startsWith('/')) {
                        navigate(href);
                    }
                });
                setIsBlocked(true);
            }
        };

        // Use capture phase to intercept before React Router processes it
        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [isDirty, navigate]);

    const confirmNavigation = useCallback(() => {
        setIsBlocked(false);
        if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
        }
    }, [pendingNavigation]);

    const cancelNavigation = useCallback(() => {
        setIsBlocked(false);
        setPendingNavigation(null);
    }, []);

    const blockNavigation = useCallback((navigationFn) => {
        if (isDirty) {
            console.log('Navigation blocked due to unsaved changes');
            setPendingNavigation(() => navigationFn);
            setIsBlocked(true);
            return true; // Navigation was blocked
        }
        console.log('Navigation allowed, no unsaved changes');
        return false; // Navigation was not blocked
    }, [isDirty]);

    return {
        isBlocked,
        confirmNavigation,
        cancelNavigation,
        blockNavigation
    };
};

export default useNavigationGuard;