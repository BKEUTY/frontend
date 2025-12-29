import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import product_cart_image from "../Assets/Images/Rectangle 119.svg";

export default function Cart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(
      "https://capstoneproject.orangedesert-3e8e63bd.eastasia.azurecontainerapps.io/api/cart/1"
    )
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const cartIds = products.map((p) => p.cartId);

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { cartIds },
    });
  };
  return (
    <main className="cart">
      <div className="cart_title">Giỏ Hàng</div>
      <div className="cart_list">
        <div className="cart_field_name">
          <p className="cart_field_name_product">Sản Phẩm</p>
          <p className="cart_field_name_price">Giá</p>
          <p className="cart_field_name_count">Số Lượng</p>
          <p className="cart_field_name_sum"></p>
        </div>

        <div className="cart_field_value_list">
          {products.map((product) => (
            <div id={product.cartId} className="cart_field_value_item">
              <div id={product.productId} className="cart_field_value_product">
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
          ))}
        </div>
      </div>

      <div className="cart_all_sum_container">
        <div className="cart_all_sum">
          <label class="filter_item">
            <input type="checkbox" />
            <span class="checkmark"></span>
            Với <span className="cart_all_sum_tax">15000đ</span> vui lòng gói
            sản phẩm giúp tôi
          </label>
          <div className="cart_all_sum_line"></div>
          <div className="cart_all_sum_value">
            <p>Tổng cộng</p>
            <p>100000đ</p>
          </div>

          <button
            className="cart_all_sum_bt checkout_bt"
            onClick={handleCheckout}
          >
            Thanh Toán
          </button>
        </div>
      </div>
    </main>
  );
}
