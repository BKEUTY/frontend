
import "./Checkout.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../Context/NotificationContext";
import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

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

  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'banking'
  const [showQR, setShowQR] = useState(false);

  // Form State
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

  const handleCheckout = async () => {
    // Basic Validation
    if (!formData.fullName || !formData.phone || !formData.address) {
      notify(t('fill_delivery_info'), "error");
      return;
    }

    if (!cartIds || cartIds.length === 0) {
      notify(t('no_products_payment'), "error");
      return;
    }

    if (paymentMethod === 'banking') {
      setShowQR(true);
      return;
    }

    // COD Flow
    await processOrder("COD");
  };

  const processOrder = async (method) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1, // Fixed user ID
            paymentMethod: method, // "COD" or "Banking"
            address: formData.address,
            phone: formData.phone,
            recipientName: formData.fullName,
            note: formData.note,
            orderItems: cartIds.map((id) => ({ cartItemId: id })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Thanh toán thất bại");
      }

      // const data = await response.json();
      notify(t('order_success'), "success");

      // Redirect to success or home
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      console.error(error);
      notify(t('payment_error_try_again'), "error");
    }
  };

  if (showQR) {
    return (
      <main className="checkout-qr-page">
        <div className="qr-container">
          <h2>{t('payment_qr_title')}</h2>
          <p>{t('scan_qr_desc')}</p>
          <div className="qr-code-box">
            {/* Placeholder QR */}
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BKEUTY_ORDER_PAYMENT" alt="QR Code" />
          </div>
          <div className="amount-display">
            {t('amount')}: <strong>{grandTotal.toLocaleString("vi-VN")}đ</strong>
          </div>
          <button className="btn-confirm-payment" onClick={() => processOrder("Banking")}>
            {t('paid_confirm')}
          </button>
          <button className="btn-back" onClick={() => setShowQR(false)}>
            {t('back')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">{t('checkout')}</h1>

      <div className="checkout-container">
        {/* Left Column: Information */}
        <div className="checkout-left">
          <div className="checkout-section">
            <h2 className="section-header">{t('delivery_info')}</h2>
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
                <div className="radio-circle"></div>
                <span>{t('payment_cod')}</span>
              </div>
              <div
                className={`payment-option ${paymentMethod === 'banking' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('banking')}
              >
                <div className="radio-circle"></div>
                <span>{t('payment_banking')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-right">
          <div className="order-summary-box">
            <h2 className="summary-title">{t('order_summary')} ({selectedProducts.length} {t('products_lower')})</h2>

            <div className="order-items-list">
              {selectedProducts.map((p, idx) => (
                <div key={idx} className="summary-item">
                  <div className="summary-item-info">
                    <div className="summary-item-name">{p.name || `Product #${p.cartId}`}</div>
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
