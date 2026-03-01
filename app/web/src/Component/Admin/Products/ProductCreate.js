import React, { useState } from 'react';
import {
    Steps, Form, Input, Button, Select, Upload, notification,
    Table, InputNumber, Row, Col, Typography, Empty
} from 'antd';
import {
    PlusOutlined, DeleteOutlined,
    ArrowRightOutlined, CheckCircleOutlined,
    CloudUploadOutlined, ShoppingOutlined,
    SettingOutlined, TableOutlined,
    FileImageOutlined, LoadingOutlined, EyeOutlined, EditOutlined,
    StarFilled, ThunderboltFilled, ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { getImageUrl } from '../../../api/axiosClient';
import { useLanguage } from '../../../i18n/LanguageContext';
import product_placeholder from '../../../Assets/Images/Products/product_placeholder.svg';
import '../../../pages/Product/ProductDetail.css';
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
    const [isPreview, setIsPreview] = useState(false);

    const [optionTypes, setOptionTypes] = useState([
        { name: t('admin_product_color'), values: [] }
    ]);

    const [variants, setVariants] = useState([]);

    const imageField = Form.useWatch('image', form);
    const previewImage = imageField?.file?.originFileObj ? URL.createObjectURL(imageField.file.originFileObj) : product_placeholder;

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

            await adminApi.createOption(payload);
            notification.success({
                message: t('success'),
                description: t('admin_msg_options_success'),
                key: 'admin_msg_options_success'
            });
            await fetchVariants(createdProductId);
            setCurrentStep(2);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const fetchVariants = async (pid) => {
        try {
            const res = await adminApi.getVariants(pid);
            let fetchedVariants = res.data || [];

            const validOptions = optionTypes.filter(o => o.name.trim() !== '' && o.values.length > 0);
            if (validOptions.length > 0) {
                const suffixes = [];
                const generateCombinations = (opts, index = 0, currentCombo = []) => {
                    if (index === opts.length) {
                        suffixes.push(currentCombo.join(' - '));
                        return;
                    }
                    for (let val of opts[index].values) {
                        generateCombinations(opts, index + 1, [...currentCombo, val]);
                    }
                };
                generateCombinations(validOptions);

                fetchedVariants = fetchedVariants.map((v, idx) => {
                    const baseName = v.productName || v.productVariantName || '';
                    if (suffixes[idx] && !baseName.includes(suffixes[idx])) {
                        return { ...v, displayVariantName: `${baseName} - ${suffixes[idx]}` };
                    }
                    return { ...v, displayVariantName: baseName };
                });
            } else {
                fetchedVariants = fetchedVariants.map(v => ({ ...v, displayVariantName: v.productName || v.productVariantName }));
            }

            setVariants(fetchedVariants);
        } catch (error) {

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
            const res = await adminApi.uploadSkuImage(file, `variant-${id}`);
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
            notification.destroy('skuUpload');
            return false;
        }
    };

    const handleSaveVariants = async () => {
        setLoading(true);
        try {
            await Promise.all(variants.map(v =>
                adminApi.updateVariant({
                    id: v.id,
                    productVariantName: v.displayVariantName || v.productVariantName,
                    price: v.price || 0,
                    stockQuantity: v.stockQuantity || 0,
                    status: 'ACTIVE',
                    productImageUrl: v.image || v.productImageUrl
                })
            ));

            notification.success({
                message: t('success'),
                description: t('admin_msg_variants_success'),
                key: 'admin_msg_variants_success'
            });
            navigate(`/product/${createdProductId}`);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-create-container" style={{ paddingBottom: 60 }}>
            <div className="product-header-section">
                <div
                    className="admin-back-btn"
                    onClick={() => navigate('/admin/products')}
                >
                    <ArrowRightOutlined style={{ transform: 'rotate(180deg)' }} />
                </div>
                <div className="product-header-info">
                    <h2>{t('admin_product_create')}</h2>
                    <p>{t('admin_create_desc')}</p>
                </div>
            </div>

            <div className="steps-wrapper" style={{ marginBottom: 40 }}>
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

            <div className="product-detail-page admin-product-create-preview" style={{ padding: 0, background: 'transparent' }}>
                <div className="product-top-section" style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)', borderRadius: '8px' }}>
                    <div className="product-gallery">
                        <div className="thumbnail-list">
                            <div className="thumb-item active"><img src={previewImage} alt="thumb" /></div>
                            <div className="thumb-item"><img src={product_placeholder} alt="thumb" /></div>
                            <div className="thumb-item"><img src={product_placeholder} alt="thumb" /></div>
                        </div>
                        <div className="main-image" style={{ padding: 0, border: '1px solid #f9f9f9', background: '#fff', overflow: 'hidden', borderRadius: '8px' }}>
                            {currentStep === 0 ? (
                                <Form.Item name="image" style={{ margin: 0, width: '100%', height: '100%' }} form={form}>
                                    <Upload.Dragger maxCount={1} beforeUpload={() => false} showUploadList={false} className="admin-upload-dragger" style={{ minHeight: '100%', border: 'none', background: 'transparent' }}>
                                        {imageField ? (
                                            <img src={previewImage} alt="product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                                                <CloudUploadOutlined style={{ color: 'var(--admin-primary)', fontSize: 48, marginBottom: 16 }} />
                                                <p style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>{t('admin_btn_upload')}</p>
                                                <p style={{ color: '#94a3b8' }}>JPG, PNG, WEBP</p>
                                            </div>
                                        )}
                                    </Upload.Dragger>
                                </Form.Item>
                            ) : (
                                <img src={previewImage} alt="product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            )}
                        </div>
                    </div>

                    <div className="product-info-side">
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                            <div className="brand-label" style={{ marginBottom: 0 }}>BKEUTY</div>
                            <Button
                                type={isPreview ? "primary" : "default"}
                                icon={isPreview ? <EditOutlined /> : <EyeOutlined />}
                                onClick={() => setIsPreview(!isPreview)}
                                style={{ borderRadius: '6px', fontSize: '0.9rem', height: 36, borderColor: '#ddd', fontWeight: 600 }}
                            >
                                {isPreview ? t('admin_btn_edit_mode') : t('admin_btn_preview')}
                            </Button>
                        </div>

                        {currentStep === 0 ? (
                            <Form form={form} layout="vertical" onFinish={handleCreateProduct} requiredMark={false} style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <Form.Item name="name" rules={[{ required: true, message: t('admin_error_name_required') }]} style={{ marginBottom: 16 }}>
                                    <Input className="preview-title-input" placeholder={t('admin_placeholder_product_name')} style={{ fontSize: '2rem', fontFamily: 'var(--inter_font)', fontWeight: 800, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }} />
                                </Form.Item>

                                {isPreview && (
                                    <div className="flash-deal-banner">
                                        <div className="flash-deal-left">
                                            <span className="flash-icon"><ThunderboltFilled /></span> FLASH DEAL
                                        </div>
                                        <div className="flash-countdown">
                                            <ClockCircleOutlined style={{ marginRight: '5px' }} /> {t('ends_in')}: <span>02</span>:<span>04</span>:<span>42</span>
                                        </div>
                                    </div>
                                )}

                                {isPreview && (
                                    <div className="detail-price" style={{ marginBottom: 25, fontSize: '1.8rem', fontWeight: 700, color: 'var(--color_main_title)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        0đ <span className="vat-tag" style={{ color: '#999', fontSize: '0.9rem', fontWeight: 400 }}>{t('admin_hint_price_step_3')}</span>
                                    </div>
                                )}

                                <Row gutter={24} style={{ marginBottom: 20 }}>
                                    <Col span={24}>
                                        <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.95rem' }}>{t('admin_label_category')}</div>
                                        <Form.Item name="categories" rules={[{ required: true, message: t('admin_error_category_required') }]} style={{ marginBottom: 0 }}>
                                            <Select mode="multiple" className="admin-select-large" placeholder={t('admin_placeholder_categories')} style={{ width: '100%', border: '1px solid #ddd' }}>
                                                <Option value="1">{t('skincare')}</Option>
                                                <Option value="2">{t('makeup')}</Option>
                                                <Option value="3">{t('body_care')}</Option>
                                                <Option value="4">{t('hair_care')}</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.95rem' }}>{t('admin_label_desc')}</div>
                                <Form.Item name="description" style={{ marginBottom: 30 }}>
                                    <TextArea className="admin-input-textarea" rows={4} placeholder={t('admin_placeholder_desc')} style={{ border: '1px solid #ddd', borderRadius: '4px', boxShadow: 'none' }} />
                                </Form.Item>

                                {isPreview && (
                                    <div className="shipping-info-box">
                                        <div className="shipping-header">
                                            <span className="now-free-icon">NowFree</span>
                                            <strong>{t('fast_delivery_2h')}</strong>
                                        </div>
                                        <div className="shipping-desc">
                                            {t('fast_delivery_desc')}
                                        </div>
                                    </div>
                                )}

                                <div className="actions" style={{ marginTop: 'auto', display: 'flex', width: '100%' }}>
                                    <Button type="primary" htmlType="submit" loading={loading} className="btn-add-bag" style={{ width: '100%', borderRadius: '4px' }}>
                                        {t('admin_btn_create_continue')} <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </Form>
                        ) : (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <h1 className="detail-title" style={{ fontSize: '2rem', marginBottom: 15 }}>{form.getFieldValue('name')}</h1>

                                {isPreview && (
                                    <div className="flash-deal-banner">
                                        <div className="flash-deal-left">
                                            <span className="flash-icon"><ThunderboltFilled /></span> FLASH DEAL
                                        </div>
                                        <div className="flash-countdown">
                                            <ClockCircleOutlined style={{ marginRight: '5px' }} /> {t('ends_in')}: <span>02</span>:<span>04</span>:<span>42</span>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 ? (
                                    <div className="product-options-section" style={{ marginTop: 10 }}>
                                        <h3 style={{ marginBottom: 20, fontSize: '1.05rem', fontWeight: 600, color: '#333' }}>{t('admin_step_options')}</h3>

                                        {optionTypes.map((opt, index) => (
                                            <div key={index} className="option-group" style={{ marginBottom: 20, background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                                    <Input
                                                        value={opt.name}
                                                        onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                                        placeholder={t('admin_placeholder_option_name')}
                                                        style={{ width: '60%', fontWeight: 600, fontSize: '0.95rem', border: 'none', borderBottom: '1px solid #ddd', borderRadius: 0, paddingLeft: 0, background: 'transparent', boxShadow: 'none' }}
                                                    />
                                                    {index > 0 && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveOptionType(index)} />}
                                                </div>
                                                <Select
                                                    mode="tags"
                                                    className="admin-select-large"
                                                    placeholder={t('admin_placeholder_option_values')}
                                                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                                                    value={opt.values}
                                                    onChange={(val) => handleOptionValuesChange(index, val)}
                                                    tokenSeparators={[',']}
                                                    open={false}
                                                />
                                            </div>
                                        ))}

                                        <Button type="dashed" onClick={handleAddOptionType} icon={<PlusOutlined />} style={{ width: '100%', height: 44, borderRadius: '4px', borderColor: '#ddd' }}>
                                            {t('admin_btn_add_option')}
                                        </Button>

                                        {isPreview && (
                                            <div className="shipping-info-box">
                                                <div className="shipping-header">
                                                    <span className="now-free-icon">{t('now_free_badge')}</span>
                                                    <strong>{t('fast_delivery_2h')}</strong>
                                                </div>
                                                <div className="shipping-desc">
                                                    {t('fast_delivery_details_ext')}
                                                </div>
                                            </div>
                                        )}

                                        <div className="actions" style={{ marginTop: 30, display: 'flex', gap: 15, width: '100%' }}>
                                            <Button onClick={() => setCurrentStep(0)} style={{ flex: 1, height: 46, borderRadius: '4px', border: '1px solid #ddd' }}>
                                                {t('back')}
                                            </Button>
                                            <Button type="primary" onClick={handleSubmitOptions} loading={loading} className="btn-add-bag" style={{ flex: 2, margin: 0 }}>
                                                {t('admin_btn_gen_variants')} <ArrowRightOutlined style={{ marginLeft: 8 }} />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="product-options-section" style={{ marginTop: 10, marginBottom: 20 }}>
                                            {optionTypes.map((opt, index) => (
                                                <div key={index} className="option-group" style={{ marginBottom: 15 }}>
                                                    <span className="option-label" style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 10, display: 'block' }}>{opt.name}:</span>
                                                    <div className="size-options">
                                                        {opt.values.map((v, i) => (
                                                            <button key={i} className="size-btn">{v}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="product-variants-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ marginBottom: 15, fontSize: '1.05rem', fontWeight: 600 }}>{t('admin_step_variants')}</h3>
                                            <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: 8 }} className="custom-scrollbar">
                                                {variants.map(record => (
                                                    <div key={record.id} style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15, padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fcfcfc' }}>
                                                        <div style={{ width: 64, height: 64, background: '#fff', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eaeaea' }}>
                                                            <Upload showUploadList={false} beforeUpload={(file) => handleVariantImageUpload(record.id, file)}>
                                                                {(record.image || record.productImageUrl) ? (
                                                                    <img src={getImageUrl(record.image || record.productImageUrl)} alt="v" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                                                                ) : (
                                                                    <div style={{ cursor: 'pointer', textAlign: 'center', color: '#ccc' }}>
                                                                        <FileImageOutlined style={{ fontSize: 20 }} />
                                                                    </div>
                                                                )}
                                                            </Upload>
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 600, color: '#333', marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                                                                {record.displayVariantName || record.productName || record.productVariantName}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: 15 }}>
                                                                {isPreview ? (
                                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px dashed #fad1e6' }}>
                                                                            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>{t('admin_label_price')}:</span>
                                                                            <span style={{ fontSize: '1.05rem', color: 'var(--admin-primary)', fontWeight: 700 }}>
                                                                                {record.price ? `${record.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}₫
                                                                            </span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px dashed #e2e8f0' }}>
                                                                            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>{t('admin_label_stock')}:</span>
                                                                            <span style={{ fontSize: '1.05rem', color: '#334155', fontWeight: 700 }}>
                                                                                {record.stockQuantity || 0}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div style={{ flex: 1 }}>
                                                                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: 4 }}>{t('admin_label_price')}</div>
                                                                            <InputNumber
                                                                                className="admin-input-large"
                                                                                value={record.price}
                                                                                min={0}
                                                                                style={{ width: '100%', height: 40, lineHeight: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                onChange={(val) => handleVariantChange(record.id, 'price', val)}
                                                                            />
                                                                        </div>
                                                                        <div style={{ flex: 1 }}>
                                                                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: 4 }}>{t('admin_label_stock')}</div>
                                                                            <InputNumber
                                                                                className="admin-input-large"
                                                                                value={record.stockQuantity}
                                                                                min={0}
                                                                                style={{ width: '100%', height: 40, lineHeight: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                                                onChange={(val) => handleVariantChange(record.id, 'stockQuantity', val)}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {isPreview && (
                                                <div className="shipping-info-box" style={{ marginTop: 20 }}>
                                                    <div className="shipping-header">
                                                        <span className="now-free-icon">{t('now_free_badge')}</span>
                                                        <strong>{t('fast_delivery_2h')}</strong>
                                                    </div>
                                                    <div className="shipping-desc">
                                                        {t('fast_delivery_details_ext')}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="actions" style={{ marginTop: 'auto', display: 'flex', gap: 15, width: '100%', paddingTop: 20 }}>
                                                <Button onClick={() => navigate('/admin/products')} style={{ flex: 1, height: 46, borderRadius: '4px', border: '1px solid #ddd', padding: 0 }}>
                                                    {t('admin_btn_finish_later')}
                                                </Button>
                                                <Button type="primary" className="btn-add-bag" onClick={handleSaveVariants} loading={loading} style={{ flex: 2, margin: 0, padding: 0 }}>
                                                    <CheckCircleOutlined style={{ marginRight: 8 }} /> {t('admin_btn_save_finish')}
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductCreate;
