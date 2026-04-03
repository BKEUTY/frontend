# BKEUTY - Modern E-commerce Platform (Frontend)

BKEUTY là nền tảng thương mại điện tử chuyên về sản phẩm làm đẹp, được xây dựng với kiến trúc hiện đại, hiệu năng cao và trải nghiệm người dùng mượt mà.

## 🚀 Công nghệ sử dụng

- **Core**: React 19, Vite, JavaScript (JSX)
- **UI Framework**: Ant Design 6
- **Routing**: React Router 7
- **Data Fetching**: @tanstack/react-query (React Query 5)
- **Styling**: Vanilla CSS (Custom properties)
- **Internationalization**: Custom Language Context (Đa ngôn ngữ)
- **State Management**: React Context API (Cart, Auth, Notification)

## ✨ Tính năng chính

- **Trang chủ**: Banner quảng cáo, sản phẩm mới, sản phẩm bán chạy.
- **Danh sách sản phẩm**: Lọc, sắp xếp và tìm kiếm sản phẩm thông minh.
- **Chi tiết sản phẩm**: Xem thông tin, đánh giá, bình luận và chọn biến thể.
- **Giỏ hàng & Thanh toán**: Quản lý giỏ hàng realtime, quy trình thanh toán tối ưu.
- **Tài khoản người dùng**: Đăng nhập (Keycloak), lịch sử đơn hàng, quản lý thông tin.
- **Đánh giá & Phản hồi**: Hệ thống đánh giá sản phẩm chi tiết.

## 🛠 Cài đặt và Chạy dự án

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   - Sao chép file `.env.example` thành `.env`.
   - Cập nhật `VITE_API_URL` trỏ đến Backend Gateway (Microservices).

3. **Chạy ở chế độ phát triển**:
   ```bash
   npm run dev
   ```
   *Dự án sẽ khởi chạy tại: `http://localhost:3000`*

4. **Xây dựng bản sản xuất**:
   ```bash
   npm run build
   ```

## 📂 Cấu trúc thư mục

- `src/api`: Cấu hình axios và các API calls.
- `src/Component`: Các thành phần giao diện dùng chung (Header, Footer, Card...).
- `src/Context`: Quản lý state toàn cục (Auth, Cart...).
- `src/pages`: Các trang ứng dụng chính.
- `src/routes`: Cấu hình routing cho ứng dụng.
- `src/hooks`: Các custom hooks xử lý logic.
