import { createBrowserRouter } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Skeleton from '../components/ui/Skeleton';

// Layouts
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Pages - Lazy Loading for Performance
const Home = lazy(() => import('../pages/Home'));
const Product = lazy(() => import('../pages/Product'));
const ProductDetail = lazy(() => import('../pages/Product/ProductDetail'));
const Service = lazy(() => import('../pages/Service'));
const Promotion = lazy(() => import('../pages/Promotion'));
const Cart = lazy(() => import('../pages/Cart'));
const Account = lazy(() => import('../pages/Account'));
const Checkout = lazy(() => import('../pages/Checkout'));
const ThankYou = lazy(() => import('../pages/ThankYou'));
const RetailSystem = lazy(() => import('../pages/RetailSystem'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Login = lazy(() => import('../features/auth/components/Login'));
const Register = lazy(() => import('../features/auth/components/Register'));
const ForgotPassword = lazy(() => import('../features/auth/components/ForgotPassword'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ServerError = lazy(() => import('../pages/ServerError'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'home', element: <Home /> },
      { path: 'product', element: <Product /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'service', element: <Service /> },
      { path: 'promotion', element: <Promotion /> },
      { path: 'cart', element: <Cart /> },
      { path: 'account/*', element: <Account /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'thank-you', element: <ThankYou /> },
      { path: 'about-brand', element: <AboutUs /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'retail-system', element: <RetailSystem /> },
      { path: 'terms', element: <Terms /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/500',
    element: (
      <Suspense fallback={<div className="layout_fallback"><Skeleton width="100%" height="400px" /></div>}>
        <ServerError />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<div className="layout_fallback"><Skeleton width="100%" height="400px" /></div>}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
