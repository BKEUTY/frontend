# BKEUTY - Premium Beauty E-commerce (Frontend)

BKEUTY là nền tảng thương mại điện tử cao cấp chuyên về các dòng sản phẩm làm đẹp. Dự án được thiết kế với ngôn ngữ "Luxury Design", chú trọng vào trải nghiệm thị giác tinh tế, hiệu ứng chuyển động mượt mà và tối ưu hóa hiệu suất trên mọi nền tảng.

## 🛠 Nền tảng Công nghệ

- **Core Engine**: [React 19](https://react.dev/) & [Vite](https://vitejs.dev/) (Tốc độ render và hot-reload cực nhanh).
- **UI System**: [Ant Design 6](https://ant.design/) được tùy biến (Custom Theme) theo phong cách Luxury (Pink Accent #c2185b).
- **Routing**: [React Router 7](https://reactrouter.com/) xử lý điều hướng phức tạp và chuyển trang mượt mà.
- **Data Management**: [@tanstack/react-query](https://tanstack.com/query/latest) tối ưu hóa caching và đồng bộ dữ liệu Real-time.
- **Styling Strategy**: Vanilla CSS kết hợp Custom CSS Variables giúp linh hoạt trong việc tùy chỉnh giao diện mà vẫn đảm bảo hiệu suất.
- **Authentication**: Tích hợp [Keycloak](https://www.keycloak.org/) OAuth2 cho bảo mật tối đa.

## ✨ Tính năng Nổi bật

- **Kiến trúc Luxury UI**: Giao diện cao cấp với hiệu ứng slide-up, glassmorphism và phối màu hài hòa.
- **Smart Shopping Flow**:
  - Tìm kiếm và lọc sản phẩm đa năng (theo thương hiệu, giá, đánh giá).
  - Quản lý giỏ hàng thông minh và quy trình Checkout tối ưu 1- bước.
- **Quản lý Tài khoản (Account 2.0)**:
  - Dashboard quản lý thông tin cá nhân chuyên nghiệp.
  - Theo dõi trạng thái đơn hàng thời gian thực.
  - **Quy trình Hoàn hàng (Return Request)**: Cho phép người dùng gửi yêu cầu hoàn trả sản phẩm kèm minh chứng hình ảnh trực quan.
- **Hệ thống Localization**: Hỗ trợ đa ngôn ngữ đầy đủ (Tiếng Việt/Tiếng Anh) cho toàn bộ workflow.

## 🚀 Cài đặt và Khởi chạy

1. **Cài đặt Dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình Môi trường**:
   - Sao chép `.env.example` -> `.env`.
   - Cấu hình các biến `VITE_API_URL` và thông tin Keycloak.

3. **Chạy Môi trường Phát triển**:
   ```bash
   npm run dev
   ```
   *Mặc định tại: `http://localhost:3000`*

4. **Build Production**:
   ```bash
   npm run build
   ```

## 📂 Tổ chức Thư mục

- `src/api`: Định nghĩa các API endpoints và interceptors.
- `src/Component`: Chứa các UI components dùng chung (Header, Footer, Layout).
- `src/Context`: Quản lý trạng thái toàn cục (Auth, Cart, Language, Notification).
- `src/pages`: Toàn bộ các trang chính trong workflow mua hàng.
- `src/hooks`: Các logic nghiệp vụ tái sử dụng (Custom hooks).
- `src/i18n`: Tài nguyên đa ngôn ngữ.

---
© 2026 BKEUTY Development Team. All rights reserved.
