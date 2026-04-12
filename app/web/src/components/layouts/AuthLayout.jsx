import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';

const AuthLayout = () => {
  return (
    <div className="auth_layout_wrapper">
      <Suspense fallback={<div className="layout_fallback"><Skeleton width="100%" height="400px" /></div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;
