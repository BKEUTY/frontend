import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './Auth.css';
import auth_bg from '../../Assets/Images/Banners/auth_background.png';
import google_icon from '../../Assets/Images/Icons/social_google.svg';
import facebook_icon from '../../Assets/Images/Icons/social_facebook.svg';

const Login = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@gmail.com' && password === '123456') {
            // Success
        }
        navigate('/home');
    };

    return (
        <div className="auth-container">
            <div className="auth-image-side" style={{ backgroundImage: `url(${auth_bg})` }}>
            </div>
            <div className="auth-form-side">
                <div className="auth-logo">BKEUTY</div>
                <h2 className="auth-title">{t('welcome_back')}</h2>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-input"
                            placeholder={t('email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            placeholder={t('password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </span>
                    </div>

                    <div className="auth-options">
                        <label className="remember-me">
                            <input type="checkbox" /> {t('remember_me')}
                        </label>
                        <Link to="/forgot-password" className="forgot-password">{t('forgot_password')}</Link>
                    </div>

                    <button type="submit" className="auth-button">{t('login')}</button>

                    <div className="auth-divider">{t('or_login_with')}</div>

                    <div className="social-login">
                        <button type="button" className="social-btn">
                            <img src={google_icon} alt="Google" className="social-icon" />
                        </button>
                        <button type="button" className="social-btn">
                            <img src={facebook_icon} alt="Facebook" className="social-icon" />
                        </button>
                    </div>

                    <div className="auth-footer">
                        {t('no_account')} <Link to="/register" className="auth-link">{t('register')}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
