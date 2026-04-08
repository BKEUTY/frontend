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
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../i18n/LanguageContext';
import Loading from '../../Component/Common/Loading';
import { useAuth } from '../../Context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const { login, register } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
            Alert.alert(t('error'), t('please_fill_all_fields'));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(t('error'), t('password_match_error'));
            return;
        }

        setLoading(true);
        try {
            const registrationData = {
                username: email,
                email: email,
                password: password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phone.trim(),
                mainAddress: 'Vietnam' // Default
            };

            await register(registrationData);
            
            Alert.alert(
                t('success'), 
                t('register_success'),
                [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]
            );
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || error.message || t('api_error_register');
            Alert.alert(t('error'), errorMessage);
        } finally {
            setLoading(false);
        }
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
                        source={require('../../Assets/Images/logo.svg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>{t('create_account')}</Text>
                    <Text style={styles.subtitle}>{t('register_subtitle')}</Text>
                </View>

                <View style={styles.form}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Ionicons name="person-outline" size={20} color="#636e72" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('last_name')}
                                value={lastName}
                                onChangeText={setLastName}
                                autoCapitalize="words"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Ionicons name="person-outline" size={20} color="#636e72" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('first_name')}
                                value={firstName}
                                onChangeText={setFirstName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="phone-portrait-outline" size={20} color="#636e72" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('phone_placeholder')}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#636e72" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email_placeholder')}
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
                            placeholder={t('password')}
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

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#636e72" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('confirm_password')}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeIcon}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#636e72"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setAgreeTerms(!agreeTerms)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                            {agreeTerms && <Ionicons name="checkmark" size={18} color="#fff" />}
                        </View>
                        <Text style={styles.checkboxText}>
                            {t('agree_terms')}{' '}
                            <Text style={styles.link}>{t('terms_and_policy')}</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.registerButton, !agreeTerms && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={!agreeTerms}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.registerButtonText}>{t('register')}</Text>
                    </TouchableOpacity>



                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{t('already_have_account')}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.footerLink}>{t('login')}</Text>
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
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 100,
        height: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        minHeight: 48,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#c2185b',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#c2185b',
    },
    checkboxText: {
        flex: 1,
        fontSize: 14,
        color: '#636e72',
        lineHeight: 20,
    },
    link: {
        color: '#c2185b',
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#c2185b',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        minHeight: 56,
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 24,
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

export default RegisterScreen;
