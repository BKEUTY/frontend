import React, { useState, useMemo } from 'react';
import { useLanguage } from "../../i18n/LanguageContext";
import "./Promotion.css";
import search_icon from "./icon_search.svg";

const MOCK_PROMOTIONS = [
    {
        id: 1,
        name: "Trung Thu Tới, Giá Giảm Phơi Phới",
        code: "BKEUTY-TRUNGTHU-2025",
        discount: "50%",
        target: "Khách hàng VIP",
        targetKey: "vip",
        startDate: "2025-10-01",
        endDate: "2025-10-08",
        status: "expired",
        applicable: true,
        type: "PERCENTAGE",
        description: "Ưu đãi cực sốc lên tới 50% cho tất cả các mặt hàng mỹ phẩm tại BKEUTY nhân dịp Tết Trung Thu. Áp dụng cho đơn hàng từ 500k trở lên."
    },
    {
        id: 2,
        name: "Phụ Nữ Việt Nam, Deal Sốc Sập Sàn",
        code: "BKEUTY-PNVN-2025",
        discount: "100.000đ",
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-10-14",
        endDate: "2025-10-21",
        status: "ongoing",
        applicable: true,
        type: "FIX_AMOUNT",
        description: "Tặng ngay voucher trị giá 100.000đ cho hóa đơn mua sắm từ 1.000.000đ. Chào mừng ngày Phụ Nữ Việt Nam 20/10."
    },
    {
        id: 3,
        name: "Mừng Ngày Quốc Khánh, Hạ Giá Không Phanh",
        code: "BKEUTY-QUOCKHANH-2025",
        discount: "200.000đ",
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-08-29",
        endDate: "2025-09-03",
        status: "expired",
        applicable: false,
        type: "COMBO",
        description: "Giảm trực tiếp 200.000đ cho các set combo chăm sóc da toàn diện. Ưu đãi mừng Lễ Quốc Khánh 2/9."
    },
    {
        id: 4,
        name: "Halloween, Cúng MakeUp Thôi",
        code: "BKEUTY-HALLOWEEN-2025",
        discount: "30%",
        target: "Khách hàng VIP",
        targetKey: "vip",
        startDate: "2025-10-29",
        endDate: "2025-11-02",
        status: "upcoming",
        applicable: true,
        type: "PERCENTAGE",
        description: "Sắm đồ trang điểm 'chất' Halloween với ưu đãi giảm 30%. Chỉ dành riêng cho hội viện VIP của BKEUTY."
    },
    {
        id: 5,
        name: "Hè Đến Rồi, Shopping Thôi",
        code: "BKEUTY-MUAHE-2025",
        discount: "Freeship",
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-07-01",
        endDate: "2025-08-31",
        status: "expired",
        applicable: true,
        type: "SHIPPING_DISCOUNT",
        description: "Miễn phí vận chuyển toàn quốc cho mọi đơn hàng trong suốt mùa hè rực rỡ."
    },
    {
        id: 6,
        name: "11 THÁNG 11",
        code: "BKEUTY-1111-2025",
        discount: "Mua 1 Tặng 1",
        target: "Khách hàng Premium",
        targetKey: "premium",
        startDate: "2025-11-10",
        endDate: "2025-11-11",
        status: "upcoming",
        applicable: false,
        type: "BUY_X_GET_Y",
        description: "Săn deal 11.11 với chương trình Mua 1 Tặng 1 cho các dòng son môi và kem nền bán chạy nhất."
    },
    {
        id: 7,
        name: "Chào Thành Viên Mới",
        code: "BKEUTY-NEW-MEMBER",
        discount: "10%",
        target: "Thành viên mới",
        targetKey: "new",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "ongoing",
        applicable: true,
        type: "MEMBERSHIP",
        description: "Món quà chào mừng cho thành viên mới của gia đình BKEUTY. Giảm ngay 10% cho đơn hàng đầu tiên."
    },
    {
        id: 8,
        name: "Giáng Sinh An Lành",
        code: "BKEUTY-XMAS-2025",
        discount: "Giảm 30%",
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-12-20",
        endDate: "2025-12-25",
        status: "upcoming",
        applicable: true,
        type: "PERCENTAGE",
        description: "Ấm áp mùa Noel với ưu đãi giảm 30% cho toàn bộ gian hàng. Quà tặng kèm cho mỗi đơn hàng trên 2 triệu."
    }
];

