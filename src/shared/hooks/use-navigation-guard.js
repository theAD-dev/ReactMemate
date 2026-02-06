import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useNavigationGuard = (isDirty) => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isNavigatingRef = useRef(false);

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

    // Handle browser back/forward button navigation
    useEffect(() => {
        if (!isDirty) return;

        // Push a dummy state to detect back navigation
        window.history.pushState({ guardedPage: true }, '', window.location.href);

        const handlePopState = (event) => {
            if (isNavigatingRef.current) {
                // User confirmed navigation, allow it
                isNavigatingRef.current = false;
                return;
            }

            // Block the navigation by pushing state back
            window.history.pushState({ guardedPage: true }, '', window.location.href);
            
            console.log('Browser back/forward blocked, showing confirmation modal');
            
            // Store the navigation function to go back
            // Need to go back 2 steps: one for the pushState we just did, one to actually navigate back
            setPendingNavigation(() => () => {
                isNavigatingRef.current = true;
                window.history.go(-2);
            });
            setIsBlocked(true);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isDirty, navigate, location.pathname]);

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