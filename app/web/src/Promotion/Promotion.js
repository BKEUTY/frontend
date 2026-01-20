import React, { useState, useMemo } from 'react';
import { useLanguage } from "../i18n/LanguageContext";
import "./Promotion.css";
import search_icon from "./icon_search.svg";

const MOCK_PROMOTIONS = [
    {
        id: 1,
        name: "Trung Thu Tới, Giá Giảm Phơi Phới",
        code: "BKEUTY-TRUNGTHU-2025",
        revenue: 290000000,
        target: "Khách hàng VIP",
        targetKey: "vip",
        startDate: "2025-10-01",
        endDate: "2025-10-08",
        status: "expired", // based on current date assumption or hardcoded for UI match
        applicable: true,
        type: "PERCENTAGE"
    },
    {
        id: 2,
        name: "Phụ Nữ Việt Nam, Deal Sốc Sập Sàn",
        code: "BKEUTY-PNVN-2025",
        revenue: 350000000,
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-10-14",
        endDate: "2025-10-21",
        status: "ongoing",
        applicable: true,
        type: "FIX_AMOUNT"
    },
    {
        id: 3,
        name: "Mừng Ngày Quốc Khánh, Hạ Giá Không Phanh",
        code: "BKEUTY-QUOCKHANH-2025",
        revenue: 210000000,
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-08-29",
        endDate: "2025-09-03",
        status: "expired",
        applicable: false,
        type: "COMBO"
    },
    {
        id: 4,
        name: "Halloween, Cúng MakeUp Thôi",
        code: "BKEUTY-HALLOWEEN-2025",
        revenue: 0,
        target: "Khách hàng VIP",
        targetKey: "vip",
        startDate: "2025-10-29",
        endDate: "2025-11-02",
        status: "upcoming",
        applicable: true,
        type: "PERCENTAGE"
    },
    {
        id: 5,
        name: "Hè Đến Rồi, Shopping Thôi",
        code: "BKEUTY-MUAHE-2025",
        revenue: 125000000,
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-07-01",
        endDate: "2025-08-31",
        status: "expired",
        applicable: true,
        type: "SHIPPING_DISCOUNT"
    },
    {
        id: 6,
        name: "11 THÁNG 11",
        code: "BKEUTY-1111-2025",
        revenue: 0,
        target: "Khách hàng Premium",
        targetKey: "premium",
        startDate: "2025-11-10",
        endDate: "2025-11-11",
        status: "upcoming",
        applicable: false,
        type: "BUY_X_GET_Y"
    },
    {
        id: 7,
        name: "Chào Thành Viên Mới",
        code: "BKEUTY-NEW-MEMBER",
        revenue: 50000000,
        target: "Thành viên mới",
        targetKey: "new",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        status: "ongoing",
        applicable: true,
        type: "MEMBERSHIP"
    },
    {
        id: 8,
        name: "Giáng Sinh An Lành",
        code: "BKEUTY-XMAS-2025",
        revenue: 0,
        target: "Tất cả",
        targetKey: "all",
        startDate: "2025-12-20",
        endDate: "2025-12-25",
        status: "upcoming",
        applicable: true,
        type: "PERCENTAGE"
    }
];

export default function Promotion() {
    const { t } = useLanguage();
    const [filterType, setFilterType] = useState('all'); // all, ongoing, upcoming, expired, applicable
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
        return new Intl.NumberFormat('vi-VN').format(val);
    };

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="promotion-page">
            <div className="promotion-header">
                <h1 className="promotion-title">{t('promo_list_title')}</h1>
            </div>

            <div className="promotion-controls">
                <div className="search-bar">
                    <img src={search_icon} alt="search" className="search-icon-img" />
                    <input
                        type="text"
                        className="search-input"
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
                            <th>{t('promo_col_revenue')}</th>
                            <th>{t('promo_col_target')}</th>
                            <th>{t('promo_col_time')}</th>
                            <th style={{ textAlign: 'center' }}>{t('promo_col_status')}</th>
                            <th style={{ textAlign: 'center' }}>{t('promo_col_applicable')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((item) => (
                                <tr key={item.id} className={item.status === 'expired' ? 'disabled-row' : ''}>
                                    <td>{item.name}</td>
                                    <td>{item.code}</td>
                                    <td>{formatCurrency(item.revenue)}</td>
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
                        <div className={`promotion-card ${item.status === 'expired' ? 'disabled-card' : ''}`} key={item.id}>
                            <div className="card-header">
                                <div className="card-title">{item.name}</div>
                                <span className="card-code">{item.code}</span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">{t('promo_col_revenue')}</span>
                                <span className="card-value">{formatCurrency(item.revenue)}</span>
                            </div>
                            <div className="card-row">
                                <span className="card-label">{t('promo_col_target')}</span>
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
        </div>
    );
}
