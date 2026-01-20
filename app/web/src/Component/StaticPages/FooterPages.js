import { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './StaticPage.css';
import location_icon from "../../Assets/Images/Icons/icon_location.svg";
import call_icon from "../../Assets/Images/Icons/icon_phone.svg";
import search_icon from "../../Assets/Images/Icons/icon_search.svg";


const StaticPageLayout = ({ title, children }) => {
    return (
        <div className="static-page-container">
            <h1 className="static-page-title">{title}</h1>
            <div className="static-page-content">
                {children}
            </div>
        </div>
    );
};

export const AboutUs = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('about_brand') || "Về Thương Hiệu"}>
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
        <StaticPageLayout title={t('contact') || "Liên Hệ"}>
            <p>{t('contact_intro')}</p>

            <div className="content-image-placeholder">
                {t('contact_map_placeholder')}
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
        <StaticPageLayout title={t('faq') || "Câu Hỏi Thường Gặp"}>
            <h3>{t('faq_1_title')}</h3>
            <p>{t('faq_1_q1')}<br />
                {t('faq_1_a1')}</p>

            <p>{t('faq_1_q2')}<br />
                {t('faq_1_a2')}</p>

            <h3>{t('faq_2_title')}</h3>
            <p>{t('faq_2_q1')}<br />
                {t('faq_2_a1')}</p>

            <p>{t('faq_2_q2')}<br />
                {t('faq_2_a2')}</p>

            <h3>{t('faq_3_title')}</h3>
            <p>{t('faq_3_q1')}<br />
                {t('faq_3_a1')}</p>
        </StaticPageLayout>
    );
};

export const RetailSystem = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState(null);

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

    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
    const paginatedBranches = filteredBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (selectedBranch) {
        return (
            <StaticPageLayout title={`${t('retail_detail')}: ${selectedBranch.name}`}>
                <div className="retail-detail-view">
                    <button className="back-btn" onClick={() => setSelectedBranch(null)}>
                        {t('retail_back_to_list')}
                    </button>

                    <div className="detail-row">
                        <span className="detail-label">{t('retail_address')}:</span>
                        <span className="detail-value">{selectedBranch.address}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">{t('retail_phone')}:</span>
                        <span className="detail-value">{selectedBranch.phone}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">{t('status')}:</span>
                        <span className="detail-value" style={{ color: selectedBranch.status === 'Open' ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
                            {selectedBranch.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">{t('retail_open_date')}:</span>
                        <span className="detail-value">{selectedBranch.open_date}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">{t('retail_manager')}:</span>
                        <span className="detail-value">{selectedBranch.manager}</span>
                    </div>
                </div>
            </StaticPageLayout>
        );
    }

    return (
        <StaticPageLayout title={t('retail_system') || "Hệ Thống Cửa Hàng"}>
            <div className="retail-filters">
                <div className="retail-search-container">
                    <img src={search_icon} alt="search" className="search-icon-img" />
                    <input
                        type="text"
                        placeholder={t('retail_search_placeholder')}
                        className="retail-search-input"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="retail-status-dropdown-container">
                    <div
                        className="retail-status-trigger"
                        onClick={() => document.getElementById('status-dropdown-menu').classList.toggle('show')}
                    >
                        <span>
                            {statusFilter === 'all' && `${t('retail_filter_status')}: ${t('all')}`}
                            {statusFilter === 'Open' && t('retail_status_open')}
                            {statusFilter === 'Closed' && t('retail_status_closed')}
                        </span>
                        <span className="dropdown-arrow">▼</span>
                    </div>
                    <ul id="status-dropdown-menu" className="retail-status-menu">
                        <li onClick={() => { setStatusFilter('all'); setCurrentPage(1); document.getElementById('status-dropdown-menu').classList.remove('show'); }} className={statusFilter === 'all' ? 'active' : ''}>
                            {t('retail_filter_status')}: {t('all')}
                        </li>
                        <li onClick={() => { setStatusFilter('Open'); setCurrentPage(1); document.getElementById('status-dropdown-menu').classList.remove('show'); }} className={statusFilter === 'Open' ? 'active' : ''}>
                            {t('retail_status_open')}
                        </li>
                        <li onClick={() => { setStatusFilter('Closed'); setCurrentPage(1); document.getElementById('status-dropdown-menu').classList.remove('show'); }} className={statusFilter === 'Closed' ? 'active' : ''}>
                            {t('retail_status_closed')}
                        </li>
                    </ul>
                </div>
            </div>

            {paginatedBranches.length > 0 ? (
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
                                    <img src={location_icon} alt="address" className="store-icon" />
                                    <span>{branch.address}</span>
                                </div>
                                <div className="store-info-item">
                                    <img src={call_icon} alt="phone" className="store-icon" />
                                    <span>{branch.phone}</span>
                                </div>
                                <button
                                    className="btn-store-detail"
                                    onClick={() => branch.status === 'Open' && setSelectedBranch(branch)}
                                    disabled={branch.status === 'Closed'}
                                >
                                    {t('retail_detail')}
                                </button>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                ❮
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className="page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                ❯
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>{t('retail_no_result')}</p>
            )}
        </StaticPageLayout>
    );
};

export const BeautyCorner = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('beauty_corner') || "Góc Làm Đẹp"}>
            <p>{t('beauty_corner_intro')}</p>

            <div className="content-image-placeholder">
                {t('beauty_corner_img')}
            </div>

            <h3>{t('beauty_featured_title')}</h3>
            <ul>
                <li>
                    <strong>{t('beauty_art_1_title')}</strong><br />
                    {t('beauty_art_1_desc')}
                </li>
                <li>
                    <strong>{t('beauty_art_2_title')}</strong><br />
                    {t('beauty_art_2_desc')}
                </li>
                <li>
                    <strong>{t('beauty_art_3_title')}</strong><br />
                    {t('beauty_art_3_desc')}
                </li>
            </ul>
        </StaticPageLayout>
    );
};

export const Terms = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('terms') || "Điều Khoản & Chính Sách"}>
            <h3>{t('terms_1_title')}</h3>
            <p>{t('terms_1_content')}</p>

            <h3>{t('terms_2_title')}</h3>
            <p>{t('terms_2_content')}</p>

            <h3>{t('terms_3_title')}</h3>
            <p>{t('terms_3_content')}</p>
        </StaticPageLayout>
    );
};
