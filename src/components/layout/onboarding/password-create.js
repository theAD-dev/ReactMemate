import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftShort, CheckCircleFill } from "react-bootstrap-icons";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import "./org.css";
import createPasswordImg from "../../../assets/images/create-password.png";
import LoinLogo from "../../../assets/images/logo.svg";
import { OnboardingCreatePassword } from '../../../APIs/OnboardingApi';

const PasswordCreate = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    if (!uuid) navigate('/onboarding');

    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [strength, setStrength] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
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
                return { uppercase, specialChar, length, strength: 'Very Weak' };
            case 2:
                return { uppercase, specialChar, length, strength: 'Weak' };
            case 3:
                return { uppercase, specialChar, length, strength: 'Strong' };
            case 4:
                return { uppercase, specialChar, length, strength: 'Very Strong' };
            default:
                return { uppercase, specialChar, length, strength: '' };
        }
    };

    const validationResult = useMemo(() => validatePassword(password), [password]);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError('');
        setStrength(validationResult.strength);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { length, uppercase, specialChar } = validationResult;

        if (!length || !uppercase || !specialChar) {
            setPasswordError('Password does not meet the criteria.');
            return;
        }

        if (password !== confirmedPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setLoading(true);
        OnboardingCreatePassword(uuid, { password: confirmedPassword })
            .then(() => navigate(`/login`))
            .catch((err) => {
                console.error("Error submitting form:", err);
                setPasswordError(err.message);
            }).finally(()=> {
                setLoading(false);
            });
    };

    return (
        <div className='requestDemoWrap veryfymail'>
            <div className="logohead">
                <img src={LoinLogo} alt="Loin Logo" />
            </div>
            <div className="copywrite">© Memate {new Date().getFullYear()}</div>
            <div className='OnboardingStep1 onboardingWrap'>
                <form onSubmit={handleSubmit}>
                    <div className="loginPage">
                        <div className="boxinfo">
                            <div className="boxLogin">
                                <div className='verifyEmailb'>
                                    <h2 className='mb-1'>Create your <span>password</span></h2>
                                    <p className='emailDis'>Your new password must be different from previously used passwords.</p>
                                </div>
                                <div className="formgroup">
                                    <label>Password</label>
                                    <div className={`inputInfo ${passwordError ? 'error-border' : ''}`}>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder='Enter password'
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                        {passwordError && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                    </div>
                                    <div className="password-strength">
                                        <div className="progress-container">
                                            <div className={`progress-bar stage-1 ${strength === 'Very Weak' || strength === 'Weak' || strength === 'Strong' || strength === 'Very Strong' ? 'green' : ''}`}></div>
                                            <div className={`progress-bar stage-2 ${strength === 'Weak' || strength === 'Strong' || strength === 'Very Strong' ? 'green' : ''}`}></div>
                                            <div className={`progress-bar stage-3 ${strength === 'Strong' || strength === 'Very Strong' ? 'green' : ''}`}></div>
                                            <div className={`progress-bar stage-4 ${strength === 'Very Strong' ? 'green' : ''}`}></div>
                                        </div>
                                        <span className="strength-text">{strength}</span>
                                    </div>
                                </div>
                                <div className="formgroup">
                                    <label>Confirm Password</label>
                                    <div className={`inputInfo ${passwordError ? 'error-border' : ''}`}>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder='Confirm password'
                                            value={confirmedPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {passwordError && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                    </div>
                                </div>
                                {passwordError && <p className="error-message"> {passwordError} </p>}

                                <div className="password-criteria mt-4">
                                    <p className='font-14 mb-1' style={{ color: validationResult.length ? 'green' : '#475467' }}>{validationResult.length ? <CheckCircleFill color='green' /> : <CheckCircleFill color='#D0D5DD' />} Must be at least 8 characters</p>
                                    <p className='font-14 mb-1' style={{ color: validationResult.uppercase ? 'green' : '#475467' }}>{validationResult.uppercase ? <CheckCircleFill color='green' /> : <CheckCircleFill color='#D0D5DD' />} One uppercase character</p>
                                    <p className='font-14 mb-1' style={{ color: validationResult.specialChar ? 'green' : '#475467' }}>{validationResult.specialChar ? <CheckCircleFill color='green' /> : <CheckCircleFill color='#D0D5DD' />} Must contain one special character</p>
                                </div>
                                <button type='submit' disabled={loading} className="fillbtn flexcenterbox" style={{ borderRadius: '30px' }}>
                                    {loading ? "Processing..." : "Save Password"}
                                </button>
                                <div className={`linkBottom`}>
                                    <Link className="backToLogin" to="/login" style={{ color: '#475467', fontWeight: '600', fontSize: '14px' }}>
                                        <ArrowLeftShort color='#475467' size={20} />Back to log in
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="sliderRight SinglBgRight" style={{
                            backgroundImage: `url(${createPasswordImg})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            <p>Complete internal control of the business from anywhere.</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordCreate;
