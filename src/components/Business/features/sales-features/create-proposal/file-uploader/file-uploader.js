import React, { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, Modal } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import styles from './file-uploader.module.scss';
import { ArrowClockwise, CloudUpload } from 'react-bootstrap-icons';
import { base64ToBlob } from './utils';
import clsx from 'clsx';
import { toast } from 'sonner';

const FileUploader = ({ show, setShow, setPhoto, additionalDesign, shape="rect" }) => {
    const [files, setFiles] = useState([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImages, setCroppedImages] = useState({});

    const handleClose = () => setShow(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImg = useCallback(async () => {
        if (!files.length || !croppedAreaPixels) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = files[0].preview;
        await new Promise((resolve) => (img.onload = resolve));

        // Set canvas dimensions to the cropped area's dimensions
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        // Translate canvas to center to rotate around the center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        return base64Image;
    }, [files, croppedAreaPixels, rotation]);

    const generateCroppedImages = async () => {
        const croppedImage = await getCroppedImg();
        if (croppedImage) {
            setCroppedImages({
                img2: croppedImage,
                img3: croppedImage,
                img4: croppedImage,
                img5: croppedImage,
            });
        }
    };

    useEffect(() => {
        generateCroppedImages();
    }, [zoom, crop, rotation, files, croppedAreaPixels]);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const remove = (e) => {
        e.stopPropagation();
        setFiles([]);
        setCroppedImages({});
        setShow(false);
    };

    const rotateImage = () => {
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    };

    const handleImage = async () => {
        const croppedImageBase64 = await getCroppedImg();
        if (!croppedImageBase64) return toast.error('Please select a photo');
        const croppedImageBlob = base64ToBlob(croppedImageBase64, 'image/jpeg');
        setPhoto({ croppedImageBase64, croppedImageBlob });
        setShow(false);
        setFiles([]);
        setCroppedImages({});
    }

    return (
        <Modal style={{ zIndex: 1111 }} show={show} centered onHide={handleClose} onShow={generateCroppedImages}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className={`${styles.title}`}>Edit Photo</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {additionalDesign}
                <div className={`${styles.previewSection}`}>
                    <div className={`${styles.previewBox}`}>
                        <div className={clsx(styles.previewBoxImg1, shape === 'round' ? 'rounded-circle' : '')}>
                            <Cropper
                                image={files.length > 0 ? files[0].preview : null}
                                crop={crop}
                                zoom={zoom}
                                cropShape={shape}
                                rotation={rotation}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                aspect={1} // or remove this if you want a flexible aspect ratio
                                restrictPosition={false} // Allow full movement within the bounds
                                style={{
                                    containerStyle: {
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative',
                                    },
                                    cropAreaStyle: {
                                        width: '100%',
                                        height: '100%',
                                    },
                                    mediaStyle: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className={`${styles.previewActions}`}>
                        <Form.Group>
                            <Form.Label className={`${styles.label}`}>Zoom</Form.Label>
                            <Form.Range
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                className='custom-range'
                                onChange={(e) => setZoom(e.target.value)}
                            />
                        </Form.Group>
                        <div className='d-flex align-item-center pt-4 ms-4' style={{ gap: '8px' }}>
                            <Button className='text-button' onClick={rotateImage}>
                                <ArrowClockwise color='#106B99' size={24} />
                                Rotate
                            </Button>
                        </div>
                    </div>
                </div>

                <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #EAECF0', marginTop: '16px' }}>
                    <input {...getInputProps()} />
                    <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '8px', marginBottom: '16px' }}>
                        <CloudUpload />
                    </button>
                    <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
                    <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-end'>
                <Button className='outline-button' onClick={remove}>Cancel</Button>
                <Button className='solid-button' onClick={handleImage}>Save Photo</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FileUploader;
