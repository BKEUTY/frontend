import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider, Typography, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, EyeInvisibleOutlined, EyeTwoTone, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNotification } from '../../Context/NotificationContext';
import './Auth.css';
import auth_bg from '../../Assets/Images/Banners/auth_background.png';

const { Title, Text } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const { t, language, changeLanguage } = useLanguage();
    const [loading, setLoading] = useState(false);
    const showNotification = useNotification();

    const onFinish = (values) => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showNotification(t('register_success') || 'Registration Successful', 'success');
            navigate('/home');
        }, 1000);
    };

    const handleSocialRegister = (provider) => {
        showNotification(`${t('register_with', 'Register with')} ${provider}`, 'info');
    };

    return (
        <div className="auth-container">

            <div className="auth-image-side" style={{ backgroundImage: `url(${auth_bg})` }}>
                <div className="auth-image-overlay">
                    <div className="auth-brand-section">
                        <h1 className="auth-brand-logo">BKEUTY</h1>
                        <p className="auth-brand-tagline">Nâng tầm vẻ đẹp của bạn</p>
                    </div>
                </div>
            </div>


            <div className="auth-form-side">
                <div className="auth-lang-switch">
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        onClick={() => changeLanguage(language === 'en' ? 'vi' : 'en')}
                    >
                        {language === 'vi' ? 'Tiếng Việt' : 'English'}
                    </Button>
                </div>
                <div className="auth-mobile-logo">
                    <h1>BKEUTY</h1>
                    <p>Nâng tầm vẻ đẹp của bạn</p>
                </div>
                <div className="auth-form-container">
                    <div className="auth-header">
                        <Title level={2} className="auth-title">
                            {t('create_account')}
                        </Title>
                        <Text className="auth-subtitle">
                            {t('register_subtitle')}
                        </Text>
                    </div>

                    <Form
                        name="register"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        className="auth-form"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label={t('full_name')}
                            rules={[
                                { required: true, message: t('name_required') },
                                { min: 2, message: t('name_min') }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder={t('full_name')}
                                autoComplete="name"
                            />
                        </Form.Item>

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
                            rules={[
                                { required: true, message: t('password_required') },
                                { min: 6, message: t('password_min') }
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder={t('password')}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                autoComplete="new-password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label={t('confirm_password')}
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: t('confirm_new_password') },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t('password_match_error')));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder={t('confirm_password')}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                autoComplete="new-password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            className="auth-agreement"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value ? Promise.resolve() : Promise.reject(new Error(t('term_required'))),
                                },
                            ]}
                        >
                            <Checkbox>
                                {t('agree_terms')}{' '}
                                <Link to="/terms" className="auth-link">
                                    {t('terms')}
                                </Link>{' '}
                                {t('and')}{' '}
                                <Link to="/policy" className="auth-link">
                                    {t('policy')}
                                </Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                className="auth-submit-btn"
                            >
                                {t('register')}
                            </Button>
                        </Form.Item>

                        <Divider plain className="auth-divider">
                            {t('or_register_with')}
                        </Divider>

                        <Space direction="horizontal" size="middle" className="social-login-container">
                            <Button
                                icon={<GoogleOutlined />}
                                onClick={() => handleSocialRegister('Google')}
                                className="social-btn social-btn-google"
                            >
                                Google
                            </Button>
                            <Button
                                icon={<FacebookOutlined />}
                                onClick={() => handleSocialRegister('Facebook')}
                                className="social-btn social-btn-facebook"
                            >
                                Facebook
                            </Button>
                        </Space>

                        <div className="auth-footer">
                            <Text>
                                {t('already_have_account')}{' '}
                                <Link to="/login" className="auth-link">
                                    {t('login')}
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
