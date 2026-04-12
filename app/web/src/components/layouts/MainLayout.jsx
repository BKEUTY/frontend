import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import CartDrawer from '../../features/cart/components/CartDrawer';
import Skeleton from '../ui/Skeleton';

const MainLayout = () => {
  return (
    <div className="App">
      <Header />
      <main className="main_content">
        <Suspense fallback={<div className="layout_fallback"><Skeleton width="100%" height="400px" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
