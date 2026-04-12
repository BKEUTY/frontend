import React, { useState } from 'react';
import authApi from '@/features/auth/services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Select } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, GlobalOutlined, HomeOutlined } from '@ant-design/icons';
import { useLanguage } from '@/store/LanguageContext';
import { notifyError, notifySuccess } from '@/utils/NotificationService';
import { useProvinces, useDistricts, useWards } from '@/features/account/hooks/useAddress';
import { SEO } from '@/components/common';

import './Auth.css';
import auth_bg from '@/assets/images/banners/auth_background.png';

const { Title, Text } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { t, language, changeLanguage } = useLanguage();
    const [loading, setLoading] = useState(false);

    const [addrState, setAddrState] = useState({ province: null, district: null, ward: null });

    const { data: provinces } = useProvinces();
    const { data: districts } = useDistricts(addrState.province?.id);
    const { data: wards } = useWards(addrState.district?.id);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const nameParts = values.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

            const data = {
                username: values.email,
                email: values.email,
                password: values.password,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: values.phoneNumber,
                dateOfBirth: '2000-01-01',
                address: {
                    address: values.street,
                    province: { provinceID: addrState.province.id, provinceName: addrState.province.name },
                    district: { districtID: addrState.district.id, districtName: addrState.district.name },
                    ward: { wardCode: addrState.ward.id, wardName: addrState.ward.name }
                }
            };

            await authApi.register(data);
            
            notifySuccess(t('success'), t('register_success') || 'Registration Successful');
            navigate('/login');
        } catch (error) {
            const errorData = error.response?.data;
            const message = typeof errorData === 'string' 
                ? errorData 
                : (errorData?.message || error.message || t('register_failed') || 'Registration Failed');
            
            notifyError(t('error'), message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <SEO title={t('register')} />
            <div className="auth-image-side" style={{ backgroundImage: `url(${auth_bg})` }}>
                <div className="auth-image-overlay">
                    <div className="auth-brand-section">
                        <h1 className="auth-brand-logo">BKEUTY</h1>
                        <p className="auth-brand-tagline">{t('brand_tagline')}</p>
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
                    <p>{t('brand_tagline')}</p>
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
                        form={form}
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

                        <div className="summary-divider" style={{ margin: '24px 0', background: '#f1f5f9' }}></div>
                        <Title level={5} style={{ marginBottom: 16 }}>{t('delivery_address')}</Title>

                        <Form.Item
                            name="phoneNumber"
                            label={t('phone')}
                            rules={[{ required: true, message: t('phone_required') }]}
                        >
                            <Input placeholder={t('phone_placeholder')} />
                        </Form.Item>

                        <Form.Item
                            name="street"
                            label={t('address')}
                            rules={[{ required: true, message: t('address_required') }]}
                        >
                            <Input 
                                prefix={<HomeOutlined />} 
                                placeholder={t('address_placeholder')} 
                            />
                        </Form.Item>

                        <div className="addr-select-grid">
                            <Form.Item 
                                name="province" 
                                label={t('province')}
                                rules={[{ required: true, message: t('select_province') }]}
                                className="select-item"
                            >
                                <Select
                                    showSearch
                                    placeholder={t('select_province')}
                                    options={provinces?.map(p => ({ value: p.ProvinceID, label: p.ProvinceName }))}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    onChange={(val, opt) => {
                                        setAddrState({ province: { id: val, name: opt.label }, district: null, ward: null });
                                        form.setFieldsValue({ district: null, ward: null });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="district" 
                                label={t('district')}
                                rules={[{ required: true, message: t('select_district') }]}
                                className="select-item"
                            >
                                <Select
                                    showSearch
                                    placeholder={t('select_district')}
                                    options={districts?.map(d => ({ value: d.DistrictID, label: d.DistrictName }))}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    disabled={!addrState.province}
                                    onChange={(val, opt) => {
                                        setAddrState(prev => ({ ...prev, district: { id: val, name: opt.label }, ward: null }));
                                        form.setFieldsValue({ ward: null });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="ward" 
                                label={t('ward')}
                                rules={[{ required: true, message: t('select_ward') }]}
                                className="select-item"
                                style={{ gridColumn: 'span 2' }}
                            >
                                <Select
                                    showSearch
                                    placeholder={t('select_ward')}
                                    options={wards?.map(w => ({ value: w.WardCode, label: w.WardName }))}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    disabled={!addrState.district}
                                    onChange={(val, opt) => {
                                        setAddrState(prev => ({ ...prev, ward: { id: val, name: opt.label } }));
                                    }}
                                />
                            </Form.Item>
                        </div>

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
                                    {t('terms')} {t('and')} {t('policy')}
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
