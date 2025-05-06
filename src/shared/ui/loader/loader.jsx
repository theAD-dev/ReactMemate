import React from 'react';
import { Spinner } from 'react-bootstrap';
import style from './loader.module.scss';

const Loader = () => {
    return (
        <div className={style.box}>
            <div className={style.innerBox}>
               <Spinner animation="border" className={style.spinnerSize} role="status"/>
            </div>
        </div>
    );
};

export default Loader;