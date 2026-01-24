import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Steps, Typography, Space, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined, EyeInvisibleOutlined, EyeTwoTone, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import './Auth.css';
import auth_bg from '../../Assets/Images/Banners/auth_background.png';

const { Title, Text } = Typography;
const { Step } = Steps;

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { t, language, changeLanguage } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');


    // Mock OTP (in production, this will be sent to email)
    const MOCK_OTP = '123456';

    // Step 1: Request OTP
    const handleRequestOTP = (values) => {
        setLoading(true);
        setEmail(values.email);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success(`${t('otp_sent')} ${values.email}. ${t('otp_mock')} ${MOCK_OTP}`);
            setCurrentStep(1);
        }, 1500);
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = (values) => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            if (values.otp === MOCK_OTP) {
                message.success(t('otp_success'));

                setCurrentStep(2);
            } else {
                message.error(t('otp_error'));
            }
        }, 1000);
    };

    // Step 3: Reset Password
    const handleResetPassword = (values) => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success(t('reset_success'));
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }, 1000);
    };

    // Resend OTP
    const handleResendOTP = () => {
        message.info(`${t('otp_sent')} ${email}. ${t('otp_mock')} ${MOCK_OTP}`);
    };

    const steps = [
        {
            title: t('step_email'),
            icon: <MailOutlined />,
        },
        {
            title: t('step_otp'),
            icon: <SafetyOutlined />,
        },
        {
            title: t('step_new_pass'),
            icon: <LockOutlined />,
        },
    ];

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
                            {t('forgot_password_title')}
                        </Title>
                        <Text className="auth-subtitle">
                            {currentStep === 0 && t('forgot_password_desc_1')}
                            {currentStep === 1 && t('forgot_password_desc_2')}
                            {currentStep === 2 && t('forgot_password_desc_3')}
                        </Text>
                    </div>

                    {/* Progress Steps */}
                    <Steps current={currentStep} className="forgot-password-steps">
                        {steps.map((item, index) => (
                            <Step key={index} title={item.title} icon={item.icon} />
                        ))}
                    </Steps>

                    {/* Step 1: Request OTP */}
                    {currentStep === 0 && (
                        <Form
                            name="request-otp"
                            onFinish={handleRequestOTP}
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

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    className="auth-submit-btn"
                                >
                                    {t('send_otp')}
                                </Button>
                            </Form.Item>

                            <div className="auth-footer">
                                <Link to="/login" className="auth-back-link">
                                    {t('back_to_login')}
                                </Link>
                            </div>
                        </Form>
                    )}

                    {/* Step 2: Verify OTP */}
                    {currentStep === 1 && (
                        <Form
                            name="verify-otp"
                            onFinish={handleVerifyOTP}
                            layout="vertical"
                            size="large"
                            className="auth-form"
                        >
                            <Form.Item
                                name="otp"
                                label={t('step_otp')}
                                rules={[
                                    { required: true, message: t('otp_required') },
                                    { len: 6, message: t('otp_length') }
                                ]}
                            >
                                <Input
                                    prefix={<SafetyOutlined />}
                                    placeholder={t('step_otp')}
                                    maxLength={6}
                                    autoComplete="off"
                                />
                            </Form.Item>

                            <div className="otp-info">
                                <Text type="secondary">
                                    {t('otp_sent')} <strong>{email}</strong>
                                </Text>
                                <Button type="link" onClick={handleResendOTP} className="resend-otp-btn">
                                    {t('resend_otp')}
                                </Button>
                            </div>

                            <Form.Item>
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                        className="auth-submit-btn"
                                    >
                                        {t('verify_otp')}
                                    </Button>
                                    <Button
                                        block
                                        onClick={() => setCurrentStep(0)}
                                    >
                                        {t('back')}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    )}

                    {/* Step 3: Reset Password */}
                    {currentStep === 2 && (
                        <Form
                            name="reset-password"
                            onFinish={handleResetPassword}
                            layout="vertical"
                            size="large"
                            className="auth-form"
                        >
                            <Form.Item
                                name="password"
                                label={t('new_password')}
                                rules={[
                                    { required: true, message: t('password_required') },
                                    { min: 6, message: t('password_min') }
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder={t('new_password')}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    autoComplete="new-password"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label={t('confirm_new_password')}
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
                                    placeholder={t('confirm_new_password')}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    autoComplete="new-password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                        className="auth-submit-btn"
                                    >
                                        {t('reset_password')}
                                    </Button>
                                    <Button
                                        block
                                        onClick={() => setCurrentStep(1)}
                                    >
                                        {t('back')}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
