import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../i18n/LanguageContext';
import Loading from '../Component/Common/Loading';

const LoginScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('Main');
        }, 1500);
    };

    if (loading) {
        return <Loading fullscreen text={t('loading', 'Loading...')} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image
                        source={require('../Assets/Images/logo.svg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>{t('welcome_back', 'Welcome Back')}</Text>
                    <Text style={styles.subtitle}>{t('login_subtitle', 'Login to continue')}</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#636e72" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email_placeholder', 'Email')}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#636e72" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('password', 'Password')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#636e72"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.forgotPassword}>
                            {t('forgot_password', 'Forgot password?')}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>{t('login', 'Login')}</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>{t('or_login_with', 'Or login with')}</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{t('no_account', "Don't have an account?")}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.footerLink}>{t('register', 'Register')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 60,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#636e72',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        minHeight: 56,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        textAlign: 'right',
        color: '#c2185b',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: '#c2185b',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        minHeight: 56,
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#636e72',
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        color: '#636e72',
        fontSize: 15,
    },
    footerLink: {
        color: '#c2185b',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default LoginScreen;
