# BKEUTY Frontend

Dự án frontend website thương mại điện tử BKEUTY.

## Yêu cầu hệ thống

- Node.js (Phiên bản khuyến nghị: 16.x hoặc mới hơn)
- npm

## Cài đặt

1. Di chuyển vào thư mục dự án:
   ```bash
   cd frontend
   ```

2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
   **Lưu ý:** Nếu gặp lỗi liên quan đến phiên bản dependency, hãy thử dùng `npm install --legacy-peer-deps`.

## Cấu hình

Dự án sử dụng file `.env` để cấu hình các biến môi trường. File này đã được tạo sẵn với nội dung sau:

```env
REACT_APP_API_URL=https://capstoneproject.orangedesert-3e8e63bd.eastasia.azurecontainerapps.io/api
```

Nếu bạn muốn thay đổi đường dẫn API (ví dụ chạy backend local), hãy chỉnh sửa giá trị `REACT_APP_API_URL` trong file `.env`.

## Chạy dự án

Để chạy dự án ở chế độ development:

```bash
npm start
```

Ứng dụng sẽ tự động mở tại [http://localhost:3000](http://localhost:3000).

## Build cho Production

Để đóng gói ứng dụng cho môi trường production:

```bash
npm run build
```

File build sẽ nằm trong thư mục `build`.

## Cấu trúc thư mục chính

- `src/Component`: Các component tái sử dụng (Header, Footer, Account...)
- `src/Product`: Trang danh sách sản phẩm
- `src/Cart`: Trang giỏ hàng
- `src/Checkout`: Trang thanh toán
- `src/Context`: Context API (Notification...)
- `src/Assets`: Hình ảnh và tài nguyên tĩnh
