import React from 'react';
import './StaticPageLayout.css';

const StaticPageLayout = ({ title, children, className = '' }) => {
    return (
        <div className={`static-page-container ${className}`}>
            <div className="static-page-header">
                <h1 className="static-page-title">{title}</h1>
            </div>
            <div className="static-page-content">
                {children}
            </div>
        </div>
    );
};

export default StaticPageLayout;