export default function Promotion() {
    const { t } = useLanguage();
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [showVipInfo, setShowVipInfo] = useState(false);
    const itemsPerPage = 5;

    const filteredData = useMemo(() => {
        return MOCK_PROMOTIONS.filter(item => {
            const searchMatch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.code.toLowerCase().includes(searchTerm.toLowerCase());

            if (!searchMatch) return false;

            if (filterType === 'all') return true;
            if (filterType === 'applicable') return item.applicable;
            return item.status === filterType;
        });
    }, [filterType, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
    };

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    const InfoIcon = () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="info-icon-svg"
            onClick={(e) => {
                e.stopPropagation();
                setShowVipInfo(true);
            }}
            title={t('vip_condition_title')}
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    );

    return (
        <div className="promotion-page">
            <div className="promotion-header">
                <h1 className="promotion-title">{t('promo_list_title')}</h1>
            </div>

            <div className="promotion-controls">
                <div className="promo-search-bar">
                    <img src={search_icon} alt="search" className="promo-search-icon" />
                    <input
                        type="text"
                        className="promo-search-input"
                        placeholder={t('promo_search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        {t('promo_tab_all')}
                    </button>
                    <button
                        className={`filter-tab ${filterType === 'ongoing' ? 'active' : ''}`}
                        onClick={() => setFilterType('ongoing')}
                    >
                        {t('promo_tab_ongoing')}
                    </button>
                    <button
                        className={`filter-tab ${filterType === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilterType('upcoming')}
                    >
                        {t('promo_tab_upcoming')}
                    </button>
                    <button
                        className={`filter-tab ${filterType === 'expired' ? 'active' : ''}`}
                        onClick={() => setFilterType('expired')}
                    >
                        {t('promo_tab_expired')}
                    </button>
                    <button
                        className={`filter-tab ${filterType === 'applicable' ? 'active' : ''}`}
                        onClick={() => setFilterType('applicable')}
                    >
                        {t('promo_tab_applicable')}
                    </button>
                </div>
            </div>

            <div className="promotion-table-container">
                <table className="promotion-table">
                    <thead>
                        <tr>
                            <th>{t('promo_col_name')}</th>
                            <th>{t('promo_col_code')}</th>
                            <th>{t('promo_col_discount')}</th>
                            <th>
                                {t('promo_col_target')}
                                <InfoIcon />
                            </th>
                            <th>{t('promo_col_time')}</th>
                            <th style={{ textAlign: 'center' }}>{t('promo_col_status')}</th>
                            <th style={{ textAlign: 'center' }}>{t('promo_col_applicable')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`promo-row ${item.status === 'expired' ? 'disabled-row' : ''}`}
                                    onClick={() => setSelectedPromo(item)}
                                >
                                    <td>{item.name}</td>
                                    <td>
                                        <span className="code-highlight">{item.code}</span>
                                    </td>
                                    <td>
                                        <span className="discount-tag">{item.discount}</span>
                                    </td>
                                    <td>{item.target}</td>
                                    <td>{formatDate(item.startDate)} - {formatDate(item.endDate)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`status-badge status-${item.status}`}>
                                            {t(`promo_status_${item.status}`)}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`applicable-badge ${item.applicable ? 'app-yes' : 'app-no'}`}>
                                            {item.applicable ? t('yes') : t('no')}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                                    {t('no_promos_found')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="mobile-card-view">
                {currentData.length > 0 ? (
                    currentData.map((item) => (
                        <div
                            className={`promotion-card ${item.status === 'expired' ? 'disabled-card' : ''}`}
                            key={item.id}
                            onClick={() => setSelectedPromo(item)}
                        >
                            <div className="card-header">
                                <div className="card-title">{item.name}</div>
                                <span className="card-code">{item.code}</span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">{t('promo_col_discount')}</span>
                                <span className="card-value highlight-discount">{item.discount}</span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">
                                    {t('promo_col_target')}
                                    <InfoIcon />
                                </span>
                                <span className="card-value">{item.target}</span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">{t('promo_col_time')}</span>
                                <span className="card-value">{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">{t('promo_col_status')}</span>
                                <span className="card-value">
                                    <span className={`status-badge status-${item.status}`}>
                                        {t(`promo_status_${item.status}`)}
                                    </span>
                                </span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">{t('promo_col_applicable')}</span>
                                <span className="card-value">
                                    <span className={`applicable-badge ${item.applicable ? 'app-yes' : 'app-no'}`}>
                                        {item.applicable ? t('yes') : t('no')}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                        {t('no_promos_found')}
                    </div>
                )}
            </div>

            <div className="pagination">
                <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                    ❮
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className="page-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                    ❯
                </button>
            </div>

            {selectedPromo && (
                <div className="promo-modal-overlay" onClick={() => setSelectedPromo(null)}>
                    <div className="promo-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{t('promo_info_title')}</h3>
                            <button className="close-modal" onClick={() => setSelectedPromo(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-item">
                                <label>{t('promo_col_name')}:</label>
                                <span>{selectedPromo.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('promo_col_code')}:</label>
                                <span className="modal-code">{selectedPromo.code}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('promo_col_discount')}:</label>
                                <span className="modal-discount">{selectedPromo.discount}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('promo_col_target')}:</label>
                                <span>{selectedPromo.target}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('promo_col_time')}:</label>
                                <span>{formatDate(selectedPromo.startDate)} - {formatDate(selectedPromo.endDate)}</span>
                            </div>
                            <div className="description-section">
                                <label>{t('description')}:</label>
                                <p>{selectedPromo.description}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button apply-promo-btn" onClick={() => setSelectedPromo(null)}>
                                {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showVipInfo && (
                <div className="promo-modal-overlay" onClick={() => setShowVipInfo(false)}>
                    <div className="promo-modal-content vip-info-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{t('vip_condition_title')}</h3>
                            <button className="close-modal" onClick={() => setShowVipInfo(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="vip-conditions">
                                {t('vip_condition_content').split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button" onClick={() => setShowVipInfo(false)}>
                                {t('close_hint') || 'Đóng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
