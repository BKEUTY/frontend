# BKEUTY Storefront - Customer Ecosystem

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a name="english"></a>
## English - Frontend Architecture

### 🌟 Executive Summary
BKEUTY Storefront is a high-end customer-facing ecosystem comprising a **Web Application** and a **Mobile Application**. It is designed with a "Luxury First" philosophy, providing a seamless and high-performance shopping journey.

### 🛠 Core Technologies
- **Web App:** React 19, Vite, Tailwind CSS, Ant Design 6.
- **Mobile App:** React Native, Expo SDK 50+, React Navigation 7.
- **State Management:** TanStack Query 5 (Server State), React Context (UI State).
- **Communication:** Axios with Global Interceptors for JWT handling (Hybrid Storage with SessionStorage & HttpOnly Cookie).

### 🚀 Key Features
- **Sophisticated Discovery:** Home Landing with Hero Section, Flash Sale, and Featured Categories.
- **Product Detail:** Advanced variant matching logic and automatic image fallback.
- **Unified Commerce (Cart Merge):** Seamless cart merging from Guest (localStorage) to User database upon login.
- **Seamless Checkout:** Streamlined 3-step checkout process (Cart -> Shipping/Voucher -> Payment Polling).
- **Account Management:** Comprehensive management of order history, GHN shipping tracking, and 4-level address structure.

### 🚦 Development & Ports
| Platform | Environment | Port | Startup Command |
| :--- | :--- | :--- | :--- |
| **Web Store** | Development | 3000 | `npm run dev` |
| **Mobile App** | Expo Metro | 8081 | `npx expo start` |

---

<a name="tiếng-việt"></a>
## Tiếng Việt - Kiến trúc Frontend

### 🌟 Tổng quan Trải nghiệm
BKEUTY Storefront là hệ sinh thái tương tác với khách hàng cao cấp, bao gồm **Ứng dụng Web** và **Ứng dụng Di động**. Được thiết kế với triết lý "Luxury First", hệ thống mang lại hành trình mua sắm mượt mà và hiệu suất cao.

### 🛠 Công nghệ Cốt lõi
- **Web App:** React 19, Vite, Tailwind CSS, Ant Design 6.
- **Mobile App:** React Native, Expo SDK 50+, React Navigation 7.
- **Quản lý trạng thái:** TanStack Query 5 (Server State), React Context (UI State).
- **Giao tiếp:** Axios với Interceptors toàn cục để xử lý JWT (Lưu trữ lai với SessionStorage và HttpOnly Cookie).

### 🚀 Tính năng Nổi bật
- **Khám phá Tinh tế:** Trang chủ với Hero Section, Flash Sale và Danh mục nổi bật.
- **Chi tiết Sản phẩm:** Logic so khớp biến thể nâng cao và tự động dự phòng ảnh (Image Fallback).
- **Thương mại Nhất quán (Cart Merge):** Đồng bộ hóa giỏ hàng tự động từ Khách (localStorage) sang tài khoản người dùng khi đăng nhập.
- **Thanh toán Mượt mà:** Quy trình thanh toán 3 bước tối ưu (Giỏ hàng -> Vận chuyển/Voucher -> Polling thanh toán).
- **Quản lý Tài khoản:** Quản lý toàn diện lịch sử đơn hàng, theo dõi vận đơn GHN và hệ thống địa chỉ 4 cấp.

### 🚦 Triển khai & Port
| Nền tảng | Môi trường | Port | Lệnh khởi chạy |
| :--- | :--- | :--- | :--- |
| **Web Store** | Phát triển | 3000 | `npm run dev` |
| **Mobile App** | Expo Metro | 8081 | `npx expo start` |

---
© 2026 BKEUTY Global. Premium E-commerce Solutions.
