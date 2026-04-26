import React, { Suspense, useState, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import CartDrawer from '../../features/cart/components/CartDrawer';
import Skeleton from '../ui/Skeleton';
import ScrollToTop from '../common/ScrollToTop';
import { MessageOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const Chatbot = lazy(() => import('../../features/chatbot/components/Chatbot'));

const MainLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main className="main_content">
        <Suspense fallback={<div className="layout_fallback"><Skeleton width="100%" height="400px" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      
      <Suspense fallback={null}>
        {isChatOpen && (
          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
      </Suspense>
      
      {!isChatOpen && (
        <FloatButton.Group
          style={{ right: 24, bottom: 24 }}
        >
          <FloatButton.BackTop visibilityHeight={400} />
          <FloatButton 
            icon={<MessageOutlined />} 
            type="primary"
            onClick={() => setIsChatOpen(true)}
            tooltip={<div>Bkeuty AI Assistant</div>}
          />
        </FloatButton.Group>
      )}
    </div>
  );
};

export default MainLayout;
