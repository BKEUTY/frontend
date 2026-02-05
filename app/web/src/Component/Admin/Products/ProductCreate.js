
import React, { useState } from 'react';
import {
    Steps, Form, Input, Button, Select, Upload, message, Card,
    Divider, Table, InputNumber, Row, Col, Alert
} from 'antd';
import {
    PlusOutlined, DeleteOutlined,
    ArrowRightOutlined, CheckCircleOutlined,
    CloudUploadOutlined, ShoppingOutlined,
    SettingOutlined, AppstoreAddOutlined,
    LeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { useLanguage } from '../../../i18n/LanguageContext';
import '../Admin.css';

const { Option } = Select;
const { TextArea } = Input;

const ProductCreate = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [createdProductId, setCreatedProductId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [optionTypes, setOptionTypes] = useState([
        { name: t('admin_product_color', 'Color'), values: [] }
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

            const res = await adminApi.createProduct(payload);
            if (res.status === 201 || res.status === 200) {
                const newProduct = res.data;
                const newProductId = newProduct.id;
                setCreatedProductId(newProductId);

                if (values.image && values.image.file) {
                    try {
                        const uploadRes = await adminApi.uploadProductImage(values.image.file.originFileObj, newProductId);
                        if (uploadRes.data && uploadRes.data.url) {
                            const imageUrl = uploadRes.data.url;
                            await adminApi.updateProduct({
                                id: newProductId,
                                name: values.name,
                                image: imageUrl
                            });
                        }
                    } catch (uploadErr) {
                        message.warning(t('admin_error_upload_img'));
                    }
                }

                message.success(t('admin_msg_create_success'));
                setCurrentStep(1);
            }
        } catch (error) {
            message.error(t('admin_error_create'));
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
            message.error(t("admin_error_at_least_one_option"));
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

            await adminApi.createOption(payload);
            message.success(t('admin_msg_options_success'));
            await fetchVariants(createdProductId);
            setCurrentStep(2);
        } catch (error) {
            message.error(t('admin_error_options_save'));
        } finally {
            setLoading(false);
        }
    };

    const fetchVariants = async (pid) => {
        try {
            const res = await adminApi.getVariants(pid);
            setVariants(res.data || []);
        } catch (error) {
            message.error(t("admin_error_fetch_variants"));
        }
    };

    const handleVariantChange = (id, field, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleVariantImageUpload = async (id, file) => {
        try {
            message.loading({ content: t('loading'), key: 'skuUpload' });
            const res = await adminApi.uploadSkuImage(file, `variant-${id}`);
            const url = res.data.url;
            handleVariantChange(id, 'image', url);
            handleVariantChange(id, 'productImageUrl', url);
            message.success({ content: t('success'), key: 'skuUpload' });
            return false;
        } catch (error) {
            message.error({ content: t('error'), key: 'skuUpload' });
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
                })
            ));

            message.success(t('admin_msg_variants_success'));
            navigate('/admin/products');
        } catch (error) {
            message.error(t('admin_error_variant_update'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-create-container" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
            {/* Header */}
            <header style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                <Button
                    icon={<LeftOutlined />}
                    shape="circle"
                    onClick={() => navigate('/admin/products')}
                    style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                />
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#111', letterSpacing: '-0.5px' }}>
                        {t('admin_product_create')}
                    </h2>
                    <p style={{ color: '#8c8c8c', margin: '4px 0 0', fontSize: 14 }}>
                        {t('admin_create_desc')}
                    </p>
                </div>
            </header>

            <Card bordered={false} className="modern-step-card" bodyStyle={{ padding: '40px' }}>
                <Steps
                    current={currentStep}
                    className="custom-steps"
                    style={{ marginBottom: 48 }}
                    items={[
                        { title: t('admin_step_info'), icon: <ShoppingOutlined /> },
                        { title: t('admin_step_options'), icon: <SettingOutlined /> },
                        { title: t('admin_step_variants'), icon: <AppstoreAddOutlined /> }
                    ]}
                />

                {currentStep === 0 && (
                    <Form form={form} layout="vertical" onFinish={handleCreateProduct} requiredMark={false}>
                        <Row gutter={32}>
                            <Col xs={24} lg={15}>
                                <div className="form-section-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <SettingOutlined style={{ color: 'var(--admin-primary)' }} />
                                        {t('admin_section_general')}
                                    </h3>
                                    <Form.Item
                                        name="name"
                                        label={<span style={{ fontWeight: 600 }}>{t('admin_label_name')}</span>}
                                        rules={[{ required: true, message: t('admin_error_name_required') }]}
                                    >
                                        <Input className="admin-input-large" placeholder={t('admin_placeholder_product_name')} />
                                    </Form.Item>
                                    <Form.Item
                                        name="description"
                                        label={<span style={{ fontWeight: 600 }}>{t('admin_label_desc')}</span>}
                                    >
                                        <TextArea className="admin-input-large" rows={5} placeholder={t('admin_placeholder_desc')} showCount maxLength={500} />
                                    </Form.Item>
                                </div>
                            </Col>

                            <Col xs={24} lg={9}>
                                <div className="form-section-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{t('admin_section_organization')}</h3>
                                    <Form.Item
                                        name="categories"
                                        label={<span style={{ fontWeight: 600 }}>{t('admin_label_category')}</span>}
                                        rules={[{ required: true, message: t('admin_error_category_required') }]}
                                    >
                                        <Select mode="tags" className="admin-input-large" placeholder={t('admin_placeholder_categories')} style={{ width: '100%' }}>
                                            <Option value="1">{t('skincare')}</Option>
                                            <Option value="2">{t('makeup')}</Option>
                                            <Option value="3">{t('body_care')}</Option>
                                            <Option value="4">{t('hair_care')}</Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-section-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{t('admin_section_media')}</h3>
                                    <Form.Item name="image">
                                        <Upload.Dragger
                                            maxCount={1}
                                            beforeUpload={() => false}
                                            style={{ borderRadius: 12, background: '#fafafa', border: '2px dashed #eee' }}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <CloudUploadOutlined style={{ color: 'var(--admin-primary)', fontSize: 32 }} />
                                            </p>
                                            <p className="ant-upload-text" style={{ fontSize: 14, fontWeight: 500 }}>{t('admin_btn_upload')}</p>
                                            <p className="ant-upload-hint" style={{ fontSize: 12 }}>PNG, JPG up to 5MB</p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                            <Button type="primary" size="large" htmlType="submit" loading={loading} className="modern-btn-primary" style={{ minWidth: 180, height: 48 }}>
                                {t('admin_btn_create_continue')} <ArrowRightOutlined />
                            </Button>
                        </div>
                    </Form>
                )}

                {currentStep === 1 && (
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{t('admin_alert_options')}</h3>
                            <p style={{ color: '#8c8c8c' }}>{t('admin_alert_options_desc')}</p>
                        </div>

                        {optionTypes.map((opt, index) => (
                            <div key={index} className="form-section-card" style={{ padding: 24, position: 'relative' }}>
                                {index > 0 && (
                                    <Button
                                        type="text"
                                        danger
                                        className="delete-btn-absolute"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveOptionType(index)}
                                        style={{ position: 'absolute', right: 12, top: 12 }}
                                    />
                                )}
                                <Row gutter={24}>
                                    <Col xs={24} md={10}>
                                        <Form.Item label={<span style={{ fontWeight: 600 }}>{t('admin_label_option_name')}</span>}>
                                            <Input
                                                className="admin-input-large"
                                                placeholder="e.g. Color, Size"
                                                value={opt.name}
                                                onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={14}>
                                        <Form.Item label={<span style={{ fontWeight: 600 }}>{t('admin_label_values_press_enter')}</span>}>
                                            <Select
                                                mode="tags"
                                                className="admin-input-large"
                                                placeholder="e.g. Red, Blue, XL"
                                                value={opt.values}
                                                onChange={(val) => handleOptionValuesChange(index, val)}
                                                open={false}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        ))}

                        <Button
                            type="dashed"
                            size="large"
                            onClick={handleAddOptionType}
                            block
                            icon={<PlusOutlined />}
                            style={{ marginBottom: 40, borderRadius: 12, height: 48, fontWeight: 600, borderStyle: 'dashed', borderWidth: 2 }}
                        >
                            {t('admin_btn_add_option')}
                        </Button>

                        <Divider style={{ margin: '32px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => setCurrentStep(0)} size="large" style={{ borderRadius: 12, height: 48, minWidth: 120 }}>{t('back')}</Button>
                            <Button type="primary" size="large" onClick={handleSubmitOptions} loading={loading} className="modern-btn-primary" style={{ minWidth: 200, height: 48 }}>
                                {t('admin_btn_gen_variants')} <ArrowRightOutlined />
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{t('admin_alert_variants')}</h3>
                            <p style={{ color: '#8c8c8c' }}>{t('admin_alert_variants_desc')}</p>
                        </div>

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
                                    width: '30%',
                                    render: (text) => <span style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{text}</span>
                                },
                                {
                                    title: t('admin_label_price'),
                                    key: 'price',
                                    render: (_, record) => (
                                        <InputNumber
                                            className="admin-input-large"
                                            value={record.price}
                                            min={0}
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={(val) => handleVariantChange(record.id, 'price', val)}
                                        />
                                    )
                                },
                                {
                                    title: t('admin_label_stock'),
                                    key: 'stock',
                                    render: (_, record) => (
                                        <InputNumber
                                            className="admin-input-large"
                                            value={record.stockQuantity}
                                            min={0}
                                            style={{ width: '100%' }}
                                            onChange={(val) => handleVariantChange(record.id, 'stockQuantity', val)}
                                        />
                                    )
                                },
                                {
                                    title: t('admin_product_image'),
                                    key: 'image',
                                    width: 140,
                                    render: (_, record) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 44, height: 44, background: '#f8f9fa', borderRadius: 8,
                                                overflow: 'hidden', border: '1px solid #eee', flexShrink: 0
                                            }}>
                                                {(record.image || record.productImageUrl) ? (
                                                    <img src={record.image || record.productImageUrl} alt="v" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : <SettingOutlined style={{ margin: 12, color: '#ccc' }} />}
                                            </div>
                                            <Upload showUploadList={false} beforeUpload={(file) => handleVariantImageUpload(record.id, file)}>
                                                <Button size="small" type="text" style={{ color: 'var(--admin-primary)', fontWeight: 600 }}>{t('admin_btn_upload')}</Button>
                                            </Upload>
                                        </div>
                                    )
                                }
                            ]}
                        />

                        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                            <Button size="large" onClick={() => navigate('/admin/products')} style={{ borderRadius: 12, height: 48 }}>{t('admin_btn_finish_later')}</Button>
                            <Button type="primary" size="large" className="modern-btn-primary" onClick={handleSaveVariants} loading={loading} style={{ minWidth: 200, height: 48 }}>
                                <CheckCircleOutlined /> {t('admin_btn_save_finish')}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProductCreate;
