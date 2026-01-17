import "./Checkout.css";
import { useLocation } from "react-router-dom";
import { useNotification } from "../Context/NotificationContext";
import master_card_image from "../Assets/Images/Payment/Mastercard.svg";
import visa_image from "../Assets/Images/Payment/Visa.svg";
import apple_pay_image from "../Assets/Images/Payment/ApplePay.svg";

export default function Checkout() {
  const { state } = useLocation();
  const cartIds = state?.cartIds || [];
  const subTotal = state?.subTotal || 0;
  const wrappingFee = state?.wrappingFee || 0;
  // Hardcoded shipping fee as per original design's spirit, or can be 0 if 'wrapping' implies shipping.
  // Original had "Vận chuyển 20000d".
  const shippingFee = 20000;
  const discount = 0;

  const grandTotal = subTotal + wrappingFee + shippingFee - discount;

  const notify = useNotification();

  const handleCheckout = async (e) => {
    if (!cartIds || cartIds.length === 0) {
      notify("Không có sản phẩm để thanh toán!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1, // Fixed user ID as per instructions
            paymentMethod: "direct",
            address: "string", // Placeholder
            orderItems: cartIds.map((id) => ({ cartItemId: id })),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Thanh toán thất bại");
      }

      const data = await response.json();
      console.log("Thanh toán thành công:", data);
      notify("Thanh toán thành công!");
    } catch (error) {
      console.error(error);
      notify("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };
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
              <p>Tổng tiền hàng</p>
              <p>{subTotal.toLocaleString("vi-VN")}đ</p>
            </div>

            {wrappingFee > 0 && (
              <div className="checkout_section1_sum key_value_position">
                <p>Phí gói quà</p>
                <p>{wrappingFee.toLocaleString("vi-VN")}đ</p>
              </div>
            )}

            <div className="checkout_section1_discount key_value_position">
              <p>Giảm giá</p>
              <p>{discount.toLocaleString("vi-VN")}đ</p>
            </div>

            <div className="checkout_section1_trans key_value_position">
              <p>Vận chuyển</p>
              <p>{shippingFee.toLocaleString("vi-VN")}đ</p>
            </div>

            <p className="checkout_line"></p>

            <div className="checkout_section1_all_sum key_value_position">
              <p>Tổng cộng</p>
              <p>{grandTotal.toLocaleString("vi-VN")}đ</p>
            </div>

            <button
              className="checkout_section1_col2_bt checkout_bt"
              onClick={handleCheckout}
            >
              Thanh Toán
            </button>
          </section>
        </section>
      </section>

      <section className="checkout_section2">
        <p className="checkout_section1_name">Phương thức thanh toán</p>
        <p className="checkout_line"></p>
        <label className="checkout_section2_filter filter_item">
          <input type="checkbox" />
          <span className="checkout_section2_checkmark checkmark"></span>
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
