import React, { useState, useEffect } from 'react';
import { Spin, Empty } from 'antd';
import { 
    WalletOutlined, 
    EyeOutlined, 
    EyeInvisibleOutlined, 
    PlusCircleOutlined, 
    MinusCircleOutlined, 
    HistoryOutlined
} from '@ant-design/icons';
import { useLanguage } from '@/store/LanguageContext';
import { useUserProfile } from '@/features/account/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import orderApi from '@/features/orders/services/orderService';
import { CButton, SEO } from '@/components/common';
import './MyWallet.css';

const MyWallet = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { data: profile, isLoading: isProfileLoading } = useUserProfile();

    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [isRefundsLoading, setIsRefundsLoading] = useState(true);

    const fetchWalletData = async () => {
        setIsRefundsLoading(true);
        try {
            const refundsRes = await orderApi.getMyRefunds({ page: 1, size: 50 });
            const refundsList = refundsRes.data?.content ?? [];
            
            const actualTx = refundsList.map(item => ({
                id: `REF-${item.id}`,
                type: 'REFUND',
                title: `${t('wallet_refund_from_order')} #${item.orderId}`,
                amount: item.total ?? 0,
                createdAt: item.createdAt,
                status: item.status,
                orderId: item.orderId,
                isCredit: true
            }));

            const sortedTx = [...actualTx].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTransactions(sortedTx);
        } catch (err) {
            console.error('Fetch refunds error inside wallet:', err);
        } finally {
            setIsRefundsLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [t]);

    const getStatusBadgeClass = (status) => {
        const lower = status?.toLowerCase();
        if (lower === 'refunded') return 'tx-status-success';
        if (['rejected', 'refund_failed', 'failed'].includes(lower)) return 'tx-status-failed';
        return 'tx-status-pending';
    };

    const getStatusText = (status) => {
        const lower = status?.toLowerCase();
        if (lower === 'refunded') return t('wallet_status_success');
        if (['rejected', 'refund_failed', 'failed'].includes(lower)) return t('wallet_status_failed');
        return t('wallet_status_pending');
    };

    return (
        <div className="my-wallet-container">
            <SEO title={t('my_wallet')} />
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">{t('my_wallet')}</h1>
                    <p className="page-subtitle">{t('wallet_subtitle')}</p>
                </div>
            </div>

            <div className="wallet-dashboard-top">
                <div className="wallet-premium-card">
                    <div className="wallet-card-bg-gradient" />
                    <div className="wallet-card-overlay" />
                    <div className="wallet-card-content">
                        <div className="wallet-card-header">
                            <div className="wallet-brand">
                                <WalletOutlined className="wallet-brand-icon" />
                                <span className="wallet-brand-name">BKeuty Pay</span>
                            </div>
                            <div className="wallet-card-status">
                                <span className="wallet-status-dot" />
                                <span className="wallet-status-text">{t('wallet_active')}</span>
                            </div>
                        </div>

                        <div className="wallet-balance-section">
                            <span className="wallet-balance-label">{t('wallet_balance')}</span>
                            <div className="wallet-balance-row">
                                <span className="wallet-balance-value">
                                    {isBalanceVisible 
                                        ? `${(profile?.wallet ?? 0).toLocaleString('vi-VN')}₫`
                                        : '••••••••'
                                    }
                                </span>
                                <button 
                                    className="wallet-toggle-btn"
                                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                                >
                                    {isBalanceVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                </button>
                            </div>
                        </div>

                        <div className="wallet-card-footer">
                            <span className="wallet-owner-name">
                                {profile?.lastname ? `${profile.lastname} ${profile.firstname}` : t('wallet_default_owner')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="wallet-history-section">
                <div className="history-header">
                    <HistoryOutlined className="history-icon" />
                    <h3 className="history-title">{t('wallet_transaction_history')}</h3>
                </div>

                <div className="transaction-list">
                    {isProfileLoading ? (
                        <div className="loading-state"><Spin size="large" /></div>
                    ) : isRefundsLoading ? (
                        <div className="loading-state"><Spin size="large" /></div>
                    ) : transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div 
                                key={tx.id} 
                                className={`transaction-item ${tx.orderId ? 'clickable' : ''}`}
                                onClick={() => tx.orderId && navigate(`/account/orders/${tx.orderId}`)}
                            >
                                <div className="tx-left">
                                    <div className={`tx-icon-circle ${tx.isCredit ? 'credit' : 'debit'}`}>
                                        {tx.isCredit ? <PlusCircleOutlined /> : <MinusCircleOutlined />}
                                    </div>
                                    <div className="tx-details">
                                        <h4 className="tx-title">{tx.title}</h4>
                                        <span className="tx-date">
                                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : '---'}
                                        </span>
                                    </div>
                                </div>
                                <div className="tx-right">
                                    <span className={`tx-amount ${tx.isCredit ? 'credit' : 'debit'}`}>
                                        {tx.isCredit ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}₫
                                    </span>
                                    <span className={`tx-status-badge ${getStatusBadgeClass(tx.status)}`}>
                                        {getStatusText(tx.status)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Empty description={t('wallet_no_transactions')} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyWallet;
