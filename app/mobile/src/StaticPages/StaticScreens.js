import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../constants/Theme';

const StaticPageLayout = ({ title, children }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </ScrollView>
    );
};

export const AboutUsScreen = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('about_brand') || "Về Thương Hiệu"}>
            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>{t('about_us_banner')}</Text>
            </View>
            <Text style={styles.heading}>{t('about_us_story_title')}</Text>
            <Text style={styles.paragraph}>{t('about_us_story_p1')}</Text>
            <Text style={styles.paragraph}>{t('about_us_story_p2')}</Text>

            <Text style={styles.heading}>{t('about_us_mission_title')}</Text>
            <Text style={styles.paragraph}>{t('about_us_mission')}</Text>
            <Text style={styles.paragraph}>{t('about_us_vision')}</Text>

            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>{t('about_us_team_img')}</Text>
            </View>

            <Text style={styles.heading}>{t('about_us_values_title')}</Text>
            <Text style={styles.listItem}>• {t('about_us_value_trust')}</Text>
            <Text style={styles.listItem}>• {t('about_us_value_dedication')}</Text>
            <Text style={styles.listItem}>• {t('about_us_value_trend')}</Text>
        </StaticPageLayout>
    );
};

export const ContactScreen = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('contact') || "Liên Hệ"}>
            <Text style={styles.paragraph}>{t('contact_intro')}</Text>

            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>{t('contact_map_placeholder')}</Text>
            </View>

            <Text style={styles.heading}>{t('contact_channels_title')}</Text>
            <Text style={styles.listItem}>• {t('contact_hotline')}</Text>
            <Text style={styles.listItem}>• {t('contact_email')}</Text>
            <Text style={styles.listItem}>• {t('contact_zalo')}</Text>

            <Text style={styles.heading}>{t('contact_office_title')}</Text>
            <Text style={styles.paragraph}>{t('contact_office_address')}</Text>
            <Text style={styles.paragraph}>{t('contact_office_desc')}</Text>
        </StaticPageLayout>
    );
};

export const FAQScreen = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('faq') || "Câu Hỏi Thường Gặp"}>
            <Text style={styles.heading}>{t('faq_1_title')}</Text>
            <Text style={styles.paragraph}>{t('faq_1_q1')}</Text>
            <Text style={styles.paragraph}>{t('faq_1_a1')}</Text>

            <Text style={styles.paragraph}>{t('faq_1_q2')}</Text>
            <Text style={styles.paragraph}>{t('faq_1_a2')}</Text>

            <Text style={styles.heading}>{t('faq_2_title')}</Text>
            <Text style={styles.paragraph}>{t('faq_2_q1')}</Text>
            <Text style={styles.paragraph}>{t('faq_2_a1')}</Text>

            <Text style={styles.paragraph}>{t('faq_2_q2')}</Text>
            <Text style={styles.paragraph}>{t('faq_2_a2')}</Text>

            <Text style={styles.heading}>{t('faq_3_title')}</Text>
            <Text style={styles.paragraph}>{t('faq_3_q1')}</Text>
            <Text style={styles.paragraph}>{t('faq_3_a1')}</Text>
        </StaticPageLayout>
    );
};

export const BeautyCornerScreen = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('beauty_corner') || "Góc Làm Đẹp"}>
            <Text style={styles.paragraph}>{t('beauty_corner_intro')}</Text>

            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>{t('beauty_corner_img')}</Text>
            </View>

            <Text style={styles.heading}>{t('beauty_featured_title')}</Text>
            <Text style={styles.subHeading}>{t('beauty_art_1_title')}</Text>
            <Text style={styles.paragraph}>{t('beauty_art_1_desc')}</Text>

            <Text style={styles.subHeading}>{t('beauty_art_2_title')}</Text>
            <Text style={styles.paragraph}>{t('beauty_art_2_desc')}</Text>

            <Text style={styles.subHeading}>{t('beauty_art_3_title')}</Text>
            <Text style={styles.paragraph}>{t('beauty_art_3_desc')}</Text>
        </StaticPageLayout>
    );
};

export const TermsScreen = () => {
    const { t } = useLanguage();
    return (
        <StaticPageLayout title={t('terms') || "Điều Khoản & Chính Sách"}>
            <Text style={styles.heading}>{t('terms_1_title')}</Text>
            <Text style={styles.paragraph}>{t('terms_1_content')}</Text>

            <Text style={styles.heading}>{t('terms_2_title')}</Text>
            <Text style={styles.paragraph}>{t('terms_2_content')}</Text>

            <Text style={styles.heading}>{t('terms_3_title')}</Text>
            <Text style={styles.paragraph}>{t('terms_3_content')}</Text>
        </StaticPageLayout>
    );
};

export const AppInfoScreen = () => {
    return (
        <StaticPageLayout title="Thông tin ứng dụng">
            <Text style={styles.paragraph}>Phiên bản: 1.0.0</Text>
            <Text style={styles.paragraph}>Bkeuty Mobile App mang đến trải nghiệm mua sắm mỹ phẩm tiện lợi và nhanh chóng.</Text>
        </StaticPageLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle || '#c2185b', // Main brand color
        textAlign: 'center',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.mainTitle || '#c2185b',
        marginTop: 20,
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 5,
        paddingLeft: 10,
    },
    imagePlaceholder: {
        width: '100%',
        height: 150,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        padding: 10,
    },
    placeholderText: {
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
});
