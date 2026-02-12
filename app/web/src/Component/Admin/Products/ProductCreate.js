import React, { useState } from 'react';
import {
    Steps, Form, Input, Button, Select, Upload, notification, Card,
    Divider, Table, InputNumber, Row, Col, Typography, Empty
} from 'antd';
import {
    PlusOutlined, DeleteOutlined,
    ArrowRightOutlined, CheckCircleOutlined,
    CloudUploadOutlined, ShoppingOutlined,
    SettingOutlined, TableOutlined,
    LeftOutlined, LoadingOutlined, TagOutlined, FileImageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { getImageUrl } from '../../../api/axiosClient';
import { useLanguage } from '../../../i18n/LanguageContext';
import './ProductCreate.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const ProductCreate = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [createdProductId, setCreatedProductId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [optionTypes, setOptionTypes] = useState([
        { name: t('admin_product_color'), values: [] }
    ]);

    const [variants, setVariants] = useState([]);

    const handleCreateProduct = async (values) => {
        setLoading(true);
        try {
            const payload = {
                name: values.name,
                description: values.description || '',
                productCategories: values.categories ? values.categories.map(Number) : [1],
                image: ''
            };

            const res = await adminApi.createProduct(payload, { skipGlobalErrorHandler: true });
            if (res.status === 201 || res.status === 200) {
                const newProduct = res.data;
                const newProductId = newProduct.id;
                setCreatedProductId(newProductId);

                if (values.image && values.image.file) {
                    try {
                        const uploadRes = await adminApi.uploadProductImage(values.image.file.originFileObj, newProductId, { skipGlobalErrorHandler: true });
                        if (uploadRes.data && uploadRes.data.url) {
                            const imageUrl = uploadRes.data.url;
                            await adminApi.updateProduct({
                                id: newProductId,
                                name: values.name,
                                image: imageUrl
                            }, { skipGlobalErrorHandler: true });
                        }
                    } catch (uploadErr) {
                        notification.warning({
                            message: t('warning'),
                            description: t('admin_error_upload_img'),
                            key: 'admin_error_upload_img'
                        });
                    }
                }

                notification.success({
                    message: t('success'),
                    description: t('admin_msg_create_success'),
                    key: 'admin_msg_create_success'
                });
                setCurrentStep(1);
            }
        } catch (error) {
            notification.error({
                message: t('error'),
                description: t('admin_error_create'),
                key: 'admin_error_create'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddOptionType = () => {
        setOptionTypes([...optionTypes, { name: '', values: [] }]);
    };

    const handleRemoveOptionType = (index) => {
        const newTypes = [...optionTypes];
        newTypes.splice(index, 1);
        setOptionTypes(newTypes);
    };

    const handleOptionNameChange = (index, val) => {
        const newTypes = [...optionTypes];
        newTypes[index].name = val;
        setOptionTypes(newTypes);
    };

    const handleOptionValuesChange = (index, val) => {
        const newTypes = [...optionTypes];
        newTypes[index].values = val;
        setOptionTypes(newTypes);
    };

    const handleSubmitOptions = async () => {
        if (!createdProductId) return;

        const validOptions = optionTypes.filter(o => o.name.trim() !== '' && o.values.length > 0);
        if (validOptions.length === 0) {
            notification.error({
                message: t('error'),
                description: t("admin_error_at_least_one_option"),
                key: 'admin_error_at_least_one_option'
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                productId: createdProductId,
                productOptionValues: validOptions.map(opt => ({
                    optionName: opt.name,
                    optionValues: opt.values
                }))
            };

            await adminApi.createOption(payload, { skipGlobalErrorHandler: true });
            notification.success({
                message: t('success'),
                description: t('admin_msg_options_success'),
                key: 'admin_msg_options_success'
            });
            await fetchVariants(createdProductId);
            setCurrentStep(2);
        } catch (error) {
            notification.error({
                message: t('error'),
                description: t('admin_error_options_save'),
                key: 'admin_error_options_save'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchVariants = async (pid) => {
        try {
            const res = await adminApi.getVariants(pid, { skipGlobalErrorHandler: true });
            setVariants(res.data || []);
        } catch (error) {
            notification.error({
                message: t('error'),
                description: t("admin_error_fetch_variants"),
                key: 'admin_error_fetch_variants'
            });
        }
    };

    const handleVariantChange = (id, field, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleVariantImageUpload = async (id, file) => {
        try {
            notification.open({
                message: t('loading'),
                description: t('loading'),
                key: 'skuUpload',
                icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
                duration: 0
            });
            const res = await adminApi.uploadSkuImage(file, `variant-${id}`, { skipGlobalErrorHandler: true });
            const url = res.data.url;
            handleVariantChange(id, 'image', url);
            handleVariantChange(id, 'productImageUrl', url);
            notification.success({
                message: t('success'),
                description: t('success'),
                key: 'skuUpload'
            });
            return false;
        } catch (error) {
            notification.error({
                message: t('error'),
                description: t('error'),
                key: 'skuUpload'
            });
            return false;
        }
    };

    const handleSaveVariants = async () => {
        setLoading(true);
        try {
            await Promise.all(variants.map(v =>
                adminApi.updateVariant({
                    id: v.id,
                    productVariantName: v.productVariantName,
                    price: v.price || 0,
                    stockQuantity: v.stockQuantity || 0,
                    status: 'ACTIVE',
                    productImageUrl: v.image || v.productImageUrl
                }, { skipGlobalErrorHandler: true })
            ));

            notification.success({
                message: t('success'),
                description: t('admin_msg_variants_success'),
                key: 'admin_msg_variants_success'
            });
            navigate('/admin/products');
        } catch (error) {
            notification.error({
                message: t('error'),
                description: t('admin_error_variant_update'),
                key: 'admin_error_variant_update'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-create-container">
            <div className="admin-page-header">
                <Button
                    icon={<LeftOutlined />}
                    className="trigger-btn"
                    onClick={() => navigate('/admin/products')}
                />
                <div>
                    <h2 className="dashboard-title">{t('admin_product_create')}</h2>
                    <Text type="secondary" className="admin-subtitle">{t('admin_create_desc')}</Text>
                </div>
            </div>

            <div className="steps-wrapper">
                <Steps
                    current={currentStep}
                    className="modern-steps"
                    responsive={false}
                    direction="horizontal"
                    items={[
                        { title: t('admin_step_info'), icon: <ShoppingOutlined /> },
                        { title: t('admin_step_options'), icon: <SettingOutlined /> },
                        { title: t('admin_step_variants'), icon: <TableOutlined /> }
                    ]}
                />
            </div>

            {currentStep === 0 && (
                <Form form={form} layout="vertical" onFinish={handleCreateProduct} requiredMark={false}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={16} style={{ display: 'flex' }}>
                            <Card bordered={false} className="beauty-card" title={t('admin_section_general')} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1 }}>
                                <Row gutter={32}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="name"
                                            label={<span className="admin-label">{t('admin_label_name')}</span>}
                                            rules={[{ required: true, message: t('admin_error_name_required') }]}
                                        >
                                            <Input className="admin-input-large" placeholder={t('admin_placeholder_product_name')} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="categories"
                                            label={<span className="admin-label">{t('admin_label_category')}</span>}
                                            rules={[{ required: true, message: t('admin_error_category_required') }]}
                                        >
                                            <Select
                                                mode="multiple"
                                                className="admin-select-large"
                                                placeholder={t('admin_placeholder_categories')}
                                                style={{ width: '100%' }}
                                                dropdownStyle={{ borderRadius: 12, padding: 8 }}
                                            >
                                                <Option value="1">{t('skincare')}</Option>
                                                <Option value="2">{t('makeup')}</Option>
                                                <Option value="3">{t('body_care')}</Option>
                                                <Option value="4">{t('hair_care')}</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="description"
                                    label={<span className="admin-label">{t('admin_label_desc')}</span>}
                                    style={{ marginTop: 24 }}
                                >
                                    <TextArea
                                        className="admin-input-textarea"
                                        rows={6}
                                        placeholder={t('admin_placeholder_desc')}
                                        showCount
                                        maxLength={2000}
                                        style={{ height: 'auto' }}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8} style={{ display: 'flex' }}>
                            <Card bordered={false} className="beauty-card" title={t('admin_section_media')} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1 }}>
                                <Form.Item name="image" style={{ marginBottom: 0 }}>
                                    <Upload.Dragger
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        className="admin-upload-dragger"
                                        showUploadList={false} // Hide default list to avoid "hooks" or weird UI
                                    >
                                        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                            {form.getFieldValue('image') ? (
                                                <img
                                                    src={typeof form.getFieldValue('image') === 'string' ? form.getFieldValue('image') : URL.createObjectURL(form.getFieldValue('image').file.originFileObj)}
                                                    alt="product"
                                                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8 }}
                                                />
                                            ) : (
                                                <>
                                                    <p className="ant-upload-drag-icon">
                                                        <CloudUploadOutlined style={{ color: 'var(--admin-primary)', fontSize: 48, marginBottom: 16 }} />
                                                    </p>
                                                    <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#334155' }}>
                                                        {t('admin_btn_upload')}
                                                    </p>
                                                    <p className="ant-upload-hint" style={{ color: '#94a3b8' }}>
                                                        JPG, PNG, WEBP
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </Upload.Dragger>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <div className="admin-sticky-footer">
                        <Button type="primary" size="large" htmlType="submit" loading={loading} className="modern-btn-primary admin-btn-responsive">
                            {t('admin_btn_create_continue')} <ArrowRightOutlined />
                        </Button>
                    </div>
                </Form>
            )}

            {currentStep === 1 && (
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h3 className="dashboard-title" style={{ fontSize: 24, marginBottom: 16 }}>{t('admin_alert_options')}</h3>
                        <p style={{ fontSize: 16, color: 'var(--admin-text-sub)' }}>{t('admin_alert_options_desc')}</p>
                    </div>

                    <Card bordered={false} className="beauty-card" bodyStyle={{ padding: 0 }}>
                        {optionTypes.map((opt, index) => (
                            <div key={index} className="option-row" style={{ borderBottom: '1px solid #f8f9fa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                                    <Text strong style={{ fontSize: 20, color: 'var(--admin-primary)', letterSpacing: '0.01em' }}>{t('admin_label_option_name')} {index + 1}</Text>
                                    {index > 0 && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveOptionType(index)}>{t('delete')}</Button>}
                                </div>
                                <Row gutter={32}>
                                    <Col span={8}>
                                        <Input
                                            className="admin-input-large"
                                            placeholder={t('admin_placeholder_option_name')}
                                            value={opt.name}
                                            onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                        />
                                    </Col>
                                    <Col span={16}>
                                        <Select
                                            mode="tags"
                                            className="admin-select-large"
                                            placeholder={t('admin_placeholder_option_values')}
                                            style={{ width: '100%' }}
                                            value={opt.values}
                                            onChange={(val) => handleOptionValuesChange(index, val)}
                                            tokenSeparators={[',']}
                                            open={false}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <div style={{ padding: 48, textAlign: 'center', background: '#fcfcfc' }}>
                            <Button
                                type="dashed"
                                size="large"
                                onClick={handleAddOptionType}
                                icon={<PlusOutlined />}
                                className="admin-btn-responsive"
                            >
                                {t('admin_btn_add_option')}
                            </Button>
                        </div>
                    </Card>

                    <div className="admin-btn-group-between" style={{ marginTop: 40 }}>
                        <Button onClick={() => setCurrentStep(0)} size="large" className="admin-btn-responsive" style={{ border: '1px solid #d9d9d9' }}>{t('back')}</Button>
                        <Button type="primary" size="large" onClick={handleSubmitOptions} loading={loading} className="modern-btn-primary admin-btn-responsive">
                            {t('admin_btn_gen_variants')} <ArrowRightOutlined />
                        </Button>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <h3 className="dashboard-title" style={{ fontSize: 24 }}>{t('admin_alert_variants')}</h3>
                        <p style={{ color: 'var(--admin-text-sub)' }}>{t('admin_alert_variants_desc')}</p>
                    </div>

                    <Card bordered={false} className="beauty-card" bodyStyle={{ padding: 0 }}>
                        <Table
                            dataSource={variants}
                            rowKey="id"
                            pagination={false}
                            className="beauty-table"
                            scroll={{ x: 800 }}
                            columns={[
                                {
                                    title: t('admin_label_variant'),
                                    dataIndex: 'productVariantName',
                                    key: 'name',
                                    width: '25%',
                                    render: (text) => <span style={{ fontWeight: 700, color: 'var(--admin-primary)', fontSize: 16 }}>{text}</span>
                                },
                                {
                                    title: t('admin_label_price'),
                                    key: 'price',
                                    width: '25%',
                                    render: (_, record) => (
                                        <InputNumber
                                            className="admin-input-large"
                                            value={record.price}
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={(val) => handleVariantChange(record.id, 'price', val)}
                                            placeholder={t('admin_placeholder_price')}
                                        />
                                    )
                                },
                                {
                                    title: t('admin_label_stock'),
                                    key: 'stock',
                                    width: '20%',
                                    render: (_, record) => (
                                        <InputNumber
                                            className="admin-input-large"
                                            value={record.stockQuantity}
                                            min={0}
                                            style={{ width: '100%' }}
                                            onChange={(val) => handleVariantChange(record.id, 'stockQuantity', val)}
                                            placeholder={t('admin_placeholder_stock')}
                                        />
                                    )
                                },
                                {
                                    title: t('admin_product_image'),
                                    key: 'image',
                                    render: (_, record) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{
                                                width: 64, height: 64, background: '#f8f9fa', borderRadius: 12,
                                                overflow: 'hidden', border: '1px solid #eee', flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {(record.image || record.productImageUrl) ? (
                                                    <img src={getImageUrl(record.image || record.productImageUrl)} alt="v" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : <FileImageOutlined style={{ fontSize: 20, color: '#ccc' }} />}
                                            </div>
                                            <Upload showUploadList={false} beforeUpload={(file) => handleVariantImageUpload(record.id, file)}>
                                                <Button size="large" type="default" className="lang-btn" style={{ height: 44, borderRadius: 12 }}>{t('admin_btn_upload')}</Button>
                                            </Upload>
                                        </div>
                                    )
                                }
                            ]}
                            locale={{
                                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('admin_no_variants')} />
                            }}
                        />
                    </Card>

                    <div className="admin-btn-group-between" style={{ marginTop: 40 }}>
                        <Button size="large" onClick={() => navigate('/admin/products')} className="admin-btn-responsive" style={{ border: '1px solid #d9d9d9' }}>{t('admin_btn_finish_later')}</Button>
                        <Button type="primary" size="large" className="modern-btn-primary admin-btn-responsive" onClick={handleSaveVariants} loading={loading}>
                            <CheckCircleOutlined /> {t('admin_btn_save_finish')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCreate;
