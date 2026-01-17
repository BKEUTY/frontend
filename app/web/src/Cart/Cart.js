import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import { useLanguage } from "../i18n/LanguageContext"; // Added import
import product_cart_image from "../Assets/Images/Products/Rectangle 119.svg";

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
      notify("Vui lòng chọn ít nhất một sản phẩm để thanh toán.", "error");
      return;
    }
    navigate("/checkout", {
      state: {
        cartIds: Array.from(selectedIds),
        subTotal: subTotal,
        wrappingFee: wrappingFee,
        total: total,
        // Sending product details to show in checkout if needed, 
        // or just rely on global state/refetch. 
        // Since Checkout page needs to show "Total", "Discount", "Shipping", 
        // passing these calculated values is good.
      },
    });
  };

  const handleDelete = (cartId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          setProducts(prev => prev.filter(p => p.cartId !== cartId));
          const newSelected = new Set(selectedIds);
          newSelected.delete(cartId);
          setSelectedIds(newSelected);
          notify("Xóa sản phẩm thành công", "success");
        } else {
          notify("Lỗi khi xóa sản phẩm", "error");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <main className="cart">
      <div className="cart_title">{t('cart')}</div>
      <div className="cart_list">
        <div className="cart_field_name">
          <div className="cart-checkbox-wrapper-th">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={products.length > 0 && selectedIds.size === products.length}
              className="cart-checkbox-th"
            />
          </div>
          <p className="cart_field_name_product cart-product-col-header">{t('product')}</p>
          <p className="cart_field_name_price">Giá</p>
          <p className="cart_field_name_count">Số Lượng</p>
          <p className="cart_field_name_sum"></p>
        </div>

        <div className="cart_field_value_list">
          {products.length === 0 ? (
            <p className="cart-empty-text">{t('cart_empty')}</p>
          ) : (
            products.map((product) => (
              <div id={product.cartId} className="cart_field_value_item" key={product.cartId}>
                <div className="cart-checkbox-wrapper-td">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.cartId)}
                    onChange={() => handleSelectOne(product.cartId)}
                    className="cart-checkbox-th"
                  />
                </div>
                <div id={product.productId} className="cart_field_value_product cart-product-col-item">
                  <img
                    className="cart_field_value_product_image"
                    loading="lazy"
                    decoding="async"
                    src={product_cart_image}
                    alt="icon"
                  />
                  <div className="cart_field_value_product_text">
                    <p className="cart_field_value_product_name">
                      {product.name}
                    </p>
                    <p className="cart_field_value_product_color">
                      {t('description')}: {product.description}
                    </p>
                    <p className="cart_field_value_product_delete" onClick={() => handleDelete(product.cartId)} style={{ cursor: 'pointer' }}>{t('delete')} </p>
                  </div>
                </div>
                <p className="cart_field_value_price">
                  {product.price.toLocaleString("vi-VN")}đ
                </p>
                <div className="cart_field_value_count">
                  <div className="cart_field_value_count_box">
                    <button className="cart_field_value_count_minus">-</button>
                    <span className="cart_field_value_count_value">
                      {product.quantity}
                    </span>
                    <button className="cart_field_value_count_add">+</button>
                  </div>
                </div>
                <div className="cart_field_value_sum">
                  <p></p>
                  <p>{t('total')}</p>
                  <p>
                    {(product.price * product.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="cart_all_sum_container">
        <div className="cart_all_sum">
          <label className="filter_item cart-wrapping-label">
            <input
              type="checkbox"
              checked={isWrapped}
              onChange={(e) => setIsWrapped(e.target.checked)}
              className="cart-wrapping-checkbox"
            />
            {/* <span className="checkmark"></span> */}
            <span>{t('wrapping_option')} <span className="cart_all_sum_tax">15.000đ</span></span>
          </label>
          <div className="cart_all_sum_line"></div>
          <div className="cart_all_sum_value">
            <p>{t('total')} ({selectedIds.size} sản phẩm)</p>
            <p>{total.toLocaleString("vi-VN")}đ</p>
          </div>

          <button
            className={`cart_all_sum_bt checkout_bt ${selectedIds.size === 0 ? 'checkout_bt_disabled' : ''}`}
            onClick={handleCheckout}
          >
            {t('checkout')}
          </button>
        </div>
      </div>
    </main>
  );
}
