import React, { useEffect, useState } from 'react';
import { Building, Person } from 'react-bootstrap-icons';
import style from './image-avatar.module.scss';

const ImageAvatar = ({ has_photo, photo, is_business }) => {
    const [imgError, setImgError] = useState(false);
    const Icon = is_business ? Building : Person;

    useEffect(() => {
        setImgError(false);
    }, [photo]);

    return (
        <div className={`d-flex justify-content-center align-items-center ${style.clientImg} ${is_business ? "" : "rounded-circle"}`} style={{ overflow: 'hidden' }}>
            {has_photo && photo && !imgError ? (
                <img src={photo} alt="client avatar" className="w-100" onError={() => setImgError(true)} />
            ) : (
                <Icon color="#667085" size={20} />
            )}
        </div>
    );
};

export const FallbackImage = ({ has_photo, photo, is_business, size, isObjectFit }) => {
    const [imgError, setImgError] = useState(false);
    const Icon = is_business ? Building : Person;

    useEffect(() => {
        setImgError(false);
    }, [photo]);

    return <>
        {has_photo && photo && !imgError ? (
            <img src={photo} alt="client avatar" className="w-100" onError={() => setImgError(true)} style={{ objectFit: isObjectFit ? 'contain' : '' }}/>
        ) : (
            <Icon color="#667085" size={size} />
        )}
    </>;
};

export default ImageAvatar;
