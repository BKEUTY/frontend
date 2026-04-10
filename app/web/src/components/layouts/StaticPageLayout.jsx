import React from 'react';
import { PageWrapper } from '@/components/common';
import './StaticPageLayout.css';

const StaticPageLayout = ({ title, children, className }) => {
    return (
        <PageWrapper 
            title={title} 
            className={`static-layout-wrap ${className}`}
        >
            <div className="static-container">
                {children}
            </div>
        </PageWrapper>
    );
};

export default StaticPageLayout;
