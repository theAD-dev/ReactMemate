import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();

        navigate('/login', { replace: true });
    }, [navigate]);

    return null;
};

export default Logout;