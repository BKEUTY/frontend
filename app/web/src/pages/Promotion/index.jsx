import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from "@/store/LanguageContext";
import { Pagination, EmptyState, CButton, SEO } from '@/components/common';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Spin, DatePicker } from 'antd';
import dayjs from 'dayjs';

import promotionApi from '@/features/promotions/services/promotionService';
import productApi from '@/features/products/services/productService';
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDebounce } from "@/hooks/useDebounce";
import "./Promotion.css";

const itemsPerPage = 10;

export default function Promotion() {
    const { t } = useLanguage();
    const [query, setQuery] = useQueryParams();

    const page = query.page ? Number(query.page) : 1;
    const filterType = query.status || 'all';
    const promoType = query.promotionType || 'all';
    const sortOrder = query.sort || 'id,desc';
    const titleTermFromUrl = query.title || '';
    const startAtParam = query.startAt || null;
    const endAtParam = query.endAt || null;

    const [searchInput, setSearchInput] = useState(titleTermFromUrl);

    const debouncedSearch = useDebounce(searchInput, 500);

    const [selectedPromo, setSelectedPromo] = useState(null);
    const [promotions, setPromotions] = useState([]);
    const [metadata, setMetadata] = useState({ productNames: {}, categoryNames: {}, brandNames: {} });
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
                promotionType: promoType === 'all' ? '' : promoType,
                startAt: startAtParam,
                endAt: endAtParam,
                sort: sortOrder === 'default' ? 'id,desc' : sortOrder
            });
            if (res.data) {
                const fetchedPromotions = res.data.content || [];
                setPromotions(fetchedPromotions);
                setTotalPages(res.data.totalPages || 0);
                setTotalItems(res.data.totalElements || 0);
                const productIds = new Set();
                const categoryIds = new Set();
                const brandIds = new Set();

                fetchedPromotions.forEach(p => {
                    if (p.productIds) p.productIds.forEach(id => productIds.add(id));
                    if (p.categoryIds) p.categoryIds.forEach(id => categoryIds.add(id));
                    if (p.brandIds) p.brandIds.forEach(id => brandIds.add(id));
                });

                if (productIds.size > 0 || categoryIds.size > 0 || brandIds.size > 0) {
                    const metaRes = await productApi.getPromotionMetadata({
                        productIds: Array.from(productIds),
                        categoryIds: Array.from(categoryIds),
                        brandIds: Array.from(brandIds)
                    });
                    if (metaRes.data) {
                        setMetadata(metaRes.data);
                    }
                }
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [page, titleTermFromUrl, filterType, promoType, startAtParam, endAtParam, sortOrder]);

    useEffect(() => {
        if (!titleTermFromUrl) setSearchInput('');
    }, [titleTermFromUrl]);

    useEffect(() => {
        if (debouncedSearch !== searchInput) return;

        const cleanSearch = String(debouncedSearch ?? '').trim();
        if (cleanSearch !== titleTermFromUrl) {
            setQuery({ title: cleanSearch || null, page: 1 });
        }
    }, [debouncedSearch, searchInput, titleTermFromUrl, setQuery]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleFilterChange = (value) => {
        setQuery({ status: value === 'all' ? null : value, page: 1 });
    };

    const handleTypeChange = (value) => {
        setQuery({ promotionType: value === 'all' ? null : value, page: 1 });
    };

    const handleSortChange = (value) => {
        setQuery({ sort: value === 'default' ? null : value, page: 1 });
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
        setQuery({ page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getPromotionTypeName = (type) => {
        if (type === 'ProductPromotion') return t('promo_type_productpromotion');
        if (type === 'VoucherPromotion') return t('promo_type_voucherpromotion');
        if (type === 'UserPromotion') return t('promo_type_userpromotion');
        return type;
    };

    const formatDiscount = (item) => {
        if (item.discountType === 'PERCENTAGE') return `${item.discountValue}%`;
        return new Intl.NumberFormat('vi-VN').format(item.discountValue) + 'đ';
    };

    const formatTarget = (item) => {
        const levels = item.membershipLevels || item.membershipLevel || [];
        const levelsArray = Array.isArray(levels) ? levels : Array.from(levels);
        
        if (item.promotionType === 'VoucherPromotion') {
            const parts = [`${t('promo_type_voucherpromotion')}${item.code ? ` (${item.code})` : ''}`];
            if (levelsArray.length > 0) {
                const levelNames = { 
                    0: t('membership_level_0'),
                    1: t('membership_level_1'), 
                    2: t('membership_level_2'), 
                    3: t('membership_level_3'),
                    4: t('membership_level_4') 
                };
                parts.push(`${t('promo_label_membership')}: ${levelsArray.map(l => levelNames[l] || l).join(', ')}`);
            }
            return parts.join(' • ');
        }
        
        if (item.promotionType === 'UserPromotion') {
            const parts = [];
            if (item.birthdayMonth?.length > 0) parts.push(`${t('promo_label_birthday')} ${item.birthdayMonth.join(', ')}`);
            if (levelsArray.length > 0) {
                const levelNames = { 
                    0: t('membership_level_0'),
                    1: t('membership_level_1'), 
                    2: t('membership_level_2'), 
                    3: t('membership_level_3'),
                    4: t('membership_level_4') 
                };
                parts.push(`${t('promo_label_membership')}: ${levelsArray.map(l => levelNames[l] || l).join(', ')}`);
            }
            if (item.userIds?.length > 0) parts.push(t('promo_type_userpromotion'));
            return parts.length > 0 ? parts.join(' • ') : t('promo_type_userpromotion');
        }
        
        const targetParts = [];
        if (item.categoryIds?.length > 0) targetParts.push(t('promo_scope_category'));
        else if (item.brandIds?.length > 0) targetParts.push(t('promo_scope_brand'));
        else targetParts.push(t('promo_scope_product'));

        if (levelsArray.length > 0) {
            const levelNames = { 
                0: t('membership_level_0'),
                1: t('membership_level_1'), 
                2: t('membership_level_2'), 
                3: t('membership_level_3'),
                4: t('membership_level_4') 
            };
            targetParts.push(`${t('promo_label_membership')}: ${levelsArray.map(l => levelNames[l] || l).join(', ')}`);
        }

        return targetParts.join(' • ');
    };

    return (
        <div className="prm-page-container">
            <div className="prm-page-header animate-slide-up">
                <h1 className="prm-page-title">{t('promo_list_title')}</h1>
                <p className="prm-hero-subtitle">Khám phá các chương trình ưu đãi đặc biệt từ BKEUTY</p>
            </div>
            
            <div className="prm-page-content">
                <div className="prm-controls animate-slide-up">
                    <Input
                        size="large"
                        placeholder={t('promo_search_placeholder')}
                        prefix={<SearchOutlined style={{ color: 'var(--retail-accent)', fontSize: '18px' }} />}
                        value={searchInput}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchInput(val);
                            if (!val) {
                                setQuery({ title: null, page: 1 });
                            }
                        }}
                        allowClear
                        onPressEnter={() => setQuery({ title: searchInput.trim() || null, page: 1 })}
                        className="prm-search-input-luxury"
                    />
                    <Select
                        size="large"
                        value={filterType}
                        onChange={handleFilterChange}
                        placeholder={t('promo_col_status')}
                        className="prm-select-luxury prm-status-select"
                        options={[
                            { value: 'all', label: `${t('promo_col_status')}: ${t('promo_tab_all')}` },
                            { value: 'STARTING', label: `${t('promo_col_status')}: ${t('promo_tab_STARTING')}` },
                            { value: 'INCOMING', label: `${t('promo_col_status')}: ${t('promo_tab_INCOMING')}` },
                            { value: 'DISABLED', label: `${t('promo_col_status')}: ${t('promo_tab_DISABLED')}` },
                            { value: 'ENDED', label: `${t('promo_col_status')}: ${t('promo_tab_ENDED')}` },
                        ]}
                    />
                    <Select
                        size="large"
                        value={promoType}
                        onChange={handleTypeChange}
                        placeholder={t('promo_col_type')}
                        className="prm-select-luxury prm-type-select"
                        options={[
                            { value: 'all', label: `${t('promo_col_type')}: ${t('all')}` },
                            { value: 'ProductPromotion', label: `${t('promo_col_type')}: ${t('promo_type_productpromotion')}` },
                            { value: 'VoucherPromotion', label: `${t('promo_col_type')}: ${t('promo_type_voucherpromotion')}` },
                            { value: 'UserPromotion', label: `${t('promo_col_type')}: ${t('promo_type_userpromotion')}` },
                        ]}
                    />
                    <Select
                        size="large"
                        value={sortOrder}
                        onChange={handleSortChange}
                        placeholder={t('sort_default')}
                        className="prm-select-luxury prm-sort-select"
                        options={[
                            { value: 'default', label: t('sort_default') },
                            { value: 'id,desc', label: t('time_newest') },
                            { value: 'id,asc', label: t('time_oldest') },
                            { value: 'discountValue,desc', label: t('price_high_low') },
                            { value: 'discountValue,asc', label: t('price_low_high') }
                        ]}
                    />
                    <DatePicker.RangePicker
                        size="large"
                        className="prm-date-range-luxury"
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
                                    <th>{t('promo_col_type')}</th>
                                    <th>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {t('promo_col_target')}
                                        </div>
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>{t('promo_col_start_time')}</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>{t('promo_col_end_time')}</th>
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
                                            <td>{getPromotionTypeName(item.promotionType)}</td>
                                            <td>{formatTarget(item)}</td>
                                            <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>{formatDate(item.startAt)}</td>
                                            <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>{formatDate(item.endAt)}</td>
                                            <td align="center">
                                                <span className={`prm-status-badge ${item.status.toLowerCase()}`}>
                                                    {t(`promo_status_${item.status}`)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="prm-empty-td">
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
                                    <span className="prm-card-label">{t('promo_col_type')}</span>
                                    <span className="prm-card-value">{getPromotionTypeName(item.promotionType)}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">
                                        {t('promo_col_target')}
                                    </span>
                                    <span className="prm-card-value">{formatTarget(item)}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">{t('promo_col_start_time')}</span>
                                    <span className="prm-card-value">{formatDate(item.startAt)}</span>
                                </div>
                                <div className="prm-card-row">
                                    <span className="prm-card-label">{t('promo_col_end_time')}</span>
                                    <span className="prm-card-value">{formatDate(item.endAt)}</span>
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
                                 <span className="prm-text-wrap">{formatTarget(selectedPromo)}</span>
                             </div>

                             {selectedPromo.promotionType === 'VoucherPromotion' && (
                                 <>
                                     {selectedPromo.code && (
                                         <div className="prm-modal-row">
                                             <label>{t('promo_code')}:</label>
                                             <span style={{ color: 'var(--retail-accent)', fontWeight: 700 }}>{selectedPromo.code}</span>
                                         </div>
                                     )}
                                     {selectedPromo.minOrderValue > 0 && (
                                         <div className="prm-modal-row">
                                             <label>{t('promo_min_order')}:</label>
                                             <span>{new Intl.NumberFormat('vi-VN').format(selectedPromo.minOrderValue)}đ</span>
                                         </div>
                                     )}
                                     {selectedPromo.usageLimitPerUser && (
                                         <div className="prm-modal-row">
                                             <label>{t('promo_usage_limit')}:</label>
                                             <span>{selectedPromo.usageLimitPerUser}</span>
                                         </div>
                                     )}
                                     {selectedPromo.remainingQuantity !== null && (
                                         <div className="prm-modal-row">
                                             <label>{t('promo_remaining')}:</label>
                                             <span>{selectedPromo.remainingQuantity}</span>
                                         </div>
                                     )}
                                 </>
                             )}

                            {selectedPromo.categoryIds?.length > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('categories')}:</label>
                                    <span className="prm-text-wrap">
                                        {selectedPromo.categoryIds.map(id => metadata.categoryNames?.[id] || id).join(', ')}
                                    </span>
                                </div>
                            )}

                            {selectedPromo.brandIds?.length > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('brands')}:</label>
                                    <span className="prm-text-wrap">
                                        {selectedPromo.brandIds.map(id => metadata.brandNames?.[id] || id).join(', ')}
                                    </span>
                                </div>
                            )}

                            {selectedPromo.productIds?.length > 0 && (
                                <div className="prm-modal-row">
                                    <label>{t('product')}:</label>
                                    <span className="prm-text-wrap">
                                        {selectedPromo.productIds.map(id => metadata.productNames?.[id] || id).join(', ')}
                                    </span>
                                </div>
                            )}

                            <div className="prm-modal-row">
                                <label>{t('promo_col_start_time')}:</label>
                                <span>{formatDate(selectedPromo.startAt)}</span>
                            </div>
                            <div className="prm-modal-row">
                                <label>{t('promo_col_end_time')}:</label>
                                <span>{formatDate(selectedPromo.endAt)}</span>
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

        </div>
    );
}
