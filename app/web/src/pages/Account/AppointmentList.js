import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PageWrapper, DevelopingState } from '../../Component/Common';

const AppointmentList = () => {
    const { t } = useLanguage();

    return (
        <PageWrapper>
            <DevelopingState />
        </PageWrapper>
    );
};

export default AppointmentList;