import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../constants/Theme';
import Header from '../Component/Header';

const ServiceScreen = () => {
    const { t } = useLanguage();
    const progressAnimation = new Animated.Value(0);

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(progressAnimation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(progressAnimation, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                })
            ])
        ).start();
    }, []);

    const widthInterpolated = progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>🛠️</Text>
                    </View>
                    <Text style={styles.title}>{t('feature_developing_title')}</Text>
                    <Text style={styles.desc}>{t('feature_developing_desc')}</Text>

                    <View style={styles.progressBarContainer}>
                        <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
                    </View>
                </View>
            </View>
        </View>
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
        backgroundColor: '#fff0f5', // Light pink
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        fontSize: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.mainTitle || '#c2185b', // Use generic if COLORS not ready
        marginBottom: 10,
        textAlign: 'center',
    },
    desc: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    progressBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.mainTitle || '#c2185b',
        borderRadius: 3,
    }
});

export default ServiceScreen;
