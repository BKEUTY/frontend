
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { FiEdit3, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import searchIcon from '../../Assets/Images/Icons/icon_search.svg';
import Skeleton from '../Common/Skeleton';
import './AppointmentList.css';

const AppointmentList = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    const allAppointments = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        serviceKey: i % 3 === 0 ? 'hair_cut_styling' : i % 3 === 1 ? 'deep_skin_care' : 'nourishing_shampoo',
        branch: i % 2 === 0 ? 'Da Nang Branch' : 'Ho Chi Minh City',
        schedule: `10/10/2023 - ${10 + (i % 8)}:00`,
        price: (i + 1) * 500000 + 100000,
        staff: `NV0${(i % 5) + 1}`,
        statusKey: i % 4 === 0 ? 'completed_status' : 'upcoming_status'
    }));

    const filteredAppointments = allAppointments.filter(item =>
        t(item.serviceKey).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="appointment-list-container">
            <div className="appointment-header">
                <div>
                    <h3>{t('appointment_list')}</h3>
                    <span className="current-time">{t('manage_appointments_desc')}</span>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder={t('search_appointment_placeholder')}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="search-input"
                    />
                    <img src={searchIcon} alt="Search" className="btn-search-icon" />
                </div>
            </div>

            <div className="appointment-table-wrapper">
                <table className="appointment-table">
                    <thead>
                        <tr>
                            <th width="5%">#</th>
                            <th width="25%">{t('service_col')}</th>
                            <th width="20%">{t('branch_col')}</th>
                            <th width="15%">{t('time_col')}</th>
                            <th width="10%">{t('staff_col')}</th>
                            <th width="15%">{t('price')}</th>
                            <th width="10%" className="text-center">{t('actions_col')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td><Skeleton width="20px" height="20px" /></td>
                                    <td>
                                        <div className="service-info">
                                            <Skeleton width="120px" height="20px" style={{ marginBottom: '5px' }} />
                                            <Skeleton width="80px" height="15px" />
                                        </div>
                                    </td>
                                    <td><Skeleton width="100px" height="20px" /></td>
                                    <td>
                                        <div className="date-time">
                                            <Skeleton width="50px" height="20px" style={{ marginBottom: '5px' }} />
                                            <Skeleton width="70px" height="14px" />
                                        </div>
                                    </td>
                                    <td><Skeleton width="50px" height="24px" borderRadius="12px" /></td>
                                    <td><Skeleton width="80px" height="20px" /></td>
                                    <td className="action-cell">
                                        <Skeleton width="24px" height="24px" borderRadius="4px" style={{ display: 'inline-block', marginRight: '5px' }} />
                                        <Skeleton width="24px" height="24px" borderRadius="4px" style={{ display: 'inline-block' }} />
                                    </td>
                                </tr>
                            ))
                        ) : currentAppointments.length > 0 ? (
                            currentAppointments.map((apt) => (
                                <tr key={apt.id}>
                                    <td data-label="#"><span className="id-badge">#{apt.id}</span></td>
                                    <td data-label={t('service_col')}>
                                        <div className="service-info">
                                            <span className="service-name">{t(apt.serviceKey)}</span>
                                            <span className={`payment-status ${apt.statusKey === 'completed_status' ? 'text-green' : 'text-orange'}`}>
                                                {t(apt.statusKey)}
                                            </span>
                                        </div>
                                    </td>
                                    <td data-label={t('branch_col')}>{apt.branch}</td>
                                    <td data-label={t('time_col')}>
                                        <div className="date-time">
                                            <span className="time-highlight">{apt.schedule.split(' - ')[1]}</span>
                                            <span className="date-sub">{apt.schedule.split(' - ')[0]}</span>
                                        </div>
                                    </td>
                                    <td data-label={t('staff_col')}>
                                        <div className="staff-tag">{apt.staff}</div>
                                    </td>
                                    <td data-label={t('price')} className="price-text">{apt.price.toLocaleString()}đ</td>
                                    <td data-label={t('actions_col')} className="action-cell">
                                        <button className="btn-icon btn-edit" title={t('edit_tooltip')}>
                                            <FiEdit3 />
                                        </button>
                                        <button className="btn-icon btn-delete" title={t('cancel_tooltip')}>
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">{t('no_appointments_found')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="appointment-footer">
                <div className="showing-info">
                    {t('showing_info_appointments')}
                    <strong>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAppointments.length)}</strong>
                    {t('of_total_appointments')}
                    <strong>{filteredAppointments.length}</strong>
                    {t('appointments_unit')}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <FiChevronLeft />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
