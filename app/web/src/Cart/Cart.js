import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext"; // Added import
import product_cart_image from "../Assets/Images/Products/product_placeholder_rect.svg";

export default function Cart() {
  const navigate = useNavigate();
  const notify = useNotification();
  const { t } = useLanguage(); // Initialized hook
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/cart/1`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        // Default select all products
        // setSelectedIds(new Set(data.map(p => p.cartId))); 
      })
      .catch((err) => console.error(err));
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
  const wrappingFee = isWrapped ? 15000 : 0;
  const total = subTotal + wrappingFee;

  const handleCheckout = () => {
    if (selectedIds.size === 0) {
      notify(t('select_min_one'), "error");
      return;
    }
    navigate("/checkout", {
      state: {
        cartIds: Array.from(selectedIds),
        subTotal: subTotal,
        wrappingFee: wrappingFee,
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
          setProducts(prev => prev.filter(p => p.cartId !== cartId));
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

          <div className="cart-items-container">
            {products.length === 0 ? (
              <div className="cart-empty-state">
                <p>{t('cart_empty')}</p>
                <div className="btn-continue-shopping" onClick={() => navigate('/')}>
                  {t('continue_shopping') || "Continue Shopping"}
                </div>
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
                      <button className="qty-btn">-</button>
                      <span className="qty-value">{product.quantity}</span>
                      <button className="qty-btn">+</button>
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
              <label className="cart-wrapping-option">
                <input
                  type="checkbox"
                  checked={isWrapped}
                  onChange={(e) => setIsWrapped(e.target.checked)}
                />
                <span className="wrap-text">{t('wrapping_option')} <span className="highlight-price">15.000đ</span></span>
              </label>

              <div className="cart-divider"></div>

              <div className="cart-total-row">
                <span className="total-label">{t('total')} ({selectedIds.size} {t('product')}):</span>
                <span className="total-amount">{total.toLocaleString("vi-VN")}đ</span>
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
