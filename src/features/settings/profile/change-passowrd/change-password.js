import React, { useState, useMemo } from 'react';
import { PencilSquare } from 'react-bootstrap-icons';
import { CheckCircleFill } from "react-bootstrap-icons";
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './change-password.module.scss';

const ChangePassword = () => {
    const [visible, setVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState({
        oldPassword: '',
        password: '',
        confirmedPassword: '',
        general: ''
    });
    const [strength, setStrength] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
        const required = password.trim().length > 0;
        const uppercase = /[A-Z]/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const length = password.length >= 8;

        let strengthLevel = 0;
        if (length) strengthLevel++;
        if (uppercase) strengthLevel++;
        if (specialChar) strengthLevel++;
        if (password.length >= 12) strengthLevel++;

        switch (strengthLevel) {
            case 1:
                return { required, uppercase, specialChar, length, strength: 'Very Weak' };
            case 2:
                return { required, uppercase, specialChar, length, strength: 'Weak' };
            case 3:
                return { required, uppercase, specialChar, length, strength: 'Strong' };
            case 4:
                return { required, uppercase, specialChar, length, strength: 'Very Strong' };
            default:
                return { required, uppercase, specialChar, length, strength: '' };
        }
    };

    const validationResult = useMemo(() => validatePassword(password), [password]);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(prev => ({ ...prev, password: '', general: '' }));
        setStrength(validatePassword(value).strength);
    };

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
        setPasswordError(prev => ({ ...prev, oldPassword: '' }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordError(prev => ({ ...prev, confirmedPassword: '', general: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPasswordError({ oldPassword: '', password: '', confirmedPassword: '', general: '' });

        // Check required fields
        if (!oldPassword.trim()) {
            setPasswordError(prev => ({ ...prev, oldPassword: 'Old password is required' }));
            return;
        }
        if (!password.trim()) {
            setPasswordError(prev => ({ ...prev, password: 'New password is required' }));
            return;
        }
        if (!confirmedPassword.trim()) {
            setPasswordError(prev => ({ ...prev, confirmedPassword: 'Confirm password is required' }));
            return;
        }

        const { length, uppercase, specialChar } = validationResult;

        if (!length || !uppercase || !specialChar) {
            setPasswordError(prev => ({ ...prev, general: 'Password does not meet the criteria' }));
            return;
        }

        if (password !== confirmedPassword) {
            setPasswordError(prev => ({ ...prev, general: 'Passwords do not match' }));
            return;
        }

        setLoading(true);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4.5" y="4.5" width="48" height="48" rx="24" fill="#BAE8FF" />
                <rect x="4.5" y="4.5" width="48" height="48" rx="24" stroke="#EBF8FF" strokeWidth="8" />
                <path d="M39.7524 19.409C40.0453 19.7019 40.0453 20.1768 39.7524 20.4697L38.1881 22.034L35.1881 19.034L36.7524 17.4697C37.0453 17.1768 37.5202 17.1768 37.8131 17.4697L39.7524 19.409Z" fill="#1AB2FF" />
                <path d="M37.1274 23.0947L34.1274 20.0947L23.9079 30.3141C23.8256 30.3965 23.7636 30.4968 23.7267 30.6073L22.5199 34.2278C22.4222 34.521 22.7011 34.7999 22.9942 34.7022L26.6148 33.4953C26.7252 33.4585 26.8256 33.3965 26.9079 33.3141L37.1274 23.0947Z" fill="#1AB2FF" />
                <path fillRule="evenodd" clipRule="evenodd" d="M18 36.75C18 37.9926 19.0074 39 20.25 39H36.75C37.9926 39 39 37.9926 39 36.75V27.75C39 27.3358 38.6642 27 38.25 27C37.8358 27 37.5 27.3358 37.5 27.75V36.75C37.5 37.1642 37.1642 37.5 36.75 37.5H20.25C19.8358 37.5 19.5 37.1642 19.5 36.75V20.25C19.5 19.8358 19.8358 19.5 20.25 19.5H30C30.4142 19.5 30.75 19.1642 30.75 18.75C30.75 18.3358 30.4142 18 30 18H20.25C19.0074 18 18 19.0074 18 20.25V36.75Z" fill="#1AB2FF" />
            </svg>
            <span className={`white-space-nowrap ${style.headerTitle}`}>Change Password</span>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end align-items-center gap-3">
            <Button label="Cancel" className="outline-button outline-none" onClick={() => setVisible(false)} />
            <Button label={loading ? "Loading..." : "Change Password"} className="success-button outline-none" onClick={handleSubmit} />
        </div>
    );

    return (
        <>
            <button className="cancel" onClick={() => setVisible(true)}>Change Password <PencilSquare color="#344054" size={20} /></button>
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => setVisible(false)}>
                <form onSubmit={handleSubmit}>
                    <div className="formgroup">
                        <label className={style.label}>Old Password <span style={{ color: 'red' }}>*</span></label>
                        <div className={`inputInfo`}>
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder='Old password'
                                value={oldPassword}
                                className={clsx(style.inputBox, { [style.error]: passwordError.oldPassword })}
                                onChange={handleOldPasswordChange}
                                required
                            />
                        </div>
                        {passwordError.oldPassword && <p className="error-message">{passwordError.oldPassword}</p>}
                    </div>
                    <div className="formgroup">
                        <label className={style.label}>New Password <span style={{ color: 'red' }}>*</span></label>
                        <div className={`inputInfo`}>
                            <input
                                type="password"
                                name="password"
                                placeholder='Enter password'
                                value={password}
                                onChange={handlePasswordChange}
                                className={clsx(style.inputBox, 'mb-0', { [style.error]: passwordError.password })}
                                required
                            />
                        </div>
                        {passwordError.password && <p className="error-message">{passwordError.password}</p>}
                        <div className={style["password-strength"]}>
                            <div className={style["progress-container"]}>
                                <div className={`${style["progress-bar"]} stage-1 ${strength === 'Very Weak' || strength === 'Weak' || strength === 'Strong' || strength === 'Very Strong' ? style.green : ''}`}></div>
                                <div className={`${style["progress-bar"]} stage-2 ${strength === 'Weak' || strength === 'Strong' || strength === 'Very Strong' ? style.green : ''}`}></div>
                                <div className={`${style["progress-bar"]} stage-3 ${strength === 'Strong' || strength === 'Very Strong' ? style.green : ''}`}></div>
                                <div className={`${style["progress-bar"]} stage-4 ${strength === 'Very Strong' ? style.green : ''}`}></div>
                            </div>
                            <small className="strength-text">{strength}</small>
                        </div>
                    </div>
                    <div className="formgroup mt-3">
                        <label className={style.label}>Confirm Password <span style={{ color: 'red' }}>*</span></label>
                        <div className={`inputInfo`}>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder='Confirm password'
                                value={confirmedPassword}
                                className={clsx(style.inputBox, { [style.error]: passwordError.confirmedPassword })}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                        </div>
                        {passwordError.confirmedPassword && <p className="error-message">{passwordError.confirmedPassword}</p>}
                    </div>
                    {passwordError.general && <p className="error-message">{passwordError.general}</p>}

                    <div className="password-criteria mt-4">
                        <p className='font-14 mb-1' style={{ color: validationResult.length ? 'green' : '#475467' }}>
                            {validationResult.length ? <CheckCircleFill color='green' /> : <CheckCircleFill color='#D0D5DD' />} Must be at least 8 characters
                        </p>
                        <p className='font-14 mb-1' style={{ color: validationResult.uppercase ? 'green' : '#475467' }}>
                            {validationResult.uppercase ? <CheckCircleFill color='green' /> : <CheckCircleFill color='#D0D5DD' />} One uppercase character
                        </p>
                        <p className='font-14 mb-1' style={{ color: validationResult.specialChar ? 'green' : '#475467' }}>
                            {validationResult.specialChar ? <CheckCircleFill color='green' /> : <CheckCircleFill color='#D0D5DD' />} Must contain one special character
                        </p>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ChangePassword;