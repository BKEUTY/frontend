import React, { useState } from 'react';
import { StarFilled, CheckCircleFilled, MessageOutlined, HeartOutlined, DownOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Tag, Modal, Input, Rate, notification, Upload } from 'antd';
import { useLanguage } from '../../i18n/LanguageContext';
import { Pagination, Skeleton, CButton } from '../../Component/Common';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../Context/AuthContext';
import './ProductReviews.css';

const { TextArea } = Input;

const ProductReviews = ({ variantId, averageRating, reviewCount, ratingCounts = {} }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [page, setPage] = useState(0);
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
        setPage(0);
        
        if (type === 'rating') {
            setRatingFilter(prev => prev === value ? null : value);
        } else if (type === 'media') {
            setHasImageFilter(prev => prev ? null : true);
        } else if (type === 'all') {
            setRatingFilter(null);
            setHasImageFilter(null);
        }
    };

    const handleOpenReviewModal = (review = null) => {
        if (!user) {
            notification.warning({ message: t('warning'), description: t('login_required') });
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
            if(res.data && res.data.url) {
                setReviewForm(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
                onSuccess("Ok");
            }
        } catch (err) {
            onError({ err });
            notification.error({ message: t('error'), description: t('upload_failed') });
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
                notification.success({ message: t('success'), description: t('review_updated') });
            } else {
                await createReview(payload);
                notification.success({ message: t('success'), description: t('review_created') });
            }
            setIsReviewModalVisible(false);
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 400) {
                notification.error({ message: t('error'), description: t('review_not_eligible_msg') });
            } else {
                notification.error({ message: t('error'), description: error.response?.data?.message || t('api_error_general') });
            }
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
                    notification.success({ message: t('success'), description: t('delete_success') });
                } catch (error) {
                    notification.error({ message: t('error'), description: error.response?.data?.message || t('api_error_general') });
                }
            }
        });
    };

    return (
        <div className="pr-container">
            <div className="pr-dashboard">
                <div className="pr-overview">
                    <span className="pr-score">{Number(averageRating || 0).toFixed(1)}</span>
                    <div className="pr-stars">
                        {[...Array(5)].map((_, i) => (
                            <StarFilled 
                                key={i} 
                                className={`pr-star-icon ${i < Math.round(Number(averageRating || 0)) ? 'filled' : 'empty'}`} 
                            />
                        ))}
                    </div>
                    <span className="pr-total">{reviewCount || 0} {t('reviews')}</span>
                </div>
                <div className="pr-bars-wrapper">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = currentRatingCounts[star] || 0;
                        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                        return (
                            <div 
                                key={star} 
                                className={`pr-bar-row ${ratingFilter === star ? 'active' : ''}`} 
                                onClick={() => handleFilterChange('rating', star)} 
                                data-count={count}
                            >
                                <span className="pr-bar-label">
                                    {star} <StarFilled className="pr-bar-star" />
                                </span>
                                <div className="pr-progress-track">
                                    <div className="pr-progress-fill" style={{ width: `${percentage}%` }} /> 
                                </div>
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
                    <CButton 
                        type={!ratingFilter && !hasImageFilter ? 'primary' : 'outline'}
                        className="pr-filter-chip"
                        onClick={() => handleFilterChange('all')}
                        style={!ratingFilter && !hasImageFilter ? { color: '#fff' } : {}}
                    >
                        {t('all')}
                    </CButton>
                    <CButton 
                        type={hasImageFilter ? 'primary' : 'outline'}
                        className="pr-filter-chip"
                        onClick={() => handleFilterChange('media')}
                        style={hasImageFilter ? { color: '#fff' } : {}}
                    >
                        {t('with_images')}
                    </CButton>
                    {[5, 4, 3, 2, 1].map(star => (
                        <CButton 
                            key={star}
                            type={ratingFilter === star ? 'primary' : 'outline'}
                            className="pr-filter-chip"
                            onClick={() => handleFilterChange('rating', star)}
                            style={ratingFilter === star ? { color: '#fff' } : {}}
                        >
                            {star} {t('rating')}
                        </CButton>
                    ))}
                </div>
            )}

            <div className="pr-list">
                {isLoading && isExpanded ? (
                    <Skeleton width="100%" height="200px" />
                ) : (reviewsToShow.length === 0 && isExpanded) ? (
                    <div className="pr-empty">{t('no_reviews')}</div>
                ) : (
                    reviewsToShow.map((rev) => {
                        const validImages = rev.images?.filter(img => img && img.trim() !== "") || [];
                        const isMyReview = user && user.id === rev.userId;

                        return (
                            <div key={rev.id} className="pr-card">
                                <div className="pr-avatar">{rev.userName?.charAt(0) || 'U'}</div>
                                <div className="pr-content">
                                    <div className="pr-header">
                                        <span className="pr-author">{rev.userName || 'User'}</span>
                                        <span className="pr-date">
                                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ''}
                                        </span>
                                    </div>
                                    <div className="pr-meta">
                                        <div className="pr-user-stars">
                                            {[...Array(5)].map((_, starIdx) => (
                                                <StarFilled 
                                                    key={starIdx} 
                                                    className={`pr-star-icon ${starIdx < rev.rating ? 'filled' : 'empty'}`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="pr-verified">
                                            <CheckCircleFilled className="pr-verified-icon" /> {t('verified_purchase')}
                                        </span>
                                    </div>
                                    <div className="pr-text">{rev.comment}</div>
                                    
                                    {validImages.length > 0 && (
                                        <div className="pr-gallery">
                                            {validImages.map((img, idx) => (
                                                <img key={idx} src={img} alt="review" className="pr-img" />
                                            ))}
                                        </div>
                                    )}
                                    
                                    {rev.reply && (
                                        <div className="pr-reply">
                                            <div className="pr-reply-header">
                                                <Tag color="gold">{t('admin_reply')}</Tag>
                                                <span className="pr-reply-date">
                                                    {rev.reply.repliedAt ? new Date(rev.reply.repliedAt).toLocaleDateString('vi-VN') : ''}
                                                </span>
                                            </div>
                                            <div className="pr-reply-text">
                                                {rev.reply.comment}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pr-actions">
                                        <CButton type="text" className="pr-action-btn" icon={<HeartOutlined />}>
                                            {t('like')}
                                        </CButton>
                                        
                                        {isMyReview && (
                                            <>
                                                <CButton type="text" className="pr-action-btn" icon={<EditOutlined />} onClick={() => handleOpenReviewModal(rev)}>
                                                    {t('edit')}
                                                </CButton>
                                                <CButton type="text" className="pr-action-btn" icon={<DeleteOutlined />} onClick={() => handleDeleteReview(rev.id)} loading={isDeleting}>
                                                    {t('delete')}
                                                </CButton>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {!isExpanded && reviewCount > 0 && (
                    <div className="pr-expand-wrap">
                        <CButton 
                            type="text"
                            className="pr-expand-btn" 
                            onClick={() => setIsExpanded(true)}
                        >
                            {t('view_all_reviews')} <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
                        </CButton>
                    </div>
                )}
            </div>
            
            {isExpanded && totalPages > 1 && (
                <div className="pr-pagination">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalElements}
                        pageSize={pageSize}
                        onPageChange={setPage}
                    />
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
                destroyOnClose
            >
                <div className="pr-modal-form">
                    <div className="pr-modal-rating">
                        <span>{t('rating')}:</span>
                        <Rate 
                            value={reviewForm.rating} 
                            onChange={(val) => setReviewForm(prev => ({ ...prev, rating: val }))} 
                            className="pr-rate-yellow"
                        />
                    </div>
                    <TextArea 
                        rows={4} 
                        placeholder={t('review_placeholder')} 
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    />
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                        customRequest={handleUploadImage}
                        onRemove={handleRemoveImage}
                        accept="image/*"
                    >
                        {fileList.length >= 5 ? null : (
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>{t('upload')}</div>
                            </div>
                        )}
                    </Upload>
                </div>
            </Modal>
        </div>
    );
};

export default ProductReviews;
