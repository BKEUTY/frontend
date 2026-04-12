import React from 'react';
import { useLanguage } from '@/store/LanguageContext';
import { PageWrapper, DevelopingState, SEO } from '@/components/common';

const AppointmentList = () => {
    const { t } = useLanguage();

    return (
        <PageWrapper>
            <SEO title={t('my_appointments')} />
            <DevelopingState />
        </PageWrapper>
    );
};

export default AppointmentList;
