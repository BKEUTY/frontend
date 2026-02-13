import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { Layout, Row, Col, Typography, Input, Button, Checkbox, Space, FloatButton } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
  YoutubeFilled,
  LinkedinFilled,
  MessageOutlined
} from '@ant-design/icons';
import logo_image from "../../Assets/Images/logo.svg";
import "./Footer.css";
import Chatbot from "../Chatbot/Chatbot";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const { t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <AntFooter className="app-footer">
      <div className="footer-container">
        <div className="footer-top-brand">
          <div className="footer-logo-wrapper">
            <img src={logo_image} alt="BKEUTY" className="footer-brand-logo" />
          </div>
          <div className="footer-certificates">
            <a href="http://online.gov.vn/Home/WebDetails/113642" target="_blank" rel="noopener noreferrer">
              <img
                src="http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png"
                alt="Đã Thông Báo BCT"
                className="gov-cert-img"
              />
            </a>
          </div>
        </div>

        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="footer-title">{t('support_team')}</Title>
            <Space direction="vertical" size="middle">
              <Link to="/retail-system" className="footer-link">{t('retail_system')}</Link>
              <Link to="/contact" className="footer-link">{t('contact')}</Link>
              <Link to="/faq" className="footer-link">{t('faq')}</Link>
              <Link to="/about-brand" className="footer-link">{t('about_brand')}</Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="footer-title">{t('product_section')}</Title>
            <Space direction="vertical" size="middle">
              <Link to="/product" className="footer-link">{t('makeup')}</Link>
              <Link to="/product" className="footer-link">{t('skincare')}</Link>
              <Link to="/product" className="footer-link">{t('gift_sets')}</Link>
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <Title level={4} className="footer-title">{t('connect_us')}</Title>
            <Paragraph className="footer-text">
              {t('newsletter_desc')}
            </Paragraph>
            <div className="newsletter-form">
              <Space.Compact style={{ width: '100%' }}>
                <Input placeholder={t('email_placeholder')} className="newsletter-input" />
                <Button type="primary" className="subscribe-btn">{t('subscribe')}</Button>
              </Space.Compact>
            </div>
            <Checkbox className="consent-checkbox">
              <span className="footer-text-sm">{t('consent')}</span>
            </Checkbox>
          </Col>
        </Row>

        <div className="footer-divider" />

        <Row justify="space-between" align="middle" gutter={[24, 24]} className="footer-bottom">
          <Col xs={24} md={12}>
            <Space size="large" wrap>
              <Space>
                <EnvironmentOutlined className="footer-icon" />
                <Text className="footer-text">Thủ Đức, TP.HCM</Text>
              </Space>
              <Space>
                <PhoneOutlined className="footer-icon" />
                <Text className="footer-text">1-802-526-2463</Text>
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space size="middle" className="social-icons">
              <FacebookFilled className="social-icon" />
              <InstagramFilled className="social-icon" />
              <TwitterSquareFilled className="social-icon" />
              <YoutubeFilled className="social-icon" />
              <LinkedinFilled className="social-icon" />
            </Space>
          </Col>
        </Row>

        <div className="footer-copyright">
          <Row justify="space-between">
            <Col>
              <Text className="footer-text-sm">© 2026 Bkeuty. All Rights Reserved.</Text>
            </Col>
            <Col>
              <Space size="middle">
                <Link to="/terms" className="footer-link-sm">{t('terms')}</Link>
                <Text className="footer-text-sm">&</Text>
                <Link to="/terms" className="footer-link-sm">{t('policy')}</Link>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <FloatButton.Group shape="circle" style={{ right: 24, bottom: 24 }}>
        <FloatButton.BackTop />
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          onClick={() => setIsChatOpen(true)}
          tooltip={t('chat')}
          style={{ marginTop: 2 }}
        />
      </FloatButton.Group>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </AntFooter>
  );
}
