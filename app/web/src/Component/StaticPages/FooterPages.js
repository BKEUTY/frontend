import { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    UserOutlined,
    LeftOutlined
} from '@ant-design/icons';
import './StaticPage.css';
import { Skeleton, PageWrapper, Pagination, CButton, EmptyState } from '../Common';
import usePagination from '../../hooks/usePagination';
import useClickOutside from '../../hooks/useClickOutside';
import contact_map from "../../Assets/Images/contact_google_map.png";

const StaticPageLayout = ({ title, children }) => {
    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1 className="static-page-title">{title}</h1>
            </div>
            <div className="static-page-content">
                {children}
            </div>
        </div>
    );
};

export const AboutUs = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('about_brand')}>
            <div className="content-image-placeholder">
                {t('about_us_banner')}
            </div>
            <h3>{t('about_us_story_title')}</h3>
            <p>{t('about_us_story_p1')}</p>
            <p>{t('about_us_story_p2')}</p>

            <h3>{t('about_us_mission_title')}</h3>
            <p>{t('about_us_mission')}</p>
            <p>{t('about_us_vision')}</p>

            <div className="content-image-placeholder">
                {t('about_us_team_img')}
            </div>

            <h3>{t('about_us_values_title')}</h3>
            <ul>
                <li>{t('about_us_value_trust')}</li>
                <li>{t('about_us_value_dedication')}</li>
                <li>{t('about_us_value_trend')}</li>
            </ul>
        </StaticPageLayout>
    );
};

export const Contact = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('contact')}>
            <p>{t('contact_intro')}</p>

            <div className="content-image-placeholder map-container">
                <img src={contact_map} alt="Google Map Store Location" className="contact-map-img" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            <h3>{t('contact_channels_title')}</h3>
            <ul>
                <li>{t('contact_hotline')}</li>
                <li>{t('contact_email')}</li>
                <li>{t('contact_zalo')}</li>
            </ul>

            <h3>{t('contact_office_title')}</h3>
            <p>
                {t('contact_office_address')}<br />
                {t('contact_office_desc')}
            </p>
        </StaticPageLayout>
    );
};

export const FAQ = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('faq')}>
            <h3>{t('faq_1_title')}</h3>
            <p>{t('faq_1_q1')}<br />{t('faq_1_a1')}</p>

            <p>{t('faq_1_q2')}<br />{t('faq_1_a2')}</p>

            <h3>{t('faq_2_title')}</h3>
            <p>{t('faq_2_q1')}<br />{t('faq_2_a1')}</p>

            <p>{t('faq_2_q2')}<br />{t('faq_2_a2')}</p>

            <h3>{t('faq_3_title')}</h3>
            <p>{t('faq_3_q1')}<br />{t('faq_3_a1')}</p>
        </StaticPageLayout>
    );
};

