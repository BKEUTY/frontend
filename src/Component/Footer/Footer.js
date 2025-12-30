import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

// Importing icons
import location_icon from "../../Assets/Images/Icons/location_on.png";
import call_icon from "../../Assets/Images/Icons/call.png";
import instagram_icon from "../../Assets/Images/Icons/_Instagram.png";
import twitter_icon from "../../Assets/Images/Icons/_Twitter.png";
import pinterest_icon from "../../Assets/Images/Icons/_Pinterest.png";
import reddit_icon from "../../Assets/Images/Icons/_Reddit.png";
import tiktok_icon from "../../Assets/Images/Icons/_TikTok.png";
import chat_icon from "../../Assets/Images/Icons/chat.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3 className="footer-title">Hỗ Trợ Khách Hàng</h3>
          <ul className="footer-links">
            <li><Link to="/he-thong-cua-hang">Hệ Thống Cửa Hàng</Link></li>
            <li><Link to="/lien-he">Liên Hệ</Link></li>
            <li><Link to="/cau-hoi-thuong-gap">Câu Hỏi Thường Gặp</Link></li>
            <li><Link to="/ve-thuong-hieu">Về Thương Hiệu</Link></li>
            <li><Link to="/goc-lam-dep">Góc Làm Đẹp</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Sản Phẩm</h3>
          <ul className="footer-links">
            <li><Link to="/trang-diem">Trang Điểm</Link></li>
            <li><Link to="/cham-soc-da">Chăm Sóc Da</Link></li>
            <li><Link to="/bo-qua-tang">Bộ Quà Tặng</Link></li>
          </ul>
        </div>

        <div className="footer-column footer-newsletter">
          <h3 className="footer-title">Kết Nối Với Bkeuty</h3>
          <p className="newsletter-desc">
            Đăng ký nhận thông báo của Bkeuty để là người đầu tiên biết về tin tức, ưu đãi và lời khuyên chăm sóc da.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Địa Chỉ Email" className="newsletter-input" />
            <button className="btn-subscribe">Đăng Ký</button>
          </div>
          <div className="newsletter-consent">
            <input type="checkbox" id="consent" />
            <label htmlFor="consent">Bằng việc gửi email, bạn đồng ý nhận thông tin quảng cáo từ Bkeuty.</label>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-info">
          <div className="footer-info-item">
            <img src={location_icon} alt="Location" className="footer-icon-img" /> Thủ Đức, TP.HCM
          </div>
          <div className="footer-info-item">
            <img src={call_icon} alt="Phone" className="footer-icon-img" /> 1-802-526-2463
          </div>
        </div>

        <div className="social-icons">
          <a href="#" className="social-icon"><img src={instagram_icon} alt="Instagram" /></a>
          <a href="#" className="social-icon"><img src={twitter_icon} alt="Twitter" /></a>
          <a href="#" className="social-icon"><img src={pinterest_icon} alt="Pinterest" /></a>
          <a href="#" className="social-icon"><img src={reddit_icon} alt="Reddit" /></a>
          <a href="#" className="social-icon"><img src={tiktok_icon} alt="TikTok" /></a>
        </div>
      </div>

      <div className="copyright-bar">
        <div>© 2025 Bkeuty. All Rights Reserved.</div>
        <div className="footer-links-inline">
          <Link to="/terms">Điều Khoản & Dịch Vụ</Link>
          <Link to="/privacy">Chính Sách Bảo Mật</Link>
        </div>
      </div>

      <button className="chat-button">
        <img src={chat_icon} alt="Chat" className="chat-icon-img" /> Trò Chuyện
      </button>
    </footer>
  );
}
