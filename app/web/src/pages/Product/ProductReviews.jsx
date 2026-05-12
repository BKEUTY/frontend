import React, { useState, useEffect } from 'react';
import { StarFilled, CheckCircleFilled, MessageOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownOutlined, HeartOutlined } from '@ant-design/icons';
import { Modal, Input, Rate, notification, Upload, Space, Avatar } from 'antd';
import { useLanguage } from '@/store/LanguageContext';
import { useNotification } from '@/store/NotificationContext';
import { Pagination, Skeleton, CButton } from '@/components/common';
import { useReviews } from '@/features/products/hooks/useReviews';
import { useAuth } from '@/store/AuthContext';
import './ProductReviews.css';

const { TextArea } = Input;

const ProductReviews = ({ variantId, averageRating, reviewCount, ratingCounts = {}, onReviewChanged }) => {
    const { t } = useLanguage();
    const showNotification = useNotification();
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [hasImageFilter, setHasImageFilter] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', images: [] });
    const [fileList, setFileList] = useState([]);
    const pageSize = 5;

    const { 
        reviewsData, statsData, isLoading, 
        createReview, isCreating,
        updateReview, isUpdating,
        deleteReview, isDeleting,
        uploadImage
    } = useReviews(variantId, {
        page,
        size: pageSize,
        rating: ratingFilter,
        hasImage: hasImageFilter
    }, {
        enabled: isExpanded,
        fetchStats: true
    });

    const currentRatingCounts = statsData || ratingCounts || {};
    const reviewsToShow = isExpanded ? (reviewsData?.reviews?.content || reviewsData?.content || []) : [];
    const totalElements = isExpanded ? (reviewsData?.reviews?.totalElements || reviewsData?.totalElements || reviewCount) : reviewCount;
    const totalPages = isExpanded ? (reviewsData?.reviews?.totalPages || reviewsData?.totalPages || 1) : 1;

    const handleFilterChange = (type, value) => {
        if (!isExpanded) setIsExpanded(true);
        setPage(1);
        if (type === 'rating') setRatingFilter(prev => prev === value ? null : value);
        else if (type === 'media') setHasImageFilter(prev => prev ? null : true);
        else if (type === 'all') { setRatingFilter(null); setHasImageFilter(null); }
    };

    const handleOpenReviewModal = (review = null) => {
        if (!user) {
            showNotification(t('warning'), 'warning', t('login_required'));
            return;
        }
        if (review) {
            setEditingReview(review);
            setReviewForm({ rating: review.rating, comment: review.comment, images: review.images || [] });
            setFileList((review.images || []).map((url, idx) => ({ uid: `-${idx}`, name: 'image.png', status: 'done', url })));
        } else {
            setEditingReview(null);
            setReviewForm({ rating: 5, comment: '', images: [] });
            setFileList([]);
        }
        setIsReviewModalVisible(true);
    };

    const handleUploadImage = async (options) => {
        const { file, onSuccess, onError } = options;
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadImage(formData);
            if(res.data?.url) {
                setReviewForm(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
                onSuccess("Ok");
            }
        } catch (err) {
            onError({ err });
            showNotification(t('error'), 'error', t('upload_failed'));
        }
    };

    const handleRemoveImage = (file) => {
        setReviewForm(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== file.url && img !== file.response?.url)
        }));
    };

    const handleSubmitReview = async () => {
        try {
            const payload = { variantId, ...reviewForm };
            if (editingReview) {
                await updateReview({ id: editingReview.id, data: payload });
                showNotification(t('success'), 'success', t('review_update_success'));
            } else {
                await createReview(payload);
                showNotification(t('success'), 'success', t('review_create_success'));
            }
            setIsReviewModalVisible(false);
            if (onReviewChanged) onReviewChanged();
        } catch (error) {
            const status = error.response?.status;
            showNotification(
                t('error'), 
                'error', 
                (status === 403 || status === 400) ? t('review_not_eligible_msg') : (error.response?.data?.message || t('api_error_general'))
            );
        }
    };

    const handleDeleteReview = (id) => {
        Modal.confirm({
            title: t('confirm_delete_title'),
            content: t('confirm_delete_message'),
            okText: t('delete'),
            okType: 'danger',
            cancelText: t('cancel'),
            onOk: async () => {
                try {
                    await deleteReview(id);
                    showNotification(t('success'), 'success', t('delete_success'));
                    if (onReviewChanged) onReviewChanged();
                } catch (error) {
                    showNotification(t('error'), 'error', error.response?.data?.message || t('api_error_general'));
                }
            }
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="pr-container">
            <div className="pr-dashboard">
                <div className="pr-overview">
                    <span className="pr-big-score">{Number(averageRating || 0).toFixed(1)}</span>
                    <div className="pr-star-stack">
                        <div className="pr-star-row">
                            {[...Array(5)].map((_, i) => (
                                <StarFilled 
                                    key={i} 
                                    style={{ color: i < Math.round(Number(averageRating || 0)) ? '#f59e0b' : '#e2e8f0' }} 
                                />
                            ))}
                        </div>
                        <span className="pr-total-text">{reviewCount} {t('reviews')}</span>
                    </div>
                </div>
                <div className="pr-bars-container">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = currentRatingCounts[star] || 0;
                        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                        return (
                            <div key={star} className={`pr-bar-row ${ratingFilter === star ? 'active' : ''}`} onClick={() => handleFilterChange('rating', star)}>
                                <span className="pr-bar-label">{star} <StarFilled style={{ fontSize: '12px', color: '#f59e0b' }} /></span>
                                <div className="pr-progress-bg">
                                    <div className="pr-progress-fill" style={{ width: `${percentage}%` }} /> 
                                </div>
                                <span className="pr-bar-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="pr-write-action">
                     <CButton type="primary" onClick={() => handleOpenReviewModal()} icon={<MessageOutlined />}>
                        {t('write_review')}
                    </CButton>
                </div>
            </div>

            {isExpanded && (
                <div className="pr-filters">
                    <button className={`pr-filter-chip ${!ratingFilter && !hasImageFilter ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>{t('all')}</button>
                    <button className={`pr-filter-chip ${hasImageFilter ? 'active' : ''}`} onClick={() => handleFilterChange('media')}>{t('with_images')}</button>
                    {[5, 4, 3, 2, 1].map(star => (
                        <button key={star} className={`pr-filter-chip ${ratingFilter === star ? 'active' : ''}`} onClick={() => handleFilterChange('rating', star)}>{star} {t('rating')}</button>
                    ))}
                </div>
            )}

            <div className="pr-list">
                {isLoading && isExpanded ? (
                    <Skeleton width="100%" height="150px" borderRadius="12px" />
                ) : (reviewsToShow.length === 0 && isExpanded) ? (
                    <div className="pr-empty-state">{t('no_reviews')}</div>
                ) : (
                    reviewsToShow.map((rev) => (
                        <div key={rev.id} className="pr-card">
                            <Avatar className="pr-user-avatar" style={{ backgroundColor: 'var(--color_main_title)' }}>{rev.userName?.charAt(0) || 'U'}</Avatar>
                            <div className="pr-main-content">
                                <div className="pr-card-header">
                                    <span className="pr-user-name">{rev.userName || 'User'}</span>
                                    <span className="pr-post-date">{formatDateTime(rev.createdAt)}</span>
                                </div>
                                <div className="pr-rating-meta">
                                    <Rate disabled defaultValue={rev.rating} style={{ fontSize: '13px', color: '#f59e0b' }} />
                                    <span className="pr-verified-tag"><CheckCircleFilled /> {t('verified_purchase')}</span>
                                </div>
                                <div className="pr-comment-text">{rev.comment}</div>
                                {rev.images?.length > 0 && (
                                    <div className="pr-image-gallery">
                                        {rev.images.filter(img => img?.trim()).map((img, idx) => (
                                            <img key={idx} src={img} alt="review" className="pr-review-img" onClick={() => window.open(img, '_blank')} />
                                        ))}
                                    </div>
                                )}
                                {rev.reply && (
                                    <div className="pr-admin-reply">
                                        <div className="pr-reply-header">
                                            <span className="pr-reply-label">{t('admin_reply').toUpperCase()}</span>
                                            <span className="pr-reply-date">{formatDateTime(rev.reply.repliedAt)}</span>
                                        </div>
                                        <div className="pr-reply-body">{rev.reply.comment}</div>
                                    </div>
                                )}
                                <div className="pr-card-actions">
                                    <CButton type="text" className="pr-btn-action" icon={<HeartOutlined />}>{t('like')}</CButton>
                                    {user?.id === rev.userId && (
                                        <>
                                            <CButton type="text" className="pr-btn-action" icon={<EditOutlined />} onClick={() => handleOpenReviewModal(rev)}>{t('edit')}</CButton>
                                            <CButton type="text" className="pr-btn-action danger" icon={<DeleteOutlined />} onClick={() => handleDeleteReview(rev.id)} loading={isDeleting}>{t('delete')}</CButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!isExpanded && reviewCount > 0 && (
                    <div className="pr-expand-footer">
                        <CButton type="text" className="pr-btn-expand" onClick={() => setIsExpanded(true)}>
                            {t('view_all_reviews')} <DownOutlined style={{ fontSize: '11px' }} />
                        </CButton>
                    </div>
                )}
            </div>
            
            {isExpanded && totalPages > 1 && (
                <div className="pr-pagination-wrap">
                    <Pagination page={page} totalPages={totalPages} totalItems={totalElements} pageSize={pageSize} onPageChange={setPage} />
                </div>
            )}

            <Modal
                title={editingReview ? t('edit_review') : t('write_review')}
                open={isReviewModalVisible}
                onOk={handleSubmitReview}
                onCancel={() => setIsReviewModalVisible(false)}
                confirmLoading={isCreating || isUpdating}
                okText={t('save')}
                cancelText={t('cancel')}
                centered
                destroyOnClose
            >
                <div className="pr-modal-body">
                    <div className="pr-modal-rate-row">
                        <span>{t('rating')}:</span>
                        <Rate value={reviewForm.rating} onChange={(val) => setReviewForm(prev => ({ ...prev, rating: val }))} style={{ color: '#ffb800' }} />
                    </div>
                    <TextArea rows={4} placeholder={t('review_placeholder')} value={reviewForm.comment} onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} style={{ borderRadius: '8px' }} />
                    <Upload listType="picture-card" fileList={fileList} onChange={({ fileList: n }) => setFileList(n)} customRequest={handleUploadImage} onRemove={handleRemoveImage} accept="image/*">
                        {fileList.length < 5 && <div><UploadOutlined /><div style={{ marginTop: 8 }}>{t('upload')}</div></div>}
                    </Upload>
                </div>
            </Modal>
        </div>
    );
};

export default ProductReviews;
