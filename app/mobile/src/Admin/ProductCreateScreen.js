import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';

const ProductCreateScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleNext = () => {
        if (currentStep === 0 && !name) {
            Alert.alert(t('error'), t('admin_error_name_required') || 'Name is required');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('admin_product_create')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.stepperContainer}>
                <View style={styles.stepper}>
                    {[0, 1, 2].map((step) => (
                        <View key={step} style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                currentStep >= step ? styles.stepActive : styles.stepInactive,
                                currentStep === step && styles.stepCurrent
                            ]}>
                                {currentStep > step ? (
                                    <Ionicons name="checkmark" size={18} color="white" />
                                ) : (
                                    <Text style={[styles.stepText, currentStep >= step && { color: 'white' }]}>{step + 1}</Text>
                                )}
                            </View>
                            {step < 2 && (
                                <View style={[
                                    styles.stepLine,
                                    currentStep > step && { backgroundColor: COLORS.mainTitle }
                                ]} />
                            )}
                        </View>
                    ))}
                </View>
                <Text style={styles.stepLabel}>
                    {currentStep === 0 ? t('admin_section_general') :
                        currentStep === 1 ? t('admin_step_options') : t('admin_step_variants')}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {currentStep === 0 && (
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('admin_label_name')}</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="cube-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('admin_placeholder_product_name')}
                                    placeholderTextColor="#cbd5e1"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('admin_label_desc')}</Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder={t('admin_placeholder_desc')}
                                    placeholderTextColor="#cbd5e1"
                                    multiline
                                    numberOfLines={4}
                                    value={description}
                                    onChangeText={setDescription}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('admin_section_media')}</Text>
                            <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.8}>
                                {image ? (
                                    <>
                                        <Image source={{ uri: image }} style={styles.previewImage} />
                                        <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                                            <Ionicons name="close-circle" size={24} color="#ef4444" />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <View style={styles.uploadPlaceholder}>
                                        <View style={styles.uploadIconCircle}>
                                            <Ionicons name="cloud-upload" size={32} color={COLORS.mainTitle} />
                                        </View>
                                        <Text style={styles.uploadText}>{t('admin_btn_upload')}</Text>
                                        <Text style={styles.uploadSubText}>PNG, JPG up to 10MB</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {currentStep > 0 && (
                    <View style={styles.placeholderSection}>
                        <View style={styles.placeholderIconBg}>
                            <MaterialCommunityIcons name="progress-wrench" size={48} color={COLORS.mainTitle} />
                        </View>
                        <Text style={styles.placeholderTitle}>{t('feature_developing_title', 'Coming Soon')}</Text>
                        <Text style={styles.placeholderText}>
                            {t('feature_developing_desc', 'This feature is under development for mobile.')}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.btn, styles.primaryBtn]}
                    onPress={handleNext}
                    activeOpacity={0.9}
                >
                    <Text style={styles.btnText}>{t('next') || 'Next'}</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backBtn: {
        padding: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    stepperContainer: {
        backgroundColor: 'white',
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 10,
    },
    stepper: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    stepActive: {
        backgroundColor: COLORS.mainTitle,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    stepInactive: {
        backgroundColor: '#f1f5f9',
        borderColor: '#e2e8f0',
    },
    stepCurrent: {
        transform: [{ scale: 1.1 }],
    },
    stepText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
    },
    stepLine: {
        width: 40,
        height: 3,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 4,
        borderRadius: 4,
    },
    stepLabel: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.mainTitle,
        marginTop: 4,
    },
    scrollContent: {
        padding: 24,
    },
    formSection: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        height: 56,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#1e293b',
        height: '100%',
    },
    textAreaContainer: {
        height: 120,
        paddingVertical: 16,
        alignItems: 'flex-start',
    },
    textArea: {
        height: '100%',
        textAlignVertical: 'top',
    },
    uploadBox: {
        height: 180,
        backgroundColor: '#fdf2f8',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#fce7f3',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        alignItems: 'center',
    },
    uploadIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(194, 24, 91, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    uploadText: {
        color: '#1e293b',
        fontWeight: '700',
        fontSize: 16,
    },
    uploadSubText: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 4,
    },
    placeholderSection: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 24,
        marginTop: 20,
    },
    placeholderIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    placeholderTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
    },
    placeholderText: {
        color: '#64748b',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    btn: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 28, // High pill radius
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    primaryBtn: {
        backgroundColor: COLORS.mainTitle,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
});

export default ProductCreateScreen;
