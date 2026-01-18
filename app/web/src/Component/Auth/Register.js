import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './Auth.css';
import auth_bg from '../../Assets/Images/Banners/auth_background.png';
import google_icon from '../../Assets/Images/Icons/social_google.svg';
import facebook_icon from '../../Assets/Images/Icons/social_facebook.svg';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/home');
    };

    return (
        <div className="auth-container">
            <div className="auth-image-side" style={{ backgroundImage: `url(${auth_bg})` }}>
            </div>
            <div className="auth-form-side">
                <div className="auth-logo">BKEUTY</div>
                <h2 className="auth-title">{t('create_account')}</h2>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder={t('full_name')}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder={t('email_placeholder')}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-input"
                            placeholder={t('password')}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </span>
                    </div>
                    <div className="form-group password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="form-input"
                            placeholder={t('confirm_password')}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="remember-me">
                            <input type="checkbox" required /> <span>{t('agree_terms')} <Link to="/terms" className="auth-link">{t('terms')}</Link> {t('and')} <Link to="/policy" className="auth-link">{t('policy')}</Link></span>
                        </label>
                    </div>

                    <button type="submit" className="auth-button">{t('register')}</button>

                    <div className="auth-divider">{t('or_register_with')}</div>

                    <div className="social-login">
                        <button type="button" className="social-btn">
                            <img src={google_icon} alt="Google" className="social-icon" />
                        </button>
                        <button type="button" className="social-btn">
                            <img src={facebook_icon} alt="Facebook" className="social-icon" />
                        </button>
                    </div>

                    <div className="auth-footer">
                        {t('already_have_account')} <Link to="/login" className="auth-link">{t('login')}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
