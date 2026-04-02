import React, { useState } from 'react';
import { StarFilled, CheckCircleFilled, MessageOutlined, HeartOutlined, DownOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useLanguage } from '../../i18n/LanguageContext';
import { Pagination, Skeleton } from '../../Component/Common';
import { useReviews } from '../../hooks/useReviews';
import './ProductDetail.css';

const ProductReviews = ({ variantId, averageRating, reviewCount, initialReviews = [], ratingCounts = {} }) => {
    const { t } = useLanguage();
    const [page, setPage] = useState(0);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [hasImageFilter, setHasImageFilter] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const pageSize = 5;
    
    const { reviewsData, isLoading } = useReviews(variantId, {
        page,
        size: pageSize,
        rating: ratingFilter,
        hasImage: hasImageFilter
    }, {
        enabled: isExpanded
    });

    const reviewsToShow = isExpanded ? (reviewsData?.reviews?.content || []) : initialReviews;
    const totalElements = isExpanded ? (reviewsData?.reviews?.totalElements || 0) : initialReviews.length;
    const totalPages = isExpanded ? (reviewsData?.reviews?.totalPages || 0) : 1;
    const apiRatingCounts = isExpanded ? (reviewsData?.ratingCounts || {}) : ratingCounts;

    const handleRatingClick = (stars) => {
        setRatingFilter(prev => prev === stars ? null : stars);
        setPage(0);
        setIsExpanded(true);
    };

    const handleMediaClick = () => {
        setHasImageFilter(prev => prev ? null : true);
        setPage(0);
        setIsExpanded(true);
    };

    return (
        <div className="tab-content review-tab-content">
            <div className="review-dashboard">
                <div className="rating-overview">
                    <span className="big-score">{averageRating || 0}</span>
                    <div className="star-stack">
                        <div className="star-row">
                            {[...Array(5)].map((_, i) => (
                                <StarFilled 
                                    key={i} 
                                    className={`bkeuty-star ${i < Math.round(averageRating || 0) ? 'filled' : 'empty'}`} 
                                />
                            ))}
                        </div>
                        <span className="total-reviews">{reviewCount || 0} {t('reviews')}</span>
                    </div>
                </div>
                <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = apiRatingCounts[star] || 0;
                        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                        return (
                            <div key={star} className={`bar-row ${ratingFilter === star ? 'active' : ''}`} onClick={() => handleRatingClick(star)} style={{ cursor: 'pointer' }}>
                                <span className="star-label">{star} <StarFilled style={{ fontSize: '12px' }} className="bkeuty-star" /></span>
                                <div className="progress-bg">
                                    <div className="progress-fi" style={{ width: `${percentage}%` }} /> 
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="review-filters">
                <button 
                    className={`filter-chip ${!ratingFilter && !hasImageFilter ? 'active' : ''}`}
                    onClick={() => { setRatingFilter(null); setHasImageFilter(null); setPage(0); setIsExpanded(true); }}
                >
                    {t('all')}
                </button>
                <button 
                    className={`filter-chip ${hasImageFilter ? 'active' : ''}`}
                    onClick={handleMediaClick}
                >
                    {t('with_images')}
                </button>
                {[5, 4, 3, 2, 1].map(star => (
                    <button 
                        key={star}
                        className={`filter-chip ${ratingFilter === star ? 'active' : ''}`}
                        onClick={() => handleRatingClick(star)}
                    >
                        {star} {t('rating')}
                    </button>
                ))}
            </div>

            <div className="review-list-container">
                {isLoading && isExpanded ? (
                    <Skeleton width="100%" height="200px" />
                ) : reviewsToShow.length === 0 ? (
                    <div className="no-reviews-msg">{t('no_reviews')}</div>
                ) : (
                    reviewsToShow.map((rev) => {
                        const validImages = rev.images?.filter(img => img && img.trim() !== "") || [];

                        return (
                            <div key={rev.id} className="review-card">
                                <div className="review-user-avatar">{rev.userName?.charAt(0) || 'U'}</div>
                                <div className="review-content-body">
                                    <div className="review-header-row">
                                        <span className="reviewer-name">{rev.userName || 'User'}</span>
                                        <span className="review-time">
                                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ''}
                                        </span>
                                    </div>
                                    <div className="review-stars-row">
                                        {[...Array(5)].map((_, starIdx) => (
                                            <span key={starIdx} className={`rv-star ${starIdx < rev.rating ? 'filled' : ''}`}>
                                                <StarFilled className="bkeuty-star" />
                                            </span>
                                        ))}
                                        <span className="verified-tag">
                                            <CheckCircleFilled className="icon-check" /> {t('verified_purchase')}
                                        </span>
                                    </div>
                                    <div className="review-text">{rev.comment}</div>
                                    
                                    {validImages.length > 0 && (
                                        <div className="review-images-grid">
                                            {validImages.map((img, idx) => (
                                                <img key={idx} src={img} alt="review" className="review-img-item" />
                                            ))}
                                        </div>
                                    )}
                                    
                                    {rev.reply && (
                                        <div className="admin-reply-box">
                                            <div className="admin-reply-header">
                                                <Tag color="gold">{t('admin_reply')}</Tag>
                                                <span className="reply-time">
                                                    {rev.reply.repliedAt ? new Date(rev.reply.repliedAt).toLocaleDateString('vi-VN') : ''}
                                                </span>
                                            </div>
                                            <div className="admin-reply-content">
                                                {rev.reply.comment}
                                            </div>
                                        </div>
                                    )}

                                    <div className="review-actions">
                                        <button className="action-btn"><HeartOutlined className="icon-action" /> {t('like')}</button>
                                        <button className="action-btn"><MessageOutlined className="icon-action" /> {t('comment_review')}</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {!isExpanded && reviewCount > reviewsToShow.length && (
                    <div className="see-more-container" style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button 
                            className="text-btn-see-more" 
                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color_main)', fontWeight: 'bold' }}
                            onClick={() => setIsExpanded(true)}
                        >
                            {t('see_more_reviews')} <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
                        </button>
                    </div>
                )}
            </div>
            
            {isExpanded && totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalElements}
                    pageSize={pageSize}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default ProductReviews;
