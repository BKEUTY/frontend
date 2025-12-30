// Header.js
import { Link } from "react-router-dom";
import "./Header.css"; // nếu bạn muốn style riêng
import logo_image from "../../Assets/Images/logo.svg";
import home_image from "../../Assets/Images/Icons/ic_baseline-home.svg";
import header_product_image from "../../Assets/Images/Products/ix_product.svg";
import service_image from "../../Assets/Images/Icons/ri_service-fill.svg";
import promotion_image from "../../Assets/Images/Icons/mdi_voucher.svg";
import retail_system_image from "../../Assets/Images/Icons/solar_shop-bold.svg";
import cart_image from "../../Assets/Images/Icons/flowbite_cart-outline.svg";
import account_image from "../../Assets/Images/Icons/mdi_account.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img
          className="brand_image"
          loading="lazy"
          decoding="async"
          src={logo_image} //Không thể dùng đường dẫn trực tiếp như html vì khi webpack sẽ bundle src để build trong đó có ảnh nên đường dẫn ảnh sẽ bị thay đổi
          alt="icon"
        />
      </div>
      <ul className="nav_list">
        <li className="nav_item">
          <img
            className="icon_nav_item"
            loading="lazy"
            decoding="async"
            src={home_image} //Không thể dùng đường dẫn trực tiếp như html vì khi webpack sẽ bundle src để build trong đó có ảnh nên đường dẫn ảnh sẽ bị thay đổi
            alt="icon"
          />
          <Link to="/">Trang chủ</Link>
        </li>

        <li className="nav_item">
          <img
            className="icon_nav_item header_product_image"
            loading="lazy"
            decoding="async"
            src={header_product_image}
            alt="product"
          />
          <Link to="/product">Sản Phẩm</Link>
        </li>

        <li className="nav_item">
          <img
            className="icon_nav_item"
            loading="lazy"
            decoding="async"
            src={service_image}
            alt="icon"
          />
          <Link to="/service">Dịch Vụ</Link>
        </li>

        <li className="nav_item">
          <img
            className="icon_nav_item"
            loading="lazy"
            decoding="async"
            src={promotion_image}
            alt="icon"
          />
          <Link to="/promotion">Khuyến Mãi</Link>
        </li>

        <li className="nav_item">
          <img
            className="icon_nav_item"
            loading="lazy"
            decoding="async"
            src={retail_system_image}
            alt="icon"
          />
          <Link to="/retail-system">Hệ Thống Cửa Hàng</Link>
        </li>
      </ul>
      <ul className="nav_list2">
        <li className="nav_item2">
          <img
            className="icon_nav_item2"
            loading="lazy"
            decoding="async"
            src={cart_image}
            alt="icon"
          />
          <Link className="nav_item2_text" to="/cart">
            <h4>Giỏ Hàng</h4>
          </Link>
        </li>

        <li className="nav_item2">
          <img
            className="icon_nav_item2"
            loading="lazy"
            decoding="async"
            src={account_image}
            alt="icon"
          />
          <Link className="nav_item2_text" to="/account">
            <h4>Chào, Phong</h4>
          </Link>
        </li>
      </ul>
    </header>
  );
}
