import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { PlusSquareOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { useLanguage } from '../../../i18n/LanguageContext';

const ProductList = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const navigate = useNavigate();

    const fetchProducts = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await adminApi.getAllProducts(page - 1, size);
            const { content, totalElements } = response.data;
            setData(content);
            setPagination(prev => ({
                ...prev,
                current: page,
                total: totalElements
            }));
        } catch (error) {
            console.error("Fetch products failed", error);
            message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize);
    };

    const columns = [
        {
            title: 'SKU',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id) => `00${id}`
        },
        {
            title: t('admin_product_name', 'Tên sản phẩm'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
        },
        {
            title: t('admin_product_price', 'Giá'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price ? price.toLocaleString() : 0}đ`
        },
        {
            title: t('description', 'Mô tả'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || t('description', 'Mô tả')
        },
        {
            title: t('admin_product_image', 'Hình ảnh'),
            dataIndex: 'images',
            key: 'images',
            render: () => t('admin_product_image', 'Hình ảnh')
        },
    ];

    return (
        <div className="admin-product-list">
            <div className="admin-product-page-header">
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{t('products', 'Sản phẩm')}</h2>
                <PlusSquareOutlined
                    className="product-add-btn-large"
                    onClick={() => navigate('/admin/products/create')}
                />
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 800 }}
                className="custom-table"
            />
        </div>
    );
};

export default ProductList;
