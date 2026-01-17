import { en, vi } from '../../web/src/i18n/resources'; // Reuse web resources if possible, or duplicate
// Duplicating for safety and independence
export const enMobile = {
    ...en,
    home_title: "Home",
    cart_empty: "Your cart is empty",
    total_payment: "Total Payment",
};

export const viMobile = {
    ...vi,
    home_title: "Trang Chủ",
    cart_empty: "Giỏ hàng trống",
    total_payment: "Tổng thanh toán",
    mid_autumn_promo: "Trung Thu tới, giá giảm phơi phới!",
    shop_now: "Khám Phá Ngay",
    section_best_selling: "SẢN PHẨM BÁN CHẠY",
    section_suggested: "GỢI Ý CHO BẠN"
};
