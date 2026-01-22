import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext"; // Added import
import { useCart } from "../Context/CartContext";
import product_cart_image from "../Assets/Images/Products/product_placeholder_rect.svg";
import cart_empty_icon from "../Assets/Images/Icons/icon_cart.svg";

export default function Cart() {
  const navigate = useNavigate();
  const notify = useNotification();
  const { t } = useLanguage(); // Initialized hook
  const { cartItems: products, setCartItems, fetchCart, updateQuantity } = useCart();

  const PROMOTIONS = [
    { id: 'PROMO1', code: 'WELCOME10', discount: 0.1, label: 'Giảm 10% cho đơn hàng đầu tiên' },
    { id: 'PROMO2', code: 'FREESHIP', discount: 20000, type: 'fixed', label: 'Miễn phí vận chuyển (tối đa 20k)' },
  ];

  // State
  // const [products, setProducts] = useState([]); // Removed local state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(products.map(p => p.cartId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const selectedProducts = products.filter(p => selectedIds.has(p.cartId));
  const subTotal = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  // Calculate Discount
  let discountAmount = 0;
  if (selectedPromo) {
    if (selectedPromo.type === 'fixed') {
      discountAmount = selectedPromo.discount;
    } else {
      discountAmount = subTotal * selectedPromo.discount;
    }
  }

  const total = Math.max(0, subTotal - discountAmount);

  const handleCheckout = () => {
    if (selectedIds.size === 0) {
      notify(t('select_min_one'), "error");
      return;
    }
    navigate("/checkout", {
      state: {
        cartIds: Array.from(selectedIds),
        selectedProducts: selectedProducts, // Pass full product objects
        subTotal: subTotal,
        discount: discountAmount,
        total: total,
      },
    });
  };

  const handleDelete = (cartId) => {
    if (!window.confirm(t('confirm_delete_item'))) return;

    fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          // setProducts(prev => prev.filter(p => p.cartId !== cartId)); // No local update
          fetchCart(); // Sync context
          const newSelected = new Set(selectedIds);
          newSelected.delete(cartId);
          setSelectedIds(newSelected);
          notify(t('delete_success'), "success");
        } else {
          notify(t('delete_error'), "error");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <main className="cart-page">
      <div className="cart-page-container">
        <h1 className="cart-page-title">{t('cart')}</h1>

        <div className="cart-list">
          {products.length > 0 && (
            <div className="cart-header-row">
              <div className="cart-col-checkbox">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={products.length > 0 && selectedIds.size === products.length}
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
                <img src={cart_empty_icon} alt="Empty Cart" className="cart-empty-img" />
                <p className="cart-empty-text">{t('cart_empty')}</p>
                <button className="btn-continue-shopping" onClick={() => navigate('/')}>
                  {t('continue_shopping') || "Continue Shopping"}
                </button>
              </div>
            ) : (
              products.map((product) => (
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
                        src={product_cart_image}
                        alt="product"
                      />
                    </div>
                    <div className="cart-product-details">
                      <p className="cart-product-name">{product.name}</p>
                      <p className="cart-product-desc">
                        {t('description')}: {product.description}
                      </p>
                      <button
                        className="cart-btn-delete"
                        onClick={() => handleDelete(product.cartId)}
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>

                  <div className="cart-col-price">
                    {product.price.toLocaleString("vi-VN")}đ
                  </div>

                  <div className="cart-col-quantity">
                    <div className="quantity-control">
                      <button className="qty-btn" onClick={() => updateQuantity(product.cartId, product.quantity - 1)}>-</button>
                      <span className="qty-value">{product.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(product.cartId, product.quantity + 1)}>+</button>
                    </div>
                  </div>

                  <div className="cart-col-total cart-item-total">
                    {(product.price * product.quantity).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div className="cart-summary-section">
            <div className="cart-summary-box">
              {/* Promotion Section */}
              <div className="promotion-section">
                <h3>{t('promotion')}</h3>
                <select
                  className="promo-select"
                  onChange={(e) => {
                    const promo = PROMOTIONS.find(p => p.code === e.target.value);
                    setSelectedPromo(promo || null);
                  }}
                >
                  <option value="">{t('select_promo')}</option>
                  {PROMOTIONS.map(p => (
                    <option key={p.id} value={p.code}>{p.code} - {p.label}</option>
                  ))}
                </select>
              </div>

              <div className="cart-divider"></div>

              <div className="cart-total-row">
                <span className="total-label">{t('total')} ({selectedIds.size} {t('product')}):</span>
                <div style={{ textAlign: 'right' }}>
                  {selectedPromo && (
                    <div style={{ fontSize: '0.9rem', color: '#2e7d32', marginBottom: '5px' }}>
                      - {discountAmount.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                  <span className="total-amount">{total.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <button
                className={`btn-checkout ${selectedIds.size === 0 ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={selectedIds.size === 0}
              >
                {t('continue') || t('checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
