import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLanguage } from "../../i18n/LanguageContext";
import { Pagination, EmptyState, CButton, PageWrapper } from '../../Component/Common';
import { SearchOutlined } from '@ant-design/icons';
import promotionApi from '../../api/promotionApi';
import { Spin } from 'antd';
import "./Promotion.css";

export default function Promotion() {
    const { t } = useLanguage();
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0); 
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [showVipInfo, setShowVipInfo] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 30;

    const fetchPromotions = useCallback(async (page = 0) => {
        setLoading(true);
        try {
            const res = await promotionApi.getPromotions(page);
            if (res.data) {
                setPromotions(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
                setTotalItems(res.data.totalElements || 0);
            }
        } catch (error) {
            console.error("Fetch promotions error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPromotions(currentPage);
    }, [currentPage, fetchPromotions]);

    const filteredData = useMemo(() => {
        return promotions.filter(item => {
            const searchMatch =
                (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.id || "").toString().includes(searchTerm.toLowerCase());

            if (!searchMatch) return false;

            if (filterType === 'all') return true;
            if (filterType === 'applicable') return item.status === 'STARTING';
            return item.status === filterType;
        });
    }, [filterType, searchTerm, promotions]);

    const currentData = filteredData;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const formatDiscount = (item) => {
        if (item.discountType === 'PERCENTAGE') {
            return `${item.discountValue}%`;
        }
        return new Intl.NumberFormat('vi-VN').format(item.discountValue) + 'đ';
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
            <PageWrapper title={t('promo_list_title')} noCard>
                <div className="promotion-controls">
                    <div className="promo-search-bar">
                        <SearchOutlined className="promo-search-icon" style={{ fontSize: '20px' }} />
                        <input
                            type="text"
                            className="promo-search-input"
                            placeholder={t('promo_search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                        />
                    </div>

                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => { setFilterType('all'); setCurrentPage(0); }}
                        >
                            {t('promo_tab_all')}
                        </button>
                        <button
                            className={`filter-tab ${filterType === 'STARTING' ? 'active' : ''}`}
                            onClick={() => { setFilterType('STARTING'); setCurrentPage(0); }}
                        >
                            {t('promo_tab_STARTING')}
                        </button>
                        <button
                            className={`filter-tab ${filterType === 'INCOMING' ? 'active' : ''}`}
                            onClick={() => { setFilterType('INCOMING'); setCurrentPage(0); }}
                        >
                            {t('promo_tab_INCOMING')}
                        </button>
                        <button
                            className={`filter-tab ${filterType === 'ENDED' ? 'active' : ''}`}
                            onClick={() => { setFilterType('ENDED'); setCurrentPage(0); }}
                        >
                            {t('promo_tab_ENDED')}
                        </button>
                        <button
                            className={`filter-tab ${filterType === 'applicable' ? 'active' : ''}`}
                            onClick={() => { setFilterType('applicable'); setCurrentPage(0); }}
                        >
                            {t('promo_tab_applicable')}
                        </button>
                    </div>
                </div>

                <div className="promotion-table-container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                    ) : (
                        <table className="promotion-table">
                            <thead>
                                <tr>
                                    <th>{t('promo_col_name')}</th>
                                    <th>ID</th>
                                    <th>{t('promo_col_discount')}</th>
                                    <th>
                                        {t('promo_col_target')}
                                        <InfoIcon />
                                    </th>
                                    <th>{t('promo_col_time')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('promo_col_status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length > 0 ? (
                                    currentData.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`promo-row ${item.status === 'ENDED' || item.status === 'DISABLED' ? 'disabled-row' : ''}`}
                                            onClick={() => setSelectedPromo(item)}
                                        >
                                            <td>{item.title}</td>
                                            <td>
                                                <span className="code-highlight">#{item.id}</span>
                                            </td>
                                            <td>
                                                <span className="discount-tag">{formatDiscount(item)}</span>
                                            </td>
                                            <td>{item.promotionType || 'ALL'}</td>
                                            <td>{formatDate(item.startAt)} - {formatDate(item.endAt)}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`status-badge status-${item.status}`}>
                                                    {t(`promo_status_${item.status}`)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '40px 0' }}>
                                            <EmptyState title={t('no_promos_found')} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mobile-card-view">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                    ) : currentData.length > 0 ? (
                        currentData.map((item) => (
                            <div
                                className={`promotion-card ${item.status === 'ENDED' || item.status === 'DISABLED' ? 'disabled-card' : ''}`}
                                key={item.id}
                                onClick={() => setSelectedPromo(item)}
                            >
                                <div className="card-header">
                                    <div className="card-title">{item.title}</div>
                                    <span className="card-code">#{item.id}</span>
                                </div>
                                <div className="card-row">
                                    <span className="card-label">{t('promo_col_discount')}</span>
                                    <span className="card-value highlight-discount">{formatDiscount(item)}</span>
                                </div>
                                <div className="card-row">
                                    <span className="card-label">
                                        {t('promo_col_target')}
                                        <InfoIcon />
                                    </span>
                                    <span className="card-value">{item.promotionType || 'ALL'}</span>
                                </div>
                                <div className="card-row">
                                    <span className="card-label">{t('promo_col_time')}</span>
                                    <span className="card-value">{formatDate(item.startAt)} - {formatDate(item.endAt)}</span>
                                </div>
                                <div className="card-row">
                                    <span className="card-label">{t('promo_col_status')}</span>
                                    <span className="card-value">
                                        <span className={`status-badge status-${item.status}`}>
                                            {t(`promo_status_${item.status}`)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '40px 0' }}>
                            <EmptyState title={t('no_promos_found')} />
                        </div>
                    )}
                </div>

                <Pagination 
                    page={currentPage} 
                    totalPages={totalPages} 
                    totalItems={totalItems} 
                    pageSize={itemsPerPage} 
                    onPageChange={setCurrentPage} 
                />
            </PageWrapper>

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
                                <span>{selectedPromo.title}</span>
                            </div>
                            <div className="detail-item">
                                <label>ID:</label>
                                <span className="modal-code">#{selectedPromo.id}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('promo_col_discount')}:</label>
                                <span className="modal-discount">{formatDiscount(selectedPromo)}</span>
                            </div>
                            {selectedPromo.maxDiscount > 0 && (
                                <div className="detail-item">
                                    <label>Giảm tối đa:</label>
                                    <span>{new Intl.NumberFormat('vi-VN').format(selectedPromo.maxDiscount)}đ</span>
                                </div>
                            )}
                            <div className="detail-item">
                                <label>{t('promo_col_target')}:</label>
                                <span>{selectedPromo.promotionType || 'ALL'}</span>
                            </div>
                            <div className="detail-item">
                                <label>{t('promo_col_time')}:</label>
                                <span>{formatDate(selectedPromo.startAt)} - {formatDate(selectedPromo.endAt)}</span>
                            </div>
                            <div className="description-section">
                                <label>{t('description')}:</label>
                                <p>{selectedPromo.description}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <CButton type="primary" block onClick={() => setSelectedPromo(null)}>
                                {t('confirm')}
                            </CButton>
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
                            <CButton type="primary" block onClick={() => setShowVipInfo(false)}>
                                {t('close_hint')}
                            </CButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
