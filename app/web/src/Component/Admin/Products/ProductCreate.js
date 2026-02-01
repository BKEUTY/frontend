
import React, { useState } from 'react';
import {
    Steps, Form, Input, Button, Select, Upload, message, Card,
    Space, Table, InputNumber, Row, Col, Alert
} from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { useLanguage } from '../../../i18n/LanguageContext';

const { Option } = Select;
const { TextArea } = Input;

const ProductCreate = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [createdProductId, setCreatedProductId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Step 2: Options State
    const [optionTypes, setOptionTypes] = useState([
        { name: 'Color', values: [] }
    ]);

    // Step 3: Variants State
    const [variants, setVariants] = useState([]);

    // --- STEP 0: PRODUCT INFO ---
    const handleCreateProduct = async (values) => {
        setLoading(true);
        try {
            // Check if image is uploaded
            if (values.image && values.image.file) {

            }

            const payload = {
                name: values.name,
                description: values.description,
                productCategories: values.categories ? values.categories.map(Number) : [1],
                image: ''
            };

            const res = await adminApi.createProduct(payload);
            if (res.status === 201 || res.status === 200) {
                const newProduct = res.data;
                setCreatedProductId(newProduct.id);
                message.success(t('Product created successfully!'));

                // Handle Image Upload if exists
                if (values.image && values.image.file) {
                    try {
                        const uploadRes = await adminApi.uploadProductImage(values.image.file.originFileObj, newProduct.id);
                        if (uploadRes.data && uploadRes.data.url) {
                            // Update product with image URL
                            await adminApi.updateProduct({
                                id: newProduct.id,
                                image: uploadRes.data.url
                            });
                        }
                    } catch (uploadErr) {
                        message.warning('Product created but image upload failed.');
                        console.error(uploadErr);
                    }
                }

                setCurrentStep(1);
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to create product. ' + (error.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 1: OPTIONS ---
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
        // val is array of strings (Select tags)
        const newTypes = [...optionTypes];
        newTypes[index].values = val;
        setOptionTypes(newTypes);
    };

    const handleSubmitOptions = async () => {
        if (!createdProductId) return;

        // Validation
        const validOptions = optionTypes.filter(o => o.name.trim() !== '' && o.values.length > 0);
        if (validOptions.length === 0) {
            message.error("Please add at least one valid option (e.g. Color: Red)");
            return;
        }

        setLoading(true);
        try {
            // Loop through options and create each

            const payload = {
                productId: createdProductId,
                productOptionValues: validOptions.map(opt => ({
                    optionName: opt.name,
                    optionValues: opt.values
                }))
            };

            await adminApi.createOption(payload);
            message.success('Options created successfully!');

            // Move to Variants step
            await fetchVariants();
            setCurrentStep(2);

        } catch (error) {
            console.error(error);
            message.error('Failed to save options.');
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VARIANTS ---
    const fetchVariants = async () => {
        try {
            const res = await adminApi.getVariants(createdProductId);
            setVariants(res.data || []);
        } catch (error) {
            console.error("Fetch variants error", error);
        }
    };

    const handleVariantChange = (id, field, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };


    const handleVariantImageUpload = async (id, file) => {
        try {
            message.loading({ content: 'Uploading...', key: 'skuUpload' });
            const res = await adminApi.uploadSkuImage(file, `variant-${id}`);
            const url = res.data.url;
            handleVariantChange(id, 'image', url);
            message.success({ content: 'Uploaded!', key: 'skuUpload' });
            return false;
        } catch (error) {
            message.error({ content: 'Upload failed', key: 'skuUpload' });
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
                    price: v.price,
                    stockQuantity: v.stockQuantity,
                    sku: v.sku,
                    status: 'ACTIVE',
                    productImageUrl: v.image
                })
            ));

            message.success('All variants updated!');
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            message.error('Some updates failed.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="product-create-container">
            <Card title={t('admin_create_title')} bordered={false}>
                <Steps current={currentStep} style={{ marginBottom: 40 }} responsive>
                    <Steps.Step title={t('admin_step_info')} />
                    <Steps.Step title={t('admin_step_options')} />
                    <Steps.Step title={t('admin_step_variants')} />
                </Steps>

                {/* STEP 0: INFO */}
                {currentStep === 0 && (
                    <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
                        <Form.Item name="name" label={t('admin_label_name')} rules={[{ required: true }]}>
                            <Input placeholder="e.g. BKEUTY Moisture Cream" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="categories" label={t('admin_label_category')} rules={[{ required: true }]}>
                                    <Select mode="tags" placeholder="Enter Category IDs">
                                        <Option value="1">Skincare (1)</Option>
                                        <Option value="2">Makeup (2)</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="brand" label={t('admin_label_brand')}>
                                    <Input placeholder="e.g. BKT" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="description" label={t('admin_label_desc')}>
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item name="image" label={t('admin_label_image')}>
                            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                {t('admin_btn_create_continue')}
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {/* STEP 1: OPTIONS */}
                {currentStep === 1 && (
                    <div>
                        <Alert
                            message={t('admin_alert_options')}
                            description={t('admin_alert_options_desc')}
                            type="info"
                            showIcon
                            style={{ marginBottom: 24 }}
                        />

                        {optionTypes.map((opt, index) => (
                            <Card
                                key={index}
                                type="inner"
                                title={`Option ${index + 1}`}
                                extra={index > 0 && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveOptionType(index)} />}
                                style={{ marginBottom: 16 }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input
                                        placeholder={t('admin_label_option_name')}
                                        value={opt.name}
                                        onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                    />
                                    <Select
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder={t('admin_label_option_values')}
                                        value={opt.values}
                                        onChange={(val) => handleOptionValuesChange(index, val)}
                                        open={false}
                                    />
                                </Space>
                            </Card>
                        ))}

                        <Button type="dashed" onClick={handleAddOptionType} block icon={<PlusOutlined />} style={{ marginBottom: 24 }}>
                            {t('admin_btn_add_option')}
                        </Button>

                        <Button type="primary" onClick={handleSubmitOptions} loading={loading} block>
                            {t('admin_btn_gen_variants')}
                        </Button>
                    </div>
                )}

                {/* STEP 2: VARIANTS */}
                {currentStep === 2 && (
                    <div>
                        <Alert
                            message={t('admin_alert_variants')}
                            description={t('admin_alert_variants_desc')}
                            style={{ marginBottom: 16 }}
                        />

                        <Table
                            dataSource={variants}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 600 }}
                            columns={[
                                { title: t('admin_label_variant'), dataIndex: 'productVariantName', key: 'name' },
                                {
                                    title: t('admin_label_price'),
                                    key: 'price',
                                    render: (_, record) => (
                                        <InputNumber
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
                                            value={record.stockQuantity}
                                            min={0}
                                            onChange={(val) => handleVariantChange(record.id, 'stockQuantity', val)}
                                        />
                                    )
                                },
                                {
                                    title: t('admin_product_image'),
                                    key: 'image',
                                    width: 120,
                                    render: (_, record) => (
                                        <Space>
                                            {record.image && <img src={record.image} alt="var" style={{ width: 30, height: 30, objectFit: 'cover' }} />}
                                            <Upload
                                                showUploadList={false}
                                                beforeUpload={(file) => handleVariantImageUpload(record.id, file)}
                                            >
                                                <Button size="small" icon={<UploadOutlined />} />
                                            </Upload>
                                        </Space>
                                    )
                                }
                            ]}
                        />

                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <Button onClick={() => navigate('/admin/products')}>{t('admin_btn_finish_later')}</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveVariants} loading={loading}>
                                {t('admin_btn_save_finish')}
                            </Button>
                        </div>
                    </div>
                )}

            </Card>
        </div>
    );
};

export default ProductCreate;
