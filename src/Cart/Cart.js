import "./Cart.css";
import { useNavigate } from "react-router-dom";
import product_cart_image from "../Assets/Images/Rectangle 119.svg";

export default function Cart() {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
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

        <div className="cart_field_value">
          <div className="cart_field_value_product">
            <img
              className="cart_field_value_product_image"
              loading="lazy"
              decoding="async"
              src={product_cart_image}
              alt="icon"
            />
            <div className="cart_field_value_product_text">
              <p className="cart_field_value_product_name">Sản phẩm 1</p>
              <p className="cart_field_value_product_color">Màu: Đỏ</p>
              <p className="cart_field_value_product_delete">Xóa </p>
            </div>
          </div>
          <p className="cart_field_value_price">14900đ</p>
          <div className="cart_field_value_count">
            <div className="cart_field_value_count_box">
              <button className="cart_field_value_count_minus">-</button>
              <span className="cart_field_value_count_value">1</span>
              <button className="cart_field_value_count_add">+</button>
            </div>
          </div>
          <div className="cart_field_value_sum">
            <p></p>
            <p>Tổng</p>
            <p>14900đ</p>
          </div>
        </div>

        <div className="cart_field_value">
          <div className="cart_field_value_product">
            <img
              className="cart_field_value_product_image"
              loading="lazy"
              decoding="async"
              src={product_cart_image}
              alt="icon"
            />
            <div className="cart_field_value_product_text">
              <p className="cart_field_value_product_name">Sản phẩm 1</p>
              <p className="cart_field_value_product_color">Màu: Đỏ</p>
              <p className="cart_field_value_product_delete">Xóa </p>
            </div>
          </div>
          <p className="cart_field_value_price">14900đ</p>
          <div className="cart_field_value_count">
            <div className="cart_field_value_count_box">
              <button className="cart_field_value_count_minus">-</button>
              <span className="cart_field_value_count_value">1</span>
              <button className="cart_field_value_count_add">+</button>
            </div>
          </div>
          <div className="cart_field_value_sum">
            <p></p>
            <p>Tổng</p>
            <p>14900đ</p>
          </div>
        </div>

        <div className="cart_field_value">
          <div className="cart_field_value_product">
            <img
              className="cart_field_value_product_image"
              loading="lazy"
              decoding="async"
              src={product_cart_image}
              alt="icon"
            />
            <div className="cart_field_value_product_text">
              <p className="cart_field_value_product_name">Sản phẩm 1</p>
              <p className="cart_field_value_product_color">Màu: Đỏ</p>
              <p className="cart_field_value_product_delete">Xóa </p>
            </div>
          </div>
          <p className="cart_field_value_price">14900đ</p>
          <div className="cart_field_value_count">
            <div className="cart_field_value_count_box">
              <button className="cart_field_value_count_minus">-</button>
              <span className="cart_field_value_count_value">1</span>
              <button className="cart_field_value_count_add">+</button>
            </div>
          </div>
          <div className="cart_field_value_sum">
            <p></p>
            <p>Tổng</p>
            <p>14900đ</p>
          </div>
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
