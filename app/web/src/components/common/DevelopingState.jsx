import React from 'react';
import { useLanguage } from "@/store/LanguageContext";
import "./DevelopingState.css";
import service_icon from "@/assets/images/icons/icon_service.svg";

const DevelopingState = ({
    icon = service_icon,
    titleKey = 'feature_developing_title',
    descKey = 'feature_developing_desc'
}) => {
    const { t } = useLanguage();

    return (
        <div className="developing-state-container">
            <div className="developing-card">
                <div className="icon-container">
                    <img src={icon} alt="Developing" className="developing-icon" />
                </div>
                <h2 className="developing-title">{t(titleKey)}</h2>

                <p className="developing-desc">{t(descKey)}</p>
                <div className="progress-bar-container">
                    <div className="progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default DevelopingState;
