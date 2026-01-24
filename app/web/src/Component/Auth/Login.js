import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider, Typography, Space } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, EyeInvisibleOutlined, EyeTwoTone, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import './Auth.css';
import auth_bg from '../../Assets/Images/Banners/auth_background.png';

const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const { t, language, changeLanguage } = useLanguage();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Login values:', values);
            setLoading(false);
            navigate('/home');
        }, 1000);
    };

    const handleSocialLogin = (provider) => {
        console.log(`Login with ${provider}`);
        // Implement social login logic here
    };

    return (
        <div className="auth-container">
            {/* Left Side - Image */}
            <div className="auth-image-side" style={{ backgroundImage: `url(${auth_bg})` }}>
                <div className="auth-image-overlay">
                    <div className="auth-brand-section">
                        <h1 className="auth-brand-logo">BKEUTY</h1>
                        <p className="auth-brand-tagline">Nâng tầm vẻ đẹp của bạn</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-side">
                <div className="auth-lang-switch">
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        onClick={() => changeLanguage(language === 'en' ? 'vi' : 'en')}
                    >
                        {language === 'en' ? 'Tiếng Việt' : 'English'}
                    </Button>
                </div>
                <div className="auth-mobile-logo">
                    <h1>BKEUTY</h1>
                    <p>Nâng tầm vẻ đẹp của bạn</p>
                </div>
                <div className="auth-form-container">
                    <div className="auth-header">
                        <Title level={2} className="auth-title">
                            {t('welcome_back')}
                        </Title>
                        <Text className="auth-subtitle">
                            {t('login_subtitle', 'Đăng nhập để tiếp tục mua sắm')}
                        </Text>
                    </div>

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        className="auth-form"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: t('email_required') },
                                { type: 'email', message: t('email_invalid') }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder={t('email_placeholder')}
                                autoComplete="email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={t('password')}
                            rules={[{ required: true, message: t('password_required') }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder={t('password')}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                autoComplete="current-password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <div className="auth-options">
                                <Checkbox>{t('remember_me')}</Checkbox>
                                <Link to="/forgot-password" className="auth-link">
                                    {t('forgot_password')}
                                </Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className="auth-submit-btn"
                            >
                                {t('login')}
                            </Button>
                        </Form.Item>

                        <Divider plain className="auth-divider">
                            {t('or_login_with')}
                        </Divider>

                        <Space direction="horizontal" size="middle" className="social-login-container">
                            <Button
                                icon={<GoogleOutlined />}
                                onClick={() => handleSocialLogin('Google')}
                                className="social-btn social-btn-google"
                            >
                                Google
                            </Button>
                            <Button
                                icon={<FacebookOutlined />}
                                onClick={() => handleSocialLogin('Facebook')}
                                className="social-btn social-btn-facebook"
                            >
                                Facebook
                            </Button>
                        </Space>

                        <div className="auth-footer">
                            <Text>
                                {t('no_account')}{' '}
                                <Link to="/register" className="auth-link">
                                    {t('register')}
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
