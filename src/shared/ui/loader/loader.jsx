import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import style from './loader.module.scss';

const Loader = () => {
    return (
        <div className={style.box}>
            <div className={style.innerBox}>
                <ProgressSpinner className={style.spinnerSize} />
            </div>
        </div>
    );
};

export default Loader;