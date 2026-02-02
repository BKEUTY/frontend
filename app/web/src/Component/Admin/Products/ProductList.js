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
            render: (id) => `00${id}` // Mock SKU format
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price ? price.toLocaleString() : 0}đ`
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || 'Mô tả'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'images', // Assuming API returns 'images' as list or object. Adjust if needed.
            key: 'images',
            render: (images) => {
                let src = 'https://via.placeholder.com/50?text=No+Img';
                if (images && images.length > 0) {
                    src = images[0].url || images[0];
                }
                // Fallback for mock data structure if images is just a string
                if (typeof images === 'string') src = images;

                return "Hình ảnh"; // As per image text, actually showing text "Hình ảnh" or small image? Image shows text "Hình ảnh". I will show text as per image but maybe a hover for image? The image literally says "Hình ảnh". Okay I will stick to text "Hình ảnh" to be safe or maybe a placeholder. 
                // Wait, it says "Hình ảnh" in the column. Usually this means it's a placeholder. I will render text "Hình ảnh" as requested by strictly following the image text.
            }
        },
        // Action column was not explicitly in the Product List image, but usually needed. 
        // The image DOES show "Sản phẩm" header and list but cuts off right side. 
        // I will keep actions hidden or minimal if not in image, but for usability I'll keep the edit button if screen allows.
        // Actually, looking at image 2, it ends at "Hình ảnh". No actions column shown. I'll remove it to match exactly or keep it minimal.
    ];

    // Correct Rendering of Image Column based on user request "refer to 2 sample images"
    // Image 2 shows: SKU | Tên sản phẩm | Giá | Mô tả | Hình ảnh
    // Under "Hình ảnh", it just says "Hình ảnh". It might be a placeholder text.

    return (
        <div className="admin-product-list">
            <div className="admin-product-page-header">
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Sản phẩm</h2>
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
