import "./Checkout.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../Context/NotificationContext";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import orderApi from '../../api/orderApi';
import paymentApi from '../../api/paymentApi';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const notify = useNotification();
  const { t } = useLanguage();

  const cartIds = state?.cartIds || [];
  const subTotal = state?.subTotal || 0;
  const shippingFee = 20000;
  const discount = state?.discount || 0;
  const selectedProducts = state?.selectedProducts || [];
  const grandTotal = Math.max(0, subTotal + shippingFee - discount);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showQR, setShowQR] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkPaymentStatus = useCallback(async (orderId) => {
    try {
      const response = await paymentApi.checkStatus(orderId);
      if (response && response.data && response.data.success === true) {
        notify(t('payment_success_msg'), "success");
        setTimeout(() => navigate('/'), 2000);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Check status error:", error);
      return false;
    }
  }, [navigate, notify, t]);

  useEffect(() => {
    let interval;
    if (showQR && orderData?.orderId) {
      interval = setInterval(async () => {
        const isPaid = await checkPaymentStatus(orderData.orderId);
        if (isPaid) clearInterval(interval);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [showQR, orderData, checkPaymentStatus]);

  const handleCheckout = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      notify(t('fill_delivery_info'), "error");
      return;
    }

    if (!cartIds || cartIds.length === 0) {
      notify(t('no_products_payment'), "error");
      return;
    }

    await processOrder(paymentMethod === 'banking' ? 'Banking' : 'COD');
  };

  const processOrder = async (method) => {
    try {
      const response = await orderApi.placeOrder({
        userId: 1, 
        paymentMethod: method,
        address: formData.address,
        phone: formData.phone,
        recipientName: formData.fullName,
        note: formData.note,
        orderItems: cartIds.map((id) => ({ cartItemId: id })),
      });

      const actualData = response.data;

      if (method === 'Banking') {
        setOrderData(actualData);
        setShowQR(true);
      } else {
        notify(t('order_success'), "success");
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error(error);
      notify(t('payment_error_try_again'), "error");
    }
  };

  const handleManualCheck = async () => {
    setIsCheckingPayment(true);
    const isPaid = await checkPaymentStatus(orderData.orderId);
    if (!isPaid) {
      notify(t('payment_not_yet'), "info");
    }
    setIsCheckingPayment(false);
  };

  if (showQR && orderData) {
    return (
      <main className="checkout-qr-page">
        <div className="qr-container">
          <div className="qr-header">
             <h2>{t('payment_qr_title')}</h2>
             <div className="order-chip">#{orderData.orderId}</div>
          </div>
          <p className="qr-desc">{t('scan_qr_desc')}</p>
          
          <div className="qr-card">
            <div className="qr-code-box">
              <img src={orderData.qrCodeLink} alt="QR Code" />
              <div className="qr-overlay-scan"></div>
            </div>
            
            <div className="qr-info-grid">
               <div className="qr-info-item">
                  <span className="label">{t('amount')}</span>
                  <span className="value highlighting">{(orderData.total || grandTotal).toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="qr-info-item">
                  <span className="label">{t('order_id')}</span>
                  <span className="value">DH{orderData.orderId}</span>
               </div>
            </div>
          </div>

          <div className="qr-actions">
            <button 
              className={`btn-confirm-payment ${isCheckingPayment ? 'loading' : ''}`} 
              onClick={handleManualCheck}
              disabled={isCheckingPayment}
            >
              {isCheckingPayment ? t('payment_checking') : t('paid_confirm')}
            </button>
            <button className="btn-back-link" onClick={() => setShowQR(false)}>
              {t('back')}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">{t('checkout')}</h1>

      <div className="checkout-container">
        <div className="checkout-left">
          <div className="checkout-section">
            <h2 className="section-header">{t('delivery_info')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('full_name')}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('full_name_placeholder')}
                />
              </div>
              <div className="form-group">
                <label>{t('phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('phone_placeholder')}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('address')}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={t('address_placeholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('note')}</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder={t('note_placeholder')}
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="section-header">{t('payment_method')}</h2>
            <div className="payment-methods">
              <div
                className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="payment-icon">🚚</div>
                <div className="payment-detail">
                  <div className="payment-name">{t('payment_cod')}</div>
                </div>
                <div className="radio-circle"></div>
              </div>
              <div
                className={`payment-option ${paymentMethod === 'banking' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('banking')}
              >
                <div className="payment-icon">💳</div>
                <div className="payment-detail">
                  <div className="payment-name">{t('payment_banking')}</div>
                </div>
                <div className="radio-circle"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary-box">
            <h2 className="summary-title">{t('order_summary')} ({selectedProducts.length} {t('products_lower')})</h2>

            <div className="order-items-list">
              {selectedProducts.map((p, idx) => (
                <div key={idx} className="summary-item">
                  <div className="summary-item-image">
                    <img src={p.image} alt={p.name} onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Product'} />
                  </div>
                  <div className="summary-item-info">
                    <div className="summary-item-name">{p.name || `${t('product')} #${p.cartId}`}</div>
                    <div className="summary-item-qty">x{p.quantity}</div>
                  </div>
                  <div className="summary-item-price">{(p.price * p.quantity).toLocaleString("vi-VN")}đ</div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>{t('subtotal')}</span>
              <span>{subTotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="summary-row">
              <span>{t('shipping_fee')}</span>
              <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>{t('discount')}</span>
                <span>-{discount.toLocaleString("vi-VN")}đ</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>{t('total')}</span>
              <span className="total-price">{grandTotal.toLocaleString("vi-VN")}đ</span>
            </div>

            <button className="btn-place-order" onClick={handleCheckout}>
              {paymentMethod === 'banking' ? t('continue_payment') : t('place_order')}
            </button>

            <div className="back-link-wrapper">
              <span className="btn-back-cart" onClick={() => navigate('/cart')}>
                {t('back_to_cart')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
