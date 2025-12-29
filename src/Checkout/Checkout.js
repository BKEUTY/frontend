import "./Checkout.css";
// import product_cart_image from "../Assets/Images/Rectangle 119.svg";

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
                placeholder="Mã bữu điện"
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
        <section className="checkout_section1_col2"></section>
      </section>
    </main>
  );
}