export const RetailSystem = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const { pagination, setCurrent } = usePagination(0, 6);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, pagination.current]);

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

    const filteredBranches = useMemo(() => {
        return branches.filter(branch => {
            const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [branches, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredBranches.length / pagination.pageSize);
    const paginatedBranches = filteredBranches.slice(pagination.current * pagination.pageSize, (pagination.current + 1) * pagination.pageSize);

    if (selectedBranch) {
        return (
            <StaticPageLayout title={`${t('retail_detail')}: ${selectedBranch.name}`}>
                <div className="retail-detail-view">
                    <CButton type="outline" icon={<LeftOutlined />} onClick={() => setSelectedBranch(null)} style={{ marginBottom: 25, borderRadius: 30 }}>
                        {t('retail_back_to_list')}
                    </CButton>

                    <div className="detail-row">
                        <span className="detail-label"><EnvironmentOutlined /> {t('retail_address')}:</span>
                        <span className="detail-value">{selectedBranch.address}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label"><PhoneOutlined /> {t('retail_phone')}:</span>
                        <span className="detail-value">{selectedBranch.phone}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">{t('status')}:</span>
                        <span className="detail-value" style={{ color: selectedBranch.status === 'Open' ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
                            {selectedBranch.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label"><ClockCircleOutlined /> {t('retail_open_date')}:</span>
                        <span className="detail-value">{selectedBranch.open_date}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label"><UserOutlined /> {t('retail_manager')}:</span>
                        <span className="detail-value">{selectedBranch.manager}</span>
                    </div>
                </div>
            </StaticPageLayout>
        );
    }

    return (
        <StaticPageLayout title={t('retail_system')}>
            <div className="retail-filters">
                <div className="retail-search-container">
                    <SearchOutlined className="search-icon-img" />
                    <input
                        type="text"
                        placeholder={t('retail_search_placeholder')}
                        className="retail-search-input"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrent(0); }}
                    />
                </div>
                <div className="retail-status-dropdown-container" ref={dropdownRef}>
                    <div
                        className="retail-status-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>
                            {statusFilter === 'all' && `${t('retail_filter_status')}: ${t('all')}`}
                            {statusFilter === 'Open' && t('retail_status_open')}
                            {statusFilter === 'Closed' && t('retail_status_closed')}
                        </span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    <ul className={`retail-status-menu ${isDropdownOpen ? 'show' : ''}`}>
                        <li onClick={() => { setStatusFilter('all'); setCurrent(0); setIsDropdownOpen(false); }} className={statusFilter === 'all' ? 'active' : ''}>
                            {t('retail_filter_status')}: {t('all')}
                        </li>
                        <li onClick={() => { setStatusFilter('Open'); setCurrent(0); setIsDropdownOpen(false); }} className={statusFilter === 'Open' ? 'active' : ''}>
                            {t('retail_status_open')}
                        </li>
                        <li onClick={() => { setStatusFilter('Closed'); setCurrent(0); setIsDropdownOpen(false); }} className={statusFilter === 'Closed' ? 'active' : ''}>
                            {t('retail_status_closed')}
                        </li>
                    </ul>
                </div>
            </div>

            {isLoading ? (
                <div className="retail-grid">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="store-card">
                            <div className="store-header">
                                <Skeleton width="60%" height="24px" />
                                <Skeleton width="60px" height="20px" borderRadius="12px" />
                            </div>
                            <div className="store-info-item">
                                <Skeleton width="20px" height="20px" borderRadius="50%" />
                                <Skeleton width="80%" height="16px" style={{ marginLeft: '10px' }} />
                            </div>
                            <div className="store-info-item">
                                <Skeleton width="20px" height="20px" borderRadius="50%" />
                                <Skeleton width="50%" height="16px" style={{ marginLeft: '10px' }} />
                            </div>
                            <Skeleton width="100%" height="36px" borderRadius="18px" style={{ marginTop: '15px' }} />
                        </div>
                    ))}
                </div>
            ) : paginatedBranches.length > 0 ? (
                <>
                    <div className="retail-grid">
                        {paginatedBranches.map(branch => (
                            <div key={branch.id} className={`store-card ${branch.status === 'Closed' ? 'disabled-card' : ''}`}>
                                <div className="store-header">
                                    <h4 className="store-name">{branch.name}</h4>
                                    <span className={`store-status-badge ${branch.status === 'Open' ? 'status-open' : 'status-closed'}`}>
                                        {branch.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                                    </span>
                                </div>
                                <div className="store-info-item">
                                    <EnvironmentOutlined className="store-icon" />
                                    <span>{branch.address}</span>
                                </div>
                                <div className="store-info-item">
                                    <PhoneOutlined className="store-icon" />
                                    <span>{branch.phone}</span>
                                </div>
                                <CButton 
                                    type="outline" 
                                    block 
                                    disabled={branch.status === 'Closed'} 
                                    onClick={() => branch.status === 'Open' && setSelectedBranch(branch)}
                                    style={{ marginTop: 'auto' }}
                                >
                                    {t('retail_detail')}
                                </CButton>
                            </div>
                        ))}
                    </div>
                    <Pagination page={pagination.current} totalPages={totalPages} onPageChange={setCurrent} />
                </>
            ) : (
                <div style={{ padding: '40px 0' }}>
                    <EmptyState title={t('retail_no_result')} />
                </div>
            )}
        </StaticPageLayout>
    );
};

export const Terms = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('terms')}>
            <h3>{t('terms_1_title')}</h3>
            <p>{t('terms_1_content')}</p>

            <h3>{t('terms_2_title')}</h3>
            <p>{t('terms_2_content')}</p>

            <h3>{t('terms_3_title')}</h3>
            <p>{t('terms_3_content')}</p>
        </StaticPageLayout>
    );
};