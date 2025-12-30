import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNotification } from "../Context/NotificationContext";
import product_cart_image from "../Assets/Images/Products/Rectangle 119.svg";

export default function Cart() {
  const navigate = useNavigate();
  const notify = useNotification();
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

  return (
    <main className="cart">
      <div className="cart_title">Giỏ Hàng</div>
      <div className="cart_list">
        <div className="cart_field_name">
          <div style={{ width: '5%', display: 'flex', justifyContent: 'center' }}>
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={products.length > 0 && selectedIds.size === products.length}
              style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
            />
          </div>
          <p className="cart_field_name_product" style={{ width: '45%' }}>Sản Phẩm</p>
          <p className="cart_field_name_price">Giá</p>
          <p className="cart_field_name_count">Số Lượng</p>
          <p className="cart_field_name_sum"></p>
        </div>

        <div className="cart_field_value_list">
          {products.length === 0 ? (
            <p className="cart_empty_text" style={{ textAlign: "center", padding: "30px", fontSize: "18px", color: "var(--color_general_text)" }}>Giỏ hàng chưa có sản phẩm</p>
          ) : (
            products.map((product) => (
              <div id={product.cartId} className="cart_field_value_item" key={product.cartId}>
                <div style={{ width: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.cartId)}
                    onChange={() => handleSelectOne(product.cartId)}
                    style={{ cursor: 'pointer', transform: 'scale(1.3)' }}
                  />
                </div>
                <div id={product.productId} className="cart_field_value_product" style={{ width: '45%' }}>
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
                      Mô tả: {product.description}
                    </p>
                    <p className="cart_field_value_product_delete">Xóa </p>
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
                  <p>Tổng</p>
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
          <label className="filter_item" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isWrapped}
              onChange={(e) => setIsWrapped(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            {/* <span className="checkmark"></span> */}
            <span>Với <span className="cart_all_sum_tax">15.000đ</span> vui lòng gói sản phẩm giúp tôi</span>
          </label>
          <div className="cart_all_sum_line"></div>
          <div className="cart_all_sum_value">
            <p>Tổng cộng ({selectedIds.size} sản phẩm)</p>
            <p>{total.toLocaleString("vi-VN")}đ</p>
          </div>

          <button
            className="cart_all_sum_bt checkout_bt"
            onClick={handleCheckout}
            style={{ opacity: selectedIds.size === 0 ? 0.6 : 1 }}
          >
            Thanh Toán
          </button>
        </div>
      </div>
    </main>
  );
}
