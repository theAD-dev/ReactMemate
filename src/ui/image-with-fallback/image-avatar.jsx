import React, { useState } from 'react';
import style from './image-avatar.module.scss';
import { Building, Person } from 'react-bootstrap-icons';

const ImageAvatar = ({ has_photo, photo, is_business }) => {
    const [imgError, setImgError] = useState(false);
    const Icon = is_business ? Building : Person;

    return (
        <div className={`d-flex justify-content-center align-items-center ${style.clientImg} ${is_business ? "" : "rounded-circle"}`} style={{ overflow: 'hidden' }}>
            {has_photo && photo && !imgError ? (
                <img src={photo} alt="client avatar" className="w-100" onError={() => setImgError(true)} />
            ) : (
                <Icon color="#667085" />
            )}
        </div>
    );
};

export const FallbackImage = ({ has_photo, photo, is_business, size }) => {
    const [imgError, setImgError] = useState(false);
    const Icon = is_business ? Building : Person;

    return <>
        {has_photo && photo && !imgError ? (
            <img src={photo} alt="client avatar" className="w-100" onError={() => setImgError(true)} />
        ) : (
            <Icon color="#667085" size={size}/>
        )}
    </>
}

export default ImageAvatar;
