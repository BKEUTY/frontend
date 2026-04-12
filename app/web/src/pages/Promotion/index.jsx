import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from "@/store/LanguageContext";
import { Pagination, EmptyState, CButton, SEO } from '@/components/common';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Spin, DatePicker } from 'antd';
import dayjs from 'dayjs';

import promotionApi from '@/features/promotions/services/promotionService';
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDebounce } from "@/hooks/useDebounce";
import "./Promotion.css";

const itemsPerPage = 30;

export default function Promotion() {
    const { t } = useLanguage();
    const [query, setQuery] = useQueryParams();

    const page = query.page ? Number(query.page) - 1 : 0;
    const filterType = query.status || 'all';
    const titleTermFromUrl = query.title || '';
    const startAtParam = query.startAt || null;
    const endAtParam = query.endAt || null;

    const [searchInput, setSearchInput] = useState(titleTermFromUrl);

    const debouncedSearch = useDebounce(searchInput, 500);


    const [selectedPromo, setSelectedPromo] = useState(null);
    const [showVipInfo, setShowVipInfo] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await promotionApi.getAll({ 
                page, 
                size: itemsPerPage,
                title: titleTermFromUrl,
                status: filterType === 'all' ? '' : filterType,
                startAt: startAtParam,
                endAt: endAtParam
            });
            if (res.data) {
                setPromotions(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
                setTotalItems(res.data.totalElements || 0);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [page, titleTermFromUrl, filterType, startAtParam, endAtParam]);

    useEffect(() => {
        setSearchInput(titleTermFromUrl);
    }, [titleTermFromUrl]);

    useEffect(() => {
        if (debouncedSearch !== titleTermFromUrl) {
            setQuery({ title: debouncedSearch || null, page: 1 });
        }
    }, [debouncedSearch, titleTermFromUrl, setQuery]);


    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleFilterChange = (value) => {
        setQuery({ status: value === 'all' ? null : value, page: 1 });
    };

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setQuery({ 
                startAt: dates[0].toISOString(), 
                endAt: dates[1].toISOString(), 
                page: 1 
            });
        } else {
            setQuery({ startAt: null, endAt: null, page: 1 });
        }
    };

    const handlePageChange = (newPage) => {
        setQuery({ page: newPage + 1 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const formatDiscount = (item) => {
        if (item.discountType === 'PERCENTAGE') return `${item.discountValue}%`;
        return new Intl.NumberFormat('vi-VN').format(item.discountValue) + 'đ';
    };

    const InfoIcon = () => (
        <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="prm-info-icon"
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
        <div className="prm-page-container">
            <div className="prm-page-header">
                <h1 className="prm-page-title">{t('promo_list_title')}</h1>
            </div>
            
            <div className="prm-page-content">
                <div className="prm-controls">
                    <div className="prm-search-status">
                        <Input
                            size="large"
                            placeholder={t('promo_search_placeholder')}
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="prm-search-input"
                        />
                        <Select
                            size="large"
                            value={filterType}
                            onChange={handleFilterChange}
                            className="prm-status-select"
                            options={[
                                { value: 'all', label: t('promo_tab_all') },
                                { value: 'STARTING', label: t('promo_tab_STARTING') },
                                { value: 'INCOMING', label: t('promo_tab_INCOMING') },
                                { value: 'DISABLED', label: t('promo_tab_DISABLED') },
                                { value: 'ENDED', label: t('promo_tab_ENDED') },
                            ]}
                        />
                    </div>
                    <DatePicker.RangePicker
                        size="large"
                        className="prm-date-range"
                        showTime
                        value={startAtParam && endAtParam ? [dayjs(startAtParam), dayjs(endAtParam)] : null}
                        onChange={handleDateRangeChange}
                        placeholder={[t('promo_col_start_time'), t('promo_col_end_time')]}
                    />
                </div>

                <div className="prm-table-wrapper">
                    {loading ? (
                        <div className="prm-loading"><Spin size="large" /></div>
                    ) : (
                        <table className="prm-table">
                            <thead>
                                <tr>
                                    <th>{t('promo_col_name')}</th>
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
                                {promotions.length > 0 ? (
                                    promotions.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`prm-row ${item.status === 'ENDED' || item.status === 'DISABLED' ? 'disabled' : ''}`}
                                            onClick={() => setSelectedPromo(item)}
                                        >
                                            <td className="prm-title-col">{item.title}</td>
                                            <td><span className="prm-badge-discount">{formatDiscount(item)}</span></td>
                                            <td>{item.promotionType}</td>
                                            <td>{formatDate(item.startAt)} - {formatDate(item.endAt)}</td>
                                            <td align="center">
                                                <span className={`prm-status-badge ${item.status.toLowerCase()}`}>
                                                    {t(`promo_status_${item.status}`)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="prm-empty-td">
                                            <EmptyState title={t('no_promos_found')} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="prm-mobile-list">
                    {loading ? (
                        <div className="prm-loading"><Spin size="large" /></div>
                    ) : promotions.length > 0 ? (
                        promotions.map((item) => (
                            <div
                                className={`prm-card ${item.status === 'ENDED' || item.status === 'DISABLED' ? 'disabled' : ''}`}
                                key={item.id}
                                onClick={() => setSelectedPromo(item)}
                            >
                                <div className="prm-card-header">
                                    <span className="prm-card-title">{item.title}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">{t('promo_col_discount')}</span>
                                    <span className="prm-card-value prm-highlight">{formatDiscount(item)}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">
                                        {t('promo_col_target')}
                                        <InfoIcon />
                                    </span>
                                    <span className="prm-card-value">{item.promotionType}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">{t('promo_col_time')}</span>
                                    <span className="prm-card-value">{formatDate(item.startAt)} - {formatDate(item.endAt)}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">{t('promo_col_status')}</span>
                                    <span className={`prm-status-badge ${item.status.toLowerCase()}`}>
                                        {t(`promo_status_${item.status}`)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="prm-empty-td">
                            <EmptyState title={t('no_promos_found')} />
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <Pagination 
                            page={page} 
                            totalPages={totalPages} 
                            totalItems={totalItems} 
                            pageSize={itemsPerPage} 
                            onPageChange={handlePageChange} 
                        />
                    </div>
                )}
            </div>

            {selectedPromo && (
                <div className="prm-overlay" onClick={() => setSelectedPromo(null)}>
                    <div className="prm-modal" onClick={e => e.stopPropagation()}>
                        <div className="prm-modal-header">
                            <h3>{t('promo_info_title')}</h3>
                            <button className="prm-modal-close" onClick={() => setSelectedPromo(null)}>&times;</button>
                        </div>
                        <div className="prm-modal-body">
                            <div className="prm-modal-row">
                                <label>{t('promo_col_name')}:</label>
                                <span>{selectedPromo.title}</span>
                            </div>
                            <div className="prm-modal-row">
                                <label>{t('promo_col_discount')}:</label>
                                <span className="prm-highlight-large">{formatDiscount(selectedPromo)}</span>
                            </div>
                            {selectedPromo.maxDiscount > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('promo_label_max_discount')}:</label>
                                    <span>{new Intl.NumberFormat('vi-VN').format(selectedPromo.maxDiscount)}đ</span>
                                </div>
                            )}
                            <div className="prm-modal-row">
                                <label>{t('promo_col_target')}:</label>
                                <span>{selectedPromo.promotionType}</span>
                            </div>

                            {selectedPromo.categoryIds?.length > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('categories')}:</label>
                                    <span className="prm-text-wrap">{selectedPromo.categoryIds.join(', ')}</span>
                                </div>
                            )}

                            {selectedPromo.brandIds?.length > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('brands')}:</label>
                                    <span className="prm-text-wrap">{selectedPromo.brandIds.join(', ')}</span>
                                </div>
                            )}

                            {selectedPromo.productIds?.length > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('product')}:</label>
                                    <span className="prm-text-wrap">{selectedPromo.productIds.join(', ')}</span>
                                </div>
                            )}

                            <div className="prm-modal-row">
                                <label>{t('promo_col_time')}:</label>
                                <span>{formatDate(selectedPromo.startAt)} - {formatDate(selectedPromo.endAt)}</span>
                            </div>
                            <div className="prm-modal-desc">
                                <label>{t('description')}:</label>
                                <p>{selectedPromo.description}</p>
                            </div>
                        </div>
                        <div className="prm-modal-footer">
                            <CButton type="primary" block onClick={() => setSelectedPromo(null)}>
                                {t('confirm')}
                            </CButton>
                        </div>
                    </div>
                </div>
            )}

            {showVipInfo && (
                <div className="prm-overlay" onClick={() => setShowVipInfo(false)}>
                    <div className="prm-modal prm-modal-sm" onClick={e => e.stopPropagation()}>
                        <div className="prm-modal-header">
                            <h3>{t('vip_condition_title')}</h3>
                            <button className="prm-modal-close" onClick={() => setShowVipInfo(false)}>&times;</button>
                        </div>
                        <div className="prm-modal-body">
                            <div className="prm-vip-text">
                                {t('vip_condition_content').split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                        <div className="prm-modal-footer">
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
