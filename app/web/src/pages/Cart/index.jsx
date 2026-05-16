import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotification } from "@/store/NotificationContext";
import { useLanguage } from "@/store/LanguageContext";
import { useCart } from "@/store/CartContext";
import product_cart_image from "@/assets/images/products/product_placeholder_rect.svg";
import { getImageUrl } from "@/services/axiosClient";
import { SEO } from "@/components/common";
import { useAuth } from "@/store/AuthContext";
import { DeleteOutlined, ShoppingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

export default function Cart() {
  const navigate = useNavigate();
  const notify = useNotification();
  const { t } = useLanguage();
  const { cartItems: products, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? new Set(products.map(p => p.cartId)) : new Set());
  };

  const selectedProducts = products.filter(p => selectedIds.has(p.cartId));
  const subTotal = selectedProducts.reduce((sum, p) => sum + p.promotionPrice * p.quantity, 0);
  const totalSelectedItemsCount = selectedProducts.reduce((sum, p) => sum + (p.quantity || 1), 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      notify(t('login_required_to_checkout'), "info");
      navigate("/login");
      return;
    }
    if (selectedIds.size === 0) {
      notify(t('select_min_one'), "error");
      return;
    }
    navigate("/checkout", {
      state: {
        cartIds: Array.from(selectedIds),
        selectedProducts: selectedProducts.map(p => ({
          ...p,
          effectivePrice: p.promotionPrice,
        })),
        subTotal,
        discount: 0,
        total: subTotal,
      },
    });
  };

  const handleDelete = (cartId) => {
    Modal.confirm({
      title: t('confirm_delete_item'),
      icon: <ExclamationCircleOutlined />,
      okText: t('yes'),
      okType: 'danger',
      cancelText: t('no'),
      onOk: async () => {
        try {
          await removeFromCart(cartId);
          const newSelected = new Set(selectedIds);
          newSelected.delete(cartId);
          setSelectedIds(newSelected);
          notify(t('delete_success'), "success");
        } catch {
          notify(t('delete_error'), "error");
        }
      },
    });
  };

  return (
    <main className="cart-page">
      <SEO title={t('cart')} />
      <div className="cart-page-container">
        <h1 className="cart-page-title">{t('cart')}</h1>

        <div className="cart-list">
          {products.length > 0 && (
            <div className="cart-header-row">
              <div className="cart-col-checkbox">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.size === products.length}
                  className="cart-checkbox"
                />
              </div>
              <div className="cart-col-product">{t('product')}</div>
              <div className="cart-col-price">{t('price')}</div>
              <div className="cart-col-quantity">{t('quantity')}</div>
              <div className="cart-col-total">{t('total')}</div>
            </div>
          )}

          <div className="cart-items-container">
            {products.length === 0 ? (
              <div className="cart-empty-state">
                <ShoppingOutlined style={{ fontSize: '100px', color: '#e5e7eb', marginBottom: '24px' }} />
                <p className="cart-empty-text">{t('cart_empty')}</p>
                <button className="btn-continue-shopping" onClick={() => navigate('/')}>
                  {t('continue_shopping')}
                </button>
              </div>
            ) : (
              products.map((product) => {
                const hasDiscount = product.promotionPrice !== undefined && product.promotionPrice !== null && product.promotionPrice < product.price;

                return (
                  <div id={product.cartId} className="cart-item-row" key={product.cartId}>
                    <div className="cart-col-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.cartId)}
                        onChange={() => handleSelectOne(product.cartId)}
                        className="cart-checkbox"
                      />
                    </div>

                    <div className="cart-col-product cart-product-info">
                      <div className="cart-product-img-wrapper">
                        <img
                          className="cart-product-img"
                          loading="lazy"
                          src={product.image ? getImageUrl(product.image) : product_cart_image}
                          alt="product"
                          onError={(e) => { e.target.src = product_cart_image }}
                        />
                      </div>
                      <div className="cart-product-details">
                        <p className="cart-product-name">{product.name}</p>
                      </div>
                    </div>

                    <div className="cart-col-price">
                      <div className="cart-price-wrapper">
                        <span className="cart-current-price">{product.promotionPrice.toLocaleString("vi-VN")}đ</span>
                        {hasDiscount && (
                          <span className="cart-old-price">{product.price.toLocaleString("vi-VN")}đ</span>
                        )}
                      </div>
                    </div>

                    <div className="cart-col-quantity">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          disabled={product.quantity <= 1}
                          onClick={() => updateQuantity(product.cartId, product.quantity - 1)}
                        >-</button>
                        <span className="qty-value">{product.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(product.cartId, product.quantity + 1)}
                        >+</button>
                      </div>
                    </div>

                    <div className="cart-col-total cart-item-total">
                      {(product.promotionPrice * product.quantity).toLocaleString("vi-VN")}đ
                    </div>

                    <button className="cart-btn-delete" onClick={() => handleDelete(product.cartId)} title={t('delete')}>
                      <DeleteOutlined />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div className="cart-summary-section">
            <div className="cart-summary-box">
              <div className="cart-total-row">
                <span className="total-label">{t('total')} ({totalSelectedItemsCount} {t('product')}):</span>
                <span className="total-amount">{subTotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <button
                className={`btn-checkout ${selectedIds.size === 0 ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={selectedIds.size === 0}
              >
                {t('checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
