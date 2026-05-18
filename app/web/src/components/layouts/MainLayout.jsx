import React, { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Skeleton from '../ui/Skeleton';
import ScrollToTop from '../common/ScrollToTop';
import { safeLazy } from '../../utils/safeLazy';

// Lazy load below-the-fold & user-triggered components to reduce main thread work
const Footer = safeLazy(() => import('./Footer/Footer'));
const CartDrawer = safeLazy(() => import('../../features/cart/components/CartDrawer'));
const Chatbot = safeLazy(() => import('../../features/chatbot/components/Chatbot'));
const FloatButtonGroup = safeLazy(() => import('./FloatButtonGroup'));

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
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
      
      <Suspense fallback={null}>
        {isChatOpen && (
          <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
      </Suspense>
      
      {!isChatOpen && (
        <Suspense fallback={null}>
          <FloatButtonGroup onChatOpen={() => setIsChatOpen(true)} />
        </Suspense>
      )}
    </div>
  );
};

export default MainLayout;
