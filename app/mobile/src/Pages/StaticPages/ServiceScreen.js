import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';
import ProgressBar from '../../Component/Common/ProgressBar';
import ScreenWrapper from '../../Component/Common/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';

const ServiceScreen = () => {
    const { t } = useLanguage();

    return (
        <ScreenWrapper padding={20}>
            <View style={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="construct-outline" size={40} color={COLORS.mainTitle} />
                    </View>
                    <Text style={styles.title}>{t('feature_developing_title')}</Text>
                    <Text style={styles.desc}>{t('feature_developing_desc')}</Text>

                    <ProgressBar color={COLORS.mainTitle} height={8} />
                </View>
            </View>
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff0f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#111',
        marginBottom: 10,
        textAlign: 'center',
    },
    desc: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    }
});

export default ServiceScreen;

