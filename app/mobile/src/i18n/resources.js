import { en as webEn, vi as webVi } from '../../../../web/src/i18n/resources';

// We can directly export the web resources if the environment supports it.
// Assuming the relative path is correct and the bundler resolves it.
// If direct import fails due to structure, we should copy the keys.
// For now, let's assume we can spread them.

export const en = {
    ...webEn,
    // Mobile specific overrides if needed
    trust_authentic: "100% Authentic Guarantee",
    trust_return: "7-day Return Policy",
    trust_check: "Check Before Accept",
    tag_hot: "HOT",
    tag_new: "NEW",
};

export const vi = {
    ...webVi,
    // Mobile specific overrides if needed
    trust_authentic: "Cam kết chính hãng 100%",
    trust_return: "Đổi trả trong 7 ngày",
    trust_check: "Được kiểm hàng trước khi nhận",
    tag_hot: "HOT",
    tag_new: "MỚI",
};
