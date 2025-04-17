import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from 'react-bootstrap';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from './not-found-template.module.scss';
import SearchIcon from "../../assets/images/icon/searchIcon.png";
import Support from '../../shared/ui/support/support';


const NotFoundTemplate = () => {
    const [visible, setVisible] = React.useState(false);
    const openSupportModal = () => {
        setVisible(true);
    };
    return (
        <div className={clsx(style.noDataBox)}>
            <Helmet>
                <title>MeMate - Page Not Found</title>
            </Helmet>
            <div className='position-relative d-flex flex-column'>
                <svg width="228" height="228" viewBox="0 0 228 228" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="114" cy="114.227" r="113.455" fill="#EAECF0" />
                    <path d="M16.7322 136.733V126.257L47.5916 77.5H56.3274V92.4148H51.0007L30.2265 125.334V125.902H73.3018V136.733H16.7322ZM51.4268 150.227V133.537L51.5689 128.849V77.5H63.9978V150.227H51.4268ZM109.03 151.612C103.182 151.612 98.1633 150.133 93.973 147.173C89.8063 144.19 86.5985 139.893 84.3494 134.283C82.124 128.648 81.0113 121.866 81.0113 113.935C81.035 106.004 82.1595 99.2566 84.3849 93.6932C86.634 88.1061 89.8418 83.8447 94.0085 80.9091C98.1988 77.9735 103.206 76.5057 109.03 76.5057C114.854 76.5057 119.861 77.9735 124.051 80.9091C128.241 83.8447 131.449 88.1061 133.675 93.6932C135.924 99.2803 137.048 106.027 137.048 113.935C137.048 121.889 135.924 128.684 133.675 134.318C131.449 139.929 128.241 144.214 124.051 147.173C119.884 150.133 114.877 151.612 109.03 151.612ZM109.03 140.497C113.575 140.497 117.162 138.26 119.79 133.786C122.441 129.287 123.767 122.67 123.767 113.935C123.767 108.158 123.163 103.305 121.956 99.375C120.749 95.4451 119.044 92.4858 116.842 90.4972C114.641 88.4848 112.036 87.4787 109.03 87.4787C104.508 87.4787 100.933 89.7277 98.3054 94.2258C95.6775 98.7003 94.3518 105.27 94.3281 113.935C94.3044 119.735 94.8844 124.612 96.0682 128.565C97.2755 132.519 98.9801 135.502 101.182 137.514C103.383 139.503 105.999 140.497 109.03 140.497ZM145.033 136.733V126.257L175.892 77.5H184.628V92.4148H179.301L158.527 125.334V125.902H201.603V136.733H145.033ZM179.728 150.227V133.537L179.87 128.849V77.5H192.299V150.227H179.728Z" fill="url(#paint0_linear_6415_742746)" />
                    <defs>
                        <linearGradient id="paint0_linear_6415_742746" x1="8.41865" y1="64.6737" x2="126.478" y2="258.437" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D0D5DD" />
                            <stop offset="0.350715" stopColor="white" />
                        </linearGradient>
                    </defs>
                </svg>

                <img className={clsx(style.searchImg)} src={SearchIcon} alt='search' />
            </div>
            <h2 className={clsx(style.title)}>Uh oh, we can't find that page...</h2>
            <p className={clsx(style.subTitle)}>
                Sorry, the page you are looking for doesn't exist or has been moved. Try searching our site:
            </p>
            <Link to={"/"}><Button className='outline-button' style={{ marginBottom: '32px' }}> <ChevronLeft /> Go back</Button></Link>
            <Link to={"#"} onClick={openSupportModal}><span className={clsx(style.supportext)}>Support</span></Link>
            <Support visible={visible} setVisible={setVisible} />
        </div>
    );
};

export default NotFoundTemplate;