import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';
import Skeleton from '../components/ui/Skeleton';
import { safeLazy } from '../utils/safeLazy';

// Layouts
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Pages - Lazy Loading for Performance with Deployment Safety
const Home = safeLazy(() => import('../pages/Home'));
const Product = safeLazy(() => import('../pages/Product'));
const ProductDetail = safeLazy(() => import('../pages/Product/ProductDetail'));
const Service = safeLazy(() => import('../pages/Service'));
const Promotion = safeLazy(() => import('../pages/Promotion'));
const Cart = safeLazy(() => import('../pages/Cart'));
const Account = safeLazy(() => import('../pages/Account'));
const Checkout = safeLazy(() => import('../pages/Checkout'));
const ThankYou = safeLazy(() => import('../pages/ThankYou'));
const RetailSystem = safeLazy(() => import('../pages/RetailSystem'));
const LandingPage = safeLazy(() => import('../pages/LandingPage'));
const Login = safeLazy(() => import('../features/auth/components/Login'));
const Register = safeLazy(() => import('../features/auth/components/Register'));
const ForgotPassword = safeLazy(() => import('../features/auth/components/ForgotPassword'));
const AboutUs = safeLazy(() => import('../pages/AboutUs'));
const Contact = safeLazy(() => import('../pages/Contact'));
const FAQ = safeLazy(() => import('../pages/FAQ'));
const Terms = safeLazy(() => import('../pages/Terms'));
const NotFound = safeLazy(() => import('../pages/NotFound'));
const ServerError = safeLazy(() => import('../pages/ServerError'));

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
