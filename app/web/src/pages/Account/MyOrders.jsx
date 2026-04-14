import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/store/LanguageContext';
import { Spin, Select, DatePicker } from 'antd';
import { EyeOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useQueryParams } from '@/hooks/useQueryParams';
import { SEO, Pagination } from '@/components/common';
import dayjs from 'dayjs';
import './MyOrders.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MyOrders = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [queryData, setQuery] = useQueryParams();
    const query = queryData || {};

    const rawPage = query.page ? Number(query.page) : 1;
    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    
    const rawSize = query.pageSize ? Number(query.pageSize) : 10;
    const pageSize = Number.isFinite(rawSize) ? Math.max(1, rawSize) : 10;

    const status = query.status || 'ALL';
    const sort = query.sort || 'default';
    const startDate = query.startDate || null;
    const endDate = query.endDate || null;

    const filters = {
        status: status === 'ALL' ? null : status,
        sort,
        startDate,
        endDate,
    };

    const { orders, total, totalPages, loading } = useOrders(page, pageSize, filters);

    const onPageChange = (p) => {
        setQuery({ page: p });
    };

    const handleFilterChange = (params) => {
        setQuery({ ...params, page: 1 });
    };

    const getStatusClass = (status) => {
        if (!status) return 'default';
        const s = status.toUpperCase();
        if (s === 'PAID' || s === 'COMPLETED') return 'success';
        if (s === 'UNPAID' || s === 'IN_PROGRESS') return 'warning';
        if (s === 'CANCELLED') return 'danger';
        return 'default';
    };

    return (
        <div className="ord-page-container">
            <SEO title={t('my_orders')} />
            
            <div className="ord-page-header">
                <h2 className="ord-page-title">{t('my_orders')}</h2>
            </div>

            <div className="ord-filter-section-compact">
                <div className="ord-filter-group">
                    <FilterOutlined className="ord-filter-icon-only" />
                    <div className="ord-filter-controls">
                        <Select 
                            value={status} 
                            onChange={(val) => handleFilterChange({ status: val })} 
                            className="ord-compact-select"
                        >
                            <Option value="ALL">{t('all')}</Option>
                            <Option value="UNPAID">{t('order_status_UNPAID')}</Option>
                            <Option value="PAID">{t('order_status_PAID')}</Option>
                            <Option value="IN_PROGRESS">{t('order_status_IN_PROGRESS')}</Option>
                            <Option value="COMPLETED">{t('order_status_COMPLETED')}</Option>
                            <Option value="CANCELLED">{t('order_status_CANCELLED')}</Option>
                        </Select>
                        <RangePicker 
                            value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null}
                            onChange={(dates) => {
                                handleFilterChange({
                                    startDate: dates?.[0] ? dates[0].format('YYYY-MM-DD') : null,
                                    endDate: dates?.[1] ? dates[1].format('YYYY-MM-DD') : null
                                });
                            }}
                            className="ord-compact-range"
                            placeholder={[t('startDate'), t('endDate')]}
                        />
                    </div>
                </div>

                <div className="ord-filter-group sort-group">
                    <SortAscendingOutlined className="ord-filter-icon-only" />
                    <div className="ord-filter-controls">
                        <Select 
                            value={sort} 
                            onChange={(val) => handleFilterChange({ sort: val })} 
                            className="ord-compact-select"
                        >
                            <Option value="default">{t('sort_default')}</Option>
                            <Option value="date_desc">{t('time_newest')}</Option>
                            <Option value="date_asc">{t('time_oldest')}</Option>
                            <Option value="total_desc">{t('price_high_low')}</Option>
                            <Option value="total_asc">{t('price_low_high')}</Option>
                        </Select>
                    </div>
                </div>
            </div>
            
            <div className="ord-page-content">
                <div className="ord-table-wrapper">
                    {loading ? (
                        <div className="ord-loading"><Spin size="large" /></div>
                    ) : (
                        <>
                            <table className="ord-table">
                                <thead>
                                    <tr>
                                        <th>{t('order_id')}</th>
                                        <th>{t('order_date')}</th>
                                        <th>{t('total')}</th>
                                        <th align="center">{t('payment_method')}</th>
                                        <th align="center">{t('status')}</th>
                                        <th align="center">{t('actions_col')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders && orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order.id} className="ord-row">
                                                <td className="ord-id-col">
                                                    <Link to={`/account/orders/${order.id}`} state={{ order }}>#{order.id}</Link>
                                                </td>
                                                <td>{order.formattedDate}</td>
                                                <td><span className="ord-highlight-total">{order.formattedTotal}</span></td>
                                                <td align="center">{order.paymentMethod}</td>
                                                <td align="center">
                                                    <span className={`ord-status-badge ${getStatusClass(order.status)}`}>
                                                        {t(`order_status_${order.status}`)}
                                                    </span>
                                                </td>
                                                <td align="center">
                                                    <button 
                                                        className="ord-action-btn"
                                                        onClick={() => navigate(`/account/orders/${order.id}`, { state: { order } })}
                                                        title={t('view_detail')}
                                                        aria-label={t('view_detail')}
                                                    >
                                                        <EyeOutlined />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="ord-empty-state">
                                                    <p>{t('no_orders')}</p>
                                                    <button className="goto-shopping" onClick={() => navigate('/product')}>
                                                        {t('continue_shopping')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            <div className="ord-pagination-wrapper">
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    totalItems={total}
                                    pageSize={pageSize}
                                    onPageChange={onPageChange}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="ord-mobile-list">
                    {loading ? (
                        <div className="ord-loading"><Spin /></div>
                    ) : (
                        <>
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <div className="ord-card" key={order.id}>
                                        <div className="ord-card-header">
                                            <Link to={`/account/orders/${order.id}`} state={{ order }} className="ord-card-title">#{order.id}</Link>
                                            <span className={`ord-status-badge ${getStatusClass(order.status)}`}>
                                                {t(`order_status_${order.status}`)}
                                            </span>
                                        </div>
                                        <div className="ord-card-row">
                                            <span>{t('order_date')}</span>
                                            <span className="fw-600">{order.formattedDate}</span>
                                        </div>
                                        <div className="ord-card-row">
                                            <span>{t('total')}</span>
                                            <span className="ord-highlight-total">{order.formattedTotal}</span>
                                        </div>
                                        <button 
                                            className="ord-btn-detail"
                                            onClick={() => navigate(`/account/orders/${order.id}`, { state: { order } })}
                                        >
                                            {t('view_detail')}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="ord-empty-state">
                                    <p>{t('no_orders')}</p>
                                    <button className="goto-shopping" onClick={() => navigate('/product')}>
                                        {t('continue_shopping')}
                                    </button>
                                </div>
                            )}
                            
                            <div className="mobile-pagination">
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    totalItems={total}
                                    pageSize={pageSize}
                                    onPageChange={onPageChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;

