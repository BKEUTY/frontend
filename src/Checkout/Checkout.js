import "./Checkout.css";
import master_card_image from "../Assets/Images/Mastercard.svg";
import visa_image from "../Assets/Images/Visa.svg";
import apple_pay_image from "../Assets/Images/ApplePay.svg";

export default function Cart() {
  return (
    <main className="checkout">
      <div className="checkout_title">Thanh Toán</div>

      <section className="checkout_section1">
        <section className="checkout_section1_col1">
          <section className="checkout_section1_cus checkout_section1_box">
            <p className="checkout_section1_cus_name checkout_section1_name">
              Thông tin khách hàng
            </p>
            <p className="checkout_line"></p>

            <input
              className="checkout_section1_cus_name checkout_input"
              type="text"
              placeholder="Họ và tên"
            />
            <div className="checkout_section1_cus_container">
              <input
                className="checkout_section1_cus_phone checkout_input"
                type="tel"
                placeholder="Số điện thoại"
              />
              <input
                className="checkout_section1_cus_email checkout_input"
                type="email"
                placeholder="Email"
              />
            </div>
          </section>

          <section className="checkout_section1_add checkout_section1_box">
            <p className="checkout_section1_add_name checkout_section1_name">
              Địa chỉ
            </p>
            <p className="checkout_line"></p>

            <div className="checkout_section1_add_container">
              <input
                className="checkout_section1_add_address checkout_input"
                type="text"
                placeholder="Số nhà, Phường, Xã"
              />
              <input
                className="checkout_section1_add_zip checkout_input"
                type="text"
                placeholder="Mã bưu điện"
              />
            </div>

            <div className="checkout_section1_add_container2">
              <input
                className="checkout_section1_add_phone checkout_input"
                type="tel"
                placeholder="Số điện thoại"
              />
              <input
                className="checkout_section1_add_email checkout_input"
                type="email"
                placeholder="Email"
              />
            </div>
          </section>

          <section className="checkout_section1_voucher checkout_section1_box">
            <p className="checkout_section1_voucher_name checkout_section1_name">
              Voucher
            </p>
            <p className="checkout_line"></p>

            <input
              className="checkout_section1_voucher_name checkout_input"
              type="text"
              placeholder="Chọn voucher"
            />
          </section>
        </section>
        <section className="checkout_section1_col2">
          <section className="checkout_section1_cart checkout_section1_box">
            <p className="checkout_section1_cart_name checkout_section1_name">
              Giỏ Hàng
            </p>
            <p className="checkout_line"></p>
            <div className="checkout_section1_sum key_value_position">
              <p>Tổng</p>
              <p>80000đ</p>
            </div>

            <div className="checkout_section1_discount key_value_position">
              <p>Giảm giá</p>
              <p>0đ</p>
            </div>

            <div className="checkout_section1_trans key_value_position">
              <p>Vận chuyển</p>
              <p>20000đ</p>
            </div>

            <p className="checkout_line"></p>

            <div className="checkout_section1_all_sum key_value_position">
              <p>Tổng cộng</p>
              <p>100000đ</p>
            </div>

            <button className="checkout_section1_col2_bt checkout_bt">
              Thanh Toán
            </button>
          </section>
        </section>
      </section>

      <section className="checkout_section2">
        <p className="checkout_section1_name">Phương thức thanh toán</p>
        <p className="checkout_line"></p>
        <label class="checkout_section2_filter filter_item">
          <input type="checkbox" />
          <span class="checkout_section2_checkmark checkmark"></span>
          Thanh toán khi nhận hàng
        </label>
        <div className="checkout_section2_payment_list">
          <img
            className="checkout_section2_payment_item"
            loading="lazy"
            decoding="async"
            src={master_card_image}
            alt="icon"
          />

          <img
            className="checkout_section2_payment_item"
            loading="lazy"
            decoding="async"
            src={visa_image}
            alt="icon"
          />

          <img
            className="checkout_section2_payment_item"
            loading="lazy"
            decoding="async"
            src={apple_pay_image}
            alt="icon"
          />
        </div>
      </section>
    </main>
  );
}
