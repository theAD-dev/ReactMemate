import clsx from 'clsx';
import style from './validation.module.scss';

const ValidationError = ({ message }) => {
    return (
        <div className={clsx(style.container)}>
            <div className='position-relative d-flex flex-column'>
                <img src="/static/media/NodataImg.ee3ccbdc6b7e66284e17.png" alt="no-data" />
            </div>
            <h2 className={clsx(style.title)}>{message || "No historical records yet."}</h2>
        </div>
    );
};

export default ValidationError;