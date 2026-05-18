import React, { useState, useEffect } from 'react';
import { Spin, Empty, Modal, Input } from 'antd';
import { 
    WalletOutlined, 
    EyeOutlined, 
    EyeInvisibleOutlined, 
    PlusCircleOutlined, 
    MinusCircleOutlined, 
    HistoryOutlined
} from '@ant-design/icons';
import { useLanguage } from '@/store/LanguageContext';
import { useNotification } from '@/store/NotificationContext';
import { useUserProfile } from '@/features/account/hooks/useUser';
import orderApi from '@/features/orders/services/orderService';
import { CButton, SEO } from '@/components/common';
import './MyWallet.css';

const MyWallet = () => {
    const { t } = useLanguage();
    const notify = useNotification();
    const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } = useUserProfile();

    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [isRefundsLoading, setIsRefundsLoading] = useState(true);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [amount, setAmount] = useState('');

    const fetchWalletData = async () => {
        setIsRefundsLoading(true);
        try {
            const refundsRes = await orderApi.getMyRefunds({ page: 1, size: 50 });
            const refundsList = refundsRes.data?.content || [];
            
            const actualTx = refundsList.map(item => ({
                id: `REF-${item.id}`,
                type: 'REFUND',
                title: `${t('wallet_refund_from_order')} #${item.orderId}`,
                amount: item.total || 0,
                createdAt: item.createdAt,
                status: item.status,
                isCredit: true
            }));

            const baseMockTx = [
                {
                    id: 'TX-90237',
                    type: 'DEPOSIT',
                    title: t('wallet_deposit_to_wallet'),
                    amount: 500000,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'APPROVED',
                    isCredit: true
                },
                {
                    id: 'TX-80123',
                    type: 'PAYMENT',
                    title: `${t('wallet_payment_for_order')} #20`,
                    amount: 250000,
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'APPROVED',
                    isCredit: false
                }
            ];

            const combinedTx = [...actualTx, ...baseMockTx].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTransactions(combinedTx);
        } catch (err) {
            console.error('Fetch refunds error inside wallet:', err);
        } finally {
            setIsRefundsLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [t]);

    const handleDeposit = () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            notify(t('wallet_invalid_amount'), 'warning');
            return;
        }
        notify(t('wallet_deposit_success'), 'success');
        setIsDepositOpen(false);
        setAmount('');
        refetchProfile();
    };

    const getStatusBadgeClass = (status) => {
        const lower = status?.toLowerCase();
        if (lower === 'approved' || lower === 'completed' || lower === 'refunded') return 'tx-status-success';
        if (lower === 'rejected' || lower === 'failed') return 'tx-status-failed';
        return 'tx-status-pending';
    };

    const getStatusText = (status) => {
        const lower = status?.toLowerCase();
        if (lower === 'approved' || lower === 'completed' || lower === 'refunded') return t('wallet_status_success');
        if (lower === 'rejected' || lower === 'failed') return t('wallet_status_failed');
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
                                        ? `${(profile?.wallet || 0).toLocaleString('vi-VN')}₫`
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
                            <CButton
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => setIsDepositOpen(true)}
                                className="wallet-card-deposit-btn"
                            >
                                {t('wallet_deposit')}
                            </CButton>
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
                    {isProfileLoading || isRefundsLoading ? (
                        <div className="loading-state"><Spin size="large" /></div>
                    ) : transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div key={tx.id} className="transaction-item">
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

            <Modal
                title={<span className="wallet-modal-title"><PlusCircleOutlined style={{ color: '#a10550' }} /> {t('wallet_deposit')}</span>}
                open={isDepositOpen}
                onCancel={() => setIsDepositOpen(false)}
                onOk={handleDeposit}
                okText={t('wallet_confirm_deposit')}
                cancelText={t('cancel')}
                className="wallet-modal-premium"
                centered
            >
                <div className="wallet-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="input-label" style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{t('wallet_deposit_amount_label')}</label>
                        <Input 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder={t('wallet_deposit_amount_placeholder')} 
                            type="number"
                            size="large"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MyWallet;
