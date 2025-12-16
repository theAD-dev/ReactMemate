import React, { useMemo, useRef, useState } from 'react';
import { Galleria as PrimeGalleria } from 'primereact/galleria';

const isImage = (ext) =>
    ['png', 'jpg', 'jpeg', 'webp'].includes(ext?.toLowerCase());

const Galleria = ({ attachments = [], label }) => {
    const galleriaRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const images = useMemo(() => {
        return attachments
            .filter(att => isImage(att.extension))
            .map(att => ({
                itemImageSrc: att.link,
                thumbnailImageSrc: att.link,
                alt: att.name,
                title: att.name
            }));
    }, [attachments]);

    if (!images.length) return null;

    const itemTemplate = (item) => (
        <img
            src={item.itemImageSrc}
            alt={item.alt}
            style={{ width: '100%', display: 'block' }}
        />
    );

    return (
        <div className='mb-2'>
            {label && <label style={{ color: '#98a2b3', fontSize: '14px', fontWeight: 400, marginBottom: '2px' }}>{label}</label>}
            <div className="w-100">
                {/* Hidden fullscreen galleria */}
                <PrimeGalleria
                    ref={galleriaRef}
                    value={images}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    circular
                    fullScreen
                    showItemNavigators
                    showThumbnails={false}
                    item={itemTemplate}
                    style={{ maxWidth: '850px' }}
                />

                {/* Thumbnail Grid */}
                <div className="d-flex gap-2 flex-wrap">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img.thumbnailImageSrc}
                            alt={img.alt}
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: 6
                            }}
                            onClick={() => {
                                setActiveIndex(index);
                                galleriaRef.current.show();
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Galleria;
