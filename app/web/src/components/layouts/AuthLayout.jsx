import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="p-8"><Skeleton width="100%" height="400px" /></div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;
