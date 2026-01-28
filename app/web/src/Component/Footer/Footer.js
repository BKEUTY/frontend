import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Footer.css";
import Chatbot from "../Chatbot/Chatbot";

// Importing icons
import location_icon from "../../Assets/Images/Icons/icon_location.svg";
import call_icon from "../../Assets/Images/Icons/icon_phone.svg";
import instagram_icon from "../../Assets/Images/Icons/social_instagram.svg";
import twitter_icon from "../../Assets/Images/Icons/social_twitter.svg";
import pinterest_icon from "../../Assets/Images/Icons/social_pinterest.svg";
import reddit_icon from "../../Assets/Images/Icons/social_reddit.svg";
import tiktok_icon from "../../Assets/Images/Icons/social_tiktok.svg";
import facebook_icon from "../../Assets/Images/Icons/social_facebook.svg";
import chat_icon from "../../Assets/Images/Icons/icon_chat.svg";

export default function Footer() {
  const { t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">{t('support_team')}</h3>
            <ul className="footer-links">
              <li><Link to="/retail-system">{t('retail_system')}</Link></li>
              <li><Link to="/contact">{t('contact')}</Link></li>
              <li><Link to="/faq">{t('faq')}</Link></li>
              <li><Link to="/about-brand">{t('about_brand')}</Link></li>

            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">{t('product_section')}</h3>
            <ul className="footer-links">
              <li><Link to="/product">{t('makeup')}</Link></li>
              <li><Link to="/product">{t('skincare')}</Link></li>
              <li><Link to="/product">{t('gift_sets')}</Link></li>
            </ul>
          </div>

          <div className="footer-column footer-newsletter">
            <h3 className="footer-title">{t('connect_us')}</h3>
            <p className="newsletter-desc">
              {t('newsletter_desc')}
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder={t('email_placeholder')} className="newsletter-input" />
              <button className="btn-subscribe">{t('subscribe')}</button>
            </div>
            <div className="newsletter-consent">
              <input type="checkbox" id="consent" />
              <label htmlFor="consent">{t('consent')}</label>
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
            <a href="/" className="social-icon"><img src={facebook_icon} alt="Facebook" /></a>
            <a href="/" className="social-icon"><img src={instagram_icon} alt="Instagram" /></a>
            <a href="/" className="social-icon"><img src={twitter_icon} alt="Twitter" /></a>
            <a href="/" className="social-icon"><img src={pinterest_icon} alt="Pinterest" /></a>
            <a href="/" className="social-icon"><img src={reddit_icon} alt="Reddit" /></a>
            <a href="/" className="social-icon"><img src={tiktok_icon} alt="TikTok" /></a>
          </div>
        </div>

        <div className="copyright-bar">
          <div>© 2026 Bkeuty. All Rights Reserved.</div>
          <div className="footer-links-inline">
            <Link to="/terms">{t('terms')} & {t('policy')}</Link>
          </div>
        </div>
      </footer>

      {!isChatOpen && (
        <button className="chat-button" onClick={() => setIsChatOpen(true)}>
          <img src={chat_icon} alt="Chat" className="chat-icon-img" /> <span className="chat-button-text">{t('chat')}</span>
        </button>
      )}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
