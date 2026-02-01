

const productApi = {
    getAll: (params) => {
        // Mock Data for User Functionalities
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        content: [
                            { id: 1, name: 'Kem Dưỡng Ẩm BKEUTY Hydra-Deep', price: 450000, brand: 'BKEUTY', image: null, rating: 4.9, sold: 1000, tag: 'HOT' },
                            { id: 2, name: 'Son Môi Lì Mịn Môi Matte Lipstick', price: 320000, brand: 'MAC', image: null, rating: 4.7, sold: 500, discount: '10%' },
                            { id: 3, name: 'Nước Hoa Hồng Dịu Nhẹ Toner', price: 150000, brand: 'Laroche Posay', image: null, rating: 4.5, sold: 200 },
                            { id: 4, name: 'Serum Vitamin C Sáng Da Clinical', price: 550000, brand: 'Obagi', image: null, rating: 4.8, sold: 300, tag: 'NEW' },
                            { id: 5, name: 'Kem Chống Nắng Phổ Rộng Perfect UV', price: 420000, brand: 'Anessa', image: null, rating: 4.6, sold: 850 },
                            { id: 6, name: 'Mặt Nạ Giấy Cấp Ẩm Tea Tree', price: 25000, brand: 'Innisfree', image: null, rating: 4.9, sold: 5000 },
                            { id: 7, name: 'Tẩy Trang Cho Da Nhạy Cảm Sensibio', price: 180000, brand: 'Bioderma', image: null, rating: 4.7, sold: 1200 },
                            { id: 8, name: 'Xịt Khoáng Cấp Nước Mineral 89', price: 280000, brand: 'Vichy', image: null, rating: 4.5, sold: 600 },
                            { id: 9, name: 'Sữa Rửa Mặt Tạo Bọt Foaming Cleanser', price: 120000, brand: 'Cerave', image: null, rating: 4.6, sold: 900 },
                            { id: 10, name: 'Dầu Dưỡng Tóc Mềm Mượt Treatment', price: 350000, brand: 'Moroccanoil', image: null, rating: 4.8, sold: 400 },
                            // Add more items to simulate pagination if needed
                            { id: 11, name: 'Phấn Nước Cushion Che Phủ Cao', price: 380000, brand: 'Clio', image: null, rating: 4.7, sold: 450 },
                            { id: 12, name: 'Mascara Dài Mi Chống Nước', price: 190000, brand: 'Maybelline', image: null, rating: 4.4, sold: 1200 },
                            { id: 13, name: 'Kem Nền Lâu Trôi 24h', price: 290000, brand: 'L\'Oreal', image: null, rating: 4.5, sold: 800 },
                            { id: 14, name: 'Chì Kẻ Mày Siêu Mảnh', price: 120000, brand: 'Lemonade', image: null, rating: 4.8, sold: 1500 },
                            { id: 15, name: 'Son Tint Bóng Căng Mọng', price: 160000, brand: 'Romand', image: null, rating: 4.9, sold: 3000 },
                        ],
                        totalPages: 1,
                        totalElements: 15
                    }
                });
            }, 500);
        });
        // const url = '/product';
        // return axiosClient.get(url, { params });
    },
    getById: (id) => {
        // Mock Single Product
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        id: id,
                        name: 'Kem Dưỡng Mock Product',
                        price: 450000,
                        brand: 'BKEUTY',
                        image: null,
                        rating: 4.9,
                        sold: 1000,
                        description: "This is a mock product description for testing purposes.",
                        images: []
                    }
                });
            }, 300);
        });
        // const url = `/product/${id}`;
        // return axiosClient.get(url);
    }
};

export default productApi;
