import { DevelopingState, PageWrapper, SEO } from '@/components/common';
import { useLanguage } from '@/store/LanguageContext';

export default function Service() {
    const { t } = useLanguage();
    return (
        <PageWrapper noCard>
            <SEO title={t('service')} />
            <DevelopingState />
        </PageWrapper>
    );
}
