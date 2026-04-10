import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/store/LanguageContext';
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    UserOutlined,
    LeftOutlined
} from '@ant-design/icons';
import { Input, Select, Button } from 'antd';
import { Skeleton, Pagination, EmptyState, CButton, SEO } from '@/components/common';
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDebounce } from "@/hooks/useDebounce";
import './RetailSystem.css';

export default function RetailSystem() {
    const { t } = useLanguage();
    const [query, setQuery] = useQueryParams();

    const searchTermFromUrl = query.search || '';
    const statusFilter = query.status || 'all';
    const page = query.page ? Number(query.page) - 1 : 0;
    const pageSize = 6;

    const [searchInput, setSearchInput] = useState(searchTermFromUrl);
    const debouncedSearch = useDebounce(searchInput, 500);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const branches = useMemo(() => [
        { id: 1, name: "BKEUTY - Quận 1", address: "123 Lê Lợi, Phường Bến Nghé, Quận 1", phone: "0908 741 625", status: "Open", open_date: "2024-01-15", manager: "Nguyễn Văn A" },
        { id: 9, name: "BKEUTY - Đồng Nai", address: "Ấp Đất Mới, xã Long Phước, Đồng Nai", phone: "0908 741 633", status: "Closed", open_date: "2024-05-10", manager: "Nguyễn Văn I" },
        { id: 2, name: "BKEUTY - Quận 2", address: "45 Thảo Điền, Phường Thảo Điền, Quận 2", phone: "0908 741 626", status: "Open", open_date: "2024-02-01", manager: "Trần Thị B" },
        { id: 3, name: "BKEUTY - Quận 3", address: "78 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3", phone: "0908 741 627", status: "Open", open_date: "2024-02-10", manager: "Lê Văn C" },
        { id: 12, name: "BKEUTY - Hà Nội 2", address: "789 Phố Huế, Hai Bà Trưng, Hà Nội", phone: "0908 741 636", status: "Closed", open_date: "2024-07-01", manager: "Hoàng Thị M" },
        { id: 4, name: "BKEUTY - Quận 5", address: "90 Nguyễn Trãi, Phường 3, Quận 5", phone: "0908 741 628", status: "Open", open_date: "2024-03-05", manager: "Phạm Thị D" },
        { id: 5, name: "BKEUTY - Quận 7", address: "101 Nguyễn Văn Linh, Tân Phong, Quận 7", phone: "0908 741 629", status: "Open", open_date: "2024-03-20", manager: "Hoàng Văn E" },
        { id: 6, name: "BKEUTY - Quận 10", address: "123 Tô Hiến Thành, Phường 14, Quận 10", phone: "0908 741 630", status: "Open", open_date: "2024-04-01", manager: "Nguyễn Văn F" },
        { id: 7, name: "BKEUTY - Quận 11", address: "234 Lạc Long Quân, Phường 5, Quận 11", phone: "0908 741 631", status: "Open", open_date: "2024-04-15", manager: "Trần Văn G" },
        { id: 8, name: "BKEUTY - Quận 12", address: "456 Lê Văn Khương, Thới An, Quận 12", phone: "0908 741 632", status: "Open", open_date: "2024-05-01", manager: "Lê Thị H" },
        { id: 10, name: "BKEUTY - Thủ Đức", address: "438 Võ Văn Ngân, TP. Thủ Đức", phone: "0908 741 634", status: "Open", open_date: "2024-06-01", manager: "Trần Văn K" },
        { id: 11, name: "BKEUTY - Hà Nội 1", address: "101 Cầu Giấy, Quận Cầu Giấy, Hà Nội", phone: "0908 741 635", status: "Open", open_date: "2024-06-15", manager: "Phạm Văn L" },
    ], []);

    useEffect(() => {
        setSearchInput(searchTermFromUrl);
    }, [searchTermFromUrl]);

    useEffect(() => {
        if (debouncedSearch !== searchTermFromUrl) {
            setQuery({ search: debouncedSearch || null, page: 1 });
        }
    }, [debouncedSearch, searchTermFromUrl, setQuery]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [searchTermFromUrl, statusFilter, page]);

    const filteredBranches = useMemo(() => {
        return branches.filter(branch => {
            const matchesSearch = branch.name.toLowerCase().includes(searchTermFromUrl.toLowerCase());
            const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [branches, searchTermFromUrl, statusFilter]);

    const totalPages = Math.ceil(filteredBranches.length / pageSize);
    const paginatedBranches = filteredBranches.slice(page * pageSize, (page + 1) * pageSize);

    const handleStatusChange = (value) => {
        setQuery({ status: value === 'all' ? null : value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setQuery({ page: newPage + 1 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (selectedBranch) {
        return (
            <div className="retail-page-container">
                <SEO title={`${t('retail_detail')}: ${selectedBranch.name}`} />
                <div className="retail-page-header">
                    <h1 className="retail-page-title">{t('retail_detail')}: {selectedBranch.name}</h1>
                </div>
                <div className="retail-page-content">
                    <div className="retail-detail-wrapper">
                        <Button icon={<LeftOutlined />} onClick={() => setSelectedBranch(null)} className="btn-back" type="text">
                            {t('retail_back_to_list')}
                        </Button>
                        <div className="retail-detail-card">
                            <div className="detail-header">
                                <h2>{selectedBranch.name}</h2>
                                <span className={`retail-status-badge ${selectedBranch.status.toLowerCase()}`}>
                                    {selectedBranch.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                                </span>
                            </div>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <div className="detail-icon"><EnvironmentOutlined /></div>
                                    <div className="detail-content"><label>{t('retail_address')}</label><p>{selectedBranch.address}</p></div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><PhoneOutlined /></div>
                                    <div className="detail-content"><label>{t('retail_phone')}</label><p>{selectedBranch.phone}</p></div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><ClockCircleOutlined /></div>
                                    <div className="detail-content"><label>{t('retail_open_date')}</label><p>{selectedBranch.open_date}</p></div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><UserOutlined /></div>
                                    <div className="detail-content"><label>{t('retail_manager')}</label><p>{selectedBranch.manager}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="retail-page-container">
            <SEO title={t('retail_system')} />
            <div className="retail-page-header">
                <h1 className="retail-page-title">{t('retail_system')}</h1>
            </div>
            <div className="retail-page-content">
                <div className="retail-controls">
                    <Input
                        size="large"
                        placeholder={t('retail_search_placeholder')}
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="retail-search-input"
                    />
                    <Select
                        size="large"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="retail-status-select"
                        options={[
                            { value: 'all', label: t('all') },
                            { value: 'Open', label: t('retail_status_open') },
                            { value: 'Closed', label: t('retail_status_closed') },
                        ]}
                    />
                </div>

                {isLoading ? (
                    <div className="retail-grid">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="store-card skeleton-card">
                                <div className="store-card-header">
                                    <Skeleton width="60%" height="22px" /><Skeleton width="80px" height="26px" borderRadius="13px" />
                                </div>
                                <div className="store-card-body">
                                    <Skeleton width="100%" height="14px" style={{ marginBottom: '10px' }} /><Skeleton width="70%" height="14px" />
                                </div>
                                <div className="store-card-footer"><Skeleton width="100%" height="36px" borderRadius="6px" /></div>
                            </div>
                        ))}
                    </div>
                ) : paginatedBranches.length > 0 ? (
                    <>
                        <div className="retail-grid">
                            {paginatedBranches.map(branch => (
                                <div key={branch.id} className={`store-card ${branch.status === 'Closed' ? 'inactive' : ''}`}>
                                    <div className="store-card-header">
                                        <h4 className="store-title">{branch.name}</h4>
                                        <span className={`retail-status-badge ${branch.status.toLowerCase()}`}>
                                            {branch.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                                        </span>
                                    </div>
                                    <div className="store-card-body">
                                        <p className="store-info"><EnvironmentOutlined /> <span>{branch.address}</span></p>
                                        <p className="store-info"><PhoneOutlined /> <span>{branch.phone}</span></p>
                                    </div>
                                    <div className="store-card-footer">
                                        <CButton 
                                            type="primary" 
                                            block 
                                            disabled={branch.status === 'Closed'}
                                            onClick={() => branch.status === 'Open' && setSelectedBranch(branch)}
                                        >
                                            {t('retail_detail')}
                                        </CButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination-wrapper">
                                <Pagination 
                                    page={page} 
                                    totalPages={totalPages} 
                                    totalItems={filteredBranches.length} 
                                    pageSize={pageSize} 
                                    onPageChange={handlePageChange} 
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state-wrapper">
                        <EmptyState title={t('retail_no_result')} />
                    </div>
                )}
            </div>
        </div>
    );
}
