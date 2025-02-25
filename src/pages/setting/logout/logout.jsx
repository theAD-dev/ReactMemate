import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('isLoggedIn');

        navigate('/login', { replace: true });
    }, [navigate]);

    return null;
};

export default Logout;