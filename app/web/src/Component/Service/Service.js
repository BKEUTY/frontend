import React from 'react';
import { useLanguage } from "../../i18n/LanguageContext";
import "./Service.css";
import service_icon from "../../Assets/Images/Icons/icon_service.svg";

export default function Service() {
    const { t } = useLanguage();

    return (
        <div className="service-page-container">
            <div className="service-developing-card">
                <div className="icon-container">
                    <img src={service_icon} alt="Service" className="developing-icon" />
                </div>
                <h2 className="developing-title">{t('feature_developing_title')}</h2>
                <p className="developing-desc">{t('feature_developing_desc')}</p>
                <div className="progress-bar-container">
                    <div className="progress-bar"></div>
                </div>
            </div>
        </div>
    );
}
