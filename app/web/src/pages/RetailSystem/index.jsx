import { DevelopingState, PageWrapper, SEO } from '@/components/common';
import { useLanguage } from '@/store/LanguageContext';

export default function RetailSystem() {
    const { t } = useLanguage();
    return (
        <PageWrapper noCard>
            <SEO title={t('retail_system')} />
            <DevelopingState />
        </PageWrapper>
    );
}
